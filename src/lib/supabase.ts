import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseMediaRecord, MediaItem } from '../types';
import { auth } from './firebase';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

const STORAGE_KEY_SUPABASE_URL = 'gabolekwe_supabase_url';
const STORAGE_KEY_SUPABASE_KEY = 'gabolekwe_supabase_anon_key';

/**
 * Get active Supabase configuration from environment variables or localStorage
 */
export const getSupabaseConfig = (): SupabaseConfig => {
  const metaEnv = (import.meta as any).env || {};
  const envUrl = metaEnv.VITE_SUPABASE_URL || '';
  const envKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_SUPABASE_URL) || '' : '';
  const localKey = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY_SUPABASE_KEY) || '' : '';

  return {
    url: envUrl || localUrl,
    anonKey: envKey || localKey,
  };
};

/**
 * Save custom Supabase credentials to localStorage
 */
export const saveSupabaseConfig = (url: string, anonKey: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_SUPABASE_URL, url.trim());
    localStorage.setItem(STORAGE_KEY_SUPABASE_KEY, anonKey.trim());
  }
};

let cachedClient: SupabaseClient | null = null;
let cachedConfigKey = '';

/**
 * Get or initialize Supabase Client singleton for client-side reads
 */
export const getSupabaseClient = (): SupabaseClient | null => {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }

  const currentKey = `${config.url}_${config.anonKey}`;
  if (cachedClient && cachedConfigKey === currentKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    cachedConfigKey = currentKey;
    return cachedClient;
  } catch (err) {
    console.error('[Supabase Client Initialization Error]:', err);
    return null;
  }
};

/**
 * Helper to get active Firebase ID token for authenticated API requests
 */
export const getFirebaseIdToken = async (): Promise<string | null> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  try {
    return await currentUser.getIdToken();
  } catch (err) {
    console.error('[Firebase Token Error]:', err);
    return null;
  }
};

/**
 * Helper to convert Supabase row to MediaItem
 */
export const mapSupabaseToMediaItem = (row: SupabaseMediaRecord): MediaItem => {
  const cUrl = row.secure_url || row.cloudinary_url || '';
  return {
    id: row.id,
    publicId: row.cloudinary_public_id || '',
    secureUrl: cUrl,
    url: row.cloudinary_url || cUrl,
    filename: row.filename || 'image',
    width: Number(row.width) || 0,
    height: Number(row.height) || 0,
    format: row.format || 'jpg',
    fileSize: Number(row.file_size) || 0,
    folder: row.folder || 'general',
    caption: row.caption || '',
    category: row.category || 'general',
    uploadedBy: row.uploaded_by || 'admin',
    uploadedAt: row.created_at || new Date().toISOString(),
  };
};

/**
 * Helper to convert MediaItem to Supabase row format
 */
export const mapMediaItemToSupabase = (item: MediaItem): SupabaseMediaRecord => {
  return {
    id: item.id,
    cloudinary_public_id: item.publicId || '',
    cloudinary_url: item.url || item.secureUrl || '',
    secure_url: item.secureUrl || item.url || '',
    filename: item.filename || 'image',
    width: item.width || 0,
    height: item.height || 0,
    format: item.format || 'jpg',
    file_size: item.fileSize || 0,
    folder: item.folder || 'general',
    caption: item.caption || '',
    category: item.category || 'general',
    uploaded_by: item.uploadedBy || 'admin',
    created_at: item.uploadedAt || new Date().toISOString(),
  };
};

/**
 * Save media record to Supabase via authorized server endpoint with Firebase Auth ID token
 */
export const saveMediaToSupabase = async (item: MediaItem): Promise<MediaItem> => {
  const token = await getFirebaseIdToken();
  if (!token) {
    throw new Error('Authentication required: You must be logged in as an authorized administrator to save media.');
  }

  const config = getSupabaseConfig();
  console.log('[Supabase API] Requesting secure media save via /api/media for item:', item.id);

  const response = await fetch('/api/media', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      mediaItem: item,
      config
    })
  });

  const resData = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error('[Supabase Save Error]:', resData);
    throw new Error(resData.error || `Failed to save media metadata: ${response.statusText}`);
  }

  console.log('[Supabase Save Success]:', resData);
  if (resData.item) {
    return mapSupabaseToMediaItem(resData.item as SupabaseMediaRecord);
  }
  return item;
};

