-- ============================================================
-- SQL EXTRA — rode no Supabase para suportar webhook da Cakto
-- ============================================================

-- Adiciona campo updated_at em profiles (se não existir)
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Adiciona campo plano_expira (opcional — para assinaturas)
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS plano_expira TIMESTAMPTZ;

-- Tabela de log de pagamentos (auditoria)
CREATE TABLE IF NOT EXISTS public.pagamentos (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email       TEXT NOT NULL,
  user_id     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  plano       TEXT NOT NULL,
  evento      TEXT NOT NULL,  -- purchase.approved, subscription.canceled etc
  produto_id  TEXT,
  valor       NUMERIC(10,2),
  payload     JSONB,           -- payload completo do webhook
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;

-- Admin pode ver tudo, usuário vê só os próprios
CREATE POLICY "pagamentos_self" ON public.pagamentos 
  USING (auth.uid() = user_id);

-- Índice para busca por email
CREATE INDEX IF NOT EXISTS pagamentos_email_idx ON public.pagamentos(email);
CREATE INDEX IF NOT EXISTS profiles_plano_idx   ON public.profiles(plano);

SELECT 'Tabelas de webhook criadas com sucesso! ✅' AS status;
