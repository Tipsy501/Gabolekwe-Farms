import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Upload, Check, Image as ImageIcon, Search, AlertCircle, RefreshCw, 
  FileCheck, Loader2, Settings, Trash2, Zap, ExternalLink 
} from 'lucide-react';
import { GalleryItem, MediaItem } from '../types';
import { 
  getCloudinaryConfig, 
  saveCloudinaryConfig, 
  uploadToCloudinary, 
  getOptimizedCloudinaryUrl,
  CloudinaryConfig,
  CloudinaryUploadResult 
} from '../lib/cloudinary';
import { getSupabaseConfig, saveSupabaseConfig } from '../lib/supabase';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (url: string) => void;
  photos: string[];
  gallery: GalleryItem[];
  uploadFileToStorage?: (file: File, onProgress?: (progress: number) => void) => Promise<string>;
  uploadPhoto: (url: string, metadata?: Partial<MediaItem>) => Promise<any>;
  deletePhoto?: (url: string) => Promise<void>;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  photos,
  gallery,
  uploadPhoto,
  deletePhoto,
}) => {
  // Navigation & Search state
  const [search, setSearch] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'library' | 'upload' | 'settings'>('library');

  // Cloudinary Configuration State
  const [cConfig, setCConfig] = useState<CloudinaryConfig>({ cloudName: '', uploadPreset: '' });
  const [configCloudNameInput, setConfigCloudNameInput] = useState('');
  const [configPresetInput, setConfigPresetInput] = useState('');
  const [configSavedMsg, setConfigSavedMsg] = useState<string | null>(null);

  // Supabase Config state
  const [supabaseUrlInput, setSupabaseUrlInput] = useState('');
  const [supabaseKeyInput, setSupabaseKeyInput] = useState('');

  // File Upload state machine
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<{ width: number; height: number; sizeFormatted: string } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'validating' | 'ready' | 'uploading' | 'saving' | 'success' | 'supabase_error' | 'firebase_error' | 'error'>('idle');
  const [lastUploadedUrl, setLastUploadedUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const lastUploadedMetaRef = useRef<any>(null);

  // Load Cloudinary & Supabase Config on open
  useEffect(() => {
    if (isOpen) {
      const cfg = getCloudinaryConfig();
      setCConfig(cfg);
      setConfigCloudNameInput(cfg.cloudName);
      setConfigPresetInput(cfg.uploadPreset);

      const sbCfg = getSupabaseConfig();
      setSupabaseUrlInput(sbCfg.url);
      setSupabaseKeyInput(sbCfg.anonKey);

      if (!cfg.cloudName || !cfg.uploadPreset) {
        setActiveTab('settings');
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Format bytes helper
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!configCloudNameInput.trim() || !configPresetInput.trim()) {
      setValidationError('Both Cloud Name and Unsigned Upload Preset are required.');
      return;
    }
    saveCloudinaryConfig(configCloudNameInput.trim(), configPresetInput.trim());
    if (supabaseUrlInput.trim() && supabaseKeyInput.trim()) {
      saveSupabaseConfig(supabaseUrlInput.trim(), supabaseKeyInput.trim());
    }
    const updated = { cloudName: configCloudNameInput.trim(), uploadPreset: configPresetInput.trim() };
    setCConfig(updated);
    setValidationError(null);
    setConfigSavedMsg('Settings saved successfully!');
    setTimeout(() => {
      setConfigSavedMsg(null);
      setActiveTab('upload');
    }, 1500);
  };

  // Process file selection and validation
  const processFileSelection = async (file: File) => {
    setValidationError(null);
    setUploadError(null);
    setUploadProgress(0);
    setLastUploadedUrl(null);
    setUploadStatus('validating');

    // Check Cloudinary Config first
    if (!cConfig.cloudName || !cConfig.uploadPreset) {
      setValidationError('Cloudinary configuration is missing. Please configure your Cloud Name and Upload Preset in settings.');
      setActiveTab('settings');
      setUploadStatus('idle');
      return;
    }

    // 1. File type check
    if (!file || !file.type || !file.type.startsWith('image/')) {
      setValidationError('Invalid file type. Please select a valid image file (JPEG, PNG, WEBP, GIF, SVG).');
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadStatus('idle');
      return;
    }

    // 2. File size limit check (10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setValidationError(`File size (${formatBytes(file.size)}) exceeds the maximum limit of 10 MB.`);
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadStatus('idle');
      return;
    }

    // 3. File integrity & preview generation
    try {
      const objectUrl = URL.createObjectURL(file);
      const img = new Image();

      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          setImageMeta({
            width: img.naturalWidth,
            height: img.naturalHeight,
            sizeFormatted: formatBytes(file.size),
          });
          resolve();
        };
        img.onerror = () => {
          reject(new Error('The selected image file appears corrupted or unreadable.'));
        };
        img.src = objectUrl;
      });

      setSelectedFile(file);
      setPreviewUrl(objectUrl);
      setUploadStatus('ready');
      setActiveTab('upload');
    } catch (err: any) {
      setValidationError(err.message || 'Failed to process image preview.');
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadStatus('idle');
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFileSelection(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFileSelection(file);
  };

  // Execute Cloudinary upload & Firebase metadata save
  const executeUpload = async () => {
    if (!selectedFile) return;

    if (isUploading) {
      console.warn('[Upload flow] Upload already in progress, ignoring duplicate call');
      return;
    }

    if (!cConfig.cloudName || !cConfig.uploadPreset) {
      setUploadError('Missing Cloudinary configuration. Please click on Settings to set your Cloud Name and Preset.');
      setActiveTab('settings');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadStatus('uploading');

    let cloudinaryResult: CloudinaryUploadResult | null = null;

    try {
      console.log('[MediaPickerModal] Step 1: Uploading to Cloudinary...', selectedFile.name);
      cloudinaryResult = await uploadToCloudinary(
        selectedFile,
        cConfig.cloudName,
        cConfig.uploadPreset,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      console.log('[MediaPickerModal] Step 2: Cloudinary response received:', cloudinaryResult);
      setUploadProgress(100);

      // Save metadata to Supabase PostgreSQL media table
      setUploadStatus('saving');
      
      const mediaMeta = {
        publicId: cloudinaryResult.publicId,
        secureUrl: cloudinaryResult.secureUrl || cloudinaryResult.optimizedUrl,
        url: cloudinaryResult.optimizedUrl || cloudinaryResult.secureUrl,
        filename: selectedFile.name,
        width: cloudinaryResult.width || imageMeta?.width || 0,
        height: cloudinaryResult.height || imageMeta?.height || 0,
        format: cloudinaryResult.format || selectedFile.type.split('/')[1] || 'jpg',
        fileSize: cloudinaryResult.bytes || selectedFile.size,
        uploadedAt: new Date().toISOString(),
        folder: 'general',
        caption: '',
        category: 'general'
      };
      lastUploadedMetaRef.current = mediaMeta;

      console.log('[MediaPickerModal] Step 3: Saving metadata record to Supabase PostgreSQL database:', mediaMeta);

      let supabaseOk = false;
      let supabaseErrorMsg = '';

      try {
        await uploadPhoto(cloudinaryResult.optimizedUrl, mediaMeta);
        supabaseOk = true;
        console.log('[MediaPickerModal] Step 4: Supabase record created successfully!');
      } catch (sbErr: any) {
        console.error('[MediaPickerModal] Step 4 FAIL: Supabase metadata write failed:', sbErr);
        supabaseErrorMsg = sbErr?.message || 'Supabase write operation failed.';
      }

      if (supabaseOk) {
        setLastUploadedUrl(cloudinaryResult.optimizedUrl);
        setUploadStatus('success');
        setUploadError(null);
        console.log('[MediaPickerModal] Complete: Image uploaded to Cloudinary & saved to Supabase PostgreSQL.');
      } else {
        setLastUploadedUrl(cloudinaryResult.optimizedUrl);
        setUploadStatus('supabase_error');
        setUploadError(`Image uploaded to Cloudinary, but Supabase media metadata could not be saved: ${supabaseErrorMsg}`);
        console.warn('[MediaPickerModal] Partial success: Cloudinary upload succeeded, but Supabase metadata save failed.');
      }
    } catch (err: any) {
      console.error('[MediaPickerModal] FAIL: Cloudinary upload failed:', err);
      setUploadError(err.message || 'An error occurred during Cloudinary upload.');
      setUploadStatus('error');
    } finally {
      // ALWAYS reset isUploading state to ensure UI is never stuck
      setIsUploading(false);
      console.log('[MediaPickerModal] Resetting isUploading = false');
    }
  };

  const retrySupabaseSave = async () => {
    if (!lastUploadedUrl) return;
    setIsUploading(true);
    setUploadStatus('saving');
    setUploadError(null);
    try {
      console.log('[MediaPickerModal] Retrying Supabase metadata save for URL:', lastUploadedUrl);
      await uploadPhoto(lastUploadedUrl, lastUploadedMetaRef.current || undefined);
      setUploadStatus('success');
      setUploadError(null);
      console.log('[MediaPickerModal] Supabase retry succeeded!');
    } catch (err: any) {
      console.error('[MediaPickerModal] Supabase retry failed:', err);
      setUploadStatus('supabase_error');
      setUploadError(`Image uploaded to Cloudinary, but Supabase media metadata could not be saved: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const resetUploadSelection = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setImageMeta(null);
    setValidationError(null);
    setUploadError(null);
    setUploadProgress(0);
    setUploadStatus('idle');
    setLastUploadedUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddCustomUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    const rawUrl = customUrl.trim();
    const optimizedUrl = getOptimizedCloudinaryUrl(rawUrl);
    try {
      await uploadPhoto(optimizedUrl);
      onSelectImage(optimizedUrl);
      onClose();
    } catch (err: any) {
      setValidationError('Failed to save image URL: ' + err.message);
    }
  };

  const handleDeletePhoto = async (e: React.MouseEvent, imgUrl: string) => {
    e.stopPropagation();
    if (!deletePhoto) return;
    if (!window.confirm('Are you sure you want to remove this image from the Media Library?')) return;

    setDeletingUrl(imgUrl);
    try {
      await deletePhoto(imgUrl);
    } catch (err: any) {
      alert('Failed to delete image: ' + err.message);
    } finally {
      setDeletingUrl(null);
    }
  };

  // Combine photos and gallery images into a unique set
  const allImages = Array.from(
    new Set([
      ...(lastUploadedUrl ? [lastUploadedUrl] : []),
      ...photos.map((p) => getOptimizedCloudinaryUrl(p)),
      ...gallery.map((g) => getOptimizedCloudinaryUrl(g.image)).filter(Boolean),
    ])
  );

  const filteredImages = allImages.filter((img) =>
    img.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="max-w-4xl w-full bg-[#0E120E] border border-white/20 p-6 sm:p-8 shadow-2xl rounded-xl space-y-6 my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-950/80 border border-blue-500/30 text-blue-400 rounded-lg">
              <Zap className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h3 className="text-xl font-serif text-white font-bold flex items-center gap-2">
                <span>Cloudinary Media Library</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded">
                  Web Optimized
                </span>
              </h3>
              <p className="text-xs text-white/50">Manage farm images with Cloudinary CDN & Firebase Metadata</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            disabled={isUploading}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 gap-2 shrink-0 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'library'
                ? 'bg-white/10 text-white border-[#A4C293]'
                : 'text-white/60 hover:text-white border-transparent'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Select Existing ({allImages.length})</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'upload'
                ? 'bg-white/10 text-white border-[#A4C293]'
                : 'text-white/60 hover:text-white border-transparent'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Upload New File</span>
            {selectedFile && <span className="w-2 h-2 rounded-full bg-[#A4C293] animate-pulse"></span>}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-t-lg transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'settings'
                ? 'bg-white/10 text-white border-[#A4C293]'
                : 'text-white/60 hover:text-white border-transparent'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Cloudinary Settings</span>
            {(!cConfig.cloudName || !cConfig.uploadPreset) && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            )}
          </button>
        </div>

        {/* TAB 1: MEDIA LIBRARY SELECTION */}
        {activeTab === 'library' && (
          <div className="space-y-4 overflow-y-auto pr-1 flex-1">
            {/* Search and Quick Action Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-black/60 p-3 border border-white/10 rounded-lg">
              <div className="md:col-span-2 relative">
                <Search className="w-4 h-4 text-white/40 absolute left-3 top-3" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter media assets by URL..."
                  className="w-full bg-black/80 border border-white/10 pl-9 pr-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#A4C293] rounded-lg"
                />
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className="bg-[#A4C293] hover:bg-white text-[#0A0C0A] py-2 px-4 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Device File</span>
              </button>
            </div>

            {/* Custom URL Input */}
            <form onSubmit={handleAddCustomUrl} className="flex gap-2">
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="Or paste external photo link (https://res.cloudinary.com/...)"
                className="flex-1 bg-black/60 border border-white/10 px-4 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#A4C293] rounded-lg"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
              >
                Use URL
              </button>
            </form>

            {/* Media Asset Grid */}
            <div>
              {filteredImages.length === 0 ? (
                <div className="py-12 text-center text-white/40 border border-dashed border-white/10 rounded-lg">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs">No media assets found matching search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-1">
                  {filteredImages.map((imgUrl, idx) => {
                    const isCloudinary = imgUrl.includes('cloudinary.com');
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          onSelectImage(imgUrl);
                          onClose();
                        }}
                        className="group relative h-36 rounded-lg overflow-hidden border border-white/10 bg-black/50 cursor-pointer hover:border-[#A4C293] transition-all"
                      >
                        <img
                          src={imgUrl}
                          alt={`Asset ${idx}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        {/* Cloudinary Optimization Badge */}
                        {isCloudinary && (
                          <div className="absolute top-1.5 left-1.5 bg-black/75 backdrop-blur-xs text-[8px] font-mono font-bold text-sky-300 px-1.5 py-0.5 rounded border border-sky-400/30 flex items-center gap-1 z-10">
                            <Zap className="w-2.5 h-2.5" /> f_auto,q_auto
                          </div>
                        )}

                        {/* Delete Button */}
                        {deletePhoto && (
                          <button
                            type="button"
                            onClick={(e) => handleDeletePhoto(e, imgUrl)}
                            disabled={deletingUrl === imgUrl}
                            title="Delete photo from Media Library"
                            className="absolute top-1.5 right-1.5 p-1.5 bg-red-950/80 hover:bg-red-600 text-red-200 rounded transition-colors opacity-0 group-hover:opacity-100 z-20"
                          >
                            {deletingUrl === imgUrl ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}

                        {/* Selection Hover Overlay */}
                        <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between items-center text-center">
                          <span className="px-2.5 py-1 bg-[#A4C293] text-[#0A0C0A] text-[10px] font-bold uppercase tracking-wider rounded shadow-sm flex items-center gap-1 mt-6">
                            <Check className="w-3 h-3" /> Select Image
                          </span>
                          <span className="text-[9px] text-white/70 font-mono truncate w-full">
                            {imgUrl}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CLOUDINARY FILE UPLOAD */}
        {activeTab === 'upload' && (
          <div className="space-y-5 overflow-y-auto pr-1 flex-1">
            {/* Warning if Cloudinary credentials missing */}
            {(!cConfig.cloudName || !cConfig.uploadPreset) && (
              <div className="p-4 bg-amber-950/70 border border-amber-500/50 text-amber-200 text-xs rounded-lg flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Cloudinary Credentials Required</span>
                    <span>Please enter your Cloud Name and Unsigned Upload Preset in Cloudinary Settings before uploading.</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className="px-3 py-1.5 bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded shrink-0"
                >
                  Configure Now
                </button>
              </div>
            )}

            {/* Validation Error Alert */}
            {validationError && (
              <div className="p-4 bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs rounded-lg flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold block mb-0.5">Validation Alert</span>
                  <span>{validationError}</span>
                </div>
              </div>
            )}

            {/* Upload Error Alert (Cloudinary failure) */}
            {uploadError && uploadStatus === 'error' && (
              <div className="p-4 bg-red-950/60 border border-red-500/40 text-red-200 text-xs rounded-lg flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold block text-red-300">Cloudinary Upload Failed</span>
                    <span className="leading-relaxed block">{uploadError}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={executeUpload}
                  disabled={isUploading}
                  className="px-3 py-1.5 bg-red-500 hover:bg-red-400 text-white font-bold text-xs uppercase tracking-wider rounded-md shrink-0 flex items-center gap-1 shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Upload</span>
                </button>
              </div>
            )}

            {/* Supabase Metadata Failure Alert */}
            {(uploadStatus === 'supabase_error' || uploadStatus === 'firebase_error') && (
              <div className="p-4 bg-amber-950/80 border border-amber-500/50 text-amber-200 text-xs rounded-lg space-y-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1 flex-1">
                    <span className="font-bold block text-amber-300 text-sm">Image uploaded to Cloudinary, but Supabase media metadata could not be saved.</span>
                    <span className="text-amber-200/80 block">The file was successfully uploaded to Cloudinary CDN, but saving metadata to Supabase PostgreSQL encountered an issue.</span>
                    {lastUploadedUrl && (
                      <div className="mt-2 bg-black/50 p-2 rounded border border-amber-500/30 font-mono text-[11px] text-amber-200">
                        <div className="truncate"><span className="text-amber-400 font-bold">URL:</span> {lastUploadedUrl}</div>
                        {lastUploadedMetaRef.current?.publicId && (
                          <div><span className="text-amber-400 font-bold">Public ID:</span> {lastUploadedMetaRef.current.publicId}</div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 shrink-0 pt-1">
                  <button
                    type="button"
                    onClick={retrySupabaseSave}
                    disabled={isUploading}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded flex items-center gap-1 shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Supabase Save</span>
                  </button>
                  {lastUploadedUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectImage(lastUploadedUrl);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-[#A4C293] hover:bg-white text-[#0A0C0A] font-bold text-xs uppercase tracking-wider rounded transition-colors"
                    >
                      Use Image
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Success Notification Banner */}
            {uploadStatus === 'success' && lastUploadedUrl && (
              <div className="p-4 bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs rounded-lg space-y-3">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <FileCheck className="w-5 h-5 text-emerald-400" />
                  <span>Upload complete ✓</span>
                </div>
                <p className="text-emerald-200/80 text-xs">
                  Image successfully uploaded to Cloudinary CDN & saved to Supabase Media Library.
                </p>
                <div className="flex items-center justify-between bg-black/40 p-2.5 rounded border border-emerald-500/20 gap-3">
                  <span className="text-[10px] font-mono text-emerald-300/80 truncate max-w-md">{lastUploadedUrl}</span>
                  <button
                    type="button"
                    onClick={() => {
                      onSelectImage(lastUploadedUrl);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-[#A4C293] hover:bg-white text-[#0A0C0A] font-bold text-[10px] uppercase tracking-wider rounded transition-colors shrink-0"
                  >
                    Select Uploaded Image
                  </button>
                </div>
              </div>
            )}

            {/* Dropzone */}
            {!selectedFile && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  isDragging
                    ? 'border-[#A4C293] bg-[#A4C293]/10 scale-[0.99]'
                    : 'border-white/20 bg-black/40 hover:border-white/40'
                }`}
              >
                <div className="max-w-md mx-auto space-y-4">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto text-sky-400">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">
                      Drag & Drop Image for Cloudinary Upload
                    </h4>
                    <p className="text-xs text-white/50">
                      Supports JPG, PNG, WEBP, GIF, SVG up to 10 MB limit
                    </p>
                  </div>
                  <div>
                    <label className="inline-flex items-center gap-2 px-6 py-3 bg-[#A4C293] hover:bg-white text-[#0A0C0A] text-xs font-bold uppercase tracking-wider rounded-lg cursor-pointer transition-colors shadow-sm">
                      <Upload className="w-4 h-4" />
                      <span>Choose File from Device</span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                        onChange={handleFileInputChange}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Selected File Preview */}
            {selectedFile && previewUrl && (
              <div className="bg-black/60 border border-white/15 p-5 rounded-xl space-y-5">
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  <div className="w-full sm:w-44 h-44 bg-black/80 rounded-lg overflow-hidden border border-white/20 relative shrink-0">
                    <img
                      src={previewUrl}
                      alt="Upload Preview"
                      className="w-full h-full object-cover"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center text-white p-2">
                        <Loader2 className="w-6 h-6 text-sky-400 animate-spin mb-2" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">{uploadProgress}%</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-3 w-full">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Cloudinary Processing Preview</span>
                      </span>
                      {!isUploading && (
                        <button
                          type="button"
                          onClick={resetUploadSelection}
                          className="text-[11px] text-white/60 hover:text-white underline underline-offset-2"
                        >
                          Change File
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="col-span-2">
                        <span className="text-white/40 block text-[10px] uppercase font-bold">File Name</span>
                        <span className="text-white font-mono truncate block">{selectedFile.name}</span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[10px] uppercase font-bold">Size</span>
                        <span className="text-white">{imageMeta?.sizeFormatted}</span>
                      </div>
                      <div>
                        <span className="text-white/40 block text-[10px] uppercase font-bold">Dimensions</span>
                        <span className="text-white">
                          {imageMeta ? `${imageMeta.width} × ${imageMeta.height} px` : 'Calculating...'}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-white/40 block text-[10px] uppercase font-bold">Auto Optimizations</span>
                        <span className="text-sky-300 font-mono text-[11px]">Format: Auto (f_auto) | Quality: Auto (q_auto)</span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {(isUploading || uploadStatus === 'saving' || uploadStatus === 'success' || uploadStatus === 'firebase_error') && (
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-white/80 font-bold">
                            {uploadStatus === 'uploading' && `Uploading to Cloudinary CDN... ${uploadProgress}%`}
                            {uploadStatus === 'saving' && 'Saving metadata to Firebase...'}
                            {uploadStatus === 'success' && 'Upload complete ✓'}
                            {uploadStatus === 'firebase_error' && 'Cloudinary Upload Complete (Firebase Save Failed)'}
                          </span>
                          <span className="text-sky-400 font-mono font-bold">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden border border-white/10">
                          <div
                            className={`h-full transition-all duration-200 ease-out rounded-full ${
                              uploadStatus === 'firebase_error' ? 'bg-amber-400' : 'bg-sky-400'
                            }`}
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="pt-3 flex flex-wrap gap-2">
                      {uploadStatus === 'success' ? (
                        <button
                          type="button"
                          onClick={resetUploadSelection}
                          className="px-6 py-2.5 bg-[#A4C293] hover:bg-white text-[#0A0C0A] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 shadow-sm font-bold"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Upload Another File</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={(uploadStatus === 'supabase_error' || uploadStatus === 'firebase_error') ? retrySupabaseSave : executeUpload}
                          disabled={isUploading || !cConfig.cloudName || !cConfig.uploadPreset}
                          className="px-6 py-2.5 bg-[#A4C293] hover:bg-white text-[#0A0C0A] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>
                                {uploadStatus === 'saving' ? 'Saving Metadata...' : `Uploading (${uploadProgress}%)...`}
                              </span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4" />
                              <span>{(uploadStatus === 'supabase_error' || uploadStatus === 'firebase_error') ? 'Retry Supabase Save' : 'Start Upload to Cloudinary'}</span>
                            </>
                          )}
                        </button>
                      )}

                      {!isUploading && uploadStatus !== 'success' && (
                        <button
                          type="button"
                          onClick={resetUploadSelection}
                          className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CLOUDINARY CONFIGURATION SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-5 overflow-y-auto pr-1 flex-1">
            <div className="bg-black/60 border border-white/10 p-6 rounded-xl space-y-4">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <Settings className="w-5 h-5 text-sky-400" />
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">Cloudinary Credentials Configuration</h4>
                  <p className="text-xs text-white/50">Configure your Cloud Name and Unsigned Upload Preset for secure browser uploads</p>
                </div>
              </div>

              {configSavedMsg && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs rounded-lg flex items-center gap-2 font-bold">
                  <Check className="w-4 h-4" />
                  <span>{configSavedMsg}</span>
                </div>
              )}

              {validationError && (
                <div className="p-3 bg-amber-950/60 border border-amber-500/40 text-amber-200 text-xs rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  <span>{validationError}</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1.5">
                    Cloudinary Cloud Name
                  </label>
                  <input
                    type="text"
                    required
                    value={configCloudNameInput}
                    onChange={(e) => setConfigCloudNameInput(e.target.value)}
                    placeholder="e.g. gabolekwe-farms"
                    className="w-full bg-black/80 border border-white/15 px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-sky-400 rounded-lg font-mono"
                  />
                  <p className="text-[10px] text-white/40 mt-1">Found in your Cloudinary Dashboard under "Cloud name".</p>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1.5">
                    Unsigned Upload Preset
                  </label>
                  <input
                    type="text"
                    required
                    value={configPresetInput}
                    onChange={(e) => setConfigPresetInput(e.target.value)}
                    placeholder="e.g. gabolekwe_preset"
                    className="w-full bg-black/80 border border-white/15 px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-sky-400 rounded-lg font-mono"
                  />
                  <p className="text-[10px] text-white/40 mt-1">
                    Found in Cloudinary Console → Settings → Upload → Upload presets (must have "Signing Mode: Unsigned").
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">Supabase Metadata Database Configuration</h5>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1">
                        Supabase Project URL (VITE_SUPABASE_URL)
                      </label>
                      <input
                        type="url"
                        value={supabaseUrlInput}
                        onChange={(e) => setSupabaseUrlInput(e.target.value)}
                        placeholder="https://your-project.supabase.co"
                        className="w-full bg-black/80 border border-white/15 px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 rounded-lg font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1">
                        Supabase Anon / Publishable Key (VITE_SUPABASE_ANON_KEY)
                      </label>
                      <input
                        type="password"
                        value={supabaseKeyInput}
                        onChange={(e) => setSupabaseKeyInput(e.target.value)}
                        placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                        className="w-full bg-black/80 border border-white/15 px-4 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-400 rounded-lg font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#A4C293] hover:bg-white text-[#0A0C0A] text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Credentials</span>
                  </button>

                  <a
                    href="https://cloudinary.com/console"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-sky-400 hover:text-sky-300 underline flex items-center gap-1"
                  >
                    <span>Cloudinary Console</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex justify-end pt-4 border-t border-white/10 shrink-0">
          <button
            onClick={onClose}
            type="button"
            disabled={isUploading}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors disabled:opacity-40"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
