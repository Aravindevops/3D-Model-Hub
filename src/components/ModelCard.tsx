"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import ModelViewer from './ModelViewer';
import { Edit2, Save, X, ExternalLink, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Model {
  id: string;
  title: string;
  description: string;
  glb_url: string;
}

export default function ModelCard({ model }: { model: Model }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(model.title);
  const [description, setDescription] = useState(model.description || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('models')
        .update({ title, description })
        .eq('id', model.id);
        
      if (error) throw error;
      
      setIsEditing(false);
      router.refresh(); 
    } catch (error) {
      console.error("Error updating model:", error);
      alert("Failed to update. Make sure you ran the SQL policy update.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this model?")) return;
    setIsDeleting(true);
    
    try {
      // Extract the filename from the end of the URL
      const fileNameStr = model.glb_url.split('/').pop();
      if (fileNameStr) {
        const fileName = decodeURIComponent(fileNameStr);
        // Delete the file from the storage bucket
        await supabase.storage.from('models').remove([fileName]);
      }

      // Delete the record from the database
      const { error } = await supabase
        .from('models')
        .delete()
        .eq('id', model.id);
        
      if (error) throw error;
      
      router.refresh(); 
    } catch (error) {
      console.error("Error deleting model:", error);
      alert("Failed to delete. Make sure you have the SQL DELETE policies applied.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancel = () => {
    setTitle(model.title);
    setDescription(model.description || '');
    setIsEditing(false);
  };

  return (
    <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', opacity: isDeleting ? 0.5 : 1, transition: 'opacity 0.2s' }} className="glass-panel">
      {/* 3D Preview (Static) */}
      <div style={{ height: '240px', backgroundColor: 'var(--bg-secondary)', position: 'relative' }}>
        <ModelViewer url={model.glb_url} interactive={false} />
        
        {/* Full View Button overlaying the viewer */}
        <Link href={`/models/${model.id}`} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}>
          <div style={{ opacity: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)', transition: 'opacity 0.2s' }} className="hover-overlay">
            <span style={{ color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500, backgroundColor: 'rgba(0,0,0,0.6)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)' }}>
              <ExternalLink size={18} /> View Full
            </span>
          </div>
        </Link>
      </div>

      {/* Info & Edit Area */}
      <div style={{ padding: '1.25rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flexGrow: 1 }}>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="input-field" 
              style={{ fontSize: '1.125rem', fontWeight: 600, padding: '0.5rem' }}
              placeholder="Model Title"
            />
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="input-field" 
              style={{ fontSize: '0.875rem', flexGrow: 1, minHeight: '60px', padding: '0.5rem', resize: 'vertical' }}
              placeholder="Description..."
            />
            
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem' }}>
              <button onClick={handleSave} disabled={isSaving || isDeleting} className="btn btn-primary" style={{ flexGrow: 1, padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                Save
              </button>
              <button onClick={handleCancel} disabled={isSaving || isDeleting} className="btn btn-secondary" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.125rem', fontWeight: 600 }}>{model.title}</h3>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <button onClick={() => setIsEditing(true)} disabled={isDeleting} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '0.25rem' }} aria-label="Edit model">
                  <Edit2 size={16} />
                </button>
                <button onClick={handleDelete} disabled={isDeleting} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.25rem' }} aria-label="Delete model">
                  {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', flexGrow: 1 }}>
              {model.description || 'No description provided.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
