#!/bin/bash

echo "Reorganizando estrutura dos componentes..."

# Função para converter PascalCase para kebab-case
function to_kebab_case() {
    echo "$1" | sed -r 's/([a-z0-9])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]'
}

# Criar estrutura base
mkdir -p src/components/{ui,widgets,layouts,features}
mkdir -p src/lib/{utils,hooks,types}

# Template para types.ts
cat > scripts/templates/types-template.txt << 'EOL'
export interface ComponentProps {
  // Props do componente
}

export interface SubComponentProps {
  // Props do subcomponente
}
EOL

# Template para hooks.ts
cat > scripts/templates/hooks-template.txt << 'EOL'
import { useState } from "react"
import { useQueryState } from "nuqs"
import type { ComponentProps } from "./types"

export function useComponent() {
  // Lógica do hook
  return {
    // Retorno do hook
  }
}
EOL

# Template para utils.ts
cat > scripts/templates/utils-template.txt << 'EOL'
export function utilFunction() {
  // Função utilitária
}
EOL

# Reorganizar widgets
source scripts/reorganize-widgets.sh

# Reorganizar layouts
LAYOUTS=(
  "MainLayout"
  "AuthLayout"
  "DashboardLayout"
)

for layout in "${LAYOUTS[@]}"; do
  layout_kebab=$(to_kebab_case "$layout")
  mkdir -p "src/components/layouts/$layout_kebab"
  
  # Criar arquivos base
  cp scripts/templates/types-template.txt "src/components/layouts/$layout_kebab/types.ts"
  cp scripts/templates/hooks-template.txt "src/components/layouts/$layout_kebab/hooks.ts"
  cp scripts/templates/utils-template.txt "src/components/layouts/$layout_kebab/utils.ts"
  cp scripts/templates/shadcn-component.txt "src/components/layouts/$layout_kebab/index.tsx"
done

# Reorganizar features
FEATURES=(
  "Authentication"
  "Dashboard"
  "Settings"
  "Profile"
)

for feature in "${FEATURES[@]}"; do
  feature_kebab=$(to_kebab_case "$feature")
  mkdir -p "src/components/features/$feature_kebab"
  
  # Criar arquivos base
  cp scripts/templates/types-template.txt "src/components/features/$feature_kebab/types.ts"
  cp scripts/templates/hooks-template.txt "src/components/features/$feature_kebab/hooks.ts"
  cp scripts/templates/utils-template.txt "src/components/features/$feature_kebab/utils.ts"
  cp scripts/templates/shadcn-component.txt "src/components/features/$feature_kebab/index.tsx"
done

echo "Estrutura dos componentes reorganizada com sucesso!" 