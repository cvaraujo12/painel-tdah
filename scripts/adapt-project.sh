#!/bin/bash

echo "Iniciando adaptação do projeto..."

# Tornar scripts executáveis
chmod +x scripts/*.sh

# 1. Configurar dependências
./scripts/setup-dependencies.sh

# 2. Converter MUI para Shadcn
./scripts/convert-mui-to-shadcn.sh

# 3. Reorganizar componentes
./scripts/reorganize-components.sh

# 4. Configurar ESLint e Prettier
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier eslint-plugin-react-hooks

# Criar configuração do ESLint
cat > .eslintrc.json << 'EOL'
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint", "react-hooks"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
EOL

# Criar configuração do Prettier
cat > .prettierrc << 'EOL'
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}
EOL

# 5. Atualizar scripts do package.json
npm pkg set scripts.dev="next dev"
npm pkg set scripts.build="next build"
npm pkg set scripts.start="next start"
npm pkg set scripts.lint="next lint"
npm pkg set scripts.format="prettier --write \"src/**/*.{ts,tsx}\""

# 6. Criar arquivo de configuração do TypeScript
cat > tsconfig.json << 'EOL'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOL

# 7. Atualizar README
cat > README.md << 'EOL'
# Painel TDAH

Painel de gerenciamento para pessoas com TDAH, construído com Next.js 14, TypeScript, Shadcn UI e Tailwind CSS.

## Tecnologias

- Next.js 14 (App Router)
- TypeScript
- Shadcn UI
- Tailwind CSS
- Supabase

## Estrutura do Projeto

```
src/
  ├── app/           # Rotas e layouts do Next.js
  ├── components/    # Componentes React
  │   ├── ui/       # Componentes base (Shadcn)
  │   ├── widgets/  # Widgets reutilizáveis
  │   ├── layouts/  # Layouts da aplicação
  │   └── features/ # Componentes específicos
  ├── lib/          # Utilitários e hooks
  └── types/        # Tipos TypeScript
```

## Desenvolvimento

1. Clone o repositório
2. Instale as dependências: `npm install`
3. Inicie o servidor: `npm run dev`

## Scripts

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera build de produção
- `npm run start`: Inicia o servidor de produção
- `npm run lint`: Executa o linter
- `npm run format`: Formata o código
EOL

echo "Adaptação do projeto concluída com sucesso!" 