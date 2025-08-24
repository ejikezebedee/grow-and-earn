import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, File, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileUploaded: (url: string) => void;
  accept?: string;
  maxSize?: number;
  bucket: string;
  path?: string;
  className?: string;
}

export const FileUpload = ({ 
  onFileUploaded, 
  accept = "image/*", 
  maxSize = 5 * 1024 * 1024, // 5MB
  bucket,
  path = '',
  className 
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = path ? `${path}/${fileName}` : fileName;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: publicData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      if (publicData?.publicUrl) {
        setPreview(publicData.publicUrl);
        onFileUploaded(publicData.publicUrl);
        setProgress(100);
      }

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Error",
        description: error.message || 'Failed to upload file',
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }, [bucket, path, onFileUploaded, toast]);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: accept.split(',').reduce((acc, type) => {
      acc[type.trim()] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize,
    multiple: false
  });

  const clearPreview = () => {
    setPreview(null);
    setProgress(0);
  };

  const isImage = accept.includes('image');

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          uploading && "pointer-events-none opacity-50"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          {isImage ? (
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
          ) : (
            <File className="h-8 w-8 text-muted-foreground" />
          )}
          {isDragActive ? (
            <p className="text-sm text-muted-foreground">Drop the file here...</p>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground">
                Drag & drop a file here, or{' '}
                <span className="text-primary underline">browse</span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Max file size: {Math.round(maxSize / 1024 / 1024)}MB
              </p>
            </div>
          )}
        </div>
      </div>

      {fileRejections.length > 0 && (
        <div className="text-sm text-destructive">
          {fileRejections[0].errors[0].message}
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {preview && (
        <div className="relative">
          {isImage ? (
            <img 
              src={preview} 
              alt="Uploaded preview" 
              className="max-w-full h-32 object-cover rounded-lg border"
            />
          ) : (
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <File className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">File uploaded successfully</span>
            </div>
          )}
          <Button
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 h-6 w-6"
            onClick={clearPreview}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
};