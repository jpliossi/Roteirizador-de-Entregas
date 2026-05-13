import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface RotaCalculada {
  ordem_ids: string[];
  distancia_total: number;
  tempo_estimado: number;
}

export const RoutingApiService = {
  async calcularRota(veiculoId: string, enderecosIds: any[]): Promise<RotaCalculada> {
    const response = await api.post('/rotas/calcular', {
      veiculo_id: veiculoId,
      enderecos_ids: enderecosIds,
    });
    return response.data;
  },

  async atribuirRota(veiculoId: string, ordemIds: string[]): Promise<any> {
    const response = await api.post('/rotas/atribuir', {
      veiculo_id: veiculoId,
      enderecos_ids: ordemIds,
    });
    return response.data;
  },
};
