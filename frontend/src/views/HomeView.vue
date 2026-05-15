<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { 
  Users, 
  MapPin, 
  Truck, 
  ArrowRight,
  Plus,
  Navigation,
  History
} from 'lucide-vue-next';
import { useDeliveryStore } from '../stores/useDeliveryStore';
import { RoutingApiService, type RotaCalculada } from '../services/RoutingApiService';

import AppButton from '../components/ui/AppButton.vue';
import AppCard from '../components/ui/AppCard.vue';
import AppBadge from '../components/ui/AppBadge.vue';
import AddressList from '../components/AddressList.vue';
import VehicleList from '../components/VehicleList.vue';
import AddressForm from '../components/AddressForm.vue';
import VehicleForm from '../components/VehicleForm.vue';
import DriverForm from '../components/DriverForm.vue';

const route = useRoute();
const deliveryStore = useDeliveryStore();

const showAddressForm = ref(false);
const showVehicleForm = ref(false);
const showDriverForm = ref(false);
const calculating = ref(false);
const rotaSugerida = ref<RotaCalculada | null>(null);

const activeView = computed(() => route.name || 'home');

const stats = computed(() => [
  { label: 'Veículos em Rota', value: deliveryStore.veiculos.filter(v => v.status === 'em rota').length, icon: Navigation, color: 'text-blue-500', bg: 'bg-blue-50' },
  { label: 'Veículos Ativos', value: deliveryStore.veiculos.length, icon: Truck, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { label: 'Motoristas', value: deliveryStore.motoristas.length, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
]);

const canCalculate = computed(() => {
  return deliveryStore.selectedEnderecoIds.length > 0 && deliveryStore.selectedVeiculoId !== null;
});

const handleCalculate = async () => {
  if (!canCalculate.value) return;
  calculating.value = true;
  try {
    const enderecosSelecionados = deliveryStore.enderecos
      .filter(e => deliveryStore.selectedEnderecoIds.includes(e.id!))
      .map(e => ({
        id: String(e.id),
        latitude: Number(e.latitude),
        longitude: Number(e.longitude),
        rua: e.rua,
        numero: e.numero,
        cidade: e.cidade
      }));

    const veiculoId = String(deliveryStore.selectedVeiculoId);
    const resposta = await RoutingApiService.calcularRota(veiculoId, enderecosSelecionados);
    rotaSugerida.value = resposta;
  } catch (err: any) {
    deliveryStore.error = "Erro ao calcular rota: " + err.message;
  } finally {
    calculating.value = false;
  }
};

const handleConfirm = async () => {
  if (!rotaSugerida.value || !deliveryStore.selectedVeiculoId) return;
  calculating.value = true;
  try {
    const ids = deliveryStore.selectedEnderecoIds.map(String);
    const veiculoId = String(deliveryStore.selectedVeiculoId);
    await RoutingApiService.atribuirRota(veiculoId, ids);
    
    deliveryStore.selectedEnderecoIds = [];
    deliveryStore.selectedVeiculoId = null;
    rotaSugerida.value = null;
    
    await deliveryStore.fetchEnderecos();
    await deliveryStore.fetchVeiculos();
  } catch (err: any) {
    deliveryStore.error = "Erro ao atribuir rota: " + err.message;
  } finally {
    calculating.value = false;
  }
};

onMounted(() => {
  deliveryStore.loadInitialData();
});
</script>

<template>
  <div class="space-y-8 animate-in fade-in duration-500">
    
    <!-- DASHBOARD VIEW -->
    <template v-if="activeView === 'home'">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Centro Operacional</h1>
          <p class="text-muted-foreground mt-1 text-lg">Visão geral da frota e logística em tempo real.</p>
        </div>
        <div class="flex gap-3">
          <AppButton @click="showAddressForm = true" variant="outline" :icon="Plus">Novo Pedido</AppButton>
          <AppButton @click="showVehicleForm = true" variant="primary" :icon="Truck">Adicionar Veículo</AppButton>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AppCard v-for="stat in stats" :key="stat.label">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{{ stat.label }}</p>
              <h3 class="text-3xl font-bold mt-1">{{ stat.value }}</h3>
            </div>
            <div :class="['p-3 rounded-xl', stat.bg]">
              <component :is="stat.icon" :class="['w-6 h-6', stat.color]" />
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Historical / Route Management View -->
      <div v-if="deliveryStore.veiculos.some(v => v.status === 'em rota')" class="space-y-4">
        <h2 class="text-xl font-bold flex items-center gap-2">
          <History class="w-5 h-5 text-muted-foreground" />
          Acompanhamento de Rotas Ativas
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AppCard v-for="veiculo in deliveryStore.veiculos.filter(v => v.status === 'em rota')" :key="veiculo.id" class="border-l-4 border-l-blue-500">
            <div class="flex justify-between items-start mb-4">
              <div>
                <h3 class="font-bold text-lg">{{ veiculo.placa }} - {{ veiculo.modelo }}</h3>
                <p class="text-sm text-muted-foreground">Motorista: {{ deliveryStore.motoristas.find(m => m.id === veiculo.motorista_id)?.nome || 'Não atribuído' }}</p>
              </div>
              <AppBadge variant="secondary" class="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">Em Rota</AppBadge>
            </div>
            
            <div class="space-y-3 mb-6">
              <p class="text-xs font-bold uppercase text-muted-foreground tracking-wider">Paradas da Rota</p>
              <div class="space-y-2">
                <div v-for="(addr, idx) in deliveryStore.enderecos.filter(e => e.veiculo_id == veiculo.id && e.status === 'em rota')" :key="addr.id" class="flex items-center gap-3 text-sm">
                  <div class="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">{{ idx + 1 }}</div>
                  <span class="truncate">{{ addr.rua }}, {{ addr.numero }}</span>
                </div>
              </div>
            </div>

            <AppButton 
              @click="deliveryStore.concluirRota(String(veiculo.id))" 
              variant="primary" 
              class="w-full bg-emerald-600 hover:bg-emerald-700 border-none"
              :loading="deliveryStore.loading"
            >
              Concluir Rota e Liberar Veículo
            </AppButton>
          </AppCard>
        </div>
      </div>

      <!-- Quick Actions / Roteirização Inteligente Overlay -->
      <transition 
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="transform -translate-y-4 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-200 ease-in"
        leave-from-class="transform translate-y-0 opacity-100"
        leave-to-class="transform -translate-y-4 opacity-0"
      >
        <div v-if="deliveryStore.selectedEnderecoIds.length > 0" class="relative z-10">
          <AppCard class="bg-primary text-primary-foreground border-none shadow-2xl">
            <div class="flex flex-col md:flex-row items-center justify-between gap-6">
              <div class="flex items-center gap-4">
                <div class="p-3 bg-white/10 rounded-xl">
                  <Navigation class="w-6 h-6" />
                </div>
                <div>
                  <h3 class="text-lg font-bold">{{ deliveryStore.selectedEnderecoIds.length }} locais selecionados</h3>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-xs text-primary-foreground/70 uppercase">Veículo Alvo:</span>
                    <select 
                      v-model="deliveryStore.selectedVeiculoId"
                      class="bg-white/10 border-none text-sm font-medium rounded px-2 py-0.5 focus:ring-0 cursor-pointer"
                    >
                      <option :value="null" class="text-foreground">Selecione...</option>
                      <option v-for="v in deliveryStore.veiculos" :key="v.id!" :value="v.id" class="text-foreground">
                        {{ v.placa }} ({{ v.modelo }})
                      </option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="flex gap-3">
                <AppButton 
                  @click="handleCalculate" 
                  variant="secondary" 
                  :loading="calculating"
                  v-if="!rotaSugerida"
                >
                  Otimizar Rota
                </AppButton>
                <AppButton 
                  @click="handleConfirm" 
                  variant="secondary" 
                  class="bg-emerald-500 hover:bg-emerald-600 border-none text-white font-bold"
                  v-if="rotaSugerida"
                  :loading="calculating"
                >
                  Confirmar e Atribuir
                </AppButton>
              </div>
            </div>
            
            <!-- Sugestão de Rota Inline -->
            <transition mode="out-in">
              <div v-if="rotaSugerida" class="mt-6 pt-6 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="space-y-1">
                  <p class="text-xs text-primary-foreground/60 font-bold uppercase">Estimativa</p>
                  <p class="text-2xl font-black">{{ rotaSugerida.distancia_total }} km <span class="text-sm font-normal opacity-60">/ {{ rotaSugerida.tempo_estimado }} min</span></p>
                </div>
                <div class="md:col-span-2">
                   <p class="text-xs text-primary-foreground/60 font-bold uppercase mb-2">Sequência Sugerida</p>
                   <div class="flex flex-wrap gap-2" v-if="rotaSugerida.ordem_sugerida">
                     <span v-for="(ponto, i) in rotaSugerida.ordem_sugerida" :key="i" class="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg text-sm">
                       <span class="w-5 h-5 flex items-center justify-center bg-white/20 rounded-full text-[10px]">{{ i+1 }}</span>
                       {{ ponto.rua }}, {{ ponto.numero }}
                       <ArrowRight v-if="i < rotaSugerida.ordem_sugerida.length - 1" class="w-3 h-3 opacity-40" />
                     </span>
                   </div>
                </div>
              </div>
            </transition>
          </AppCard>
        </div>
      </transition>

      <!-- Main Activity Area -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-4">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold flex items-center gap-2">
              <MapPin class="w-5 h-5 text-muted-foreground" />
              Gestão de Pedidos
            </h2>
          </div>
          <AddressList />
        </div>

        <div class="space-y-8">
          <div class="space-y-4">
            <h2 class="text-xl font-bold flex items-center gap-2">
              <Truck class="w-5 h-5 text-muted-foreground" />
              Frota Ativa
            </h2>
            <VehicleList />
          </div>
        </div>
      </div>
    </template>

    <!-- OTHER VIEWS -->
    <template v-else>
       <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold tracking-tight capitalize">{{ activeView }}</h1>
          <p class="text-muted-foreground mt-1">Gestão detalhada de {{ activeView }}.</p>
        </div>
        <AppButton @click="showAddressForm = true" v-if="activeView === 'enderecos'" :icon="Plus">Novo Endereço</AppButton>
        <AppButton @click="showVehicleForm = true" v-if="activeView === 'veiculos'" :icon="Plus">Novo Veículo</AppButton>
        <AppButton @click="showDriverForm = true" v-if="activeView === 'motoristas'" :icon="Plus">Novo Motorista</AppButton>
      </div>
      
      <div v-if="activeView === 'enderecos'" class="animate-in slide-in-from-bottom-2 duration-300">
        <AddressList />
      </div>
      <div v-if="activeView === 'veiculos'" class="animate-in slide-in-from-bottom-2 duration-300">
        <VehicleList />
      </div>
      <div v-if="activeView === 'motoristas'" class="animate-in slide-in-from-bottom-2 duration-300">
        <AppCard>
           <div class="divide-y">
             <div v-for="m in deliveryStore.motoristas" :key="m.id" class="py-4 flex items-center justify-between">
               <div class="flex items-center gap-4">
                 <div class="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                   {{ m.nome.substring(0,2).toUpperCase() }}
                 </div>
                 <div>
                   <p class="font-bold">{{ m.nome }}</p>
                   <p class="text-sm text-muted-foreground">CPF: {{ m.cpf }}</p>
                 </div>
               </div>
               <div class="flex items-center gap-4">
                 <AppBadge variant="success">Disponível</AppBadge>
                 <AppButton variant="ghost" size="icon"><History class="w-4 h-4" /></AppButton>
               </div>
             </div>
             <div v-if="deliveryStore.motoristas.length === 0" class="py-12 text-center text-muted-foreground">
               Nenhum motorista cadastrado.
             </div>
           </div>
        </AppCard>
      </div>
      <div v-if="activeView === 'rotas'" class="bg-primary rounded-2xl p-12 text-center text-primary-foreground min-h-100 flex flex-col items-center justify-center border shadow-xl overflow-hidden relative">
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <Navigation class="w-20 h-20 mb-6 opacity-20 animate-pulse relative z-10" />
        <h2 class="text-3xl font-bold relative z-10">Mapa Geo-Inteligente</h2>
        <p class="text-primary-foreground/60 mt-2 max-w-md relative z-10">Módulo de visualização cartográfica em tempo real sendo sincronizado com o provedor de mapas.</p>
        <AppButton variant="secondary" class="mt-8 relative z-10">Conectar GPS</AppButton>
      </div>
    </template>

    <!-- Modals -->
    <div v-if="showAddressForm || showVehicleForm || showDriverForm" class="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-background/80 backdrop-blur-md" @click="showAddressForm = showVehicleForm = showDriverForm = false"></div>
      <div class="w-full max-w-lg relative z-10 animate-in zoom-in-95 duration-200">
        <AddressForm v-if="showAddressForm" @close="showAddressForm = false" />
        <VehicleForm v-if="showVehicleForm" @close="showVehicleForm = false" />
        <DriverForm v-if="showDriverForm" @close="showDriverForm = false" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
