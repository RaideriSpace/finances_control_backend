import { GerarTransacoesRecorrentesUseCase } from './gerar-transacoes-recorrentes.use-case';
import { Recorrencia } from '../../domain/recorrencia.entity';

function recorrencia(overrides: Partial<Recorrencia>): Recorrencia {
  return {
    id: 'rec-1',
    compra: 'Aluguel',
    acao: 'pagamento',
    classificacao_1: 'Moradia',
    classificacao_2: null,
    tipo: 'debito',
    parcelamento: 1,
    parcela: 1,
    local: null,
    valorPadrao: 1200,
    cartaoPadrao: 'nubank',
    ultimaGeracao: null,
    ...overrides,
  };
}

function criarUseCase(recorrencias: Recorrencia[]) {
  const recorrenciaRepository = {
    findAll: jest.fn().mockResolvedValue(recorrencias),
    updateFields: jest.fn().mockResolvedValue(null),
  };
  const transacaoRepository = {
    createMany: jest.fn().mockResolvedValue([]),
  };
  const useCase = new GerarTransacoesRecorrentesUseCase(
    recorrenciaRepository as never,
    transacaoRepository as never,
  );
  return { useCase, recorrenciaRepository, transacaoRepository };
}

describe('GerarTransacoesRecorrentesUseCase', () => {
  const referencia = new Date(2026, 8, 15); // 2026-09-15

  it('gera transação para recorrência elegível nunca gerada', async () => {
    const { useCase, transacaoRepository, recorrenciaRepository } =
      criarUseCase([recorrencia({})]);

    const geradas = await useCase.execute(referencia);

    expect(geradas).toBe(1);
    expect(transacaoRepository.createMany).toHaveBeenCalledTimes(1);
    expect(recorrenciaRepository.updateFields).toHaveBeenCalledWith('rec-1', {
      ultimaGeracao: '2026-09-01',
    });
  });

  it('não duplica quando já gerada no mês de referência', async () => {
    const { useCase, transacaoRepository } = criarUseCase([
      recorrencia({ ultimaGeracao: '2026-09-01' }),
    ]);

    const geradas = await useCase.execute(referencia);

    expect(geradas).toBe(0);
    expect(transacaoRepository.createMany).not.toHaveBeenCalled();
  });

  it('pula recorrências sem valorPadrao/cartaoPadrao definidos', async () => {
    const { useCase, transacaoRepository } = criarUseCase([
      recorrencia({ valorPadrao: null }),
      recorrencia({ id: 'rec-2', cartaoPadrao: null }),
    ]);

    const geradas = await useCase.execute(referencia);

    expect(geradas).toBe(0);
    expect(transacaoRepository.createMany).not.toHaveBeenCalled();
  });

  it('processa múltiplas recorrências elegíveis no mesmo run', async () => {
    const { useCase, transacaoRepository } = criarUseCase([
      recorrencia({ id: 'rec-1' }),
      recorrencia({ id: 'rec-2', ultimaGeracao: '2026-08-01' }),
    ]);

    const geradas = await useCase.execute(referencia);

    expect(geradas).toBe(2);
    expect(transacaoRepository.createMany).toHaveBeenCalledTimes(2);
  });
});
