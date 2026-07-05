import Link from 'next/link';
import { Box, Upload } from 'lucide-react';

export default function Navbar() {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-primary)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '80px'
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: 'var(--accent-color)',
            color: 'var(--accent-text)',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Box size={20} />
          </div>
          <span style={{ fontWeight: 600, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>
            3D Asset Manager
          </span>
        </Link>

        <nav>
          <ul style={{ display: 'flex', gap: '1.5rem', listStyle: 'none' }}>
            <li>
              <Link href="/" style={{ fontWeight: 500 }}>Gallery</Link>
            </li>
            <li>
              <Link href="/admin" className="btn btn-secondary" style={{ padding: '0.4rem 1rem' }}>
                <Upload size={16} /> Admin Upload
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
