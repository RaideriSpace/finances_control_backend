import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { randomUUID } from 'crypto';
import { GastosFixosController } from '../src/modules/gastos-fixos/gastos-fixos.controller';
import { GASTO_FIXO_REPOSITORY } from '../src/modules/gastos-fixos/domain/gasto-fixo.repository';
import {
  GastoFixo,
  NovoGastoFixo,
} from '../src/modules/gastos-fixos/domain/gasto-fixo.entity';
import { ListarGastosFixosUseCase } from '../src/modules/gastos-fixos/application/use-cases/listar-gastos-fixos.use-case';
import { BuscarGastoFixoUseCase } from '../src/modules/gastos-fixos/application/use-cases/buscar-gasto-fixo.use-case';
import { CriarGastoFixoUseCase } from '../src/modules/gastos-fixos/application/use-cases/criar-gasto-fixo.use-case';
import { AtualizarGastoFixoUseCase } from '../src/modules/gastos-fixos/application/use-cases/atualizar-gasto-fixo.use-case';
import { RemoverGastoFixoUseCase } from '../src/modules/gastos-fixos/application/use-cases/remover-gasto-fixo.use-case';

class FakeGastoFixoRepository {
  private itens: GastoFixo[] = [];

  findAll(): Promise<GastoFixo[]> {
    return Promise.resolve(this.itens);
  }

  findById(id: string): Promise<GastoFixo | null> {
    return Promise.resolve(this.itens.find((item) => item.id === id) ?? null);
  }

  create(dto: NovoGastoFixo): Promise<GastoFixo> {
    const criado: GastoFixo = { id: randomUUID(), ...dto };
    this.itens.push(criado);
    return Promise.resolve(criado);
  }

  async updateFields(
    id: string,
    partial: Partial<Omit<GastoFixo, 'id'>>,
  ): Promise<GastoFixo | null> {
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

describe('GastosFixosController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    // Monta o slice de HTTP (controller + use-cases) sem passar pelo
    // TypeOrmModule.forFeature do módulo real — evita depender de uma
    // conexão de banco de dados neste teste de integração da camada HTTP.
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [GastosFixosController],
      providers: [
        { provide: GASTO_FIXO_REPOSITORY, useClass: FakeGastoFixoRepository },
        ListarGastosFixosUseCase,
        BuscarGastoFixoUseCase,
        CriarGastoFixoUseCase,
        AtualizarGastoFixoUseCase,
        RemoverGastoFixoUseCase,
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

  it('persiste nome e valor ao criar (regressão do bug de DTO sem validação)', async () => {
    const resposta = await request(app.getHttpServer())
      .post('/gastos-fixos')
      .send({ nome: 'Aluguel', valor: 1200.5 })
      .expect(201);

    const corpo = resposta.body as GastoFixo;
    expect(corpo.nome).toBe('Aluguel');
    expect(corpo.valor).toBe(1200.5);

    const listagem = await request(app.getHttpServer())
      .get('/gastos-fixos')
      .expect(200);
    expect(listagem.body).toHaveLength(1);
  });

  it('rejeita payload sem os campos obrigatórios', async () => {
    await request(app.getHttpServer())
      .post('/gastos-fixos')
      .send({})
      .expect(400);
  });

  it('retorna 404 ao buscar um ID inexistente', async () => {
    await request(app.getHttpServer())
      .get('/gastos-fixos/00000000-0000-0000-0000-000000000000')
      .expect(404);
  });
});
