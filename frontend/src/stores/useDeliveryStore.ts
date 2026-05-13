import { defineStore } from 'pinia';
import { ManagementApiService, type Endereco, type Veiculo } from '../services/ManagementApiService';

export const useDeliveryStore = defineStore('delivery', {
  state: () => ({
    enderecos: [] as Endereco[],
    veiculos: [] as Veiculo[],
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchEnderecos() {
      this.loading = true;
      try {
        this.enderecos = await ManagementApiService.getEnderecos();
        this.error = null;
      } catch (err: any) {
        this.error = 'Erro ao carregar endereços: ' + (err.message || 'Erro desconhecido');
      } finally {
        this.loading = false;
      }
    },

    async fetchVeiculos() {
      this.loading = true;
      try {
        this.veiculos = await ManagementApiService.getVeiculos();
        this.error = null;
      } catch (err: any) {
        this.error = 'Erro ao carregar veículos: ' + (err.message || 'Erro desconhecido');
      } finally {
        this.loading = false;
      }
    },

    async loadInitialData() {
      await Promise.all([this.fetchEnderecos(), this.fetchVeiculos()]);
    }
  },

  getters: {
    getEnderecoById: (state) => (id: number) => {
      return state.enderecos.find(e => e.id === id);
    },
    getVeiculoById: (state) => (id: number) => {
      return state.veiculos.find(v => v.id === id);
    }
  }
});
