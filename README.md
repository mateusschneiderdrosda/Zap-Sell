# ZapSell v3 — Guia de Configuração

## 🚀 Novas funcionalidades (v3)

| Feature | Descrição |
|---|---|
| 🤖 **Agente IA** | Configura e treina um agente com Claude para responder no WhatsApp |
| 📚 **Base de conhecimento** | Adiciona instruções e FAQs para treinar a IA |
| ⬇️ **Download de config** | Exporta a configuração do agente em JSON |
| 📲 **QR Code WhatsApp** | Conecta número via QR Code (como o WhatsApp Web) |
| 💳 **Planos e assinaturas** | Sistema de cobrança mensal/anual com 3 planos |
| 🎨 **Novo design** | Interface dark premium, tema gamer-profissional |

---

## ⚡ Setup em 3 passos

### 1. Configure o Supabase
Abra `js/supabase-config.js`:
```js
const SUPABASE_URL      = 'https://SEU_PROJETO.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGci...'  // começa com eyJ!
```

### 2. Crie as tabelas
SQL Editor do Supabase → cole `SETUP_BANCO.sql` → Run

### 3. Configure a API do Claude (para o Agente IA)
Nas Configurações do app, adicione sua **Anthropic API Key**:
- Acesse: https://console.anthropic.com/settings/keys
- Gere uma nova chave
- Cole em Configurações → Integrações

---

## 📁 Estrutura
```
ZapSell-v3/
├── index.html              ← Login
├── css/style.css
├── js/
│   ├── supabase-config.js  ← ⚠️ CONFIGURE
│   ├── utils.js
│   ├── sidebar.js
│   ├── leads.js
│   └── vendas-config.js
├── pages/
│   ├── dashboard.html
│   ├── leads.html
│   ├── vendas.html
│   ├── agente.html         ← 🆕 Agente IA
│   ├── whatsapp.html       ← 🆕 QR Code
│   ├── planos.html         ← 🆕 Assinaturas
│   └── configuracoes.html
└── SETUP_BANCO.sql         ← Execute no Supabase
```

---

## 💳 Sistema de planos
| Plano | Preço | Mensagens/mês |
|---|---|---|
| Gratuito | R$ 0 | 50 |
| Pro | R$ 97/mês | 2.000 |
| Business | R$ 247/mês | Ilimitado |

Para integrar pagamento real, conecte o **Stripe** ou **Mercado Pago** na função `confirmarAssinatura()` em `planos.html`.

---

## 🤖 Como funciona o Agente IA
1. Vá em **Agente IA** → configure nome, personalidade e instruções
2. Adicione conteúdo na **Base de Conhecimento** (FAQs, regras, produtos)
3. Teste no **preview ao vivo** do chat
4. Salve e **Ative o agente**
5. Conecte seu **WhatsApp** via QR Code
6. A IA vai responder automaticamente usando o Claude

---

## ⚠️ Nota sobre o QR Code WhatsApp
O QR Code exibido é funcional em design/frontend. Para conectar de verdade ao WhatsApp, você precisa de um **backend Node.js** com a biblioteca `whatsapp-web.js` ou `baileys`. O ZapSell gera o token de sessão, mas a validação é feita no servidor.

**Backend recomendado:** Node.js + `whatsapp-web.js` + Supabase para persistência.
