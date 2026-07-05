import { supabase } from '@/lib/supabase';
import ModelViewer from '@/components/ModelViewer';
import { ArrowLeft, Calendar } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function ModelDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  
  const { data: model, error } = await supabase
    .from('models')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    return <div style={{ color: 'white', padding: '2rem' }}>Database Error: {error.message} (ID: {params.id})</div>;
  }
  
  if (!model) {
    return <div style={{ color: 'white', padding: '2rem' }}>Model not found for ID: {params.id}</div>;
  }

  const date = new Date(model.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <main className="main-content" style={{ height: 'calc(100vh - 70px)', display: 'flex', flexDirection: 'column' }}>
      <div className="container" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', padding: '2rem 1rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-tertiary)', textDecoration: 'none', marginBottom: '1rem', fontSize: '0.875rem' }} className="hover-text">
              <ArrowLeft size={16} /> Back to Gallery
            </Link>
            <h1 style={{ margin: '0 0 0.5rem 0' }}>{model.title}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
              <Calendar size={14} /> {date}
            </div>
          </div>
          
          <div style={{ maxWidth: '400px', textAlign: 'right' }}>
             <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{model.description}</p>
          </div>
        </div>

        {/* Viewer */}
        <div className="glass-panel animate-fade-in" style={{ flexGrow: 1, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-color)', minHeight: '400px' }}>
          <ModelViewer url={model.glb_url} interactive={true} />
        </div>

      </div>
    </main>
  );
}
