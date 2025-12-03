import React, { useMemo, useState, useCallback } from 'react';
import Plot from 'react-plotly.js';

type Notif = {
  id: string;
  title: string;
  status: 'sent' | 'pending' | 'failed';
  source?: string;
  created: string;
  details?: string;
};

const CARD: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: 12,
  padding: 16,
  boxShadow: '0 6px 12px rgba(0,0,0,0.08)'
};

const KPI_CARD: React.CSSProperties = {
  backgroundColor: 'white',
  borderRadius: 12,
  padding: 12,
  boxShadow: '0 6px 12px rgba(0,0,0,0.08)',
  textAlign: 'center',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
};

function minutesAgoText(dt: Date) {
  const diff = new Date().getTime() - dt.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins <= 0) return 'agora';
  if (mins === 1) return '1 min atrás';
  return `${mins} min atrás`;
}

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export default function Dashboard() {
  const hoje = useMemo(() => new Date(), []);
  const inicioSemana = useMemo(() => {
    const d = new Date(hoje);
    const day = d.getDay();
    const isoWeekday = day === 0 ? 7 : day;
    d.setDate(d.getDate() - (isoWeekday - 1));
    return d;
  }, [hoje]);

  const diasSemanaFull = [
    'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'
  ];

  const pacientes = [
    'Ana Silva', 'Bruno Costa', 'Carla Dantas', 'Daniel Alves', 'Elena Freire', 'Fábio Gomes', 'Gisela Nunes', 'Helena Izidro', 'Ivan Reis'
  ];

  const tipos = ['Psicoterapia', 'Retorno', 'Clínica Geral'];

  const detalhes = useMemo(() => {
    const arr: any[] = [];
    const now = new Date();
    const maxDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const fixedTimesPerDay: string[][] = [
      ['09:00','11:00','14:00'],
      ['10:00','12:15','16:00'],
      ['11:15','11:45','13:00','15:30','16:30'],
      ['09:30','11:00','14:30','16:30'],
      ['10:00','13:30','15:00'],
      ['09:00','10:30','14:00'],
      []
    ];
    for (let i = 0; i < diasSemanaFull.length; i++) {
      const times = fixedTimesPerDay[i] || [];
      const d = new Date(inicioSemana);
      d.setDate(d.getDate() + i);
      for (let t = 0; t < times.length; t++) {
        const hora = times[t];
        const paciente_nome = pacientes[(i + t) % pacientes.length];
        const tipo = tipos[(i + t) % tipos.length];
        const [hh, mm] = hora.split(':').map(s => parseInt(s, 10));
        const dt = new Date(d.getFullYear(), d.getMonth(), d.getDate(), hh, mm);
        if (dt >= now && dt <= maxDate) {
          arr.push({ Dia: diasSemanaFull[i], Data: `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth()+1).toString().padStart(2, '0')}`, Horário: hora, Paciente: paciente_nome, Tipo: tipo, __datetime: dt.toISOString() });
        }
      }
    }
    arr.sort((a, b) => {
      const di = diasSemanaFull.indexOf(a.Dia) - diasSemanaFull.indexOf(b.Dia);
      if (di !== 0) return di;
      return a.Horário.localeCompare(b.Horário);
    });
    return arr;
  }, [inicioSemana]);

  const [notifs, setNotifs] = useState<Notif[]>(() => [
    makeNotification('Lembrete de Consulta para João S.', 'sent', 2, 'Enviado via WhatsApp'),
    makeNotification('Confirmação de Agendamento para Maria O.', 'sent', 15, 'Enviado via WhatsApp'),
    makeNotification('Falha ao Enviar Lembrete para Carlos P.', 'failed', 31, 'Número Inválido')
  ]);

  const [tab, setTab] = useState<'sent' | 'records'>('sent');

  
  const tiposContagem = useMemo(() => {
    const m = new Map<string, number>();
    detalhes.forEach(d => m.set(d.Tipo, (m.get(d.Tipo) || 0) + 1));
    const arr = Array.from(m.entries()).map(([k, v]) => ({ 'Tipo de Consulta': k, Quantidade: v }));
    return arr;
  }, [detalhes]);

  
  const _sortedTipos = tiposContagem.slice().sort((a, b) => b.Quantidade - a.Quantidade).map(t => t['Tipo de Consulta']);
  const topTwo = _sortedTipos.slice(0, 2);
  let maisFrequente = '-';
  if (topTwo.length === 0) maisFrequente = '-';
  else if (topTwo.length === 1) {
    maisFrequente = topTwo[0] === 'Psicoterapia' ? 'Psicoterapia' : topTwo[0];
  } else {
    maisFrequente = topTwo.join(' / ');
  }

  
  const diaMaisMovimentado = useMemo(() => {
    if (!detalhes || detalhes.length === 0) return '-';
    const counter = new Map<string, number>();
    detalhes.forEach(d => counter.set(d.Dia, (counter.get(d.Dia) || 0) + 1));
    const sorted = Array.from(counter.entries()).sort((a,b) => b[1] - a[1]);
    return sorted[0]?.[0] || '-';
  }, [detalhes]);

  
  const dfMensal = useMemo(() => ({ meses: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul'], pacientes: [22,30,45,50,47,60,75] }), []);

  const handleResend = useCallback((id: string) => {
    setNotifs(prev => prev.map(n => n.id === id ? ({ ...n, status: Math.random() > 0.33 ? 'sent' : 'failed', created: new Date().toISOString(), details: Math.random() > 0.33 ? 'Reenviado via WhatsApp' : 'Tentativa falhou' }) : n));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
        <div style={KPI_CARD as React.CSSProperties}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Consulta Mais Realizada</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginTop: 6, color: '#333' }}>{maisFrequente}</div>
        </div>
        <div style={KPI_CARD as React.CSSProperties}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Atendimentos na Semana</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginTop: 6, color: '#333' }}>{32}</div>
        </div>
        <div style={KPI_CARD as React.CSSProperties}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Dia Mais Movimentado</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginTop: 6, color: '#333' }}>{diaMaisMovimentado}</div>
        </div>
        <div style={KPI_CARD as React.CSSProperties}>
          <div style={{ fontSize: 20, fontWeight: 700 }}>Total Atendimentos</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginTop: 6, color: '#333' }}>35</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        <div style={{ ...CARD, flex: 3, minWidth: 360 }}>
          <h3>Agenda Semanal Detalhada</h3>
          <div style={{ height: 480, overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: '#e0f7fa', color: '#00796b', fontWeight: 700 }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: 8 }}>Data</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Dia</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Horário</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Paciente</th>
                  <th style={{ textAlign: 'left', padding: 8 }}>Tipo</th>
                </tr>
              </thead>
              <tbody>
                {detalhes.map((r, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: 8 }}>{r.Data}</td>
                    <td style={{ padding: 8 }}>{r.Dia}</td>
                    <td style={{ padding: 8 }}>{r.Horário}</td>
                    <td style={{ padding: 8 }}>{r.Paciente}</td>
                    <td style={{ padding: 8 }}>{r.Tipo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ ...CARD, flex: 1, minWidth: 260 }}>
          <h3>Atividade Recente</h3>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <button onClick={() => setTab('sent')} style={{ padding: '6px 10px', cursor: 'pointer' }} className={tab === 'sent' ? 'active' : ''}>Notificações Enviadas</button>
            <button onClick={() => setTab('records')} style={{ padding: '6px 10px', cursor: 'pointer' }} className={tab === 'records' ? 'active' : ''}>Prontuários Realizados</button>
          </div>
          <div style={{ marginTop: 12 }}>
            {tab === 'records' ? (
              <div>
                <div style={{ padding: '8px 0' }}>Prontuário atualizado: João S. - 10:20</div>
                <div style={{ padding: '8px 0' }}>Prontuário atualizado: Maria O. - 09:45</div>
              </div>
            ) : (
              notifs.slice(0, 10).map(n => {
                const created = new Date(n.created);
                const timeText = minutesAgoText(created);
                const color = n.status === 'sent' ? '#90caf9' : (n.status === 'pending' ? '#ffe082' : '#ff8a80');
                return (
                  <div key={n.id} style={{ display: 'flex', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                      <div style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: 'white' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{n.title}</div>
                      <div style={{ color: '#777', fontSize: 12, marginTop: 4 }}>{`${n.details || ''} • ${timeText}`}</div>
                    </div>
                    <div>
                      {n.status === 'failed' && <button onClick={() => handleResend(n.id)} style={{ marginLeft: 8 }}>Reenviar</button>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ ...CARD, flex: 1 }}>
          <h4>Pacientes Atendidos por Mês</h4>
          <Plot
                data={[{ x: dfMensal.meses, y: dfMensal.pacientes, type: 'scatter', mode: 'lines+markers', fill: 'tozeroy', line: { shape: 'spline', color: '#4e79a7' }, marker: { color: '#4e79a7' } }]}
                layout={{ margin: { l: 10, r: 10, t: 30, b: 30 }, height: 300, title: '', font: { color: '#333' }, xaxis: { tickfont: { size: 11 }, automargin: true }, yaxis: { tickfont: { size: 11 } }, plot_bgcolor: 'white', paper_bgcolor: 'white' }}
            style={{ width: '100%' }}
            config={{ displayModeBar: false }}
          />
        </div>
        <div style={{ ...CARD, flex: 1 }}>
          <h4>Contagem por Tipo de Atendimento</h4>
              <Plot
                data={[{ x: tiposContagem.map(d => d['Tipo de Consulta']), y: tiposContagem.map(d => d.Quantidade), type: 'bar', marker: { color: tiposContagem.map((_, i) => palette[i % palette.length]) }, text: tiposContagem.map(d => d.Quantidade), textposition: 'auto' }]}
                layout={{ margin: { l: 10, r: 10, t: 30, b: 60 }, height: 300, title: '', font: { color: '#333' }, xaxis: { tickfont: { size: 11 }, automargin: true }, yaxis: { tickfont: { size: 11 } }, plot_bgcolor: 'white', paper_bgcolor: 'white' }}
                style={{ width: '100%' }}
                config={{ displayModeBar: false }}
              />
        </div>
      </div>
    </div>
  );
}

 
 

function makeNotification(title: string, status: Notif['status'] = 'sent', minutesAgo = 2, details = ''): Notif {
  const created = new Date();
  created.setMinutes(created.getMinutes() - minutesAgo);
  return { id: uid(), title, status, created: created.toISOString(), details };
}

 
const palette = ['#4e79a7','#f28e2b','#e15759','#76b7b2','#59a14f','#edc948','#b07aa1','#ff9da7','#9c755f','#bab0ac'];

