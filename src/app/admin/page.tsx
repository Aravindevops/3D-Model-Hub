"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UploadCloud, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.name.toLowerCase().endsWith('.glb')) {
        setFile(selected);
      } else {
        setStatus({ type: 'error', message: 'Please select a valid .glb file.' });
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title) {
      setStatus({ type: 'error', message: 'Please provide a title and select a file.' });
      return;
    }

    setIsUploading(true);
    setStatus({ type: null, message: '' });

    try {
      // 1. Upload file to Supabase Storage (bucket named 'models')
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('models')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('models')
        .getPublicUrl(filePath);

      // 3. Save metadata to database
      const { error: dbError } = await supabase
        .from('models')
        .insert([
          {
            title,
            description,
            glb_url: publicUrl,
          }
        ]);

      if (dbError) throw dbError;

      setStatus({ type: 'success', message: 'Model uploaded successfully!' });
      setFile(null);
      setTitle('');
      setDescription('');
      
    } catch (error: any) {
      console.error(error);
      setStatus({ type: 'error', message: error.message || 'An error occurred during upload.' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="main-content">
      <div className="container" style={{ maxWidth: '600px' }}>
        <h1 className="animate-fade-in">Admin Dashboard</h1>
        <p className="animate-fade-in delay-100" style={{ marginBottom: '2rem' }}>
          Upload new 3D models to your digital asset management system.
        </p>

        <div className="animate-fade-in delay-200 glass-panel" style={{ padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
          <form onSubmit={handleUpload}>
            <div className="input-group">
              <label htmlFor="title" className="input-label">Model Title</label>
              <input
                id="title"
                type="text"
                className="input-field"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Cyberpunk Hovercar"
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="description" className="input-label">Description (Optional)</label>
              <textarea
                id="description"
                className="input-field"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief description of the asset..."
                rows={4}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div className="input-group">
              <label className="input-label">GLB File</label>
              <label 
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '3rem 2rem',
                  border: '2px dashed var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  backgroundColor: file ? 'var(--bg-tertiary)' : 'var(--bg-primary)',
                  transition: 'background-color 0.2s',
                  textAlign: 'center'
                }}
              >
                <input
                  type="file"
                  accept=".glb"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <UploadCloud size={32} style={{ color: 'var(--text-tertiary)', marginBottom: '1rem' }} />
                {file ? (
                  <span style={{ fontWeight: 500 }}>{file.name}</span>
                ) : (
                  <>
                    <span style={{ fontWeight: 500, marginBottom: '0.25rem' }}>Click to upload</span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)' }}>Only .glb files are supported</span>
                  </>
                )}
              </label>
            </div>

            {status.type && (
              <div style={{
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: status.type === 'success' ? '#dcfce7' : '#fee2e2',
                color: status.type === 'success' ? '#166534' : '#991b1b'
              }}>
                {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                <span>{status.message}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                  Uploading...
                </>
              ) : (
                'Upload Asset'
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
