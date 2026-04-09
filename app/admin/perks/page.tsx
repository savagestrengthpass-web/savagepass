'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Perk } from '@/types';
import { Plus, Search, Tag, Trash2, Pencil } from 'lucide-react';

export default function AdminPerks() {
  const [perks, setPerks] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPerks();
  }, []);

  async function fetchPerks() {
    setLoading(true);
    const { data, error } = await supabase
      .from('perks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching perks:', error);
    } else {
      setPerks(data || []);
    }
    setLoading(false);
  }

  async function deletePerk(id: string, name: string) {
    if (!confirm(`¿Eliminar beneficio "${name}"? Esta acción no se puede deshacer.`)) return;

    const { error } = await supabase.from('perks').delete().eq('id', id);
    if (error) {
      console.error('Error deleting perk:', error);
      alert('Error al eliminar el beneficio.');
    } else {
      fetchPerks();
    }
  }

  const filteredPerks = perks.filter(p =>
    p.partner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="heading" style={{ fontSize: '2rem', color: 'var(--accent)' }}>Beneficios y Descuentos</h1>
          <p style={{ color: 'var(--muted)' }}>Administra los descuentos de socios para los titulares de Savage Pass.</p>
        </div>
        <Link href="/admin/perks/new" className="btn-primary">
          <Plus size={20} />
          Nuevo Beneficio
        </Link>
      </header>

      <div className="glass-dark" style={{ padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', color: 'var(--muted)' }} />
          <input
            type="text"
            placeholder="Buscar por nombre de socio o categoría..."
            className="input-field"
            style={{ paddingLeft: '40px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>Cargando beneficios...</div>
      ) : filteredPerks.length === 0 ? (
        <div className="glass-dark" style={{ textAlign: 'center', padding: '3rem', borderRadius: '12px' }}>
          <Tag size={48} style={{ color: 'var(--muted)', marginBottom: '1rem' }} />
          <p style={{ color: 'var(--muted)' }}>No se encontraron beneficios. ¡Agrega tu primer descuento de socio!</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
          {filteredPerks.map((perk) => (
            <div key={perk.id} className="glass-dark" style={{
              borderRadius: '16px',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Card Header */}
              <div style={{ padding: '1.25rem 1.25rem 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                {perk.image_url ? (
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: '1px solid var(--card-border)'
                  }}>
                    <Image
                      src={perk.image_url}
                      alt={perk.partner_name}
                      width={48}
                      height={48}
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                  </div>
                ) : (
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'rgba(233, 255, 0, 0.1)',
                    border: '1px solid rgba(233, 255, 0, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent)',
                    flexShrink: 0,
                  }}>
                    <Tag size={20} />
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {perk.partner_name}
                  </h3>
                  <span style={{
                    fontSize: '0.7rem',
                    color: 'var(--muted)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    {perk.category}
                  </span>
                </div>
                <div style={{
                  background: 'rgba(233, 255, 0, 0.12)',
                  border: '1px solid rgba(233, 255, 0, 0.25)',
                  padding: '4px 10px',
                  borderRadius: '100px',
                  fontSize: '0.75rem',
                  fontWeight: 900,
                  color: 'var(--accent)',
                  whiteSpace: 'nowrap',
                }}>
                  {perk.discount}
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1rem 1.25rem', flex: 1 }}>
                <p style={{ color: 'var(--muted)', fontSize: '0.82rem', lineHeight: 1.5, margin: 0 }}>
                  {perk.description}
                </p>
              </div>

              {/* Card Footer */}
              <div style={{
                padding: '0.75rem 1.25rem',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px',
              }}>
                <Link
                  href={`/admin/perks/${perk.id}/edit`}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Pencil size={14} />
                  Editar
                </Link>
                <button
                  onClick={() => deletePerk(perk.id, perk.partner_name)}
                  className="btn-secondary"
                  style={{
                    padding: '6px 12px',
                    fontSize: '0.8rem',
                    borderColor: 'var(--error)',
                    color: 'var(--error)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer',
                    background: 'transparent',
                  }}
                >
                  <Trash2 size={14} />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
