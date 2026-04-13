-- ============================================================
-- ZAPSELL — Schema Completo v2
-- Cole no SQL Editor do Supabase e clique Run
-- ============================================================

-- 1. PERFIS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nome TEXT, email TEXT, plano TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. LEADS
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL, telefone TEXT, email TEXT,
  origem TEXT DEFAULT 'manual',
  status TEXT DEFAULT 'novo' CHECK (status IN ('novo','em_contato','convertido','perdido')),
  notas TEXT, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. VENDAS
CREATE TABLE IF NOT EXISTS public.vendas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  descricao TEXT, valor NUMERIC(10,2) NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente','pago','cancelado')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CONFIGURAÇÕES GERAIS
CREATE TABLE IF NOT EXISTS public.configuracoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  nome_empresa TEXT, webhook_url TEXT, notificacoes_email BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CONFIGURAÇÃO DO AGENTE IA (NOVO)
CREATE TABLE IF NOT EXISTS public.agente_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  nome TEXT DEFAULT 'Sofia',
  cargo TEXT DEFAULT 'assistente virtual',
  empresa TEXT,
  tom TEXT DEFAULT 'amigavel',
  instrucoes TEXT,
  atalhos TEXT DEFAULT '[]',   -- JSON array de respostas rápidas
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BASE DE CONHECIMENTO — arquivos para treinar a IA (NOVO)
CREATE TABLE IF NOT EXISTS public.base_conhecimento (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  tamanho INTEGER,
  tipo TEXT DEFAULT 'arquivo',  -- arquivo | texto | faq | link
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendas            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.configuracoes     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agente_config     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.base_conhecimento ENABLE ROW LEVEL SECURITY;

CREATE POLICY "perfil_self"  ON public.profiles         USING (auth.uid()=id) WITH CHECK (auth.uid()=id);
CREATE POLICY "leads_self"   ON public.leads             USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE POLICY "vendas_self"  ON public.vendas            USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE POLICY "config_self"  ON public.configuracoes     USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE POLICY "agente_self"  ON public.agente_config     USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);
CREATE POLICY "base_self"    ON public.base_conhecimento USING (auth.uid()=user_id) WITH CHECK (auth.uid()=user_id);

-- ============================================================
-- TRIGGER: cria perfil automático no cadastro
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome, plano)
  VALUES (NEW.id, NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email,'@',1)),
    COALESCE(NEW.raw_user_meta_data->>'plano','free'));
  INSERT INTO public.configuracoes (user_id) VALUES (NEW.id);
  INSERT INTO public.agente_config (user_id, nome, instrucoes)
  VALUES (NEW.id,'Sofia','Você é Sofia, uma assistente virtual simpática. Ajude os clientes com suas dúvidas de forma clara e objetiva.');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
