import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Endereco {
  id?: number;
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
  cep: string;
  bairro: string;
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
  motorista_id?: number;
}

export interface Motorista {
  id?: number;
  nome: string;
  cpf: string;
}

export const GeocodingService = {
  async buscarEnderecoPorCEP(cep: string) {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) throw new Error("CEP Inválido");

    // 1. Busca dados do endereço
    const viaCepRes = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const addressData = await viaCepRes.json();

    if (addressData.erro) throw new Error("CEP não encontrado");

    // 2. Busca Latitude e Longitude usando os dados do ViaCEP
    // Formatamos a query: "Rua, Bairro, Cidade, Estado"
    const query = `${addressData.logradouro}, ${addressData.localidade}, Brazil`;
    const nominatimRes = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
    );
    const geoData = await nominatimRes.json();

    return {
      rua: addressData.logradouro,
      bairro: addressData.bairro,
      cidade: addressData.localidade,
      estado: addressData.uf,
      // Se o Nominatim não achar, usamos uma coordenada padrão de Campo Grande como fallback
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
        status: dados.status || 'Pendente', // status padrão como 'Pendente'
        veiculo_id: dados.veiculo_id || null, // pode ser null inicialmente
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
    const response = await api.post('/veiculos', { veiculo });
    return response.data;
  },

  async createMotorista(motorista: Motorista): Promise<Motorista> {
    const response = await api.post('/motoristas', { motorista });
    return response.data;
  },

  async updateEnderecoStatus(id: number, status: string, veiculoId?: number): Promise<Endereco> {
    const response = await api.patch(`/enderecos/${id}`, {
      endereco: { status, veiculo_id: veiculoId }
    });
    return response.data;
  }
  
};
