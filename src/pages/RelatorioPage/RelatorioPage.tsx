import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './RelatorioPage.css'; 

import { FiAlertTriangle, FiSave } from 'react-icons/fi'; // Adicionei ícone de Save
import { FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, FaSpinner } from 'react-icons/fa';

// Serviços
import { pacienteService, type Paciente } from '../../services/pacienteService';
import { testeService, type TesteAplicado } from '../../services/testeService';

function RelatorioPage(): JSX.Element {
  const { id } = useParams();
  
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [testes, setTestes] = useState<TesteAplicado[]>([]);
  const [loading, setLoading] = useState(true);
  const [laudoText, setLaudoText] = useState('');
  
  // Estados de controle
  const [saving, setSaving] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  // 1. Carrega dados
  useEffect(() => {
    if (id) loadData(Number(id));
  }, [id]);

  const loadData = async (pacienteId: number) => {
    try {
      setLoading(true);
      
      const pacienteData = await pacienteService.getById(pacienteId);
      setPaciente(pacienteData);

      const todosTestes = await testeService.getAll();
      const testesDoPaciente = todosTestes.filter(t => Number(t.PacienteID) === pacienteId);
      setTestes(testesDoPaciente);

      try {
        const prontuario = await pacienteService.getProntuarioAtivo(pacienteId);
        if (prontuario && prontuario.ResumoFinal) {
          setLaudoText(prontuario.ResumoFinal);
          setHasDraft(true); 
        }
      } catch (err) {
        console.log("Sem rascunho salvo, gerando novo...");
      }

    } catch (error) {
      console.error("Erro ao carregar dados", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Lógica Inteligente de Geração de Texto
  useEffect(() => {
    if (paciente && !hasDraft) {
      const idade = calcularIdade(paciente.DataNascimento);
      
      if (testes.length === 0) {
        setLaudoText(
          `PACIENTE: ${paciente.NomeCompleto}\nIDADE: ${idade} anos\n\n` +
          `\nDados insuficientes para geração de laudo automatizado por IA. Recomenda-se a aplicação dos protocolos de avaliação padrão para posterior análise.`
        );
      } else {
        const listaFormatada = testes.map(t => {
          const dataCurta = t.DataHora ? new Date(t.DataHora).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : 'data n/d';
          return `${t.TipoTeste} em ${dataCurta} (${t.Resultado || 'Pendente'})`;
        });
        
        const formatador = new Intl.ListFormat('pt-BR', { style: 'long', type: 'conjunction' });
        const resumoTestes = formatador.format(listaFormatada);

        setLaudoText(
          `O paciente ${paciente.NomeCompleto}, ${idade} anos, foi submetido a uma avaliação clínica.\n\n` +
          `HISTÓRICO DE EXAMES:\nForam analisados os seguintes registros: ${resumoTestes}.\n\n` +
          `ANÁLISE E CONDUTA:\nCom base nos resultados apresentados, foi identificado a necessidade de investigação aprofundada. Recomenda-se avaliação clínica completa para confirmação diagnóstica e elaboração de plano terapêutico individualizado.`
        );
      }
    }
  }, [paciente, testes, hasDraft]);

  const handleSaveRascunho = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await pacienteService.saveLaudo(Number(id), laudoText);
      // Feedback visual simples ou Toast poderia ser usado aqui
      alert('Rascunho salvo com sucesso!'); 
      setHasDraft(true); 
    } catch (error) {
      alert('Erro ao salvar rascunho.');
    } finally {
      setSaving(false);
    }
  };

  const getAlertas = () => {
    if (testes.length === 0) return null;
    const criticos = testes.filter(t => {
      const res = t.Resultado?.toLowerCase() || '';
      return res.includes('grave') || res.includes('alto') || res.includes('crítico') || res.includes('severo');
    });
    return criticos;
  };

  const alertasCriticos = getAlertas();

  const calcularIdade = (dataNasc: string | null) => {
    if (!dataNasc) return 'Idade não informada';
    const hoje = new Date();
    const nasc = new Date(dataNasc);
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
    return idade;
  };

  if (loading) return <div className="p-5 text-center"><FaSpinner className="spinner-border" /> Carregando dados...</div>;
  if (!paciente) return <div className="p-5 text-center">Paciente não encontrado.</div>;

  return (
    <> 
      <header className="sp-header">
        <h1>Relatório de Avaliação</h1>
        <div className="sp-header-buttons">
          <button className="sp-btn sp-btn-secondary">Exportar PDF</button>
          {/* Voltei o Assinar Laudo para cá (Ação Final) */}
          <button className="sp-btn sp-btn-primary">Assinar Laudo</button>
        </div>
      </header>

      <div className="warning-box">
        <FiAlertTriangle size={24} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontWeight: 600 }}>
            Ferramenta de apoio. Não substitui avaliação clínica.
          </span>
          <span style={{ color: '#C99719D1', fontSize: '0.6rem', lineHeight: '1.2', marginLeft: '10px' }}>
            As informações geradas com base nos dados do banco devem ser validadas.
          </span>
        </div>
      </div>

      <section className="summary-section">
        <h2>Resumo dos Testes Aplicados</h2>
        <div className="summary-cards">
          
          {testes.length === 0 ? (
             <div className="sp-card" style={{gridColumn: 'span 2'}}>
               <p style={{margin:0, color: '#666', fontStyle: 'italic'}}>Nenhum teste registrado para este paciente.</p>
             </div>
          ) : (
            testes.map(t => (
              <div className="sp-card" key={t.TesteID}>
                <h1 style={{fontSize: '.8rem', opacity: 0.50, textTransform: 'uppercase'}}> 
                  {t.TipoTeste.length > 18 ? t.TipoTeste.substring(0, 16) + '...' : t.TipoTeste} 
                </h1>
                <p style={{marginLeft: '10px'}}>{t.Resultado || 'Pendente'}</p>
              </div>
            ))
          )}

          <div className={`sp-card ${alertasCriticos && alertasCriticos.length > 0 ? 'card-identified' : ''}`}>
            <h1 style={{fontSize: '.8rem', opacity: 0.50}}> Alertas do Sistema </h1>
             {testes.length === 0 ? (
                <p style={{marginLeft: '10px', color: '#999'}}>Aguardando dados</p>
             ) : alertasCriticos && alertasCriticos.length > 0 ? (
                <p style={{marginLeft: '10px', color: '#d93025'}}>
                  {alertasCriticos.length} Item(ns) de Atenção
                </p>
             ) : (
                <p style={{marginLeft: '10px', color: '#28a745'}}>Nenhum alerta crítico</p>
             )}
          </div>

        </div>
      </section>

      <section className="data-section">
        <div className="data-visualization sp-card">
          <h3>Visualização de Dados</h3>
          <div className="chart-placeholder">
             {testes.length === 0 ? (
                <div style={{height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc'}}>
                  Gráfico indisponível (Sem dados)
                </div>
             ) : (
                <img 
                  src="https://i.postimg.cc/rsFdDWL1/Gemini-Generated-Image-j3z4pij3z4pij3z4-1.png" 
                  alt="Patient Vital Sign Trends Chart" 
                />
             )}
          </div>
        </div>

        <div className="draft-laudo sp-card">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 style={{margin:0}}>Rascunho do Laudo {hasDraft ? '(Carregado)' : '(Auto)'}</h3>
            {/* Se quiser adicionar algum status aqui, pode por */}
          </div>

          <div className="editor-toolbar">
            <button><FaBold /></button>
            <button><FaItalic /></button>
            <button><FaUnderline /></button>
            <button><FaListUl /></button>
            <button><FaListOl /></button>
          </div>
          
          <div className="editor-container">
            <textarea
              className="laudo-textarea"
              value={laudoText}
              onChange={(e) => setLaudoText(e.target.value)}
              placeholder="Aguardando dados para gerar laudo..."
            />
          </div>

          {/* --- BOTÃO AGORA AQUI EMBAIXO --- */}
          <div style={{ marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '16px', textAlign: 'right' }}>
            <button 
                className="sp-btn sp-btn-primary"
                onClick={handleSaveRascunho}
                disabled={saving}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
                {saving ? (
                    <>Salvando...</> 
                ) : (
                    <> <FiSave /> Salvar Rascunho </>
                )}
            </button>
          </div>
          {/* ------------------------------- */}

        </div>
      </section>
    </>
  );
}

export default RelatorioPage;