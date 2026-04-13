// ============================================================
// js/leads.js — CRUD de Leads
// ============================================================

async function listarLeads(filtros = {}) {
  let query = _sb.from('leads').select('*').order('created_at', { ascending: false })
  if (filtros.status) query = query.eq('status', filtros.status)
  if (filtros.busca)  query = query.ilike('nome', `%${filtros.busca}%`)
  const { data, error } = await query
  if (error) throw error
  return data
}

async function criarLead({ nome, telefone, email, origem = 'manual', notas = '' }) {
  const { data: { user } } = await _sb.auth.getUser()
  const { data, error } = await _sb.from('leads').insert({
    user_id: user.id, nome, telefone, email, origem, notas, status: 'novo'
  }).select().single()
  if (error) throw error
  return data
}

async function atualizarLead(id, campos) {
  const { data, error } = await _sb
    .from('leads').update({ ...campos, updated_at: new Date().toISOString() })
    .eq('id', id).select().single()
  if (error) throw error
  return data
}

async function deletarLead(id) {
  const { error } = await _sb.from('leads').delete().eq('id', id)
  if (error) throw error
}

async function atualizarStatus(id, status) {
  return atualizarLead(id, { status })
}

async function contarLeadsPorStatus() {
  const { data, error } = await _sb.from('leads').select('status')
  if (error) throw error
  return data.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1
    return acc
  }, { novo: 0, em_contato: 0, convertido: 0, perdido: 0 })
}
