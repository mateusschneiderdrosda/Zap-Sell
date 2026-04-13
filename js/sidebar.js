// sidebar.js — URLs limpas (sem /pages/*.html)

const SIDEBAR_HTML = (ativo) => `
<div class="sidebar">
  <div class="sidebar-logo">
    <div class="sidebar-logo-icon">
      <svg viewBox="0 0 24 24"><path d="M20.52 3.48A11.77 11.77 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.96L0 24l6.2-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.22-3.48-8.52z"/></svg>
    </div>
    <div class="sidebar-logo-text">Zap<span>Sell</span></div>
  </div>
  <nav>
    <span class="nav-section">Principal</span>
    <a href="/dashboard" class="${ativo==='dashboard'?'active':''}">
      <span class="nav-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3zm10 0h8v8h-8zM3 13h8v8H3zm10 3h2v-2h2v2h2v2h-2v2h-2v-2h-2z"/></svg></span>
      Dashboard
    </a>
    <a href="/leads" class="${ativo==='leads'?'active':''}">
      <span class="nav-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg></span>
      Leads
    </a>
    <a href="/vendas" class="${ativo==='vendas'?'active':''}">
      <span class="nav-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg></span>
      Vendas
    </a>
    <span class="nav-section">Automação</span>
    <a href="/agente" class="${ativo==='ia'?'active':''}">
      <span class="nav-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M21 10.5h-1V7c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-3.5h1c.55 0 1-.45 1-1v-2c0-.55-.45-1-1-1zM8 13H6v-2h2v2zm5 0h-2v-2h2v2zm5 0h-2v-2h2v2z"/></svg></span>
      Agente IA
      <span class="nav-new">novo</span>
    </a>
    <span class="nav-section">Conta</span>
    <a href="/planos" class="${ativo==='planos'?'active':''}">
      <span class="nav-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg></span>
      Planos
    </a>
    <a href="/configuracoes" class="${ativo==='config'?'active':''}">
      <span class="nav-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg></span>
      Configurações
    </a>
  </nav>
  <div class="sidebar-footer">
    <div class="user-chip" onclick="logout()">
      <div class="avatar" id="avatar">?</div>
      <div class="user-info">
        <div class="user-name" id="sidebar-nome">Carregando...</div>
        <div class="user-plan" id="sidebar-plano">free</div>
      </div>
    </div>
  </div>
</div>`

function renderSidebar(ativo) {
  const app = document.querySelector('.app')
  if (app) app.insertAdjacentHTML('afterbegin', SIDEBAR_HTML(ativo))
}
