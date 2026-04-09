'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Perk } from '@/types';
import { ArrowLeft, Save, Store, Percent, AlertCircle, Upload, X, Trash2 } from 'lucide-react';

export default function EditPerk() {
  const router = useRouter();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    partner_name: '',
    category: '',
    discount: '',
    description: '',
    conditions: '',
    image_url: null as string | null,
  });

  useEffect(() => {
    if (id) fetchPerk();
  }, [id]);

  async function fetchPerk() {
    setLoading(true);
    const { data, error } = await supabase
      .from('perks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching perk:', error);
      alert('Beneficio no encontrado.');
      router.push('/admin/perks');
    } else {
      setFormData({
        partner_name: data.partner_name,
        category: data.category,
        discount: data.discount,
        description: data.description,
        conditions: data.conditions,
        image_url: data.image_url,
      });
      if (data.image_url) setImagePreview(data.image_url);
    }
    setLoading(false);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    setUploading(true);

    const fileExt = file.name.split('.').pop();
    const fileName = `perk-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('perk-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (error) {
      console.error('Upload error:', error);
      alert('Carga de imagen fallida.');
      setImagePreview(formData.image_url);
    } else {
      const { data: urlData } = supabase.storage.from('perk-images').getPublicUrl(data.path);
      setFormData({ ...formData, image_url: urlData.publicUrl });
    }

    setUploading(false);
  }

  function removeImage() {
    setImagePreview(null);
    setFormData({ ...formData, image_url: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('perks')
      .update(formData)
      .eq('id', id);

    if (error) {
      console.error('Error updating perk:', error.message);
      alert(`Error al actualizar el beneficio: ${error.message}`);
    } else {
      router.push('/admin/perks');
      router.refresh();
    }
    setSaving(false);
  }

  async function deletePerk() {
    if (!confirm('¿Eliminar este beneficio? Esta acción no se puede deshacer.')) return;
    setSaving(true);

    const { error } = await supabase.from('perks').delete().eq('id', id);
    if (error) {
      alert('Error al eliminar el beneficio.');
    } else {
      router.push('/admin/perks');
      router.refresh();
    }
    setSaving(false);
  }

  const categoryOptions = ['Restaurante', 'Suplementos', 'Comida Saludable', 'Ropa Deportiva', 'Bienestar', 'Cuidado Personal', 'Entretenimiento', 'Otro'];

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>Cargando...</div>;

  return (
    <div className="admin-container" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/admin/perks" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', marginBottom: '1rem' }}>
          <ArrowLeft size={16} />
          Volver a Beneficios
        </Link>
        <h1 className="heading" style={{ fontSize: '2rem' }}>Editar Beneficio</h1>
      </header>

      <form onSubmit={handleSubmit} className="glass-dark" style={{ padding: '2rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Image Upload */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Imagen del Socio</label>
          {imagePreview ? (
            <div style={{ position: 'relative', width: '100%', height: '160px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
              <Image src={imagePreview} alt="Preview" fill style={{ objectFit: 'cover' }} />
              <button
                type="button"
                onClick={removeImage}
                style={{
                  position: 'absolute', top: '8px', right: '8px',
                  background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%',
                  width: '32px', height: '32px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', color: '#fff',
                }}
              >
                <X size={16} />
              </button>
              {uploading && (
                <div style={{
                  position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--accent)', fontWeight: 700, fontSize: '0.9rem',
                }}>
                  Subiendo...
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '100%', height: '120px', borderRadius: '12px',
                border: '2px dashed var(--card-border)', background: 'rgba(255,255,255,0.02)',
                color: 'var(--muted)', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '8px',
                cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
              }}
            >
              <Upload size={24} />
              Haz clic para subir una imagen
            </button>
          )}
          <input
            ref={fileInputRef} type="file" accept="image/*"
            style={{ display: 'none' }} onChange={handleImageUpload}
          />
        </div>

        {/* Partner Name */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Nombre del Socio</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Store size={18} style={{ position: 'absolute', left: '12px', color: 'var(--muted)' }} />
            <input required type="text" placeholder="ej. Iron Grill Steakhouse" className="input-field" style={{ paddingLeft: '40px' }}
              value={formData.partner_name}
              onChange={(e) => setFormData({ ...formData, partner_name: e.target.value })}
            />
          </div>
        </div>

        {/* Category */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Categoría</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {categoryOptions.map((cat) => (
              <button key={cat} type="button"
                onClick={() => setFormData({ ...formData, category: cat })}
                style={{
                  padding: '8px 16px', borderRadius: '100px', border: '1px solid',
                  borderColor: formData.category === cat ? 'var(--accent)' : 'var(--card-border)',
                  background: formData.category === cat ? 'rgba(233, 255, 0, 0.1)' : 'transparent',
                  color: formData.category === cat ? 'var(--accent)' : 'var(--muted)',
                  fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <input type="text" placeholder="O escribe una categoría personalizada..." className="input-field" style={{ marginTop: '0.5rem' }}
            value={categoryOptions.includes(formData.category) ? '' : formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
        </div>

        {/* Discount */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Descuento</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Percent size={18} style={{ position: 'absolute', left: '12px', color: 'var(--muted)' }} />
            <input required type="text" placeholder="ej. 15% DE DESCUENTO" className="input-field" style={{ paddingLeft: '40px' }}
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
            />
          </div>
        </div>

        {/* Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Descripción</label>
          <textarea required placeholder="Describe qué se incluye..." className="input-field" style={{ minHeight: '80px', resize: 'vertical' }}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Conditions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Condiciones</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <AlertCircle size={18} style={{ position: 'absolute', left: '12px', color: 'var(--muted)' }} />
            <input required type="text" placeholder="ej. Solo consumo en el lugar." className="input-field" style={{ paddingLeft: '40px' }}
              value={formData.conditions}
              onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" className="btn-primary" disabled={saving || uploading || !formData.category} style={{ flex: 1, height: '50px' }}>
            <Save size={20} />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
          <button type="button" onClick={deletePerk} disabled={saving} className="btn-secondary"
            style={{ height: '50px', borderColor: 'var(--error)', color: 'var(--error)' }}>
            <Trash2 size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
