'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Member } from '@/types';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Calendar, User, CreditCard, ChevronRight, Tag } from 'lucide-react';
import Link from 'next/link';

export default function DigitalPass() {
  const { id } = useParams();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchMember();
    }
  }, [id]);

  async function fetchMember() {
    setLoading(true);
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching member:', error);
    } else {
      setMember(data);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ width: '40px', height: '40px', border: '4px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }}
        />
      </div>
    );
  }

  if (!member) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        <ShieldAlert size={64} color="var(--error)" style={{ marginBottom: '1rem' }} />
        <h2 className="heading">Pass Not Found</h2>
        <p style={{ color: 'var(--muted)', marginTop: '0.5rem' }}>The requested membership card does not exist or has been removed.</p>
      </div>
    );
  }

  const validationUrl = `${window.location.origin}/validate/${member.id}`;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--background)', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decorative Elements */}
      <div style={{ 
        position: 'absolute', 
        top: '-10%', 
        right: '-10%', 
        width: '300px', 
        height: '300px', 
        background: 'var(--accent)', 
        filter: 'blur(150px)', 
        opacity: 0.1, 
        zIndex: 0 
      }} />
      <div style={{ 
        position: 'absolute', 
        bottom: '-10%', 
        left: '-10%', 
        width: '300px', 
        height: '300px', 
        background: 'var(--accent)', 
        filter: 'blur(150px)', 
        opacity: 0.05, 
        zIndex: 0 
      }} />

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-dark"
        style={{ 
          width: '100%', 
          maxWidth: '380px', 
          borderRadius: '24px', 
          overflow: 'hidden',
          zIndex: 1,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Pass Header */}
        <div style={{ 
          background: 'var(--accent)', 
          padding: '1.5rem', 
          color: 'var(--accent-foreground)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 900, fontFamily: 'var(--font-heading)', margin: 0, lineHeight: 1 }}>SAVAGE</h1>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.8 }}>Strength Pass</p>
          </div>
          <div style={{ 
            padding: '4px 12px', 
            borderRadius: '100px', 
            background: 'rgba(0,0,0,0.1)', 
            fontSize: '0.7rem', 
            fontWeight: 800,
            textTransform: 'uppercase'
          }}>
            Premium
          </div>
        </div>

        {/* Member Info */}
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <motion.h2 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, textTransform: 'uppercase' }}
            >
              {member.member_name}
            </motion.h2>
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Member ID: {member.member_id}</p>
          </div>

          {/* QR Code Container */}
          <div style={{ position: 'relative', padding: '1rem', background: '#FFF', borderRadius: '16px', boxShadow: '0 0 40px rgba(233, 255, 0, 0.2)' }}>
            <QRCodeSVG 
              value={validationUrl} 
              size={200} 
              level="H"
              imageSettings={{
                src: "/favicon.ico",
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                excavate: true,
              }}
            />
            {!member.is_active && (
              <div style={{ 
                position: 'absolute', 
                inset: 0, 
                background: 'rgba(0,0,0,0.8)', 
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--error)',
                backdropFilter: 'blur(4px)'
              }}>
                <ShieldAlert size={48} />
                <span style={{ fontWeight: 900, marginTop: '0.5rem', textTransform: 'uppercase' }}>Inactive</span>
              </div>
            )}
          </div>

          <div style={{ width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="glass" style={{ padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
              <Calendar size={16} style={{ color: 'var(--accent)', marginBottom: '0.5rem' }} />
              <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Joined Since</span>
              <span style={{ fontWeight: 700 }}>{new Date(member.date_joined).getFullYear()}</span>
            </div>
            <div className="glass" style={{ padding: '1rem', borderRadius: '12px', textAlign: 'center' }}>
              <ShieldCheck size={16} style={{ color: member.is_active ? 'var(--success)' : 'var(--error)', marginBottom: '0.5rem' }} />
              <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Status</span>
              <span style={{ fontWeight: 700, color: member.is_active ? 'var(--success)' : 'var(--error)' }}>
                {member.is_active ? 'ACTIVE' : 'INACTIVE'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CreditCard size={18} color="var(--muted)" />
              <span style={{ fontSize: '0.85rem' }}>Digital Membership</span>
            </div>
            <ChevronRight size={18} color="var(--muted)" />
          </div>
          <Link href="/perks" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            background: 'rgba(233, 255, 0, 0.06)',
            border: '1px solid rgba(233, 255, 0, 0.12)',
            borderRadius: '12px',
            transition: 'all 0.2s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tag size={18} color="var(--accent)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)' }}>View Perks & Discounts</span>
            </div>
            <ChevronRight size={18} color="var(--accent)" />
          </Link>
        </div>
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        style={{ marginTop: '2rem', color: 'var(--muted)', fontSize: '0.8rem', textAlign: 'center', maxWidth: '280px' }}
      >
        Please show this pass to the staff when entering the gym.
      </motion.p>
    </div>
  );
}
