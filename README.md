# Painel TDAH

Painel de controle pessoal adaptado para pessoas com TDAH, com foco em organização e produtividade.

## Tecnologias Utilizadas

- Next.js 14
- React 18
- Material UI
- TypeScript
- Vercel (Deploy)

## Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## Configuração do Ambiente de Desenvolvimento

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd painel-v2
```

2. Instale as dependências:
```bash
npm install
# ou
yarn
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```
Edite o arquivo `.env.local` com suas configurações.

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000)

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria a build de produção
- `npm run start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter

## Deploy na Vercel

1. Crie uma conta na [Vercel](https://vercel.com)
2. Instale a CLI da Vercel:
```bash
npm i -g vercel
```

3. Faça login na Vercel:
```bash
vercel login
```

4. Deploy:
```bash
vercel
```

Para fazer deploy em produção:
```bash
vercel --prod
```

## Estrutura do Projeto

```
painel-v2/
├── src/
│   ├── app/           # Rotas e layouts
│   ├── components/    # Componentes React
│   └── types/        # Definições de tipos TypeScript
├── public/           # Arquivos estáticos
└── ...
```

## Boas Práticas

- Mantenha os componentes pequenos e focados
- Use TypeScript para type safety
- Siga o padrão de commits convencional
- Documente alterações significativas

## Contribuição

1. Crie um branch: `git checkout -b feature/nome-da-feature`
2. Commit suas mudanças: `git commit -m 'feat: Adiciona nova feature'`
3. Push para o branch: `git push origin feature/nome-da-feature`
4. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. 