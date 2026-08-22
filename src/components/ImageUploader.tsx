import React, { useState } from 'react';
import { Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function ImageUploader({ onUploadSuccess }: { onUploadSuccess: (url: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUrl('');
      setUploadStatus('idle');
    }
  };

  const uploadFile = async (formData: FormData, endpoint: string) => {
    setIsUploading(true);
    setUploadStatus('idle');
    setErrorMessage('');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      onUploadSuccess(data.url);
      setUploadStatus('success');
      setFile(null);
      setUrl('');
    } catch (err) {
      setUploadStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSubmit = () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    // Send file directly without compression to preserve quality
    uploadFile(formData, '/api/upload');
  };

  const handleUrlSubmit = () => {
    if (!url) return;
    
    setIsUploading(true);
    setUploadStatus('idle');
    setErrorMessage('');
    fetch('/api/upload-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    })
      .then(r => r.json())
      .then(data => {
        onUploadSuccess(data.url);
        setUploadStatus('success');
        setFile(null);
        setUrl('');
      })
      .catch(err => {
        setUploadStatus('error');
        setErrorMessage(err.message);
      })
      .finally(() => setIsUploading(false));
  };

  return (
    <div className="p-6 bg-white border border-neutral-200 rounded-xl shadow-sm space-y-6">
      <div className="space-y-4">
        <h3 className="font-bold text-sm">رفع من ملف</h3>
        <input type="file" onChange={handleFileChange} accept="image/*" className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-neutral-50 file:text-neutral-700 hover:file:bg-neutral-100" />
        <button onClick={handleFileSubmit} disabled={!file || isUploading} className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50 flex items-center gap-2">
          {isUploading ? <Loader2 className="animate-spin w-4 h-4" /> : <Upload className="w-4 h-4" />}
          رفع الملف
        </button>
      </div>
      <div className="space-y-4 pt-4 border-t border-neutral-100">
        <h3 className="font-bold text-sm">رفع من رابط (خارجي)</h3>
        <input type="text" value={url} onChange={(e) => { setUrl(e.target.value); setFile(null); }} placeholder="https://example.com/image.jpg" className="w-full p-2 border border-neutral-200 rounded-lg text-sm" />
        <button onClick={handleUrlSubmit} disabled={!url || isUploading} className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 disabled:opacity-50 flex items-center gap-2">
          {isUploading ? <Loader2 className="animate-spin w-4 h-4" /> : <Upload className="w-4 h-4" />}
          رفع من الرابط
        </button>
      </div>

      {uploadStatus === 'success' && <div className="flex items-center gap-2 text-emerald-600"><CheckCircle className="w-5 h-5" /><span>تم الرفع بنجاح!</span></div>}
      {uploadStatus === 'error' && <div className="flex items-center gap-2 text-red-600"><AlertCircle className="w-5 h-5" /><span>{errorMessage}</span></div>}
    </div>
  );
}
