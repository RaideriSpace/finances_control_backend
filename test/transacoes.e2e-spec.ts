import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { randomUUID } from 'crypto';
import { TransacoesController } from '../src/modules/transacoes/transacoes.controller';
import { TRANSACAO_REPOSITORY } from '../src/modules/transacoes/domain/transacao.repository';
import {
  NovaTransacao,
  Transacao,
} from '../src/modules/transacoes/domain/transacao.entity';
import { ListarTransacoesUseCase } from '../src/modules/transacoes/application/use-cases/listar-transacoes.use-case';
import { BuscarTransacaoUseCase } from '../src/modules/transacoes/application/use-cases/buscar-transacao.use-case';
import { CriarTransacaoUseCase } from '../src/modules/transacoes/application/use-cases/criar-transacao.use-case';
import { AtualizarTransacaoUseCase } from '../src/modules/transacoes/application/use-cases/atualizar-transacao.use-case';
import { RemoverTransacaoUseCase } from '../src/modules/transacoes/application/use-cases/remover-transacao.use-case';

class FakeTransacaoRepository {
  private itens: Transacao[] = [];

  findAll(): Promise<Transacao[]> {
    return Promise.resolve(this.itens);
  }

  findById(id: string): Promise<Transacao | null> {
    return Promise.resolve(this.itens.find((item) => item.id === id) ?? null);
  }

  findByName(nome: string): Promise<Transacao[]> {
    return Promise.resolve(
      this.itens.filter((item) => item.compra.includes(nome)),
    );
  }

  createMany(transacoes: NovaTransacao[]): Promise<Transacao[]> {
    const criadas = transacoes.map((transacao) => ({
      id: randomUUID(),
      ...transacao,
    }));
    this.itens.push(...criadas);
    return Promise.resolve(criadas);
  }

  async updateFields(
    id: string,
    partial: Partial<Omit<Transacao, 'id'>>,
  ): Promise<Transacao | null> {
    const item = await this.findById(id);
    if (!item) return null;
    Object.assign(item, partial);
    return item;
  }

  delete(id: string): Promise<boolean> {
    const tamanhoAntes = this.itens.length;
    this.itens = this.itens.filter((item) => item.id !== id);
    return Promise.resolve(this.itens.length < tamanhoAntes);
  }
}

