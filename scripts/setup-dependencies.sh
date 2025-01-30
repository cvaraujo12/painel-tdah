#!/bin/bash

echo "Verificando e instalando dependências..."

# Dependências necessárias
DEPS=(
  "@radix-ui/react-checkbox"
  "@radix-ui/react-dialog"
  "@radix-ui/react-label"
  "@radix-ui/react-select"
  "@radix-ui/react-slot"
  "class-variance-authority"
  "clsx"
  "lucide-react"
  "next"
  "nuqs"
  "react"
  "react-dom"
  "tailwind-merge"
  "tailwindcss-animate"
  "@types/node"
  "@types/react"
  "@types/react-dom"
  "autoprefixer"
  "postcss"
  "tailwindcss"
  "typescript"
  "shadcn-ui"
)

# Verificar package.json
if [ ! -f "package.json" ]; then
  echo "Inicializando package.json..."
  npm init -y
fi

# Instalar dependências
for dep in "${DEPS[@]}"; do
  if ! grep -q "\"$dep\"" package.json; then
    echo "Instalando $dep..."
    npm install $dep
  fi
done

# Configurar shadcn-ui
if ! command -v shadcn-ui &> /dev/null; then
  echo "Configurando shadcn-ui..."
  npx shadcn-ui@latest init
fi

echo "Dependências configuradas com sucesso!" 