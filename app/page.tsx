'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Search, Hash, Mail, ShieldCheck, QrCode, Zap, AlertCircle, Tag } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [memberId, setMemberId] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error: queryError } = await supabase
      .from('members')
      .select('id')
      .eq('member_id', memberId)
      .eq('member_email', email)
      .single();

    if (queryError || !data) {
      setError('No membership found. Please check your Member ID and email address.');
    } else {
      router.push(`/pass/${data.id}`);
    }
    setLoading(false);
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--background)',
      color: 'var(--foreground)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '700px',
        height: '700px',
        background: 'var(--accent)',
        filter: 'blur(250px)',
        opacity: 0.07,
        zIndex: 0
      }} />

      {/* Navigation */}
      <nav style={{
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%'
      }}>
        <Image src="/logo.png" alt="Savage Strength" width={160} height={45} style={{ objectFit: 'contain', clipPath: 'inset(0 2px 2px 0)' }} priority />
        <Link
          href="/perks"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: 'var(--accent)',
            fontSize: '0.85rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid rgba(233, 255, 0, 0.2)',
            background: 'rgba(233, 255, 0, 0.06)',
          }}
        >
          <Tag size={14} />
          Perks
        </Link>
      </nav>

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        zIndex: 1
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{
            width: '100%',
            maxWidth: '480px',
            textAlign: 'center'
          }}
        >
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.04)',
            padding: '8px 16px',
            borderRadius: '100px',
            marginBottom: '2rem',
            border: '1px solid rgba(255,255,255,0.08)',
            fontSize: '0.7rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'var(--accent)'
          }}>
            <ShieldCheck size={14} />
            Digital Membership System
          </div>

          <h1 className="heading" style={{
            fontSize: 'clamp(2.5rem, 8vw, 4rem)',
            lineHeight: 0.95,
            marginBottom: '1rem'
          }}>
            Access Your <span style={{ color: 'var(--accent)' }}>Pass</span>
          </h1>

          <p style={{
            color: 'var(--muted)',
            fontSize: '1rem',
            marginBottom: '3rem',
            lineHeight: 1.6
          }}>
            Enter your Member ID and email to view your digital membership card.
          </p>

          {/* Lookup Form */}
          <form
            onSubmit={handleLookup}
            className="glass-dark"
            style={{
              padding: '2rem',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              textAlign: 'left'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{
                color: 'var(--muted)',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Member ID
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Hash size={18} style={{ position: 'absolute', left: '14px', color: 'var(--muted)' }} />
                <input
                  required
                  type="text"
                  placeholder="e.g. SS-2024-001"
                  className="input-field"
                  style={{ paddingLeft: '44px', height: '50px' }}
                  value={memberId}
                  onChange={(e) => { setMemberId(e.target.value); setError(''); }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{
                color: 'var(--muted)',
                fontSize: '0.75rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Email Address
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail size={18} style={{ position: 'absolute', left: '14px', color: 'var(--muted)' }} />
                <input
                  required
                  type="email"
                  placeholder="e.g. john@example.com"
                  className="input-field"
                  style={{ paddingLeft: '44px', height: '50px' }}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  background: 'rgba(255, 0, 92, 0.1)',
                  border: '1px solid rgba(255, 0, 92, 0.2)',
                  borderRadius: '10px',
                  color: 'var(--error)',
                  fontSize: '0.8rem',
                  fontWeight: 600
                }}
              >
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: '100%', height: '54px', fontSize: '1rem', marginTop: '0.5rem', borderRadius: '10px' }}
            >
              <Search size={20} />
              {loading ? 'Looking Up...' : 'Find My Pass'}
            </button>
          </form>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.75rem',
            marginTop: '3rem',
            maxWidth: '480px'
          }}
        >
          {[
            { icon: <QrCode size={14} />, label: 'QR Verification' },
            { icon: <ShieldCheck size={14} />, label: 'Secure Access' },
            { icon: <Zap size={14} />, label: 'Instant Lookup' }
          ].map((item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '100px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                color: 'var(--muted)',
                fontSize: '0.75rem',
                fontWeight: 600
              }}
            >
              {item.icon}
              {item.label}
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--muted)',
        fontSize: '0.75rem',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        opacity: 0.5
      }}>
        <p>© 2024 SAVAGE STRENGTH. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  );
}
