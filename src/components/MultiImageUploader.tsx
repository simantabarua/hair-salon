import React, { useState } from 'react';
import { UploadCloud, Loader2, X } from 'lucide-react';
import { apiClient } from '@/lib/apiClient';
import { toast } from 'sonner';

interface MultiImageUploaderProps {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
  placeholder?: string;
}

export const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({
  label,
  value = [],
  onChange,
  placeholder = '/img/placeholder.png'
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate files
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file.`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is larger than 5MB.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    try {
      setUploading(true);
      const uploadedUrls: string[] = [];

      for (let i = 0; i < validFiles.length; i++) {
        setUploadProgress(`Uploading ${i + 1}/${validFiles.length}...`);
        const file = validFiles[i];
        const formData = new FormData();
        formData.append('file', file);

        const res = await apiClient.post<{ url: string }>('/api/v1/upload', formData);
        if (res && res.url) {
          uploadedUrls.push(res.url);
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      if (uploadedUrls.length > 0) {
        onChange([...value, ...uploadedUrls]);
        toast.success(`Successfully uploaded ${uploadedUrls.length} image(s)`);
      }
    } catch (err: any) {
      toast.error(err.message || 'Image upload failed.');
    } finally {
      setUploading(false);
      setUploadProgress('');
    }
  };

  const removeImage = (indexToRemove: number) => {
    const updated = value.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  return (
    <div className="bg-black/40 border border-white/10 rounded-lg p-3 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-[10px] text-white/40 uppercase tracking-wider block font-semibold">
          {label}
        </label>
        {value.length > 0 && (
          <span className="text-[10px] text-white/60">
            {value.length} image(s)
          </span>
        )}
      </div>

      <div className="space-y-3">
        {/* Upload Dropzone */}
        <label className="relative group flex flex-col items-center justify-center border border-dashed border-white/10 hover:border-primary/50 bg-black/25 hover:bg-black/40 rounded-lg p-4 cursor-pointer transition-all duration-200 min-h-24">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <span className="text-xs text-white/60 font-medium">{uploadProgress}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5 py-1 text-center">
              <UploadCloud className="w-6 h-6 text-white/30 group-hover:text-primary transition-colors" />
              <span className="text-xs text-white/60 group-hover:text-white transition-colors font-medium">
                Upload image files
              </span>
              <span className="text-[9px] text-white/30">Select one or multiple images (Max 5MB each)</span>
            </div>
          )}
        </label>

        {/* Image Grid Preview */}
        {value.length > 0 && (
          <div className="grid grid-cols-3 gap-2 pt-1">
            {value.map((url, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-md overflow-hidden border border-white/10 group/img bg-black/30"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = placeholder;
                  }}
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-black/75 hover:bg-red-950/80 text-white hover:text-red-400 p-1 rounded-full transition-all duration-150 border border-white/10 opacity-0 group-hover/img:opacity-100"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 bg-primary/95 text-black text-[8px] font-bold px-1 py-0.5 rounded shadow">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
