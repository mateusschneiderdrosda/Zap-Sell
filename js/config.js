// ============================================================
// js/config.js — CONFIGURAÇÃO CENTRAL DO ZAPSELL
// ⚠️  EDITE AQUI: nome do produto, links de checkout, etc.
// ============================================================

const ZAPSELL_CONFIG = {

  // ── PRODUTO ────────────────────────────────────────────────
  produto: {
    nome:        'ZapSell',
    tagline:     'Agente de IA para seu WhatsApp. Venda enquanto dorme.',
    descricao:   'Automatize suas vendas com Inteligência Artificial diretamente no WhatsApp. CRM completo, agente IA com Claude, alertas e muito mais.',
    logo_url:    '../assets/logo.png',   // coloque sua logo aqui
    site_url:    'https://zap-sell-murex.vercel.app',
    suporte_zap: 'https://wa.me/5541999990000',
    cor_primaria:'#00e676',
  },

  // ── LINKS DE CHECKOUT (CAKTO) ──────────────────────────────
  // Cole aqui os links gerados no painel da Cakto
  checkout: {
    free:     null,                                        // gratuito = sem checkout
    pro:      'https://pay.cakto.com.br/SEU_LINK_PRO',    // ← SUBSTITUA
    business: 'https://pay.cakto.com.br/SEU_LINK_BIZ',    // ← SUBSTITUA
  },

  // ── PREÇOS DOS PLANOS ──────────────────────────────────────
  planos: {
    free: {
      nome:      'Gratuito',
      preco:     0,
      mensagens: 50,
      descricao: 'Para começar a testar',
      features:  ['50 mensagens/mês','1 número WhatsApp','Dashboard básico','Suporte por e-mail'],
    },
    pro: {
      nome:      'Pro',
      preco:     97,
      mensagens: 2000,
      descricao: 'Para vendedores ativos',
      features:  ['2.000 mensagens/mês','3 números WhatsApp','Agente IA com Claude','Relatórios avançados','Integrações (Cakto, Kiwify)','Suporte prioritário'],
      destaque:  true,
    },
    business: {
      nome:      'Business',
      preco:     247,
      mensagens: null,
      descricao: 'Para times e agências',
      features:  ['Mensagens ilimitadas','10 números WhatsApp','Multi-usuários','API própria','Todas as integrações','Suporte dedicado 24/7'],
    },
  },

  // ── ADMIN ──────────────────────────────────────────────────
  admin: {
    email:   'mateusschneider037@gmail.com',
    usuario: 'msddragon',
    // NUNCA coloque senha em texto aqui — a senha fica só no Supabase Auth
  },

  // ── IA ─────────────────────────────────────────────────────
  ia: {
    // Groq API — ultrarrápida e gratuita
    // Modelo: llama-3.3-70b-versatile
    groq_key: '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',
    modelo:   'llama-3.3-70b-versatile',
  },

  // ── INTEGRAÇÕES ────────────────────────────────────────────
  integracoes: {
    cakto:     { ativo: true,  url_webhook: '/webhook/cakto'    },
    kiwify:    { ativo: true,  url_webhook: '/webhook/kiwify'   },
    hotmart:   { ativo: false, url_webhook: '/webhook/hotmart'  },
    utmify:    { ativo: true,  url_webhook: '/webhook/utmify'   },
    eduzz:     { ativo: false, url_webhook: '/webhook/eduzz'    },
    stripe:    { ativo: false, url_webhook: '/webhook/stripe'   },
  },

  // ── EVOLUTION API (WhatsApp backend) ──────────────────────
  evolution: {
    url:      'https://SUA-EVOLUTION-API.com',   // ← SUBSTITUA
    api_key:  'SEU_TOKEN_AQUI',                  // ← SUBSTITUA
    instancia: 'zapsell-main',
  },

}

// Expõe globalmente
window.ZS = ZAPSELL_CONFIG
