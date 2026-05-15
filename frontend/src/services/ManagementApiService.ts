import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Endereco {
  id?: string;
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
  cep: string;
  bairro: string;
  latitude: number;
  longitude: number;
  status?: string;
  veiculo_id?: string;
}

export interface Veiculo {
  id?: string;
  placa: string;
  modelo: string;
  capacidade: number;
  motorista_id?: string;
  status?: string;
}

export interface Motorista {
  id?: string;
  nome: string;
  cpf: string;
}

export const GeocodingService = {
  async buscarEnderecoPorCEP(cep: string) {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) throw new Error("CEP Inválido");

    const viaCepRes = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const addressData = await viaCepRes.json();

    if (addressData.erro) throw new Error("CEP não encontrado");

    const query = `${addressData.logradouro}, ${addressData.localidade}, Brazil`;
    const nominatimRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
    const geoData = await nominatimRes.json();

    return {
      rua: addressData.logradouro,
      bairro: addressData.bairro,
      cidade: addressData.localidade,
      estado: addressData.uf,
      latitude: geoData.length > 0 ? parseFloat(geoData[0].lat) : -20.46,
      longitude: geoData.length > 0 ? parseFloat(geoData[0].lon) : -54.61
    };
  }
};

export const ManagementApiService = {
  async getEnderecos(): Promise<Endereco[]> {
    const response = await api.get('/enderecos');
    return response.data;
  },

  async getVeiculos(): Promise<Veiculo[]> {
    const response = await api.get('/veiculos');
    return response.data;
  },

  async getMotoristas(): Promise<Motorista[]> {
    const response = await api.get('/motoristas');
    return response.data;
  },

  async createEndereco(dados: any): Promise<Endereco> {
    const response = await api.post('/enderecos', {
      endereco: {
        status: dados.status || 'pendente',
        veiculo_id: dados.veiculo_id || null,
        rua: dados.rua,
        numero: dados.numero,
        bairro: dados.bairro,
        cidade: dados.cidade,
        estado: dados.estado,
        cep: dados.cep,
        latitude: dados.latitude,
        longitude: dados.longitude,
      }
    });
    return response.data;
  },

  async createVeiculo(veiculo: Veiculo): Promise<Veiculo> {
    const response = await api.post('/veiculos', { 
      veiculo: { ...veiculo, status: 'disponivel' } 
    });
    return response.data;
  },

  async createMotorista(motorista: Motorista): Promise<Motorista> {
    const response = await api.post('/motoristas', { motorista });
    return response.data;
  },

  async updateEnderecoStatus(id: string, status: string, veiculoId?: string): Promise<Endereco> {
    const response = await api.patch(/enderecos/ + id, {
      endereco: { status, veiculo_id: veiculoId }
    });
    return response.data;
  },

  async concluirRota(veiculoId: string): Promise<any> {
    const response = await api.put('/enderecos/atualizar_status', {
      veiculo_id: veiculoId,
      concluir: true
    });
    return response.data;
  }
};
