import { supabase } from '@/lib/supabase';
import ModelCard from '@/components/ModelCard';

export const revalidate = 0;

export default async function Home() {
  const { data: models, error } = await supabase
    .from('models')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <main className="main-content">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 className="animate-fade-in" style={{ margin: 0 }}>3D Gallery</h1>
        </div>
        
        {error ? (
          <p style={{ color: 'red' }}>Error loading models: {error.message}</p>
        ) : models?.length === 0 ? (
          <p>No models found. Go to the Admin dashboard to upload one!</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {models?.map((model, index) => (
              <div key={model.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ModelCard model={model} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
