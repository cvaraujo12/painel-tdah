-- Desativa triggers temporariamente para evitar conflitos
SET session_replication_role = replica;

-- Cria extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sequências para as tabelas
CREATE SEQUENCE IF NOT EXISTS tasks_id_seq;
CREATE SEQUENCE IF NOT EXISTS notes_id_seq;
CREATE SEQUENCE IF NOT EXISTS mood_entries_id_seq;

-- Tabela de tarefas
CREATE TABLE IF NOT EXISTS public.tasks (
    id bigint PRIMARY KEY DEFAULT nextval('tasks_id_seq'),
    title text NOT NULL,
    description text,
    completed boolean DEFAULT false,
    priority text DEFAULT 'medium',
    due_date timestamp with time zone,
    tags text[],
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id uuid NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabela de notas
CREATE TABLE IF NOT EXISTS public.notes (
    id bigint PRIMARY KEY DEFAULT nextval('notes_id_seq'),
    title text,
    content text NOT NULL,
    tags text[],
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id uuid NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Tabela de registro de humor
CREATE TABLE IF NOT EXISTS public.mood_entries (
    id bigint PRIMARY KEY DEFAULT nextval('mood_entries_id_seq'),
    mood_level integer NOT NULL CHECK (mood_level BETWEEN 1 AND 5),
    notes text,
    energy_level integer CHECK (energy_level BETWEEN 1 AND 5),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    user_id uuid NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON public.tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON public.notes(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON public.mood_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_created_at ON public.mood_entries(created_at);

-- Habilita RLS para todas as tabelas
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

-- Políticas para tasks
DO $$
BEGIN
    DROP POLICY IF EXISTS "Enable read for users based on user_id" ON public.tasks;
    DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.tasks;
    DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.tasks;
    DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.tasks;
    
    CREATE POLICY "Enable read for users based on user_id" 
        ON public.tasks FOR SELECT 
        USING (auth.uid() = user_id);
    
    CREATE POLICY "Enable insert for authenticated users only" 
        ON public.tasks FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "Enable update for users based on user_id" 
        ON public.tasks FOR UPDATE 
        USING (auth.uid() = user_id);
    
    CREATE POLICY "Enable delete for users based on user_id" 
        ON public.tasks FOR DELETE 
        USING (auth.uid() = user_id);
END
$$;

-- Políticas para notes
DO $$
BEGIN
    DROP POLICY IF EXISTS "Enable read for users based on user_id" ON public.notes;
    DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.notes;
    DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.notes;
    DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.notes;
    
    CREATE POLICY "Enable read for users based on user_id" 
        ON public.notes FOR SELECT 
        USING (auth.uid() = user_id);
    
    CREATE POLICY "Enable insert for authenticated users only" 
        ON public.notes FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "Enable update for users based on user_id" 
        ON public.notes FOR UPDATE 
        USING (auth.uid() = user_id);
    
    CREATE POLICY "Enable delete for users based on user_id" 
        ON public.notes FOR DELETE 
        USING (auth.uid() = user_id);
END
$$;

-- Políticas para mood_entries
DO $$
BEGIN
    DROP POLICY IF EXISTS "Enable read for users based on user_id" ON public.mood_entries;
    DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.mood_entries;
    DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.mood_entries;
    DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.mood_entries;
    
    CREATE POLICY "Enable read for users based on user_id" 
        ON public.mood_entries FOR SELECT 
        USING (auth.uid() = user_id);
    
    CREATE POLICY "Enable insert for authenticated users only" 
        ON public.mood_entries FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "Enable update for users based on user_id" 
        ON public.mood_entries FOR UPDATE 
        USING (auth.uid() = user_id);
    
    CREATE POLICY "Enable delete for users based on user_id" 
        ON public.mood_entries FOR DELETE 
        USING (auth.uid() = user_id);
END
$$;

-- Configuração do Realtime
BEGIN;
    DROP PUBLICATION IF EXISTS supabase_realtime;
    CREATE PUBLICATION supabase_realtime;
END;

-- Adiciona tabelas ao realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mood_entries;

-- Reativa triggers
SET session_replication_role = DEFAULT; 