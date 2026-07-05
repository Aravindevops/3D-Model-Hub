import { supabase } from '@/lib/supabase';
import ModelViewer from '@/components/ModelViewer';

export const revalidate = 0; // Disable caching for now to see immediate updates

export default async function Home() {
  const { data: models, error } = await supabase
    .from('models')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="main-content">
      <div className="container">
        <h1 className="animate-fade-in">Gallery</h1>
        <p className="animate-fade-in delay-100" style={{ marginBottom: '2rem' }}>
          Explore our collection of interactive 3D assets.
        </p>

        {error ? (
          <div style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderLeft: '4px solid #ef4444' }}>
            <p style={{ color: 'var(--text-primary)', margin: 0 }}>
              Could not load models. Please ensure your Supabase credentials are correct and the "models" table exists.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {models?.map((model, idx) => (
              <div 
                key={model.id} 
                className={`animate-fade-in glass-panel`}
                style={{ 
                  animationDelay: `${(idx + 2) * 0.1}s`,
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div style={{ height: '250px', backgroundColor: 'var(--bg-tertiary)' }}>
                  <ModelViewer url={model.glb_url} />
                </div>
                <div style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{model.title}</h3>
                  <p style={{ fontSize: '0.875rem', margin: 0 }}>{model.description || 'No description available.'}</p>
                </div>
              </div>
            ))}
            
            {models?.length === 0 && (
              <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>No models found. Head to the Admin Upload page to add some!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
