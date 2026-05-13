import { defineStore } from 'pinia';
import { ManagementApiService, type Endereco, type Veiculo } from '../services/ManagementApiService';
import { RoutingApiService, type RotaCalculada } from '../services/RoutingApiService';

export const useDeliveryStore = defineStore('delivery', {
  state: () => ({
    enderecos: [] as Endereco[],
    veiculos: [] as Veiculo[],
    selectedEnderecoIds: [] as number[],
    selectedVeiculoId: null as number | null,
    previewRota: null as RotaCalculada | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    toggleEnderecoSelection(id: number) {
      const index = this.selectedEnderecoIds.indexOf(id);
      if (index > -1) {
        this.selectedEnderecoIds.splice(index, 1);
      } else {
        this.selectedEnderecoIds.push(id);
      }
    },

    setVeiculoSelection(id: number | null) {
      this.selectedVeiculoId = id;
    },

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
    },

    async addEndereco(endereco: Endereco) {
      this.loading = true;
      try {
        await ManagementApiService.createEndereco(endereco);
        await this.fetchEnderecos(); // Recarrega a lista oficial do servidor
      } catch (err: any) {
        this.error = 'Erro ao criar endereço: ' + (err.message || '');
      } finally {
        this.loading = false;
      }
    },

    async addVeiculo(veiculo: Veiculo) {
      this.loading = true;
      try {
        await ManagementApiService.createVeiculo(veiculo);
        await this.fetchVeiculos(); // Recarrega a lista oficial do servidor
      } catch (err: any) {
        this.error = 'Erro ao criar veículo: ' + (err.message || '');
      } finally {
        this.loading = false;
      }
    },

    async calcularRotaTemporaria() {
      if (!this.selectedVeiculoId || this.selectedEnderecoIds.length === 0) {
        this.error = 'Selecione um veículo e pelo menos um endereço.';
        return;
      }

      this.loading = true;
      try {
        this.previewRota = await RoutingApiService.calcularRota(
          this.selectedVeiculoId.toString(),
          this.selectedEnderecoIds.map(id => id.toString())
        );
      } catch (err: any) {
        this.error = 'Erro ao calcular rota: ' + (err.message || '');
      } finally {
        this.loading = false;
      }
    },

    async confirmarAtribuicao() {
      if (!this.previewRota || !this.selectedVeiculoId) return;

      this.loading = true;
      try {
        // 1. Atribui no microserviço de roteamento (Prisma)
        await RoutingApiService.atribuirRota(
          this.selectedVeiculoId.toString(),
          this.previewRota.ordem_ids
        );

        // 2. Atualiza status no microserviço de gestão (Rails)
        // Idealmente seria um endpoint de batch update, mas faremos sequencial para este escopo
        await Promise.all(
          this.previewRota.ordem_ids.map(id => 
            ManagementApiService.updateEnderecoStatus(parseInt(id), 'em rota', this.selectedVeiculoId!)
          )
        );

        // 3. Limpa seleção e recarrega dados
        this.selectedEnderecoIds = [];
        this.selectedVeiculoId = null;
        this.previewRota = null;
        await this.fetchEnderecos();
      } catch (err: any) {
        this.error = 'Erro ao confirmar atribuição: ' + (err.message || '');
      } finally {
        this.loading = false;
      }
    }
  },

  getters: {
    getEnderecoById: (state) => (id: number) => {
      return state.enderecos.find(e => e.id === id);
    },
    getVeiculoById: (state) => (id: number) => {
      return state.veiculos.find(v => v.id === id);
    },
    enderecosPendentes: (state) => {
      return state.enderecos.filter(e => e.status === 'pendente' || !e.status);
    },
    veiculosComRotas: (state) => {
      return state.veiculos.map(v => ({
        ...v,
        enderecos: state.enderecos.filter(e => e.status === 'em rota' && (e as any).veiculo_id === v.id)
      }));
    }
  }
});
