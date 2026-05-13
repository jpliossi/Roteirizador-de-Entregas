import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Endereco {
  id?: number;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  latitude: number;
  longitude: number;
  status?: string;
  veiculo_id?: number;
}

export interface Veiculo {
  id?: number;
  placa: string;
  modelo: string;
  capacidade: number;
  motorista_id: number;
}

export const ManagementApiService = {
  async getEnderecos(): Promise<Endereco[]> {
    const response = await api.get('/enderecos');
    return response.data;
  },

  async getVeiculos(): Promise<Veiculo[]> {
    const response = await api.get('/veiculos');
    return response.data;
  },

  async createEndereco(endereco: Endereco): Promise<Endereco> {
    const payload = {
      ...endereco,
      rua: endereco.logradouro // Garante compatibilidade com campo 'rua' do Rails
    };
    const response = await api.post('/enderecos', { endereco: payload });
    return response.data;
  },

  async createVeiculo(veiculo: Veiculo): Promise<Veiculo> {
    const response = await api.post('/veiculos', { veiculo });
    return response.data;
  },

  async updateEnderecoStatus(id: number, status: string, veiculoId?: number): Promise<Endereco> {
    const response = await api.patch(`/enderecos/${id}`, {
      endereco: { status, veiculo_id: veiculoId }
    });
    return response.data;
  }
};
