import React, { useState } from 'react';
import { UploadCloud, Loader2, X } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { toast } from 'sonner';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  value,
  onChange,
  placeholder = '/img/placeholder.png'
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed.');
      return;
    }

    // Validate size (e.g. 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.');
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      // Call backend upload endpoint
      const res = await apiClient.post<{ url: string }>('/api/v1/upload', formData);
      if (res && res.url) {
        onChange(res.url);
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Upload failed: Invalid response from server');
      }
    } catch (err: any) {
      toast.error(err.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-black/40 border border-white/10 rounded-lg p-3 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[10px] text-white/40 uppercase tracking-wider block font-semibold">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[10px] text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
          >
            <X className="w-3 h-3" /> Clear Image
          </button>
        )}
      </div>

      <div className="space-y-3">
        {/* Upload Dropzone / Click Area */}
        <label className="relative group flex flex-col items-center justify-center border border-dashed border-white/10 hover:border-primary/50 bg-black/25 hover:bg-black/40 rounded-lg p-4 cursor-pointer transition-all duration-200 min-h-24">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <span className="text-xs text-white/60">Uploading to Cloudinary...</span>
            </div>
          ) : value ? (
            <div className="flex flex-col items-center gap-2 w-full py-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value}
                alt="Uploaded"
                className="max-h-24 object-contain rounded-md border border-white/5"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = placeholder;
                }}
              />
              <span className="text-[10px] text-primary/80 group-hover:text-primary transition-colors mt-1 font-medium">
                Click to replace image
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 py-1 text-center">
              <UploadCloud className="w-6 h-6 text-white/30 group-hover:text-primary transition-colors" />
              <span className="text-xs text-white/60 group-hover:text-white transition-colors font-medium">
                Upload image file
              </span>
              <span className="text-[9px] text-white/30">Supports JPG, PNG, WEBP (Max 5MB)</span>
            </div>
          )}
        </label>
      </div>
    </div>
  );
};
