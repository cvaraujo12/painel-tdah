#!/bin/bash

echo "Iniciando migração para armazenamento local..."

# Instalar dependências necessárias
echo "Instalando dependências..."
npm install uuid
npm install -D @types/uuid

# Função para substituir imports do Supabase
replace_supabase_imports() {
  local file="$1"
  echo "Processando arquivo: $file"
  
  # Remover imports do Supabase
  sed -i '/import.*@supabase\/ssr/d' "$file"
  sed -i '/import.*@supabase\/supabase-js/d' "$file"
  
  # Adicionar import da nova camada de armazenamento
  if grep -q "storage\|auth" "$file"; then
    sed -i '1i import { storage, auth } from "@/lib/storage";' "$file"
  fi
}

# Função para substituir chamadas do Supabase
replace_supabase_calls() {
  local file="$1"
  
  # Substituir chamadas de autenticação
  sed -i 's/supabase\.auth\.signUp/auth.signUp/g' "$file"
  sed -i 's/supabase\.auth\.signIn/auth.signIn/g' "$file"
  sed -i 's/supabase\.auth\.signOut/auth.signOut/g' "$file"
  sed -i 's/supabase\.auth\.getSession/auth.getCurrentUser/g' "$file"
  sed -i 's/supabase\.auth\.getUser/auth.getCurrentUser/g' "$file"
  
  # Substituir chamadas de dados
  sed -i 's/supabase\.from(['"'"'"]tasks['"'"'"])\.select()/storage.query("tasks")/g' "$file"
  sed -i 's/supabase\.from(['"'"'"]notes['"'"'"])\.select()/storage.query("notes")/g' "$file"
  sed -i 's/supabase\.from(['"'"'"]mood_entries['"'"'"])\.select()/storage.query("mood_entries")/g' "$file"
  
  sed -i 's/supabase\.from(['"'"'"]tasks['"'"'"])\.insert/storage.insert("tasks",/g' "$file"
  sed -i 's/supabase\.from(['"'"'"]notes['"'"'"])\.insert/storage.insert("notes",/g' "$file"
  sed -i 's/supabase\.from(['"'"'"]mood_entries['"'"'"])\.insert/storage.insert("mood_entries",/g' "$file"
  
  sed -i 's/supabase\.from(['"'"'"]tasks['"'"'"])\.update/storage.update("tasks",/g' "$file"
  sed -i 's/supabase\.from(['"'"'"]notes['"'"'"])\.update/storage.update("notes",/g' "$file"
  sed -i 's/supabase\.from(['"'"'"]mood_entries['"'"'"])\.update/storage.update("mood_entries",/g' "$file"
  
  sed -i 's/supabase\.from(['"'"'"]tasks['"'"'"])\.delete/storage.delete("tasks",/g' "$file"
  sed -i 's/supabase\.from(['"'"'"]notes['"'"'"])\.delete/storage.delete("notes",/g' "$file"
  sed -i 's/supabase\.from(['"'"'"]mood_entries['"'"'"])\.delete/storage.delete("mood_entries",/g' "$file"
}

# Função para remover middleware do Supabase
remove_supabase_middleware() {
  if [ -f src/middleware.ts ]; then
    echo "Atualizando middleware..."
    cat > src/middleware.ts << 'EOL'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  return NextResponse.next()
}
 
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
EOL
  fi
}

# Função para atualizar configurações do Next.js
update_next_config() {
  echo "Atualizando next.config.js..."
  sed -i '/NEXT_PUBLIC_SUPABASE_URL/d' next.config.js
  sed -i '/NEXT_PUBLIC_SUPABASE_ANON_KEY/d' next.config.js
  sed -i '/supabase/d' next.config.js
}

# Processar todos os arquivos TypeScript/JavaScript
echo "Migrando arquivos..."
find src -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) -not -path "*/node_modules/*" | while read -r file; do
  replace_supabase_imports "$file"
  replace_supabase_calls "$file"
done

# Remover middleware do Supabase
remove_supabase_middleware

# Atualizar configurações do Next.js
update_next_config

# Remover tipos do Supabase
echo "Removendo tipos do Supabase..."
rm -f src/types/supabase.ts

# Executar script de remoção do Supabase
echo "Executando script de remoção do Supabase..."
./scripts/remove-supabase.sh

echo "Migração concluída!"
echo "Por favor, verifique os arquivos manualmente para garantir que todas as substituições foram feitas corretamente."
echo "Você pode precisar ajustar algumas chamadas de API manualmente, especialmente se estiver usando queries mais complexas." 