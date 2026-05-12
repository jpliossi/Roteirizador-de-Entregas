import { jest } from '@jest/globals';

// Mock do Axios
jest.unstable_mockModule('axios', () => ({
  default: {
    put: jest.fn()
  }
}));

// Mock do Prisma
const mockPrisma = {
  rota: {
    create: jest.fn()
  }
};

jest.unstable_mockModule('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma)
}));

jest.unstable_mockModule('@prisma/adapter-pg', () => ({
  PrismaPg: jest.fn()
}));

jest.unstable_mockModule('pg', () => ({
  default: {
    Pool: jest.fn().mockImplementation(() => ({
      on: jest.fn(),
      connect: jest.fn()
    }))
  }
}));

const { RouteService } = await import('../src/services/RouteService.js');
const axios = (await import('axios')).default;

describe('RouteService', () => {
  let service: any;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new RouteService();
  });

  describe('calculateDistance', () => {
    it('deve calcular a distância euclidiana corretamente entre dois pontos', () => {
      const p1 = { latitude: 0, longitude: 0 };
      const p2 = { latitude: 3, longitude: 4 };
      // Distância de (0,0) a (3,4) é sqrt(3^2 + 4^2) = 5
      const dist = (service as any).calculateDistance(p1, p2);
      expect(dist).toBe(5);
    });
  });

  describe('calculateRoute', () => {
    it('deve ordenar os endereços por proximidade (ponto a ponto)', async () => {
      const enderecos = [
        { id: '1', latitude: 0, longitude: 0 },
        { id: '3', latitude: 10, longitude: 10 },
        { id: '2', latitude: 1, longitude: 1 },
      ];

      mockPrisma.rota.create.mockResolvedValue({
        id: 'r-calc-1',
        veiculo_id: 'veic-1',
        endereco_ids: ['1', '2', '3']
      } as any);

      const result = await service.calculateRoute('veic-1', enderecos);

      expect(result.ordem_sugerida[0].id).toBe('1');
      expect(result.ordem_sugerida[1].id).toBe('2');
      expect(result.ordem_sugerida[2].id).toBe('3');
      expect(result.id).toBe('r-calc-1');
    });

    it('deve retornar lista vazia se não houver endereços', async () => {
      const result = await service.calculateRoute('veic-1', []);
      expect(result).toEqual([]);
    });
  });

  describe('efetivarRota', () => {
    it('deve salvar a rota e chamar o management-api com sucesso (200)', async () => {
      const veiculo_id = 'v1';
      const endereco_ids = ['e1', 'e2'];

      mockPrisma.rota.create.mockResolvedValue({
        id: 'r1',
        veiculo_id,
        endereco_ids
      } as any);

      (axios.put as any).mockResolvedValue({ status: 200 });

      const result = await service.efetivarRota(veiculo_id, endereco_ids);

      expect(mockPrisma.rota.create).toHaveBeenCalledWith({
        data: { veiculo_id, endereco_ids }
      });
      expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining('/enderecos/atualizar_status'),
        { endereco_ids }
      );
      expect(result.rota_id).toBe('r1');
    });

    it('deve lançar erro se a chamada ao management-api falhar (500)', async () => {
      mockPrisma.rota.create.mockResolvedValue({ id: 'r1' } as any);
      (axios.put as any).mockRejectedValue(new Error('Internal Server Error'));

      await expect(service.efetivarRota('v1', ['e1'])).rejects.toThrow('Internal Server Error');
    });
  });
});