describe('TransacoesController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    // Monta o slice de HTTP (controller + use-cases) sem passar pelo
    // TypeOrmModule.forFeature do módulo real — evita depender de uma
    // conexão de banco de dados neste teste de integração da camada HTTP.
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [TransacoesController],
      providers: [
        { provide: TRANSACAO_REPOSITORY, useClass: FakeTransacaoRepository },
        ListarTransacoesUseCase,
        BuscarTransacaoUseCase,
        CriarTransacaoUseCase,
        AtualizarTransacaoUseCase,
        RemoverTransacaoUseCase,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const payloadBase = {
    compra: 'Notebook',
    acao: 'compra',
    classificacao_1: 'Eletrônicos',
    cartao: 'nubank',
    tipo: 'credito',
    parcelamento: 3,
    parcela: 1,
    valor: 300,
    data_inicio: '2026-04-20',
  };

  it('cria uma transação parcelada expandindo em N linhas', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/transacoes')
      .send(payloadBase)
      .expect(201);

    const corpo = resposta.body as Transacao[];
    expect(corpo).toHaveLength(3);
    expect(corpo.map((t) => t.data_pagamento)).toEqual([
      '2026-04-20',
      '2026-05-05',
      '2026-06-05',
    ]);
  });

  it('atualiza a data de pagamento da parcela ao mudar data_inicio', async () => {
    const criacao = await request(app.getHttpServer())
      .post('/transacoes')
      .send({ ...payloadBase, parcelamento: 1, tipo: 'debito' })
      .expect(201);

    const [transacao] = criacao.body as Transacao[];

    const atualizacao = await request(app.getHttpServer())
      .patch(`/transacoes/${transacao.id}`)
      .send({ data_inicio: '2026-05-10' })
      .expect(200);

    expect((atualizacao.body as Transacao).data_pagamento).toBe('2026-05-10');
  });

  it('retorna 404 ao remover um ID inexistente', async () => {
    await request(app.getHttpServer())
      .delete('/transacoes/00000000-0000-0000-0000-000000000000')
      .expect(404);
  });

  it('rejeita transferência sem conta de destino', async () => {
    await request(app.getHttpServer())
      .post('/transacoes')
      .send({
        ...payloadBase,
        acao: 'transferência',
        tipo: 'debito',
        parcelamento: 1,
      })
      .expect(400);
  });

  it('rejeita transferência com destino igual à origem', async () => {
    await request(app.getHttpServer())
      .post('/transacoes')
      .send({
        ...payloadBase,
        acao: 'transferência',
        tipo: 'debito',
        parcelamento: 1,
        cartao: 'nubank',
        cartaoDestino: 'nubank',
      })
      .expect(400);
  });

  it('rejeita transferência como crédito', async () => {
    await request(app.getHttpServer())
      .post('/transacoes')
      .send({
        ...payloadBase,
        acao: 'transferência',
        tipo: 'credito',
        parcelamento: 1,
        cartao: 'nubank',
        cartaoDestino: 'inter',
      })
      .expect(400);
  });

  it('cria transferência como duas linhas: saída na origem e depósito no destino', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/transacoes')
      .send({
        ...payloadBase,
        acao: 'transferência',
        tipo: 'debito',
        parcelamento: 1,
        cartao: 'nubank',
        cartaoDestino: 'inter',
        valor: 250,
        data_inicio: '2026-04-20',
      })
      .expect(201);

    const corpo = resposta.body as Transacao[];
    expect(corpo).toHaveLength(2);

    const saida = corpo.find((t) => t.acao === 'transferência');
    const entrada = corpo.find((t) => t.acao === 'depósito');

    expect(saida?.cartao).toBe('nubank');
    expect(saida?.cartaoDestino).toBe('inter');
    expect(saida?.valor).toBe(250);
    expect(saida?.data_pagamento).toBe('2026-04-20');

    expect(entrada?.cartao).toBe('inter');
    expect(entrada?.cartaoDestino).toBeNull();
    expect(entrada?.valor).toBe(250);
    expect(entrada?.data_pagamento).toBe('2026-04-20');
  });

  it('rejeita pagamento de fatura sem conta de destino', async () => {
    await request(app.getHttpServer())
      .post('/transacoes')
      .send({
        ...payloadBase,
        acao: 'pagamento',
        tipo: 'debito',
        parcelamento: 1,
      })
      .expect(400);
  });

  it('permite pagamento de fatura com a mesma conta na origem e no destino (débito e crédito do mesmo banco)', async () => {
    await request(app.getHttpServer())
      .post('/transacoes')
      .send({
        ...payloadBase,
        acao: 'pagamento',
        tipo: 'debito',
        parcelamento: 1,
        cartao: 'nubank',
        cartaoDestino: 'nubank',
      })
      .expect(201);
  });

  it('cria pagamento de fatura como duas linhas: saída débito na origem e depósito crédito no destino', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/transacoes')
      .send({
        ...payloadBase,
        acao: 'pagamento',
        tipo: 'debito',
        parcelamento: 1,
        cartao: 'inter',
        cartaoDestino: 'nubank',
        valor: 400,
        data_inicio: '2026-04-25',
      })
      .expect(201);

    const corpo = resposta.body as Transacao[];
    expect(corpo).toHaveLength(2);

    const saida = corpo.find((t) => t.acao === 'pagamento');
    const entrada = corpo.find((t) => t.acao === 'depósito');

    expect(saida?.cartao).toBe('inter');
    expect(saida?.tipo).toBe('debito');
    expect(saida?.cartaoDestino).toBe('nubank');
    expect(saida?.valor).toBe(400);

    expect(entrada?.cartao).toBe('nubank');
    expect(entrada?.tipo).toBe('credito');
    expect(entrada?.cartaoDestino).toBeNull();
    expect(entrada?.valor).toBe(400);
    expect(entrada?.data_pagamento).toBe('2026-04-25');
  });
});
