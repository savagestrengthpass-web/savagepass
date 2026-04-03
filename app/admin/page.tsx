'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Member } from '@/types';
import { Plus, Search, User, CheckCircle, XCircle, MoreVertical } from 'lucide-react';

export default function AdminDashboard() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    setLoading(true);
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching members:', error);
    } else {
      setMembers(data || []);
    }
    setLoading(false);
  }

  async function toggleStatus(id: string, currentStatus: boolean) {
    const { error } = await supabase
      .from('members')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      console.error('Error updating status:', error);
    } else {
      fetchMembers();
    }
  }

  const filteredMembers = members.filter(m => 
    m.member_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.member_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-container" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 className="heading" style={{ fontSize: '2rem', color: 'var(--accent)' }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--muted)' }}>Manage Savage Strength members and their passes.</p>
        </div>
        <Link href="/admin/new" className="btn-primary">
          <Plus size={20} />
          New Member
        </Link>
      </header>

      <div className="glass-dark" style={{ padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={20} style={{ position: 'absolute', left: '12px', color: 'var(--muted)' }} />
          <input 
            type="text" 
            placeholder="Search by name or ID..." 
            className="input-field"
            style={{ paddingLeft: '40px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-dark" style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--card-border)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '1rem' }}>Member</th>
              <th style={{ padding: '1rem' }}>ID</th>
              <th style={{ padding: '1rem' }}>Joined</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>Loading members...</td>
              </tr>
            ) : filteredMembers.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--muted)' }}>No members found.</td>
              </tr>
            ) : (
              filteredMembers.map((member) => (
                <tr key={member.id} style={{ borderBottom: '1px solid var(--card-border)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '50%', 
                        background: 'var(--card-border)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                      }}>
                        <User size={16} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700 }}>{member.member_name}</span>
                        {member.member_email && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{member.member_email}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--muted)' }}>{member.member_id}</td>
                  <td style={{ padding: '1rem', color: 'var(--muted)' }}>{new Date(member.date_joined).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <button 
                      onClick={() => toggleStatus(member.id, member.is_active)}
                      style={{ 
                        background: 'transparent', 
                        border: 'none', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: member.is_active ? 'var(--success)' : 'var(--error)',
                        fontWeight: 600
                      }}
                    >
                      {member.is_active ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      {member.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link href={`/pass/${member.id}`} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                        View Pass
                      </Link>
                      <Link href={`/admin/${member.id}/edit`} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
