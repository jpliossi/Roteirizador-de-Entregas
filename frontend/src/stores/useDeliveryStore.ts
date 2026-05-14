import { defineStore } from 'pinia';
import { ManagementApiService, type Endereco, type Veiculo, type Motorista } from '../services/ManagementApiService';
import { RoutingApiService, type RotaCalculada } from '../services/RoutingApiService';

export const useDeliveryStore = defineStore('delivery', {
  state: () => ({
    enderecos: [] as Endereco[],
    veiculos: [] as Veiculo[],
    motoristas: [] as Motorista[],
    selectedEnderecoIds: [] as number[],
    selectedVeiculoId: null as number | null,
    previewRota: null as RotaCalculada | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    toggleEnderecoSelection(id: number) {
      const index = this.selectedEnderecoIds.indexOf(id);
      if (index === -1) {
        this.selectedEnderecoIds.push(id);
      } else {
        this.selectedEnderecoIds.splice(index, 1);
      }
    },
    async fetchEnderecos() {
      this.loading = true; 
      try {
        this.enderecos = await ManagementApiService.getEnderecos();
        this.error = null;
      } catch (err: any) {
        this.error = 'Erro ao carregar endereços: ' + (err.message || '');
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
        this.error = 'Erro ao carregar veículos: ' + (err.message || '');
      } finally {
        this.loading = false;
      }
    },

    async fetchMotoristas() {
      this.loading = true;
      try {
        this.motoristas = await ManagementApiService.getMotoristas();
        this.error = null;
      } catch (err: any) {
        this.error = 'Erro ao carregar motoristas: ' + (err.message || '');
      } finally {
        this.loading = false;
      }
    },

    async loadInitialData() {
      await Promise.all([this.fetchEnderecos(), this.fetchVeiculos(), this.fetchMotoristas()]);
    },

    async addMotorista(motorista: Motorista) {
      this.loading = true;
      try {
        await ManagementApiService.createMotorista(motorista);
        await this.fetchMotoristas();
      } catch (err: any) {
        this.error = 'Erro ao criar motorista: ' + (err.message || '');
      } finally {
        this.loading = false;
      }
    },

    async addEndereco(endereco: Endereco) {
      this.loading = true;
      try {
        await ManagementApiService.createEndereco(endereco);
        await this.fetchEnderecos(); // Recarrega a lista oficial do servidor
        } catch (err: any) {
        this.error = 'Erro ao criar endereco: ' + (err.message || '');
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
        // 1. Transformamos os IDs selecionados em objetos com coordenadas
        const enderecosComCoordenadas = this.enderecos
          .filter(e => this.selectedEnderecoIds.includes(e.id!))
          .map(e => ({
            id: e.id!.toString(),
            latitude: e.latitude,
            longitude: e.longitude
          }));

        // 2. Enviamos os objetos completos para o Node.js
        this.previewRota = await RoutingApiService.calcularRota(
          this.selectedVeiculoId.toString(),
          enderecosComCoordenadas as any // Enviando o array de objetos {id, lat, lng}
        );
        
        this.error = null;
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
      return state.veiculos.map(v => {
        const rotas = state.enderecos.filter(e => {
          // Log para você ver no console se os IDs estão batendo
          // console.log(`Comparando Endereco ${e.veiculo_id} com Veiculo ${v.id}`);
          
          const statusMatch = e.status === 'em rota' || e.status === 'em_rota';
          const veiculoMatch = String(e.veiculo_id) === String(v.id); // Força ambos para String
          
          return statusMatch && veiculoMatch;
        });

        return {
          ...v,
          enderecosAtribuidos: rotas,
          motorista: state.motoristas.find(m => String(m.id) === String(v.motorista_id))
        };
      });
    }
  }
});


