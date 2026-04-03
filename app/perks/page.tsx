'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Tag, Utensils, Dumbbell, ShoppingBag, Heart, Coffee, Scissors } from 'lucide-react';

interface Perk {
  id: number;
  partner: string;
  category: string;
  discount: string;
  description: string;
  conditions: string;
  icon: React.ReactNode;
  accentColor: string;
}

const perks: Perk[] = [
  {
    id: 1,
    partner: 'Iron Grill Steakhouse',
    category: 'Restaurant',
    discount: '15% OFF',
    description: 'All menu items including drinks. Perfect post-workout fuel.',
    conditions: 'Dine-in only. Show your active Savage Pass.',
    icon: <Utensils size={22} />,
    accentColor: '#FF6B35',
  },
  {
    id: 2,
    partner: 'Fuel Nutrition Co.',
    category: 'Supplements',
    discount: '20% OFF',
    description: 'Protein, pre-workouts, vitamins, and all supplement purchases.',
    conditions: 'In-store and online with member code.',
    icon: <Dumbbell size={22} />,
    accentColor: '#00D4AA',
  },
  {
    id: 3,
    partner: 'The Green Bowl',
    category: 'Healthy Food',
    discount: '10% OFF',
    description: 'Fresh bowls, smoothies, and meal prep packages.',
    conditions: 'Valid at all locations. Not combinable with other offers.',
    icon: <Coffee size={22} />,
    accentColor: '#7ED957',
  },
  {
    id: 4,
    partner: 'Beast Mode Apparel',
    category: 'Sportswear',
    discount: '25% OFF',
    description: 'Training gear, shoes, and accessories for peak performance.',
    conditions: 'Online store only. Use code at checkout.',
    icon: <ShoppingBag size={22} />,
    accentColor: '#E9FF00',
  },
  {
    id: 5,
    partner: 'Recovery Lab',
    category: 'Wellness',
    discount: '30% OFF',
    description: 'Cryotherapy, sports massage, and recovery sessions.',
    conditions: 'First visit free. Subsequent visits at discounted rate.',
    icon: <Heart size={22} />,
    accentColor: '#FF4D8D',
  },
  {
    id: 6,
    partner: 'Sharp Cuts Barbershop',
    category: 'Grooming',
    discount: '15% OFF',
    description: 'Haircuts, beard trims, and grooming packages.',
    conditions: 'Walk-ins welcome. Show your Savage Pass.',
    icon: <Scissors size={22} />,
    accentColor: '#8B5CF6',
  },
];

const categories = ['All', ...Array.from(new Set(perks.map(p => p.category)))];

export default function PerksPage() {
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
        position: 'absolute',
        top: '-5%',
        right: '-10%',
        width: '500px',
        height: '500px',
        background: 'var(--accent)',
        filter: 'blur(200px)',
        opacity: 0.05,
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '-10%',
        width: '400px',
        height: '400px',
        background: '#FF4D8D',
        filter: 'blur(200px)',
        opacity: 0.04,
        zIndex: 0
      }} />

      {/* Navigation */}
      <nav style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
        position: 'relative',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        <Image src="/logo.png" alt="Savage Strength" width={160} height={45} style={{ objectFit: 'contain', clipPath: 'inset(0 2px 2px 0)' }} />
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--muted)',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} />
          Back
        </Link>
      </nav>

      {/* Hero Header */}
      <header style={{
        padding: '3rem 2rem 2rem',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(233, 255, 0, 0.08)',
            padding: '8px 16px',
            borderRadius: '100px',
            marginBottom: '1.5rem',
            border: '1px solid rgba(233, 255, 0, 0.15)',
            fontSize: '0.7rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--accent)'
          }}>
            <Tag size={14} />
            Exclusive Member Perks
          </div>

          <h1 className="heading" style={{
            fontSize: 'clamp(2.5rem, 7vw, 4rem)',
            lineHeight: 0.95,
            marginBottom: '1rem'
          }}>
            Your Pass. <span style={{ color: 'var(--accent)' }}>More Rewards.</span>
          </h1>

          <p style={{
            color: 'var(--muted)',
            fontSize: '1.05rem',
            lineHeight: 1.6,
            maxWidth: '550px',
            margin: '0 auto'
          }}>
            Show your active Savage Strength Pass at any of our partner locations to unlock exclusive discounts and perks.
          </p>
        </motion.div>
      </header>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        style={{
          maxWidth: '800px',
          margin: '0 auto 3rem',
          padding: '0 2rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap'
        }}
      >
        {[
          { value: `${perks.length}`, label: 'Partners' },
          { value: 'Up to 30%', label: 'Savings' },
          { value: 'Always', label: 'Available' },
        ].map((stat, i) => (
          <div key={i} style={{
            textAlign: 'center',
            padding: '1rem 1.5rem',
          }}>
            <span style={{
              display: 'block',
              fontSize: '1.5rem',
              fontWeight: 900,
              color: 'var(--accent)',
              fontFamily: 'var(--font-heading)',
            }}>
              {stat.value}
            </span>
            <span style={{
              fontSize: '0.7rem',
              color: 'var(--muted)',
              textTransform: 'uppercase',
              fontWeight: 700,
              letterSpacing: '0.08em'
            }}>
              {stat.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Perks Grid */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem 4rem',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.25rem',
        }}>
          {perks.map((perk, index) => (
            <motion.div
              key={perk.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 0.4, duration: 0.5 }}
              className="glass-dark"
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, border-color 0.2s',
                cursor: 'default',
              }}
              whileHover={{ y: -4 }}
            >
              {/* Card Header */}
              <div style={{
                padding: '1.5rem 1.5rem 0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: `${perk.accentColor}15`,
                    border: `1px solid ${perk.accentColor}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: perk.accentColor,
                    flexShrink: 0,
                  }}>
                    {perk.icon}
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      margin: 0,
                      lineHeight: 1.2,
                    }}>
                      {perk.partner}
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
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.25rem 1.5rem', flex: 1 }}>
                <p style={{
                  color: 'var(--muted)',
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                  margin: 0,
                }}>
                  {perk.description}
                </p>
              </div>

              {/* Card Footer */}
              <div style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--muted)',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                }}>
                  <Clock size={12} />
                  {perk.conditions}
                </div>

                <div style={{
                  background: `${perk.accentColor}18`,
                  border: `1px solid ${perk.accentColor}35`,
                  padding: '6px 14px',
                  borderRadius: '100px',
                  fontSize: '0.8rem',
                  fontWeight: 900,
                  color: perk.accentColor,
                  whiteSpace: 'nowrap',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '0.02em',
                }}>
                  {perk.discount}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* CTA Section */}
      <section style={{
        padding: '3rem 2rem 4rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        position: 'relative',
        zIndex: 1
      }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Want to become a partner? Contact us to offer exclusive deals to our members.
          </p>
          <p style={{
            color: 'var(--muted)',
            fontSize: '0.7rem',
            opacity: 0.5,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontWeight: 700
          }}>
            © 2024 SAVAGE STRENGTH. ALL RIGHTS RESERVED.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
