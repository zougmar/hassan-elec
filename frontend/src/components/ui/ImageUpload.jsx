import { useCallback, useRef, useMemo, useEffect } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ACCEPT = 'image/jpeg,image/jpg,image/png,image/gif,image/webp';
const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

/** Single image upload with drag & drop */
export function ImageUploadSingle({ value, onChange, previewUrl, label, className = '' }) {
  const inputRef = useRef(null);

  const handleFile = useCallback(
    (file) => {
      if (!file || !file.type.startsWith('image/')) return;
      if (file.size > MAX_SIZE_BYTES) return;
      onChange(file);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer?.files?.[0];
      handleFile(file);
    },
    [handleFile]
  );

  const handleChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      handleFile(file);
      e.target.value = '';
    },
    [handleFile]
  );

  const clear = useCallback(() => {
    onChange(null);
    if (inputRef.current) inputRef.current.value = '';
  }, [onChange]);

  const fileBlobUrl = useMemo(() => {
    if (value && typeof value === 'object' && value instanceof File) return URL.createObjectURL(value);
    return null;
  }, [value]);
  useEffect(() => () => { if (fileBlobUrl) URL.revokeObjectURL(fileBlobUrl); }, [fileBlobUrl]);

  const displayPreview = fileBlobUrl || previewUrl;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        onChange={handleChange}
        className="sr-only"
        id="image-upload-single"
      />
      {displayPreview ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800">
          <img
            src={displayPreview}
            alt="Preview"
            className="w-full h-52 object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="p-2.5 rounded-lg bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-white transition-colors shadow"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={clear}
              className="p-2.5 rounded-lg bg-red-500/90 text-white hover:bg-red-600 transition-colors shadow"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="absolute bottom-2 left-2 right-2 text-xs text-white/90 bg-black/40 rounded-lg px-2 py-1">
            JPG, PNG, GIF, WebP · max {MAX_SIZE_MB}MB
          </p>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition-colors cursor-pointer py-10 px-6"
        >
          <div className="p-3 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
            <ImageIcon className="w-8 h-8" />
          </div>
          <div className="text-center">
            <p className="font-medium text-slate-700 dark:text-slate-300">Drop image here or click to upload</p>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">JPG, PNG, GIF, WebP · max {MAX_SIZE_MB}MB</p>
          </div>
        </div>
      )}
    </div>
  );
}

/** Multiple images upload with drag & drop */
export function ImageUploadMultiple({ value = [], onChange, previewUrls = [], label, max = 10, className = '' }) {
  const inputRef = useRef(null);

  const handleFiles = useCallback(
    (files) => {
      const images = Array.from(files || []).filter((f) => f.type.startsWith('image/') && f.size <= MAX_SIZE_BYTES);
      const combined = [...value, ...images].slice(0, max);
      onChange(combined);
    },
    [value, onChange, max]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleFiles(e.dataTransfer?.files);
    },
    [handleFiles]
  );

  const handleChange = useCallback(
    (e) => {
      handleFiles(e.target.files);
      e.target.value = '';
    },
    [handleFiles]
  );

  const newFileBlobUrls = useMemo(() => value.map((f) => (f instanceof File ? URL.createObjectURL(f) : f)), [value]);
  useEffect(() => () => newFileBlobUrls.forEach((url) => typeof url === 'string' && url.startsWith('blob:') && URL.revokeObjectURL(url)), [newFileBlobUrls]);

  const currentPreviews = previewUrls.length > 0 ? [...previewUrls, ...newFileBlobUrls] : newFileBlobUrls;

  const existingCount = previewUrls.length;
  const removeAt = useCallback(
    (index) => {
      if (index >= existingCount) {
        const newIndex = index - existingCount;
        onChange(value.filter((_, i) => i !== newIndex));
      }
    },
    [value, existingCount, onChange]
  );

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{label}</label>
      )}
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        multiple
        onChange={handleChange}
        className="sr-only"
        id="image-upload-multiple"
      />
      <div
        role="button"
        tabIndex={0}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => value.length < max && inputRef.current?.click()}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        className={`rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 hover:border-primary-400 hover:bg-primary-50/50 dark:hover:bg-primary-900/20 transition-colors cursor-pointer py-6 px-4 ${value.length >= max ? 'opacity-60 pointer-events-none' : ''}`}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <Upload className="w-8 h-8 text-slate-400 dark:text-slate-500" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {value.length >= max ? `Maximum ${max} images` : 'Drop images or click to add'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-500">JPG, PNG, GIF, WebP · max {MAX_SIZE_MB}MB each</p>
        </div>
      </div>
      {currentPreviews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
          {currentPreviews.map((src, index) => (
            <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-600 aspect-square bg-slate-100 dark:bg-slate-800">
              <img src={typeof src === 'string' ? src : src} alt="" className="w-full h-full object-cover" />
              {index >= existingCount && (
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="absolute top-1 right-1 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
