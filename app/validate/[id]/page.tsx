'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Member } from '@/types';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, AlertTriangle, User, History } from 'lucide-react';
import Link from 'next/link';

export default function ValidatePass() {
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
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          style={{ width: '60px', height: '60px', border: '6px solid var(--accent)', borderTopColor: 'transparent', borderRadius: '50%' }}
        />
      </div>
    );
  }

  if (!member) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
        <AlertTriangle size={80} color="var(--error)" style={{ marginBottom: '1.5rem' }} />
        <h1 className="heading" style={{ fontSize: '2.5rem' }}>Pass Invalid</h1>
        <p style={{ color: 'var(--muted)', marginTop: '0.5rem', maxWidth: '300px' }}>This QR code does not match any registered member in our system.</p>
        <Link href="/admin" className="btn-secondary" style={{ marginTop: '2rem' }}>Go to Dashboard</Link>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: member.is_active ? 'rgba(0, 255, 148, 0.05)' : 'rgba(255, 0, 92, 0.05)', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center'
    }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="glass-dark"
        style={{ 
          width: '100%', 
          maxWidth: '450px', 
          padding: '3rem 2rem', 
          borderRadius: '32px',
          border: `2px solid ${member.is_active ? 'var(--success)' : 'var(--error)'}`,
          boxShadow: `0 0 60px ${member.is_active ? 'rgba(0, 255, 148, 0.1)' : 'rgba(255, 0, 92, 0.1)'}`
        }}
      >
        <div style={{ marginBottom: '2rem' }}>
          {member.is_active ? (
            <motion.div
              initial={{ rotate: -20, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <CheckCircle size={100} color="var(--success)" style={{ filter: 'drop-shadow(0 0 20px rgba(0, 255, 148, 0.4))' }} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ x: -10 }}
              animate={{ x: [0, -10, 10, -10, 10, 0] }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <XCircle size={100} color="var(--error)" style={{ filter: 'drop-shadow(0 0 20px rgba(255, 0, 92, 0.4))' }} />
            </motion.div>
          )}
        </div>

        <h1 className="heading" style={{ 
          fontSize: '3rem', 
          margin: '0 0 1rem 0',
          color: member.is_active ? 'var(--success)' : 'var(--error)',
          letterSpacing: '0.05em'
        }}>
          {member.is_active ? 'VALID' : 'INVALID'}
        </h1>

        <div style={{ 
          background: 'rgba(255,255,255,0.03)', 
          padding: '2rem', 
          borderRadius: '24px',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '50%', 
            background: 'var(--card-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '0.5rem'
          }}>
            <User size={40} color="var(--muted)" />
          </div>
          
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0, textTransform: 'uppercase' }}>{member.member_name}</h2>
            <p style={{ color: 'var(--muted)', fontWeight: 600, marginTop: '0.25rem' }}>ID: {member.member_id}</p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 800 }}>Joined In</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>{new Date(member.date_joined).getFullYear()}</span>
          </div>
          <div style={{ width: '1px', background: 'var(--card-border)' }} />
          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--muted)', textTransform: 'uppercase', fontWeight: 800 }}>Type</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>PREMIUM</span>
          </div>
        </div>

        {!member.is_active && (
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            background: 'rgba(255, 0, 92, 0.1)', 
            borderRadius: '12px',
            color: 'var(--error)',
            fontSize: '0.9rem',
            fontWeight: 700,
            textTransform: 'uppercase'
          }}>
            Access Denied. Check Payment Status.
          </div>
        )}
      </motion.div>

      <Link 
        href="/admin" 
        style={{ 
          marginTop: '2rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          color: 'var(--muted)',
          fontWeight: 600,
          textTransform: 'uppercase',
          fontSize: '0.8rem',
          letterSpacing: '0.1em'
        }}
      >
        <History size={16} />
        Return to Admin
      </Link>
    </div>
  );
}
