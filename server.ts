import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';

const app = express();
const PORT = 3000;

app.use(express.json());

const FIREBASE_API_KEY = process.env.VITE_FIREBASE_API_KEY || "AIzaSyBKEXYDSmXx4h8LbWlPq_iaTT-32307SMQ";

/**
 * Helper to verify Firebase Auth ID Token and check if the user is an authorized administrator
 */
async function verifyFirebaseAdminToken(authHeader?: string, req?: express.Request): Promise<{ valid: boolean; email?: string; error?: string }> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing or malformed Authorization header. Bearer token required.' };
  }

  const idToken = authHeader.split('Bearer ')[1]?.trim();
  if (!idToken) {
    return { valid: false, error: 'Empty Firebase ID token provided.' };
  }

  try {
    // Lookup user using Firebase Auth Identity Toolkit REST API
    const lookupRes = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken })
    });

    if (!lookupRes.ok) {
      const errData = await lookupRes.json().catch(() => ({}));
      console.warn('[Server Auth] Firebase account lookup failed:', errData);
      return { valid: false, error: 'Invalid or expired Firebase authentication token.' };
    }

    const lookupData = await lookupRes.json();
    if (!lookupData.users || lookupData.users.length === 0) {
      return { valid: false, error: 'No matching user found for token.' };
    }

    const user = lookupData.users[0];
    const email = (user.email || '').toLowerCase().trim();

    if (!email) {
      return { valid: false, error: 'Authenticated user has no email address associated.' };
    }

    // topogabolekwe@gmail.com is always authorized as Super Admin
    if (email === 'topogabolekwe@gmail.com') {
      return { valid: true, email };
    }

    // Verify against active admin users in Supabase database
    if (req) {
      try {
        const supabase = getBackendSupabaseClient(req);
        const { data } = await supabase
          .from('cms_content')
          .select('payload')
          .eq('key', 'admins')
          .maybeSingle();

        if (data && Array.isArray(data.payload)) {
          const isAuthorized = data.payload.some((a: any) => {
            const docEmail = (a.email || '').toLowerCase().trim();
            const docStatus = a.status || 'Active';
            return docEmail === email && docStatus === 'Active';
          });
          if (isAuthorized) {
            return { valid: true, email };
          }
        }
      } catch (sbErr) {
        console.warn('[Server Auth] Supabase admin check warning:', sbErr);
      }
    }

    return { valid: false, error: `Access Denied: The account "${email}" is not an authorized administrator.` };
  } catch (err: any) {
    console.error('[Server Auth Error]:', err);
    return { valid: false, error: 'Server error during token verification.' };
  }
}

/**
 * Get Supabase Client for server-side operations using Service Role Key (bypassing RLS securely)
 */
function getBackendSupabaseClient(req: express.Request) {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || req.headers['x-supabase-url'] as string || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';

  console.log(`[Supabase Diagnostics] SUPABASE_URL configured: ${!!url}`);
  console.log(`[Supabase Diagnostics] SUPABASE_SERVICE_ROLE_KEY configured: ${!!serviceKey}`);

  if (!url || !serviceKey) {
    throw new Error('Missing server-side Supabase configuration. SUPABASE_SERVICE_ROLE_KEY and VITE_SUPABASE_URL must be configured.');
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Secure API endpoint for saving CMS content in Supabase
app.post('/api/cms', async (req, res) => {
  const authHeader = req.headers.authorization;
  const authResult = await verifyFirebaseAdminToken(authHeader, req);

  if (!authResult.valid) {
    res.status(403).json({ error: authResult.error || 'Unauthorized: Only administrators can update CMS content.' });
    return;
  }

  const { key, payload } = req.body || {};
  if (!key) {
    res.status(400).json({ error: 'Missing required field: key.' });
    return;
  }

  try {
    const supabase = getBackendSupabaseClient(req);
    const { data, error } = await supabase
      .from('cms_content')
      .upsert({
        key,
        payload,
        updated_at: new Date().toISOString(),
        updated_by: authResult.email
      }, { onConflict: 'key' })
      .select()
      .single();

    if (error) {
      console.error(`[Server CMS Save Error] key=${key}:`, error);
      res.status(500).json({ error: `Supabase save failed: ${error.message}` });
      return;
    }

    console.log(`[Server CMS Save Success] Authorized admin: ${authResult.email}, Saved key: ${key}`);
    res.json({ success: true, key, item: data });
  } catch (err: any) {
    console.error(`[Server CMS Save Exception] key=${key}:`, err);
    res.status(500).json({ error: err.message || 'Internal server error while saving CMS content.' });
  }
});

// Secure API endpoint for creating or updating media records in Supabase
app.post('/api/media', async (req, res) => {
  const authHeader = req.headers.authorization;
  const authResult = await verifyFirebaseAdminToken(authHeader, req);

  if (!authResult.valid) {
    res.status(403).json({ error: authResult.error || 'Unauthorized: Only administrators can create or update media records.' });
    return;
  }

  const { mediaItem } = req.body || {};
  if (!mediaItem || !mediaItem.id) {
    res.status(400).json({ error: 'Invalid payload. mediaItem with id is required.' });
    return;
  }

  try {
    const supabase = getBackendSupabaseClient(req);
    const payload = {
      id: mediaItem.id,
      cloudinary_public_id: mediaItem.publicId || '',
      cloudinary_url: mediaItem.url || mediaItem.secureUrl || '',
      secure_url: mediaItem.secureUrl || mediaItem.url || '',
      filename: mediaItem.filename || 'image',
      width: Number(mediaItem.width) || 0,
      height: Number(mediaItem.height) || 0,
      format: mediaItem.format || 'jpg',
      file_size: Number(mediaItem.fileSize) || 0,
      folder: mediaItem.folder || 'general',
      caption: mediaItem.caption || '',
      category: mediaItem.category || 'general',
      uploaded_by: authResult.email || mediaItem.uploadedBy || 'admin',
      created_at: mediaItem.uploadedAt || new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('media')
      .upsert(payload, { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      console.error('[Server Media Save Error]:', error);
      res.status(500).json({ error: `Supabase database save failed: ${error.message}` });
      return;
    }

    console.log('[Server Media Save Success] Authorized admin:', authResult.email, 'Saved media ID:', data.id);
    res.json({ success: true, item: data });
  } catch (err: any) {
    console.error('[Server Media Save Exception]:', err);
    res.status(500).json({ error: err.message || 'Internal server error while saving media.' });
  }
});

// Secure API endpoint for deleting media records from Supabase
app.delete('/api/media/:id', async (req, res) => {
  const authHeader = req.headers.authorization;
  const authResult = await verifyFirebaseAdminToken(authHeader, req);

  if (!authResult.valid) {
    res.status(403).json({ error: authResult.error || 'Unauthorized: Only administrators can delete media records.' });
    return;
  }

  const mediaId = req.params.id;
  if (!mediaId) {
    res.status(400).json({ error: 'Missing media ID parameter.' });
    return;
  }

  try {
    const supabase = getBackendSupabaseClient(req);
    const { error } = await supabase
      .from('media')
      .delete()
      .eq('id', mediaId);

    if (error) {
      console.error('[Server Media Delete Error]:', error);
      res.status(500).json({ error: `Supabase database delete failed: ${error.message}` });
      return;
    }

    console.log('[Server Media Delete Success] Authorized admin:', authResult.email, 'Deleted media ID:', mediaId);
    res.json({ success: true, deletedId: mediaId });
  } catch (err: any) {
    console.error('[Server Media Delete Exception]:', err);
    res.status(500).json({ error: err.message || 'Internal server error while deleting media.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Express Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
