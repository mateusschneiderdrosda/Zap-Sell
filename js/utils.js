// utils.js — versão corrigida

/* PAGE LOADER */
function injetarLoader() {
  if (document.getElementById('page-loader')) return
  const el = document.createElement('div')
  el.id = 'page-loader'
  el.innerHTML = `<div class="loader-icon"><svg viewBox="0 0 24 24"><path d="M20.52 3.48A11.77 11.77 0 0 0 12 0C5.37 0 0 5.37 0 12c0 2.11.55 4.16 1.6 5.96L0 24l6.2-1.62A11.93 11.93 0 0 0 12 24c6.63 0 12-5.37 12-12 0-3.2-1.25-6.22-3.48-8.52z"/></svg></div>`
  document.body.prepend(el)
}
injetarLoader()

function esconderLoader() {
  const el = document.getElementById('page-loader')
  if (el) { el.classList.add('hide'); setTimeout(() => el.remove(), 300) }
}

/* AUTH */
async function getUsuario() {
  const { data: { user } } = await _sb.auth.getUser()
  return user
}

// Alias mantido para compatibilidade com páginas antigas
async function getPerfil() {
  const user = await getUsuario()
  if (!user) return null
  const { data } = await _sb.from('profiles').select('*').eq('id', user.id).single()
  return data
}

async function protegerPagina() {
  const user = await getUsuario()
  if (!user) { window.location.href = '/login'; return null }
  return user
}

async function logout() {
  await _sb.auth.signOut()
  window.location.href = '/login'
}

/* SIDEBAR — aceita tanto carregarSidebar() quanto carregarSidebar(userId) */
async function carregarSidebar(userId) {
  let uid = userId
  if (!uid) {
    const user = await getUsuario()
    if (!user) return
    uid = user.id
  }

  const { data: p } = await _sb.from('profiles').select('nome,email,plano').eq('id', uid).single()
  if (!p) return

  const nome  = p.nome || p.email?.split('@')[0] || 'Usuário'
  const plano = p.plano || 'free'
  const planoLabel = { free: 'Gratuito', pro: '⭐ Pro', business: '🚀 Business' }[plano] || plano

  const av = document.getElementById('avatar')
  const sn = document.getElementById('sidebar-nome')
  const sp = document.getElementById('sidebar-plano') || document.getElementById('sidebar-email')

  if (av) av.textContent = nome[0].toUpperCase()
  if (sn) sn.textContent = nome
  if (sp) {
    sp.textContent = planoLabel
    sp.style.color = plano === 'free' ? 'var(--muted)' : 'var(--green)'
  }
}

/* TOAST */
function toast(msg, tipo = 'success') {
  let el = document.getElementById('_toast')
  if (!el) {
    el = document.createElement('div')
    el.id = '_toast'
    el.className = 'toast'
    document.body.appendChild(el)
  }
  el.textContent = msg
  el.className = `toast ${tipo}`
  void el.offsetWidth
  el.classList.add('show')
  clearTimeout(el._t)
  el._t = setTimeout(() => el.classList.remove('show'), 3000)
}

/* MODAL */
function abrirModal(id)  { document.getElementById(id)?.classList.add('open') }
function fecharModal(id) { document.getElementById(id)?.classList.remove('open') }

/* FORMATAÇÃO */
function formatarData(iso) {
  if (!iso) return '—'
  const d     = new Date(iso)
  const agora = new Date()
  const diff  = (agora - d) / 1000
  if (diff < 60)    return 'agora'
  if (diff < 3600)  return Math.floor(diff / 60) + 'min'
  if (diff < 86400) return Math.floor(diff / 3600) + 'h'
  return d.toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit' })
}

function formatarMoeda(v) {
  return 'R$\u00A0' + Number(v || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

function statusTag(s) {
  const m = {
    novo:       ['tag-blue',   'Novo'],
    em_contato: ['tag-yellow', 'Em contato'],
    convertido: ['tag-green',  'Convertido'],
    perdido:    ['tag-red',    'Perdido'],
    pendente:   ['tag-yellow', 'Pendente'],
    pago:       ['tag-green',  'Pago'],
    cancelado:  ['tag-red',    'Cancelado'],
  }
  const [cls, txt] = m[s] || ['tag-gray', s]
  return `<span class="tag ${cls}">${txt}</span>`
}
