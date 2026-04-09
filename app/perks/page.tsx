'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Perk } from '@/types';
import { ArrowLeft, Clock, Tag, Store } from 'lucide-react';

export default function PerksPage() {
  const [perks, setPerks] = useState<Perk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPerks();
  }, []);

  async function fetchPerks() {
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

  // Generate a consistent accent color based on category
  function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      'Restaurant': '#FF6B35',
      'Supplements': '#00D4AA',
      'Healthy Food': '#7ED957',
      'Sportswear': '#E9FF00',
      'Wellness': '#FF4D8D',
      'Grooming': '#8B5CF6',
      'Entertainment': '#3B82F6',
      'Other': '#F59E0B',
    };
    return colors[category] || '#E9FF00';
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--background)',
      color: 'var(--foreground)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Glows */}
      <div style={{
        position: 'absolute', top: '-5%', right: '-10%',
        width: '500px', height: '500px', background: 'var(--accent)',
        filter: 'blur(200px)', opacity: 0.05, zIndex: 0
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', left: '-10%',
        width: '400px', height: '400px', background: '#FF4D8D',
        filter: 'blur(200px)', opacity: 0.04, zIndex: 0
      }} />

      {/* Navigation */}
      <nav style={{
        padding: '1.5rem 2rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        zIndex: 10, position: 'relative',
        maxWidth: '1200px', margin: '0 auto', width: '100%'
      }}>
        <Link href="/lookup" style={{ display: 'flex', alignItems: 'center' }}>
          <Image src="/logo.png" alt="Savage Strength" width={160} height={45} style={{ objectFit: 'contain', clipPath: 'inset(0 2px 2px 0)' }} />
        </Link>
        <Link href="/lookup" style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          color: 'var(--muted)', fontSize: '0.85rem', fontWeight: 600,
        }}>
          <ArrowLeft size={16} />
          Volver
        </Link>
      </nav>

      {/* Hero Header */}
      <header style={{
        padding: '3rem 2rem 2rem', textAlign: 'center',
        position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto'
      }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(233, 255, 0, 0.08)', padding: '8px 16px',
            borderRadius: '100px', marginBottom: '1.5rem',
            border: '1px solid rgba(233, 255, 0, 0.15)',
            fontSize: '0.7rem', fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--accent)'
          }}>
            <Tag size={14} />
            Beneficios Exclusivos para Miembros
          </div>

          <h1 className="heading" style={{
            fontSize: 'clamp(2.5rem, 7vw, 4rem)', lineHeight: 0.95, marginBottom: '1rem'
          }}>
            Tu Pase. <span style={{ color: 'var(--accent)' }}>Más Recompensas.</span>
          </h1>

          <p style={{
            color: 'var(--muted)', fontSize: '1.05rem', lineHeight: 1.6,
            maxWidth: '550px', margin: '0 auto'
          }}>
            Muestra tu Savage Strength Pass activo en cualquiera de nuestras ubicaciones asociadas para desbloquear descuentos y beneficios exclusivos.
          </p>
        </motion.div>
      </header>

      {/* Stats Bar */}
      {!loading && perks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{
            maxWidth: '800px', margin: '0 auto 3rem', padding: '0 2rem',
            display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap'
          }}
        >
          {[
            { value: `${perks.length}`, label: 'Socios' },
            { value: `Hasta ${Math.max(...perks.map(p => parseInt(p.discount) || 0))}%`, label: 'Ahorro' },
            { value: 'Siempre', label: 'Disponible' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '1rem 1.5rem' }}>
              <span style={{
                display: 'block', fontSize: '1.5rem', fontWeight: 900,
                color: 'var(--accent)', fontFamily: 'var(--font-heading)',
              }}>{stat.value}</span>
              <span style={{
                fontSize: '0.7rem', color: 'var(--muted)',
                textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.08em'
              }}>{stat.label}</span>
            </div>
          ))}
        </motion.div>
      )}

      {/* Perks Grid */}
      <main style={{
        maxWidth: '1200px', margin: '0 auto', padding: '0 2rem 4rem',
        position: 'relative', zIndex: 1
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>Cargando beneficios...</div>
        ) : perks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--muted)' }}>
            <Store size={48} style={{ marginBottom: '1rem', opacity: 0.4 }} />
            <p>¡Pronto tendremos beneficios de socios!</p>
          </div>
        ) : (
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem',
          }}>
            {perks.map((perk, index) => {
              const accentColor = getCategoryColor(perk.category);
              return (
                <motion.div
                  key={perk.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index + 0.4, duration: 0.5 }}
                  className="glass-dark"
                  style={{
                    borderRadius: '20px', overflow: 'hidden',
                    display: 'flex', flexDirection: 'column',
                    cursor: 'default',
                  }}
                  whileHover={{ y: -4 }}
                >
                  {/* Card Header */}
                  <div style={{
                    padding: '1.5rem 1.5rem 0',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {perk.image_url ? (
                        <div style={{
                          width: '48px', height: '48px', borderRadius: '14px',
                          overflow: 'hidden', flexShrink: 0,
                          border: `1px solid ${accentColor}30`,
                        }}>
                          <Image
                            src={perk.image_url} alt={perk.partner_name}
                            width={48} height={48}
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                          />
                        </div>
                      ) : (
                        <div style={{
                          width: '48px', height: '48px', borderRadius: '14px',
                          background: `${accentColor}15`, border: `1px solid ${accentColor}30`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: accentColor, flexShrink: 0,
                        }}>
                          <Store size={22} />
                        </div>
                      )}
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, lineHeight: 1.2 }}>
                          {perk.partner_name}
                        </h3>
                        <span style={{
                          fontSize: '0.7rem', color: 'var(--muted)', fontWeight: 700,
                          textTransform: 'uppercase', letterSpacing: '0.05em',
                        }}>
                          {perk.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: '1.25rem 1.5rem', flex: 1 }}>
                    <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.5, margin: 0 }}>
                      {perk.description}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div style={{
                    padding: '1rem 1.5rem',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      color: 'var(--muted)', fontSize: '0.72rem', fontWeight: 600,
                    }}>
                      <Clock size={12} />
                      {perk.conditions}
                    </div>

                    <div style={{
                      background: `${accentColor}18`, border: `1px solid ${accentColor}35`,
                      padding: '6px 14px', borderRadius: '100px',
                      fontSize: '0.8rem', fontWeight: 900, color: accentColor,
                      whiteSpace: 'nowrap', fontFamily: 'var(--font-heading)', letterSpacing: '0.02em',
                    }}>
                      {perk.discount}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <section style={{
        padding: '3rem 2rem 4rem', textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.04)', position: 'relative', zIndex: 1
      }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            ¿Quieres ser socio? Contáctanos para ofrecer ofertas exclusivas a nuestros miembros.
          </p>
          <p style={{
            color: 'var(--muted)', fontSize: '0.7rem', opacity: 0.5,
            textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700
          }}>
            © 2024 SAVAGE STRENGTH. TODOS LOS DERECHOS RESERVADOS.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
