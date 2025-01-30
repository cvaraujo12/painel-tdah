#!/bin/bash

echo "Removendo dependências do Supabase..."

# Remover dependências do package.json
npm uninstall @supabase/ssr @supabase/supabase-js

# Remover variáveis de ambiente do Supabase
if [ -f .env.local ]; then
  sed -i '/NEXT_PUBLIC_SUPABASE_URL/d' .env.local
  sed -i '/NEXT_PUBLIC_SUPABASE_ANON_KEY/d' .env.local
fi

if [ -f .env ]; then
  sed -i '/NEXT_PUBLIC_SUPABASE_URL/d' .env
  sed -i '/NEXT_PUBLIC_SUPABASE_ANON_KEY/d' .env
fi

# Remover diretório do Supabase
rm -rf supabase/

# Remover configurações do Supabase do next.config.js
sed -i '/supabase/d' next.config.js

echo "Dependências do Supabase removidas com sucesso!"
echo "Por favor, atualize seus componentes para usar a nova camada de armazenamento em src/lib/storage/index.ts" 