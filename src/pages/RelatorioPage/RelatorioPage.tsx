// src/pages/RelatorioPage/RelatorioPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './RelatorioPage.css'; 

import { FiAlertTriangle } from 'react-icons/fi';
import { FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, FaSpinner } from 'react-icons/fa';

// Importando os serviços para buscar dados reais
import { pacienteService, type Paciente } from '../../services/pacienteService';
import { testeService, type TesteAplicado } from '../../services/testeService';

function RelatorioPage(): JSX.Element {
  const { id } = useParams(); // Pega o ID da URL
  
  // Estados de Dados
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [testes, setTestes] = useState<TesteAplicado[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado do texto do laudo (inicia vazio e é preenchido pela IA/Lógica)
  const [laudoText, setLaudoText] = useState('');

  // 1. Busca os dados reais ao carregar a página
  useEffect(() => {
    if (id) {
      loadData(Number(id));
    }
  }, [id]);

  const loadData = async (pacienteId: number) => {
    try {
      setLoading(true);
      const pacienteData = await pacienteService.getById(pacienteId);
      setPaciente(pacienteData);

      const todosTestes = await testeService.getAll();
      // Filtra apenas os testes desse paciente
      const testesDoPaciente = todosTestes.filter(t => Number(t.PacienteID) === pacienteId);
      setTestes(testesDoPaciente);
    } catch (error) {
      console.error("Erro ao carregar dados", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. Gera o texto do laudo AUTOMATICAMENTE quando os dados chegam
  useEffect(() => {
    if (paciente) {
      const idade = calcularIdade(paciente.DataNascimento);
      
      const resumoTestes = testes.length > 0 
        ? testes.map(t => `${t.TipoTeste} (${t.Resultado || 'Sem resultado'})`).join(', ')
        : 'nenhum teste registrado recentemente';

      // Template String com dados reais
      const textoGerado = `O paciente ${paciente.NomeCompleto}, ${idade} anos, foi submetido a uma avaliação clínica.\n\nCom base nos exames aplicados: ${resumoTestes}.\n\nFoi identificado a necessidade de investigação aprofundada e manejo imediato. Recomenda-se avaliação clínica completa para confirmação diagnóstica e elaboração de plano terapêutico individualizado.`;

      setLaudoText(textoGerado);
    }
  }, [paciente, testes]);

  // Função auxiliar para idade
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
          
          {/* Lógica Dinâmica: Substitui os cards fixos pelos dados do banco */}
          {testes.length === 0 ? (
             <div className="sp-card" style={{gridColumn: 'span 3'}}>
               <p style={{margin:0, color: '#666'}}>Nenhum teste encontrado.</p>
             </div>
          ) : (
            testes.map(t => (
              <div className="sp-card" key={t.TesteID}>
                <h1 style={{fontSize: '.8rem', opacity: 0.50, textTransform: 'uppercase'}}> 
                  {t.TipoTeste.length > 20 ? t.TipoTeste.substring(0, 18) + '...' : t.TipoTeste} 
                </h1>
                <p style={{marginLeft: '10px'}}>{t.Resultado || 'Pendente'}</p>
              </div>
            ))
          )}

          {/* Card estático mantido como exemplo de alerta */}
          <div className="sp-card card-identified">
            <h1 style={{fontSize: '.8rem', opacity: 0.50}}> Alertas do Sistema </h1>
             <p style={{marginLeft: '10px'}}>Revisar histórico</p>
          </div>
        </div>
      </section>

      <section className="data-section">
        <div className="data-visualization sp-card">
          <h3>Visualização de Dados</h3>
          <div className="chart-placeholder">
            <img 
              src="https://i.postimg.cc/rsFdDWL1/Gemini-Generated-Image-j3z4pij3z4pij3z4-1.png" 
              alt="Patient Vital Sign Trends Chart" 
            />
          </div>
        </div>

        <div className="draft-laudo sp-card">
          <h3>Rascunho do Laudo (Gerado Automaticamente)</h3>
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
              placeholder="Aguardando dados..."
            />
          </div>
        </div>
      </section>
    </>
  );
}

export default RelatorioPage;