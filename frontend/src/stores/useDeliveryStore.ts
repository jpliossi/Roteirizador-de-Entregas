import { defineStore } from 'pinia';
import { ManagementApiService, type Endereco, type Veiculo, type Motorista } from '../services/ManagementApiService';
import { RoutingApiService } from '../services/RoutingApiService';

export const useDeliveryStore = defineStore('delivery', {
  state: () => ({
    enderecos: [] as Endereco[],
    veiculos: [] as Veiculo[],
    motoristas: [] as Motorista[],
    selectedEnderecoIds: [] as string[],
    selectedVeiculoId: null as string | null,
    results: null as any | null,
    loading: false,
    searchQuery: '',
    finalizedRoutes: [] as any[], // Historico para relatório
  }),

  getters: {
    // Filtro e Ordenação (Pendentes primeiro)
    filteredEnderecos: (state) => {
      let list = state.enderecos;
      
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        list = list.filter(e => 
          e.rua.toLowerCase().includes(query) || 
          e.bairro.toLowerCase().includes(query) ||
          e.cidade.toLowerCase().includes(query)
        );
      }

      return [...list].sort((a, b) => {
        if (a.status === 'pendente' && b.status !== 'pendente') return -1;
        if (a.status !== 'pendente' && b.status === 'pendente') return 1;
        return 0;
      });
    },

    // Apenas pendentes e em rota para Dashboard
    operationalEnderecos: (state) => {
      return state.enderecos.filter(e => e.status === 'pendente' || e.status === 'em rota');
    },

    filteredVeiculos: (state) => {
      if (!state.searchQuery) return state.veiculos;
      const query = state.searchQuery.toLowerCase();
      return state.veiculos.filter(v => 
        v.placa.toLowerCase().includes(query) || 
        v.modelo.toLowerCase().includes(query)
      );
    },

    filteredMotoristas: (state) => {
      if (!state.searchQuery) return state.motoristas;
      const query = state.searchQuery.toLowerCase();
      return state.motoristas.filter(m => 
        m.nome.toLowerCase().includes(query) || 
        m.cpf.includes(query)
      );
    }
  },

  actions: {
    async loadInitialData() {
      this.loading = true;
      try {
        await Promise.all([
          this.fetchEnderecos(),
          this.fetchVeiculos(),
          this.fetchMotoristas()
        ]);
      } finally {
        this.loading = false;
      }
    },

    async fetchEnderecos() {
      this.enderecos = await ManagementApiService.getEnderecos();
    },

    async fetchVeiculos() {
      this.veiculos = await ManagementApiService.getVeiculos();
    },

    async fetchMotoristas() {
      this.motoristas = await ManagementApiService.getMotoristas();
    },

    async addEndereco(dados: any) {
      const res = await ManagementApiService.createEndereco(dados);
      this.enderecos.push(res);
      return res;
    },

    async addVeiculo(veiculo: any) {
      const res = await ManagementApiService.createVeiculo(veiculo);
      await this.fetchVeiculos();
      return res;
    },

    async addMotorista(motorista: any) {
      const res = await ManagementApiService.createMotorista(motorista);
      await this.fetchMotoristas();
      return res;
    },

    toggleEnderecoSelection(id: string) {
      const idx = this.selectedEnderecoIds.indexOf(id);
      if (idx > -1) {
        this.selectedEnderecoIds.splice(idx, 1);
      } else {
        this.selectedEnderecoIds.push(id);
      }
    },

    toggleVeiculoSelection(id: string) {
      this.selectedVeiculoId = this.selectedVeiculoId === id ? null : id;
    },

    async removeMotorista(id: string) {
      await ManagementApiService.deleteMotorista(id);
      await this.fetchMotoristas();
    },

    async removeVeiculo(id: string) {
      await ManagementApiService.deleteVeiculo(id);
      await this.fetchVeiculos();
    },

    async calcularRota() {
      if (this.selectedEnderecoIds.length === 0 || !this.selectedVeiculoId) return;
      this.loading = true;
      try {
        const res = await RoutingApiService.calcularRota(
          this.selectedVeiculoId,
          this.enderecos.filter(e => e.id && this.selectedEnderecoIds.includes(e.id))
        );
        this.results = res;
      } finally {
        this.loading = false;
      }
    },

    async concluirRota(rotaId: any) {
      this.loading = true;
      try {
        if (this.selectedVeiculoId) {
          await ManagementApiService.concluirRota(this.selectedVeiculoId);
          // Adicionar ao relatório local (opcional)
          if (this.results) {
             this.finalizedRoutes.push({
               id: Date.now(),
               veiculo: this.veiculos.find(v => String(v.id) === this.selectedVeiculoId)?.placa,
               ...this.results,
               data: new Date().toLocaleString()
             });
          }
        }
        await this.fetchEnderecos();
        this.results = null;
        this.selectedEnderecoIds = [];
        this.selectedVeiculoId = null;
      } finally {
        this.loading = false;
      }
    }
  }
});