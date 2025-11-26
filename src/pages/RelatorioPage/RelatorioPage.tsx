// src/components/RelatorioPage.tsx

import React from 'react';
import './RelatorioPage.css'; 

import { FiAlertTriangle } from 'react-icons/fi';
import { FaBold, FaItalic, FaUnderline, FaListUl, FaListOl } from 'react-icons/fa';

function RelatorioPage(): JSX.Element {
  return (
    <> 
      {/* --- Cabeçalho (sp-header) --- */}
      <header className="sp-header">
        <h1>Relatório de Avaliação</h1>
        <div className="sp-header-buttons">
          {/* Usando sp-btn para evitar conflito com Bootstrap .btn */}
          <button className="sp-btn sp-btn-secondary">Exportar PDF</button>
          <button className="sp-btn sp-btn-primary">Assinar Laudo</button>
        </div>
      </header>

      {/* --- Aviso --- */}
      <div className="warning-box">
        <FiAlertTriangle size={24} />
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontWeight: 600 }}>
            Ferramenta de apoio. Não substitui avaliação clínica.
          </span>
          <span style={{ color: '#C99719D1', fontSize: '0.6rem', lineHeight: '1.2', marginLeft: '10px' }}>
            As informações geradas por IA devem ser revisadas e validadas por um profissional qualificado.
          </span>
        </div>
      </div>

      {/* --- Resumo Executivo --- */}
      <section className="summary-section">
        <h2>Resumo Executivo (IA)</h2>
        <div className="summary-cards">
          {/* Cards renomeados para sp-card */}
          <div className="sp-card">
           <h1 style={{fontSize: '.8rem', opacity: 0.50}}> ASRS-18 </h1>
            <p style={{marginLeft: '10px'}}>Triagem Positiva</p>
          </div>
          <div className="sp-card">
            <h1 style={{fontSize: '.8rem', opacity: 0.50}}> PHQ-9 </h1>
             <p style={{marginLeft: '10px'}}>Sintomas Moderados</p>
          </div>
          <div className="sp-card card-identified">
            <h1 style={{fontSize: '.8rem', opacity: 0.50}}> Itens Críticos </h1>
             <p style={{marginLeft: '10px'}}>1 Identificado</p>
          </div>
        </div>
      </section>

      {/* --- Seção de Dados e Rascunho --- */}
      <section className="data-section">
        {/* --- Coluna da Esquerda: Gráfico --- */}
        <div className="data-visualization sp-card">
          <h3>Visualização de Dados</h3>
          <div className="chart-placeholder">
            <img 
              src="https://i.postimg.cc/rsFdDWL1/Gemini-Generated-Image-j3z4pij3z4pij3z4-1.png" 
              alt="Patient Vital Sign Trends Chart" 
            />
          </div>
        </div>

        {/* --- Coluna da Direita: Rascunho do Laudo --- */}
        <div className="draft-laudo sp-card">
          <h3>Rascunho do Laudo</h3>
          <div className="editor-toolbar">
            <button><FaBold /></button>
            <button><FaItalic /></button>
            <button><FaUnderline /></button>
            <button><FaListUl /></button>
            <button><FaListOl /></button>
          </div>
          <div className="editor-content">
            <p>
              O paciente Carlos Silva, 42 anos, apresenta pontuação sugestiva de
              TDAH no questionário ASRS-18, com destaque para escores elevados
              na subescala de desatenção. A avaliação PHQ-9 indica sintomas
              depressivos de intensidade moderada. Foi identificado um item crítico
              relacionado à ideação suicida, que necessita de investigação aprofundada
              e manejo imediato. Recomenda-se avaliação clinica completa para confirmação
              diagnóstica e elaboração de plano terapêutico.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default RelatorioPage;