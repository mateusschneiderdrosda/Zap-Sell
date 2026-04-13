// supabase/functions/webhook-cakto/index.ts
// Edge Function — processa pagamentos da Cakto e ativa plano automaticamente

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // service role para bypassar RLS
)

// Mapeamento evento Cakto → plano ZapSell
const PLANO_MAP: Record<string, string> = {
  "SEU_PRODUTO_ID_PRO":      "pro",
  "SEU_PRODUTO_ID_BUSINESS": "business",
}

serve(async (req) => {
  // CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: { "Access-Control-Allow-Origin": "*" } })
  }

  try {
    const body = await req.json()
    console.log("[Cakto Webhook]", JSON.stringify(body))

    // Estrutura do webhook Cakto:
    // body.event: "purchase.approved" | "subscription.activated" | "purchase.refunded" | "subscription.canceled"
    // body.data.customer.email
    // body.data.product.id
    // body.data.status

    const event  = body?.event || body?.type || ""
    const email  = body?.data?.customer?.email || body?.customer?.email || ""
    const prodId = body?.data?.product?.id     || body?.product?.id     || ""
    const status = body?.data?.status          || body?.status          || ""

    if (!email) {
      return new Response(JSON.stringify({ error: "email não encontrado no webhook" }), { status: 400 })
    }

    // Determina o plano pelo produto
    const plano = PLANO_MAP[prodId] || "pro" // default pro se não mapeado

    // Eventos de ATIVAÇÃO
    if (["purchase.approved", "subscription.activated", "order.approved"].includes(event)) {

      // 1. Busca o usuário pelo email
      const { data: users, error: listErr } = await supabase.auth.admin.listUsers()
      if (listErr) throw listErr

      const user = users.users.find(u => u.email?.toLowerCase() === email.toLowerCase())

      if (user) {
        // Usuário já existe — só atualiza o plano
        await supabase
          .from("profiles")
          .update({ plano, updated_at: new Date().toISOString() })
          .eq("id", user.id)

        console.log(`✅ Plano ${plano} ativado para ${email} (usuário existente)`)

      } else {
        // Usuário novo — cria conta automaticamente com senha aleatória
        const senha = Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-4).toUpperCase()
        const nome  = body?.data?.customer?.name || email.split("@")[0]

        const { data: newUser, error: createErr } = await supabase.auth.admin.createUser({
          email,
          password: senha,
          email_confirm: true, // confirma email automaticamente
          user_metadata: { nome, plano }
        })

        if (createErr) throw createErr

        // Atualiza perfil com plano correto (trigger já cria o perfil)
        await supabase
          .from("profiles")
          .update({ plano, nome })
          .eq("id", newUser.user.id)

        // Envia email com acesso (via Supabase Mailer)
        await supabase.auth.admin.generateLink({
          type: "magiclink",
          email,
          options: {
            redirectTo: "https://zapsel.shop/pages/dashboard.html"
          }
        }).then(async ({ data: link }) => {
          // Dispara email de boas-vindas com o link de acesso
          // O Supabase envia automaticamente via Auth → Email Templates
          console.log(`📧 Link de acesso gerado para ${email}`)
        })

        console.log(`✅ Conta criada para ${email} com plano ${plano}`)
      }

      return new Response(JSON.stringify({ ok: true, acao: "plano_ativado", plano, email }), {
        headers: { "Content-Type": "application/json" }
      })
    }

    // Eventos de CANCELAMENTO / REEMBOLSO
    if (["purchase.refunded", "subscription.canceled", "subscription.expired"].includes(event)) {
      const { data: users } = await supabase.auth.admin.listUsers()
      const user = users?.users.find(u => u.email?.toLowerCase() === email.toLowerCase())

      if (user) {
        await supabase
          .from("profiles")
          .update({ plano: "free" })
          .eq("id", user.id)

        console.log(`⬇️ Plano rebaixado para free: ${email}`)
      }

      return new Response(JSON.stringify({ ok: true, acao: "plano_rebaixado", email }), {
        headers: { "Content-Type": "application/json" }
      })
    }

    // Evento não tratado
    return new Response(JSON.stringify({ ok: true, acao: "ignorado", event }), {
      headers: { "Content-Type": "application/json" }
    })

  } catch (err) {
    console.error("[Webhook Error]", err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
