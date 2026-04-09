'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Member } from '@/types';
import { ArrowLeft, Save, User, Hash, ToggleLeft, ToggleRight, Trash2, Calendar } from 'lucide-react';

export default function EditMember() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<Member>>({
    member_name: '',
    member_email: '',
    member_phone: '',
    member_id: '',
    is_active: true,
  });

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
      alert('Miembro no encontrado.');
      router.push('/admin');
    } else {
      setFormData(data);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('members')
      .update({
        member_name: formData.member_name,
        member_email: formData.member_email,
        member_phone: formData.member_phone,
        member_id: formData.member_id,
        date_joined: formData.date_joined,
        is_active: formData.is_active,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating member:', error);
      alert('Error al actualizar el miembro.');
    } else {
      router.push('/admin');
      router.refresh();
    }
    setSaving(false);
  }

  async function deleteMember() {
    if (!confirm('¿Estás seguro de que quieres eliminar a este miembro? Esta acción no se puede deshacer.')) return;
    
    setSaving(true);
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting member:', error);
      alert('Error al eliminar el miembro.');
    } else {
      router.push('/admin');
      router.refresh();
    }
    setSaving(false);
  }

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>Cargando...</div>;

  return (
    <div className="admin-container" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', marginBottom: '1rem' }}>
          <ArrowLeft size={16} />
          Volver al Panel
        </Link>
        <h1 className="heading" style={{ fontSize: '2rem' }}>Editar Miembro</h1>
      </header>

      <form onSubmit={handleSubmit} className="glass-dark" style={{ padding: '2rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Nombre Completo</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <User size={18} style={{ position: 'absolute', left: '12px', color: 'var(--muted)' }} />
            <input 
              required
              type="text" 
              placeholder="ej. Juan Pérez"
              className="input-field" 
              style={{ paddingLeft: '40px' }}
              value={formData.member_name}
              onChange={(e) => setFormData({ ...formData, member_name: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Correo Electrónico</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '12px', color: 'var(--muted)', fontWeight: 800 }}>@</span>
            <input 
              type="email" 
              placeholder="ej. juan@ejemplo.com"
              className="input-field" 
              style={{ paddingLeft: '40px' }}
              value={formData.member_email || ''}
              onChange={(e) => setFormData({ ...formData, member_email: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Número de Teléfono</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <span style={{ position: 'absolute', left: '12px', color: 'var(--muted)', fontWeight: 800 }}>#</span>
            <input 
              type="tel" 
              placeholder="ej. +52 55 1234 5678"
              className="input-field" 
              style={{ paddingLeft: '40px' }}
              value={formData.member_phone || ''}
              onChange={(e) => setFormData({ ...formData, member_phone: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>ID de Miembro del Gimnasio</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Hash size={18} style={{ position: 'absolute', left: '12px', color: 'var(--muted)' }} />
            <input 
              required
              type="text" 
              placeholder="ej. SS-2024-001"
              className="input-field" 
              style={{ paddingLeft: '40px' }}
              value={formData.member_id || ''}
              onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Fecha de Unión</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Calendar size={18} style={{ position: 'absolute', left: '12px', color: 'var(--muted)' }} />
            <input 
              required
              type="date" 
              className="input-field" 
              style={{ paddingLeft: '40px' }}
              value={formData.date_joined || ''}
              onChange={(e) => setFormData({ ...formData, date_joined: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>
          <div>
            <span style={{ fontWeight: 700, display: 'block' }}>Membresía Activa</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Activa o desactiva el pase.</span>
          </div>
          <button 
            type="button"
            onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: formData.is_active ? 'var(--accent)' : 'var(--muted)' }}
          >
            {formData.is_active ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={saving}
            style={{ flex: 1, height: '50px' }}
          >
            <Save size={20} />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button 
            type="button" 
            onClick={deleteMember}
            disabled={saving}
            className="btn-secondary"
            style={{ height: '50px', borderColor: 'var(--error)', color: 'var(--error)' }}
          >
            <Trash2 size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
