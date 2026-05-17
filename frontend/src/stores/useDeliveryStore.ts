import { defineStore } from 'pinia';
import { ManagementApiService, type Endereco, type Veiculo, type Motorista, api } from '../services/ManagementApiService';
import { RoutingApiService } from '../services/RoutingApiService';

export interface ToastInfo {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

export const useDeliveryStore = defineStore('delivery', {
  state: () => ({
    enderecos: [] as Endereco[],
    veiculos: [] as Veiculo[],
    motoristas: [] as Motorista[],
    selectedEnderecoIds: [] as string[],
    selectedVeiculoId: null as string | null,
    pendingRoutes: [] as any[],
    results: null as any | null,
    loading: false,
    searchQuery: '',
    finalizedRoutes: [] as any[],
    toasts: [] as ToastInfo[],
  }),

  getters: {
    enderecosPendentes: (state) => state.enderecos.filter(e => e.status === 'pendente'),
    enderecosEmRota: (state) => state.enderecos.filter(e => e.status === 'em rota'),
    
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
    addToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
      const id = Date.now();
      this.toasts.push({ message, type, id });
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== id);
      }, 5000);
    },

    async fetchInitialData() {
      this.loading = true;
      try {
        await Promise.all([
          this.fetchEnderecos(),
          this.fetchVeiculos(),
          this.fetchMotoristas(),
          this.fetchRotas()
        ]);
      } catch (error) {
        console.error('Error fetching initial data:', error);
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

        // src/stores/useDeliveryStore.ts

    async fetchRotas() {
      try {
        const response = await ManagementApiService.getRotum(); 
        const rawData = response.data || response;
        console.log("🔍 PROVA REAL DO QUE VEIO DO RAILS:");
        console.table(rawData);

        if (!Array.isArray(rawData)) {
          console.warn("⚠️ Dados de retorno não são um Array válido:", rawData);
          return;
        }

        // Mapeamento à prova de falhas
        const todasAsRotasMapeadas = rawData.map((r: any) => {
          // Força a descoberta do ID do veículo buscando em todas as variações possíveis
          const idDoVeiculo = r.veiculo_id || r.vehicle_id || r.vehicle?.id;

          return {
            id: r.id,
            veiculo_id: idDoVeiculo ? String(idDoVeiculo) : undefined, // Garante que salva como string na raiz!
            placa: r.placa || r.vehicle?.placa || "Sem Placa",
            km_total: Number(r.km_total || 0),
            tempo_previsto: Number(r.tempo_previsto || 0),
            status: r.status,
            enderecos_relacionados: r.enderecos_relacionados || [],
            updated_at: r.updated_at
          };
        });

        // Filtra aplicando o estado reativo correto
        this.pendingRoutes = todasAsRotasMapeadas.filter((r: any) => r.status === 'pendente');
        this.finalizedRoutes = todasAsRotasMapeadas.filter((r: any) => r.status === 'concluido');

        console.log("🎯 Rotas pendentes mapeadas com sucesso:", this.pendingRoutes);
      } catch (error) {
        console.error("Erro ao carregar rotas:", error);
        this.addToast('Erro ao atualizar painel de rotas', 'error');
      }
    },

    async addEndereco(dados: any) {
      try {
        const res = await ManagementApiService.createEndereco(dados);
        this.addToast('Endereço cadastrado com sucesso!', 'success');
        await this.fetchEnderecos();
        return res;
      } catch (e) {
        this.addToast('Erro ao cadastrar endereço', 'error');
        throw e;
      }
    },

    async addVeiculo(veiculo: any) {
      try {
        const res = await ManagementApiService.createVeiculo(veiculo);
        this.addToast('Veículo salvo com sucesso!', 'success');
        await this.fetchVeiculos();
        return res;
      } catch (e) {
        this.addToast('Erro ao salvar veículo', 'error');
        throw e;
      }
    },

    async addMotorista(motorista: any) {
      try {
        const res = await ManagementApiService.createMotorista(motorista);
        this.addToast('Motorista registrado!', 'success');
        await this.fetchMotoristas();
        return res;
      } catch (e) {
        this.addToast('Erro ao registrar motorista', 'error');
        throw e;
      }
    },

    async updateVeiculoMotorista(veiculoId: string, motoristaId: string | null) {
      try {
        const veiculo = this.veiculos.find(v => String(v.id) === veiculoId);
        if (!veiculo) return;
        
        await api.patch(`/veiculos/${veiculoId}`, {
          veiculo: { motorista_id: motoristaId }
        });
        this.addToast('Motorista vinculado ao veículo!', 'success');
        await this.fetchVeiculos();
      } catch (e) {
        this.addToast('Erro ao vincular motorista', 'error');
      }
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
      this.addToast('Motorista removido');
      await this.fetchMotoristas();
    },

    async removeVeiculo(id: string) {
      await ManagementApiService.deleteVeiculo(id);
      this.addToast('Veículo removido');
      await this.fetchVeiculos();
    },

    async calcularRota(enderecosIds: string[], veiculoId: string) {
      this.loading = true;
      try {
        const selectedEnderecos = this.enderecos.filter(e => e.id && enderecosIds.includes(e.id));
        
        // 1. Calcula a rota no microsserviço (que devolve a ordem ideal, km e tempo)
        const res = await RoutingApiService.calcularRota(veiculoId, selectedEnderecos);
        
        const dadosRota = res.data || res;
        const kmCalculado = dadosRota.distancia_total || 0; 
        const tempoCalculado = dadosRota.tempo_estimado || 0; 

        // 2. Atualiza o status dos endereços selecionados para 'em rota'
        await ManagementApiService.calcularRota(enderecosIds, veiculoId);
        
        // 3. Grava a rota de forma definitiva no Postgres com todas as métricas exigidas
        const responseBanco = await ManagementApiService.salvarRotaNoBanco(
          veiculoId, 
          enderecosIds,
          kmCalculado, 
          tempoCalculado
        );

        const vehicle = this.veiculos.find(v => String(v.id) === veiculoId);
        
        
        const routeWithContext = {
          id: responseBanco.data.id, 
          veiculo_id: String(veiculoId), // 🔥 Essencial! Garante que o botão leia o ID imediato como string
          placa: vehicle?.placa || "Sem Veículo", // 🔥 Essencial! Exibe a placa sem precisar de F5
          km_total: kmCalculado,
          tempo_previsto: tempoCalculado,
          status: 'pendente',
          // Mapeia os endereços em andamento para montar a linha do tempo visual na tela na hora
          enderecos_relacionados: selectedEnderecos.map(e => ({
            id: e.id,
            rua: e.rua,
            numero: e.numero,
            bairro: e.bairro
          }))
        };

        // Adiciona no topo ou no final da lista reativa
        this.pendingRoutes.push(routeWithContext);
        this.results = routeWithContext;
        
        this.addToast('Nova rota calculada e persistida no banco!', 'success');
        
        // 🎯 DISPARA O FETCH ASSÍNCRONO: Atualiza o estado da store com o banco de forma limpa
        setTimeout(async () => {
          await this.fetchEnderecos(); // Sincroniza em background sem dar "piscada" de status na tela
        }, 300);
        await this.fetchVeiculos(); 
        await this.fetchRotas(); // 🔥 Ative essa linha! Ela vai sincronizar tudo em background com o Rails de forma segura.

      } catch (e) {
        this.addToast('Erro ao calcular rota', 'error');
        console.error(e);
      } finally {
        this.loading = false;
      }
    },

    async concluirRota(veiculoId: string) {
      console.log("ID do Veículo para concluir:", veiculoId);
      this.loading = true;
      try {
        await ManagementApiService.concluirRota(veiculoId); // Atualiza status dos endereços para 'concluido'
        
        const routeIndex = this.pendingRoutes.findIndex(r => String(r.vehicle?.id) === String(veiculoId));
          if (routeIndex > -1) {
            const finishedRoute = {
              ...this.pendingRoutes[routeIndex],
              finalizedAt: new Date().toISOString(),
              status: 'concluido'
            };
            this.finalizedRoutes.push(finishedRoute);
            this.pendingRoutes.splice(routeIndex, 1);
          }

        this.addToast('Rota concluída com sucesso!', 'success');
        await Promise.all([this.fetchEnderecos(), this.fetchVeiculos(), this.fetchRotas()]);
      } catch (e) {
        this.addToast('Erro ao concluir rota', 'error');
        console.error(e);
      } finally {
        this.loading = false;
      }
    }
  }
});
