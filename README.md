# Ilha Classificados

Protótipo de marketplace para a Cidade Universitária, na Ilha do Fundão, com foco no CEP 21941-000.

## Funcionalidades

- Anúncios, busca por categoria, favoritos e publicação de itens.
- Ordens de serviço, propostas, chat e denúncia de anúncios.
- Dados de demonstração e persistência local no navegador.

## Executar localmente

Node.js e npm.

Na raiz do projeto, execute:

```bash
npm install
npm run dev
```

Abra o endereço exibido pelo Vite. Explore os anúncios de exemplo ou publique um anúncio para testar o fluxo no navegador.

## Comandos

- `npm run lint` — Verifica os tipos do TypeScript.
- `npm run build` — Gera a versão de distribuição.
- `npm run preview` — Pré-visualiza o build do Vite.

## Arquivos de referência

- [Estado e persistência](src/context/ClassifiedsContext.tsx)
- [Dados de demonstração](src/data/seedData.ts)