/**
 * Fetch all media items from Supabase PostgreSQL database (Public read)
 */
export const fetchMediaFromSupabase = async (): Promise<MediaItem[]> => {
  const client = getSupabaseClient();
  if (!client) {
    console.warn('[Supabase API] Client not configured.');
    return [];
  }

  const { data, error } = await client
    .from('media')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[Supabase API Fetch Error]:', error);
    throw new Error(`Failed to fetch media from Supabase: ${error.message}`);
  }

  return (data || []).map((row: any) => mapSupabaseToMediaItem(row as SupabaseMediaRecord));
};

/**
 * Delete media record from Supabase via authorized server endpoint with Firebase Auth ID token
 */
export const deleteMediaFromSupabase = async (id: string): Promise<void> => {
  const token = await getFirebaseIdToken();
  if (!token) {
    throw new Error('Authentication required: You must be logged in as an authorized administrator to delete media.');
  }

  const config = getSupabaseConfig();
  console.log('[Supabase API] Requesting secure media deletion via /api/media for ID:', id);

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${token}`
  };
  if (config.url) headers['X-Supabase-Url'] = config.url;
  if (config.anonKey) headers['X-Supabase-Key'] = config.anonKey;

  const response = await fetch(`/api/media/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    headers
  });

  const resData = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error('[Supabase Delete Error]:', resData);
    throw new Error(resData.error || `Failed to delete media record: ${response.statusText}`);
  }

  console.log('[Supabase Delete Success]:', resData);
};

/**
 * Fetch a CMS section payload from Supabase
 */
export const fetchCMSContentFromSupabase = async <T>(key: string): Promise<T | null> => {
  const config = getSupabaseConfig();
  console.log(`[Diagnostic] Supabase URL in use: ${config.url || 'None'}`);

  const client = getSupabaseClient();
  if (!client) {
    console.log(`[Diagnostic] CMS Key ${key} loaded from Supabase: false (Client not configured, using fallback default)`);
    return null;
  }

  try {
    const { data, error } = await client
      .from('cms_content')
      .select('payload')
      .eq('key', key)
      .maybeSingle();

    if (error) {
      console.warn(`[Supabase CMS Fetch Warning] key=${key}:`, error.message);
      console.log(`[Diagnostic] CMS Key ${key} loaded from Supabase: false (Error/Fallback)`);
      return null;
    }

    const found = !!(data && data.payload);
    console.log(`[Diagnostic] CMS Key ${key} loaded from Supabase: ${found} (${found ? 'Remote database content' : 'Using default fallback'})`);

    if (found) {
      return data.payload as T;
    }
  } catch (err) {
    console.warn(`[Supabase CMS Fetch Exception] key=${key}:`, err);
    console.log(`[Diagnostic] CMS Key ${key} loaded from Supabase: false (Exception/Fallback)`);
  }
  return null;
};

/**
 * Save a CMS section payload to Supabase via authorized server proxy
 */
export const saveCMSContentToSupabase = async (key: string, payload: any): Promise<void> => {
  const token = await getFirebaseIdToken();
  if (!token) {
    throw new Error('Authentication required: You must be logged in as an authorized administrator to save CMS content.');
  }

  const config = getSupabaseConfig();
  console.log(`[Diagnostic] Supabase URL in use for save: ${config.url || 'None'}`);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
  if (config.url) headers['X-Supabase-Url'] = config.url;
  if (config.anonKey) headers['X-Supabase-Key'] = config.anonKey;

  const response = await fetch('/api/cms', {
    method: 'POST',
    headers,
    body: JSON.stringify({ key, payload, config })
  });

  console.log(`[Diagnostic] /api/cms save response status: ${response.status} (${response.statusText})`);

  const resData = await response.json().catch(() => ({}));

  if (!response.ok) {
    console.error(`[Supabase CMS Save Error] key=${key}:`, resData);
    throw new Error(resData.error || `Failed to save CMS content for ${key}: ${response.statusText}`);
  }

  console.log(`[Supabase CMS Save Success] key=${key}`);
};
