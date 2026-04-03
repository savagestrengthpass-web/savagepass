'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, User, Hash, ToggleLeft, ToggleRight, Calendar } from 'lucide-react';

export default function NewMember() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    member_name: '',
    member_email: '',
    member_phone: '',
    member_id: '',
    date_joined: new Date().toISOString().split('T')[0],
    is_active: true,
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const qr_code_secret = `${formData.member_id}-${Math.random().toString(36).substring(2, 10)}`;

    const { error } = await supabase
      .from('members')
      .insert([
        {
          ...formData,
          qr_code_secret,
        },
      ]);

    if (error) {
      console.error('Error creating member:', error.message, error.code, error.details);
      alert(`Error creating member: ${error.message}`);
    } else {
      router.push('/admin');
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <div className="admin-container" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', marginBottom: '1rem' }}>
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
        <h1 className="heading" style={{ fontSize: '2rem' }}>Add New Member</h1>
      </header>

      <form onSubmit={handleSubmit} className="glass-dark" style={{ padding: '2rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Full Name</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <User size={18} style={{ position: 'absolute', left: '12px', color: 'var(--muted)' }} />
            <input 
              required
              type="text" 
              placeholder="e.g. John Doe"
              className="input-field" 
              style={{ paddingLeft: '40px' }}
              value={formData.member_name}
              onChange={(e) => setFormData({ ...formData, member_name: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Email Address</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '12px', color: 'var(--muted)', fontWeight: 800 }}>@</span>
            <input 
              type="email" 
              placeholder="e.g. john@example.com"
              className="input-field" 
              style={{ paddingLeft: '40px' }}
              value={formData.member_email}
              onChange={(e) => setFormData({ ...formData, member_email: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Phone Number</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '12px', color: 'var(--muted)', fontWeight: 800 }}>#</span>
            <input 
              type="tel" 
              placeholder="e.g. +1 234 567 890"
              className="input-field" 
              style={{ paddingLeft: '40px' }}
              value={formData.member_phone}
              onChange={(e) => setFormData({ ...formData, member_phone: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Gym Member ID</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Hash size={18} style={{ position: 'absolute', left: '12px', color: 'var(--muted)' }} />
            <input 
              required
              type="text" 
              placeholder="e.g. SS-2024-001"
              className="input-field" 
              style={{ paddingLeft: '40px' }}
              value={formData.member_id}
              onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Date Joined</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Calendar size={18} style={{ position: 'absolute', left: '12px', color: 'var(--muted)' }} />
            <input 
              required
              type="date" 
              className="input-field" 
              style={{ paddingLeft: '40px' }}
              value={formData.date_joined}
              onChange={(e) => setFormData({ ...formData, date_joined: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
          <div>
            <span style={{ fontWeight: 700, display: 'block' }}>Active Membership</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Toggle to enable or disable the pass.</span>
          </div>
          <button 
            type="button"
            onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: formData.is_active ? 'var(--accent)' : 'var(--muted)' }}
          >
            {formData.is_active ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
          </button>
        </div>

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={loading}
          style={{ marginTop: '1rem', width: '100%', height: '50px' }}
        >
          <Save size={20} />
          {loading ? 'Creating...' : 'Create Member'}
        </button>
      </form>
    </div>
  );
}
