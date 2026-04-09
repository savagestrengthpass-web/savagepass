'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, Users, Home, Tag } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show the admin header on the login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div>
      {/* Admin Header */}
      <header style={{
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid var(--card-border)',
        background: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/admin" style={{ display: 'flex', alignItems: 'center' }}>
            <Image src="/logo.png" alt="Savage Strength" width={130} height={36} style={{ objectFit: 'contain', clipPath: 'inset(0 2px 2px 0)' }} />
          </Link>

          <nav style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              href="/admin"
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: pathname === '/admin' ? 'var(--accent)' : 'var(--muted)',
                background: pathname === '/admin' ? 'rgba(233, 255, 0, 0.08)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <Users size={14} />
              Miembros
            </Link>
            <Link
              href="/admin/perks"
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: pathname.startsWith('/admin/perks') ? 'var(--accent)' : 'var(--muted)',
                background: pathname.startsWith('/admin/perks') ? 'rgba(233, 255, 0, 0.08)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <Tag size={14} />
              Beneficios
            </Link>
            <Link
              href="/lookup"
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 600,
                color: 'var(--muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              <Home size={14} />
              Ver Sitio
            </Link>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: '1px solid var(--card-border)',
            color: 'var(--muted)',
            padding: '6px 14px',
            borderRadius: '6px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
        >
          <LogOut size={14} />
          Cerrar Sesión
        </button>
      </header>

      {children}
    </div>
  );
}
