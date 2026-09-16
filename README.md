# Finanças Control — Backend

API (NestJS + TypeORM + PostgreSQL) para o controle financeiro pessoal. Cobre lançamentos
(transações, com parcelamento automático), saldos por fonte de renda, gastos fixos,
recorrências (com geração automática de transações) e um resumo mensal agregado (dashboard).

## Arquitetura

Cada módulo em `src/modules/<feature>` segue o mesmo recorte:

```
<feature>/
  domain/           # entidades e regras de negócio puras (sem NestJS/TypeORM)
  application/
    dto/            # DTOs de entrada, validados com class-validator
    use-cases/      # um caso de uso por operação, only depende do port do domínio
  infrastructure/
    <feature>.orm-entity.ts       # entidade TypeORM (detalhe de persistência)
    <feature>.mapper.ts           # ORM entity <-> entidade de domínio
    <feature>.typeorm.repository.ts  # implementação do port de repositório
  <feature>.controller.ts   # só chama use-cases
  <feature>.response.dto.ts # forma pública da resposta HTTP
  <feature>.module.ts       # liga o port do domínio à implementação TypeORM via DI
```

`src/modules/common/` guarda o que é cross-cutting (filtro global de exceções, paginação
opcional, contrato base de repositório). `src/modules/config/env.validation.ts` valida as
variáveis de ambiente obrigatórias no boot.

## Setup

```bash
cp .env.example .env   # preencha as credenciais do Postgres
npm install
npm run start:dev
```

Documentação interativa da API em `http://localhost:3000/api` (Swagger).

## Migrations

O schema já existente foi criado manualmente; a partir desta limpeza, mudanças de schema
passam por migrations do TypeORM:

```bash
npm run migration:run       # aplica migrations pendentes
npm run migration:generate -- src/migrations/NomeDaMigration
npm run migration:revert
```

## Testes

```bash
npm test        # unitários — regras de domínio e use-cases com repositórios em memória
npm run test:e2e  # HTTP (controller + pipes + filtro de exceção) com repositórios fake,
                   # não requer um Postgres real
npm run test:cov
```

## Automação de recorrências

Recorrências com `valorPadrao` e `cartaoPadrao` definidos geram uma transação automaticamente
todo mês (job diário, ver `RecorrenciasScheduler`). Recorrências sem esses campos continuam
exigindo lançamento manual (endpoint usado pelo modal "Contas Recorrentes" do frontend).
