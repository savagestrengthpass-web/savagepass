'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Save, Store, Tag, Percent, FileText, AlertCircle, Upload, X } from 'lucide-react';

export default function NewPerk() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    partner_name: '',
    category: '',
    discount: '',
    description: '',
    conditions: '',
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
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
      alert('Image upload failed. Make sure the "perk-images" storage bucket exists in Supabase.');
      setImagePreview(null);
    } else {
      const { data: urlData } = supabase.storage.from('perk-images').getPublicUrl(data.path);
      setImageUrl(urlData.publicUrl);
    }

    setUploading(false);
  }

  function removeImage() {
    setImagePreview(null);
    setImageUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('perks')
      .insert([{ ...formData, image_url: imageUrl }]);

    if (error) {
      console.error('Error creating perk:', error.message);
      alert(`Error creating perk: ${error.message}`);
    } else {
      router.push('/admin/perks');
      router.refresh();
    }
    setLoading(false);
  }

  const categoryOptions = ['Restaurant', 'Supplements', 'Healthy Food', 'Sportswear', 'Wellness', 'Grooming', 'Entertainment', 'Other'];

  return (
    <div className="admin-container" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/admin/perks" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', marginBottom: '1rem' }}>
          <ArrowLeft size={16} />
          Back to Perks
        </Link>
        <h1 className="heading" style={{ fontSize: '2rem' }}>Add New Perk</h1>
      </header>

      <form onSubmit={handleSubmit} className="glass-dark" style={{ padding: '2rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Image Upload */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Partner Image</label>
          {imagePreview ? (
            <div style={{ position: 'relative', width: '100%', height: '160px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--card-border)' }}>
              <Image src={imagePreview} alt="Preview" fill style={{ objectFit: 'cover' }} />
              <button
                type="button"
                onClick={removeImage}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'rgba(0,0,0,0.7)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                }}
              >
                <X size={16} />
              </button>
              {uploading && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                }}>
                  Uploading...
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '100%',
                height: '120px',
                borderRadius: '12px',
                border: '2px dashed var(--card-border)',
                background: 'rgba(255,255,255,0.02)',
                color: 'var(--muted)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
            >
              <Upload size={24} />
              Click to upload an image
              <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>PNG, JPG up to 5MB</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />
        </div>

        {/* Partner Name */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Partner Name</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Store size={18} style={{ position: 'absolute', left: '12px', color: 'var(--muted)' }} />
            <input
              required
              type="text"
              placeholder="e.g. Iron Grill Steakhouse"
              className="input-field"
              style={{ paddingLeft: '40px' }}
              value={formData.partner_name}
              onChange={(e) => setFormData({ ...formData, partner_name: e.target.value })}
            />
          </div>
        </div>

        {/* Category */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Category</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {categoryOptions.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFormData({ ...formData, category: cat })}
                style={{
                  padding: '8px 16px',
                  borderRadius: '100px',
                  border: '1px solid',
                  borderColor: formData.category === cat ? 'var(--accent)' : 'var(--card-border)',
                  background: formData.category === cat ? 'rgba(233, 255, 0, 0.1)' : 'transparent',
                  color: formData.category === cat ? 'var(--accent)' : 'var(--muted)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Or type a custom category..."
            className="input-field"
            style={{ marginTop: '0.5rem' }}
            value={categoryOptions.includes(formData.category) ? '' : formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          />
        </div>

        {/* Discount */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Discount</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Percent size={18} style={{ position: 'absolute', left: '12px', color: 'var(--muted)' }} />
            <input
              required
              type="text"
              placeholder="e.g. 15% OFF"
              className="input-field"
              style={{ paddingLeft: '40px' }}
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
            />
          </div>
        </div>

        {/* Description */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Description</label>
          <textarea
            required
            placeholder="Describe what's included in this perk..."
            className="input-field"
            style={{ minHeight: '80px', resize: 'vertical' }}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Conditions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label style={{ color: 'var(--muted)', fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase' }}>Conditions</label>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <AlertCircle size={18} style={{ position: 'absolute', left: '12px', color: 'var(--muted)' }} />
            <input
              required
              type="text"
              placeholder="e.g. Dine-in only. Show your active Savage Pass."
              className="input-field"
              style={{ paddingLeft: '40px' }}
              value={formData.conditions}
              onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
            />
          </div>
        </div>

        <button
          type="submit"
          className="btn-primary"
          disabled={loading || uploading || !formData.category}
          style={{ marginTop: '1rem', width: '100%', height: '50px' }}
        >
          <Save size={20} />
          {loading ? 'Creating...' : 'Create Perk'}
        </button>
      </form>
    </div>
  );
}
