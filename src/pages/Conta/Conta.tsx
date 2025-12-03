import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { MdAccountCircle } from 'react-icons/md';

type Medico = {
  MedicoID: number;
  NomeCompleto?: string;
  CRM?: string;
  Email?: string;
  Telefone?: string;
  Especialidade?: string;
};

export default function Conta() {
  const [medico, setMedico] = useState<Medico | null>(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('medico');
    let parsed: any = null;
    try { parsed = stored ? JSON.parse(stored) : null; } catch { parsed = null; }

    if (parsed && parsed.MedicoID) {
      fetchMedico(parsed.MedicoID);
    } else {
      setMedico(parsed);
    }
  }, []);

  async function fetchMedico(id: number) {
    setLoading(true);
    try {
      const { data } = await api.get(`/medicos/${id}`);
      setMedico(data);
      localStorage.setItem('medico', JSON.stringify(data));
    } catch (err) {
      console.error('Erro ao buscar medico', err);
      alert('Erro ao carregar dados da conta.');
    } finally {
      setLoading(false);
    }
  }

  function handleChange(field: keyof Medico, value: string) {
    setMedico(prev => prev ? { ...prev, [field]: value } : prev);
  }

  async function handleSave() {
    if (!medico) return;
    setLoading(true);
    try {
      const payload = {
        NomeCompleto: medico.NomeCompleto,
        Email: medico.Email,
        Telefone: medico.Telefone,
        Especialidade: medico.Especialidade,
      };
      await api.put(`/medicos/${medico.MedicoID}`, payload);
      // refresh and persist
      await fetchMedico(medico.MedicoID);
      setEditing(false);
      alert('Dados atualizados com sucesso');
    } catch (err) {
      console.error('Erro ao salvar medico', err);
      alert('Erro ao salvar alterações.');
    } finally {
      setLoading(false);
    }
  }

  if (loading && !medico) return <div style={{ padding: 20 }}>Carregando...</div>;

  const containerStyle: React.CSSProperties = { padding: 20 };
  const cardStyle: React.CSSProperties = { display: 'flex', gap: 24, alignItems: 'flex-start', background: '#fff', padding: 28, borderRadius: 12, boxShadow: '0 8px 20px rgba(0,0,0,0.06)', maxWidth: 1100 };
  const leftCol: React.CSSProperties = { width: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 };
  const avatarStyle: React.CSSProperties = { width: 140, height: 140, borderRadius: 70, background: '#f0f4f8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, color: '#4e79a7' };
  const rightCol: React.CSSProperties = { flex: 1 };
  const rowStyle: React.CSSProperties = { display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }
  const labelStyle: React.CSSProperties = { width: 200, fontWeight: 700, color: '#333' };
  const inputStyle: React.CSSProperties = { padding: '10px 12px', borderRadius: 8, border: '1px solid #e0e6ef', width: '100%', fontSize: 14 };
  const btnPrimary: React.CSSProperties = { padding: '9px 16px', background: '#4e79a7', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' };
  const btnSecondary: React.CSSProperties = { padding: '9px 14px', background: '#f0f4f8', color: '#333', border: 'none', borderRadius: 8, cursor: 'pointer' };
  const gridTwo: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 };

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: 12 }}>Minha Conta</h2>
      {!medico ? (
        <div>Nenhum dado da conta encontrado.</div>
      ) : (
        <div style={cardStyle}>
          <div style={leftCol}>
            <div style={avatarStyle} aria-hidden>
              {medico.NomeCompleto ? medico.NomeCompleto.split(' ').map(p => p[0]).slice(0,2).join('').toUpperCase() : <MdAccountCircle size={64} />}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontWeight: 700 }}>{medico.NomeCompleto}</div>
              <div style={{ color: '#777', fontSize: 13 }}>{medico.Especialidade || '—'}</div>
            </div>
          </div>

          <div style={rightCol}>
            <div style={gridTwo}>
              <div>
                <div style={{ marginBottom: 8, fontWeight: 700, color: '#333' }}>Nome</div>
                <div>{editing ? <input style={inputStyle} value={medico.NomeCompleto || ''} onChange={e => handleChange('NomeCompleto', e.target.value)} /> : medico.NomeCompleto}</div>
              </div>

              <div>
                <div style={{ marginBottom: 8, fontWeight: 700, color: '#333' }}>CRM</div>
                <div>{editing ? <input style={inputStyle} value={medico.CRM || ''} onChange={e => handleChange('CRM' as any, e.target.value)} /> : (medico.CRM || '—')}</div>
              </div>
            </div>

            <div style={rowStyle}>
              <div style={labelStyle}>Email</div>
              <div style={{ flex: 1 }}>{editing ? <input style={inputStyle} value={medico.Email || ''} onChange={e => handleChange('Email', e.target.value)} /> : medico.Email}</div>
            </div>

            <div style={rowStyle}>
              <div style={labelStyle}>Telefone</div>
              <div style={{ flex: 1 }}>{editing ? <input style={inputStyle} value={medico.Telefone || ''} onChange={e => handleChange('Telefone', e.target.value)} /> : medico.Telefone}</div>
            </div>

            <div style={rowStyle}>
              <div style={labelStyle}>Especialidade</div>
              <div style={{ flex: 1 }}>{editing ? <input style={inputStyle} value={medico.Especialidade || ''} onChange={e => handleChange('Especialidade', e.target.value)} /> : medico.Especialidade}</div>
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {!editing ? (
                <button onClick={() => setEditing(true)} style={btnPrimary}>Editar</button>
              ) : (
                <>
                  <button onClick={handleSave} disabled={loading} style={btnPrimary}>Salvar</button>
                  <button onClick={() => { setEditing(false); fetchMedico(medico.MedicoID); }} style={btnSecondary}>Cancelar</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
