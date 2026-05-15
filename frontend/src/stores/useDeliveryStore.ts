import axios from 'axios';
import { defineStore } from 'pinia';
import { ManagementApiService, type Endereco, type Veiculo, type Motorista } from '../services/ManagementApiService';
import { RoutingApiService, type RotaCalculada } from '../services/RoutingApiService';

import { toast } from 'vue-sonner';

export const useDeliveryStore = defineStore('delivery', {
  state: () => ({
    enderecos: [] as Endereco[],
    veiculos: [] as Veiculo[],
    motoristas: [] as Motorista[],
    selectedEnderecoIds: [] as string[],
    selectedVeiculoId: null as string | null,
    previewRota: null as RotaCalculada | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    toggleEnderecoSelection(id: string) {
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

    async concluirRota(veiculoId: string) {
      this.loading = true;
      try {
        await ManagementApiService.concluirRota(veiculoId);
        await this.fetchEnderecos();
        await this.fetchVeiculos();
        toast.success('Rota concluída e veículo liberado!');
      } catch (err: any) {
        this.error = 'Erro ao concluir rota: ' + (err.message || '');
        toast.error('Erro ao concluir rota');
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
      const t = toast.loading('Credenciando motorista...');
      try {
        await ManagementApiService.createMotorista(motorista);
        await this.fetchMotoristas();
        toast.success('Motorista credenciado com sucesso', { id: t });
      } catch (err: any) {
        this.error = 'Erro ao criar motorista: ' + (err.message || '');
        toast.error(this.error, { id: t });
      } finally {
        this.loading = false;
      }
    },

    async addEndereco(endereco: Endereco) {
      this.loading = true;
      const t = toast.loading('Registrando pedido...');
      try {
        await ManagementApiService.createEndereco(endereco);
        await this.fetchEnderecos();
        toast.success('Pedido registrado no sistema', { id: t });
        } catch (err: any) {
        this.error = 'Erro ao criar endereco: ' + (err.message || '');
        toast.error(this.error, { id: t });
      } finally {
        this.loading = false;
      }
    },

    async addVeiculo(veiculo: Veiculo) {
      this.loading = true;
      const t = toast.loading('Incorporando veículo...');
      try {
        await ManagementApiService.createVeiculo(veiculo);
        await this.fetchVeiculos();
        toast.success('Veículo pronto para operação', { id: t });
      } catch (err: any) {
        this.error = 'Erro ao criar veículo: ' + (err.message || '');
        toast.error(this.error, { id: t });
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
        const enderecosComCoordenadas = this.enderecos
          .filter(e => this.selectedEnderecoIds.includes(e.id!))
          .map(e => ({
            id: String(e.id),
            latitude: Number(e.latitude),
            longitude: Number(e.longitude)
          }));

        if (enderecosComCoordenadas.length === 0) {
          this.error = 'Erro: IDs de endereço não encontrados.';
          return;
        }

        this.previewRota = await RoutingApiService.calcularRota(
          this.selectedVeiculoId,
          enderecosComCoordenadas
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
        await RoutingApiService.atribuirRota(
          this.selectedVeiculoId,
          this.previewRota.ordem_ids
        );

        await axios.put('http://localhost:3000/enderecos/atualizar_status', {
           endereco_ids: this.previewRota.ordem_ids,
           veiculo_id: this.selectedVeiculoId
        });

        this.selectedEnderecoIds = [];
        this.selectedVeiculoId = null;
        this.previewRota = null;
        await Promise.all([this.fetchEnderecos(), this.fetchVeiculos()]);
      } catch (err: any) {
        this.error = 'Erro ao confirmar atribuição: ' + (err.message || '');
      } finally {
        this.loading = false;
      }
    },

    async fetchRotaOrdenada(veiculoId: string) {
      try {
        const rota = await RoutingApiService.geRotaPorVeiculo(veiculoId);
        return rota.ordem_ids || [];
      } catch (err) {
        return [];
      }
    }
  },

  getters: {
    getEnderecoById: (state) => (id: string) => {
      return state.enderecos.find(e => e.id === id);
    },
    getVeiculoById: (state) => (id: string) => {
      return state.veiculos.find(v => v.id === id);
    },
    enderecosPendentes: (state) => {
      // Filtra apenas quem tem status 'pendente' E não tem veículo atribuído
      return state.enderecos.filter(e => {
      const isPendente = e.status?.toLowerCase() === 'pendente';
      const semVeiculo = !e.veiculo_id || e.veiculo_id === null;
      
      // SÓ aparece na lista da esquerda se for pendente E não tiver veículo
      return isPendente && semVeiculo;});
    },
    veiculosDisponiveis: (state) => {
      return state.veiculos.filter(v => {
        // Um veículo está disponível se ele NÃO aparecer na lista de Veículos Com Rotas
        const temRotaAtiva = state.enderecos.some(e => String(e.veiculo_id) === String(v.id));
        return !temRotaAtiva;
      });
    },
    veiculosComRotas: (state) => {
      // Pegamos todos os veículos
      return state.veiculos.map(v => {
        const enderecosDesteVeiculo = state.enderecos.filter(e => {
          // Comparação blindada
          return String(e.veiculo_id).trim() === String(v.id).trim() && 
                e.status?.toLowerCase() !== 'em rota';
        });
        return {
          ...v,
          enderecosAtribuidos: enderecosDesteVeiculo,
          motorista: state.motoristas.find(m => String(m.id) === String(v.motorista_id))
        };
      })
      .filter(v => v.enderecosAtribuidos.length > 0);
    },
  }
});
