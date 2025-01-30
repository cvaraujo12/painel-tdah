# Painel TDAH

Sistema de gerenciamento de tarefas e acompanhamento para pessoas com TDAH.

## 🚀 Tecnologias

- Next.js 14 (App Router)
- TypeScript
- Shadcn UI
- Tailwind CSS
- NextAuth.js
- Prisma
- PostgreSQL

## 📋 Requisitos

- Node.js 18+
- npm ou yarn
- PostgreSQL

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/painel-tdah.git
cd painel-tdah
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

4. Execute as migrações do banco de dados:
```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 🧪 Testes

### Testes Unitários
```bash
npm test
```

### Testes E2E
```bash
npm run test:e2e
```

## 📦 Deploy

O deploy é feito automaticamente na Vercel através do GitHub Actions quando há push na branch main.

## 🏗️ Arquitetura

```
src/
├── app/              # Rotas e páginas
├── components/       # Componentes React
├── hooks/           # Hooks customizados
├── lib/             # Bibliotecas e configurações
├── types/           # Tipos TypeScript
└── utils/           # Funções utilitárias
```

## 🔒 Segurança

- Autenticação via NextAuth.js
- Headers de segurança via middleware
- Sanitização de inputs
- Proteção contra CSRF
- Rate limiting

## 📈 Monitoramento

- Vercel Analytics
- Sentry para rastreamento de erros
- Logs estruturados
- Métricas de performance

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
