<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useDeliveryStore } from '../stores/useDeliveryStore';
import AddressList from '../components/AddressList.vue';
import AddressForm from '../components/AddressForm.vue';
import VehicleList from '../components/VehicleList.vue';
import VehicleForm from '../components/VehicleForm.vue';
import DriverForm from '../components/DriverForm.vue';
import { ManagementApiService } from '../services/ManagementApiService';
import { 
  Plus, 
  Navigation2, 
  UserPlus, 
  X, 
  ClipboardList,
  CheckCircle2,
  Clock,
  Printer,
  Truck,
  MapPin,
  Users,
  Trash2 
} from 'lucide-vue-next';

const route = useRoute();
const deliveryStore = useDeliveryStore();

const showAddressForm = ref(false);
const showVehicleForm = ref(false);
const showDriverForm = ref(false);

const currentPath = computed(() => route.path);

onMounted(async () => {
  await deliveryStore.fetchInitialData();
});

const formatRouteAddresses = (ids?: string[]) => {
  if (!ids || ids.length === 0) return 'Nenhuma parada atribuída';

  return ids.map(id => {
    // Busca o endereço correspondente na store
    const addr = deliveryStore.enderecos.find(e => e.id === id);
    return addr ? `${addr.rua}, ${addr.numero}` : null;
  })
  .filter(Boolean) // Filtra caso algum endereço tenha sido excluído
  .join(' → ');    // Junta tudo formando um caminho visual
};

// Função placeholder para excluir
const excluirEndereco = async (id: string) => {
  if (!id) {
    deliveryStore.addToast('Erro no sistema: O ID do endereço está vazio.', 'error');
    return;
  }

  if (confirm('Tem certeza que deseja excluir este endereço?')) {
    try {
      // 2. Chama a API
      await ManagementApiService.deleteEndereco(id);
      
      // 3. Limpa da tela sem precisar dar F5 (Atualiza o Estado da Store)
      deliveryStore.enderecos = deliveryStore.enderecos.filter(addr => addr.id !== id);
      deliveryStore.addToast('Endereço excluído com sucesso.', 'success');
    } catch (error) {
      console.error(error);
      deliveryStore.addToast('Erro ao excluir o endereço.', 'error');
    }
  }
};

</script>

