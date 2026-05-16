import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface RotaCalculada {
  veiculo_id: string;
  ordem_ids: string[];
  distancia_total: number; 
  tempo_estimado: number;  
  ordem_sugerida?: any[];
}

export const RoutingApiService = {
  async calcularRota(veiculoId: string, enderecos: any[]): Promise<any> {
    const response = await api.post('/rotas/calcular', {
      veiculo_id: veiculoId,
      enderecos: enderecos, // Enviando os objetos completos {id, lat, lng}
    });
    
    return {
      ordem_ids: response.data.ordem_sugerida.map((e: any) => e.id),
      ordem_sugerida: response.data.ordem_sugerida,
      distancia_total: response.data.distancia_total,
      tempo_estimado: response.data.tempo_estimado
    };
  },
  

  async atribuirRota(veiculoId: string, ordemIds: string[]): Promise<any> {
    const response = await api.post('/rotas/atribuir', {
      veiculo_id: veiculoId,
      ordem_ids: ordemIds,
    });
    return response.data;
  },

  async geRotaPorVeiculo(veiculoId: string): Promise<any> {
    const response = await api.get(`/rotas/veiculo/${veiculoId}`);
    return response.data;
  },
};
