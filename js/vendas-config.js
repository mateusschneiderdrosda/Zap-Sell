// ============================================================
// js/vendas.js — CRUD de Vendas
// ============================================================

async function listarVendas(filtros = {}) {
  let query = _sb.from('vendas')
    .select('*, leads(nome, telefone)')
    .order('created_at', { ascending: false })
  if (filtros.status) query = query.eq('status', filtros.status)
  const { data, error } = await query
  if (error) throw error
  return data
}

async function criarVenda({ lead_id, descricao, valor, status = 'pendente' }) {
  const { data: { user } } = await _sb.auth.getUser()
  const { data, error } = await _sb.from('vendas').insert({
    user_id: user.id, lead_id: lead_id || null, descricao, valor: Number(valor), status
  }).select().single()
  if (error) throw error
  return data
}

async function atualizarVenda(id, campos) {
  const { data, error } = await _sb.from('vendas')
    .update({ ...campos, updated_at: new Date().toISOString() })
    .eq('id', id).select().single()
  if (error) throw error
  return data
}

async function deletarVenda(id) {
  const { error } = await _sb.from('vendas').delete().eq('id', id)
  if (error) throw error
}

async function totalVendas() {
  const { data, error } = await _sb.from('vendas').select('valor, status')
  if (error) throw error
  return {
    total:     data.reduce((s, v) => s + Number(v.valor), 0),
    pagas:     data.filter(v => v.status === 'pago').reduce((s, v) => s + Number(v.valor), 0),
    pendentes: data.filter(v => v.status === 'pendente').reduce((s, v) => s + Number(v.valor), 0),
  }
}

// ============================================================
// js/configuracoes.js — Salvar e carregar configurações
// ============================================================

async function getConfiguracoes() {
  const { data: { user } } = await _sb.auth.getUser()
  const { data, error } = await _sb.from('configuracoes').select('*').eq('user_id', user.id).maybeSingle()
  if (error) throw error
  return data || {}
}

async function salvarConfiguracoes(campos) {
  const { data: { user } } = await _sb.auth.getUser()
  // upsert = cria se não existe, atualiza se existe
  const { data, error } = await _sb.from('configuracoes')
    .upsert({ user_id: user.id, ...campos, updated_at: new Date().toISOString() },
            { onConflict: 'user_id' })
    .select().single()
  if (error) throw error
  return data
}

async function atualizarNome(novoNome) {
  const { error } = await _sb.auth.updateUser({ data: { nome: novoNome } })
  if (error) throw error
  const user = await getUsuario()
  await _sb.from('profiles').update({ nome: novoNome }).eq('id', user.id)
}

async function atualizarSenha(novaSenha) {
  const { error } = await _sb.auth.updateUser({ password: novaSenha })
  if (error) throw error
}