<template>
  <div class="space-y-8">
    <!-- DASHBOARD VIEW -->
    <div v-if="currentPath === '/'" class="space-y-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 class="text-4xl font-black text-slate-900 tracking-tight">Dashboard Principal</h1>
          <p class="text-slate-500 font-medium">Gestão em tempo real da sua frota e entregas.</p>
        </div>
      </div>

      <!-- Métricas Rápidas -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div class="p-4 bg-amber-50 rounded-2xl">
            <Clock class="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <p class="text-sm font-bold text-slate-500 uppercase tracking-wider">Pendentes</p>
            <p class="text-3xl font-black text-slate-900">{{ deliveryStore.enderecosPendentes.length }}</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div class="p-4 bg-blue-50 rounded-2xl">
            <Navigation2 class="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p class="text-sm font-bold text-slate-500 uppercase tracking-wider">Em Rota</p>
            <p class="text-3xl font-black text-slate-900">{{ deliveryStore.enderecosEmRota.length }}</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div class="p-4 bg-emerald-50 rounded-2xl">
            <CheckCircle2 class="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <p class="text-sm font-bold text-slate-500 uppercase tracking-wider">Finalizados</p>
            <p class="text-3xl font-black text-slate-900">{{ deliveryStore.finalizedRoutes.length }}</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
          <div class="p-4 bg-slate-50 rounded-2xl">
            <Truck class="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <p class="text-sm font-bold text-slate-500 uppercase tracking-wider">Frota Total</p>
            <p class="text-3xl font-black text-slate-900">{{ deliveryStore.veiculos.length }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Coluna Esquerda: Listagem de Endereços Atuais -->
        <div class="bg-white rounded-4x1 shadow-sm border border-slate-100 overflow-hidden">
          <div class="p-8 border-b border-slate-50 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <ClipboardList class="w-6 h-6 text-slate-900" />
              <h2 class="text-xl font-black text-slate-900 uppercase tracking-tight">Fila de Entregas</h2>
            </div>
          </div>
          <div class="p-6">
            <AddressList />
          </div>
        </div>

        <!-- Coluna Direita: Filas de Rotas Ativas -->
        <div class="space-y-6">
          <div v-for="(res, idx) in deliveryStore.pendingRoutes" :key="idx" class="bg-slate-900 rounded-4xl p-8 text-white">
            <div class="flex items-center justify-between mb-8">
              <div class="flex items-center gap-4">
                <div class="p-3 bg-white/10 rounded-2xl">
                  <Navigation2 class="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 class="font-black text-lg uppercase tracking-tight">Rota em Andamento</h3>
                  <p class="text-xs text-white/50 font-bold uppercase tracking-widest">{{ res.vehicle?.placa || 'Sem Placa' }} • {{ res.vehicle?.modelo || 'Veículo' }}</p>
                </div>
              </div>
              <button @click="deliveryStore.concluirRota(res.veiculo_id)" class="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20">
                Concluir Rota
              </button>
            </div>

            <div class="space-y-4">
              <div v-for="(stop, sIdx) in res.route" :key="sIdx" class="relative pl-8">
                <!-- Linha conectora -->
                <div v-if="Number(sIdx) < res.route.length - 1" class="absolute left-1.75 top-6 w-0.5 h-full bg-slate-800 my-1"></div>
                
                <div class="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-slate-700 bg-slate-900 flex items-center justify-center">
                  <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                </div>
                
                <div class="bg-white/5 p-4 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all cursor-default">
                  <p class="text-xs font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">Parada #{{ Number(sIdx) + 1 }}</p>
                  <p class="text-sm text-white/70 font-medium">{{ stop.rua }}, {{ stop.numero }}</p>
                  <p class="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">{{ stop.bairro }}</p>
                </div>
              </div>
            </div>

            <div class="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
              <div class="flex gap-8">
                <div>
                  <p class="text-[10px] font-black text-white/30 uppercase tracking-widest">Distância</p>
                  <p class="text-xl font-black">{{ Number(res.km_total || 0).toFixed(2) }} km</p>
                </div>
                <div>
                  <p class="text-[10px] font-black text-white/30 uppercase tracking-widest">Tempo Est.</p>
                  <p class="text-xl font-black">{{ Math.round(Number(res.tempo_previsto || 0)) }} min</p>
                </div>
              </div>
              <button class="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                <Printer class="w-5 h-5 text-white/50" />
              </button>
            </div>
          </div>

          <!-- Relatório Simplificado de Rotas Finalizadas -->
          <div v-if="deliveryStore.finalizedRoutes.length > 0" class="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm">
             <div class="flex items-center gap-3 mb-6">
               <CheckCircle2 class="w-5 h-5 text-emerald-500" />
               <h2 class="text-lg font-black text-slate-900 uppercase tracking-tight">Recém Finalizadas</h2>
             </div>
             <div class="space-y-4">
               <div v-for="(route, rIdx) in deliveryStore.finalizedRoutes" :key="rIdx" class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                 <div class="flex items-center gap-4">
                   <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                     <Truck class="w-5 h-5 text-emerald-600" />
                   </div>
                   <div>
                      <p class="font-black text-slate-900 text-sm tracking-tight">{{ route.vehicle?.placa }}</p>
                      
                      <p 
                        class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 line-clamp-2 leading-relaxed"
                        :title="formatRouteAddresses(route.enderecosIds)"
                      >
                        {{ formatRouteAddresses(route.enderecosIds) }}
                      </p>
                    </div>
                 </div>
                 <div class="text-right">
                   <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Concluído</p>
                   <p class="text-xs font-black text-slate-900">{{ new Date(route.finalizedAt).toLocaleTimeString() }}</p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ENDEREÇOS VIEW -->
    <div v-else-if="currentPath === '/enderecos'" class="space-y-8">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 class="text-4xl font-black text-slate-900 tracking-tight">Cadastro de Endereços</h1>
          <p class="text-slate-500 font-medium text-lg italic">Adicione novos pontos de entrega para serem atribuídos às rotas.</p>
        </div>
        <button @click="showAddressForm = true" class="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-3xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest text-xs">
          <Plus class="w-5 h-5" /> Novo Endereço
        </button>
      </div>
      <div
        v-if="deliveryStore.enderecos.length === 0"
        class="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 text-center py-20 flex flex-col items-center justify-center"
      >
        <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <MapPin class="w-10 h-10 text-slate-300" />
        </div>
        <h3 class="text-xl font-black text-slate-900 mb-2">Nenhum destino encontrado</h3>
        <p class="text-slate-500 font-bold uppercase tracking-widest text-xs max-w-sm">
          Clique em "Novo Endereço" para começar a cadastrar seus pontos de entrega logísticos.
        </p>
      </div>

      <div v-else class="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden" >
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Logradouro</th>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Bairro / Cidade</th>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th class="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Ação</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr 
                v-for="addr in deliveryStore.enderecos" 
                :key="addr.id"
                class="hover:bg-slate-50/50 transition-colors group"
              >
                <td class="px-8 py-5">
                  <p class="font-bold text-sm text-slate-900">{{ addr.rua }}, {{ addr.numero }}</p>
                  <p class="text-[10px] font-bold text-slate-400 uppercase mt-1">CEP: {{ addr.cep }}</p>
                </td>

                <td class="px-8 py-5">
                  <p class="font-bold text-sm text-slate-700">{{ addr.bairro }}</p>
                  <p class="text-[10px] font-bold text-slate-400 uppercase mt-1">{{ addr.cidade }}</p>
                </td>

                <td class="px-8 py-5">
                  <span 
                    class="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                    :class="{
                      'bg-amber-100 text-amber-700': addr.status === 'pendente',
                      'bg-blue-100 text-blue-700': addr.status === 'em rota',
                      'bg-emerald-100 text-emerald-700': addr.status === 'concluido'
                    }"
                  >
                    {{ addr.status }}
                  </span>
                </td>

                <td class="px-8 py-5 text-right">
                  <div class="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      @click="excluirEndereco(String(addr.id))"
                      class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Excluir"
                    >
                      <Trash2 class="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- MOTORISTAS VIEW -->
    <div v-else-if="currentPath === '/motoristas'" class="space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-black text-slate-900 tracking-tight">Gestão de Motoristas</h1>
          <p class="text-slate-500 font-medium text-lg">Cadastro e controle de motoristas da frota.</p>
        </div>
        <button @click="showDriverForm = true" class="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-3xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest text-xs">
          <UserPlus class="w-5 h-5" /> Novo Motorista
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-if="deliveryStore.motoristas.length === 0" class="col-span-full text-center py-20 bg-white rounded-[40px] border border-slate-100">
          <Users class="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p class="text-slate-500 font-bold uppercase tracking-widest text-sm">Nenhum motorista cadastrado</p>
        </div>
        <div v-for="motorista in deliveryStore.motoristas" :key="motorista.id" class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg transition-all">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black">
              {{ motorista.nome?.charAt(0).toUpperCase() || 'M' }}
            </div>
          </div>
          <h3 class="text-lg font-black text-slate-900 tracking-tight mb-2">{{ motorista.nome }}</h3>
          <p class="text-sm text-slate-500 font-bold mb-1">CPF: {{ motorista.cpf }}</p>
        </div>
      </div>
    </div>

    <!-- ROTAS VIEW -->
    <div v-else-if="currentPath === '/rotas'" class="space-y-8">
      <div>
        <h1 class="text-4xl font-black text-slate-900 tracking-tight">Histórico de Rotas</h1>
        <p class="text-slate-500 font-medium text-lg">Visualize todas as rotas ativas e finalizadas.</p>
      </div>

      <!-- Rotas em Andamento -->
      <div v-if="deliveryStore.pendingRoutes.length > 0" class="space-y-6">
        <h2 class="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
          <Navigation2 class="w-6 h-6 text-blue-600" />
          Rotas em Andamento
        </h2>
        
        <div v-for="res in deliveryStore.pendingRoutes" :key="res.id" class="bg-slate-900 rounded-4xl p-8 text-white mb-6">
          
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-white/10 rounded-2xl">
                <Navigation2 class="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 class="font-black text-lg uppercase tracking-tight">Rota em Andamento</h3>
                <p class="text-xs text-white/50 font-bold uppercase tracking-widest">{{ res.placa || 'Sem Placa' }}</p>
              </div>
            </div>
            
            <button @click="deliveryStore.concluirRota(res.veiculo_id)" class="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20">
              Concluir Rota
            </button>
          </div>

          <div class="space-y-4">
            <div v-for="(stop, sIdx) in res.enderecos_relacionados" :key="stop.id || sIdx" class="relative pl-8">
              
              <div v-if="Number(sIdx) < res.enderecos_relacionados.length - 1" class="absolute left-1.75 top-6 w-0.5 h-full bg-slate-800 my-1"></div>
              
              <div class="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-slate-700 bg-slate-900 flex items-center justify-center">
                <div class="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              </div>
              
              <div class="bg-white/5 p-4 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all cursor-default">
                <p class="text-xs font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">Parada #{{ Number(sIdx) + 1 }}</p>
                <p class="text-sm text-white/70 font-medium">{{ stop.rua }}, {{ stop.numero }}</p>
                <p class="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-1">{{ stop.bairro }}</p>
              </div>
              
            </div>
          </div>

          <div class="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
            <div class="flex gap-8">
              <div>
                <p class="text-[10px] font-black text-white/30 uppercase tracking-widest">Distância</p>
                <p class="text-xl font-black">{{ Number(res.km_total || 0).toFixed(2) }} km</p>
              </div>
              <div>
                <p class="text-[10px] font-black text-white/30 uppercase tracking-widest">Tempo Est.</p>
                <p class="text-xl font-black">{{ Math.round(Number(res.tempo_previsto || 0)) }} min</p>
              </div>
            </div>
            <button class="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
              <Printer class="w-5 h-5 text-white/50" />
            </button>
          </div>
          
        </div>
      </div>

      <!-- Rotas Finalizadas -->
      <div v-if="deliveryStore.finalizedRoutes.length > 0" class="space-y-6">
        <h2 class="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
          <CheckCircle2 class="w-6 h-6 text-emerald-600" />
          Rotas Finalizadas
        </h2>
        <div class="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm">
          <div class="space-y-4">
            <div v-for="(route, rIdx) in deliveryStore.finalizedRoutes" :key="route.id || rIdx" class="p-6 bg-slate-50 rounded-2xl space-y-4">
              
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Truck class="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p class="font-black text-slate-900 text-sm tracking-tight">{{ route.placa }}</p>
                    <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      {{ route.enderecos_relacionados?.length || 0 }} paradas • {{ Number(route.km_total || 0).toFixed(2) }} km
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Concluído</p>
                  <p class="text-xs font-black text-slate-900">
                    {{ route.updated_at ? new Date(route.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Concluído' }}
                  </p>
                </div>
              </div>

              <div v-if="route.enderecos_relacionados && route.enderecos_relacionados.length > 0" class="pt-3 border-t border-slate-200/60 text-xs font-semibold text-slate-500 flex items-center gap-2">
                <span class="text-[9px] font-black uppercase tracking-wider text-slate-400 bg-slate-200/50 px-1.5 py-0.5 rounded">Trajeto</span>
                <p class="truncate tracking-tight text-slate-600">
                  {{ route.enderecos_relacionados.map((e: { rua: any; numero: any; }) => `${e.rua}, ${e.numero}`).join(' → ') }}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- Sem rotas -->
      <div v-if="deliveryStore.pendingRoutes.length === 0 && deliveryStore.finalizedRoutes.length === 0" class="text-center py-20 bg-white rounded-[40px] border border-slate-100">
        <Navigation2 class="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p class="text-slate-500 font-bold uppercase tracking-widest text-sm">Nenhuma rota encontrada</p>
      </div>
    </div>

    <!-- VEÍCULOS VIEW -->
    <div v-else-if="currentPath === '/veiculos'" class="space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-4xl font-black text-slate-900 tracking-tight">Frota de Veículos</h1>
          <p class="text-slate-500 font-medium text-lg">Gerencie os veículos disponíveis para roteirização.</p>
        </div>
        <div class="flex gap-4">
          <button @click="showVehicleForm = true" class="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-3xl font-black hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 uppercase tracking-widest text-xs">
            <Plus class="w-5 h-5" /> Novo Veículo
          </button>
        </div>
      </div>
      <div class="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100">
        <VehicleList />
      </div>
    </div>

    <!-- MODAIS -->
    <Transition enter-active-class="duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showAddressForm || showVehicleForm || showDriverForm" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-md" @click="showAddressForm = showVehicleForm = showDriverForm = false"></div>
        <div class="relative bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
          <div class="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
             <div class="flex items-center gap-3">
              <div class="p-3 bg-slate-900 text-white rounded-2xl">
                <Plus v-if="showAddressForm || showVehicleForm" class="w-6 h-6" />
                <UserPlus v-else class="w-6 h-6" />
              </div>
              <h2 class="text-xl font-black text-slate-900 uppercase tracking-tight">
                {{ showAddressForm ? 'Novo Endereço' : showVehicleForm ? 'Novo Veículo' : 'Novo Motorista' }}
              </h2>
            </div>
            <button @click="showAddressForm = showVehicleForm = showDriverForm = false" class="p-3 hover:bg-slate-200 rounded-2xl transition-all">
              <X class="w-6 h-6 text-slate-400" />
            </button>
          </div>
          <div class="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
            <AddressForm v-if="showAddressForm" @close="showAddressForm = false" />
            <VehicleForm v-if="showVehicleForm" @close="showVehicleForm = false" />
            <DriverForm v-if="showDriverForm" @close="showDriverForm = false" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
</style>