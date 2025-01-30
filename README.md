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
