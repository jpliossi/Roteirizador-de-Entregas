<script setup lang="ts">
import { useDeliveryStore } from '../stores/useDeliveryStore';
import { onMounted, computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { 
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  Layers,
  Search,
  Plus,
  ArrowRight,
  ChevronRight,
  Play,
  X,
  FileText,
  Calendar,
  MapPin,
  History,
  Users
} from 'lucide-vue-next';
import AddressList from '../components/AddressList.vue';
import VehicleList from '../components/VehicleList.vue';
import DriverList from '../components/DriverList.vue';
import AddressForm from '../components/AddressForm.vue';
import VehicleForm from '../components/VehicleForm.vue';
import DriverForm from '../components/DriverForm.vue';
import AppButton from '../components/ui/AppButton.vue';

const deliveryStore = useDeliveryStore();
const route = useRoute();

onMounted(() => {
  deliveryStore.loadInitialData();
});

const stats = computed(() => [
  { 
    label: 'Pendentes', 
    value: deliveryStore.enderecos.filter(e => e.status === 'pendente').length, 
    icon: Clock,
    color: 'text-amber-600',
    bg: 'bg-amber-100'
  },
  { 
    label: 'Em Rota', 
    value: deliveryStore.enderecos.filter(e => e.status === 'em rota').length, 
    icon: Truck,
    color: 'text-blue-600',
    bg: 'bg-blue-100'
  },
  { 
    label: 'Entregues', 
    value: deliveryStore.enderecos.filter(e => e.status === 'entregue').length, 
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bg: 'bg-emerald-100'
  },
  { 
    label: 'Média de Tempo', 
    value: '22 min', 
    icon: TrendingUp,
    color: 'text-primary',
    bg: 'bg-primary/10'
  }
]);

const canCalculate = computed(() => 
  deliveryStore.selectedEnderecoIds.length > 0 && deliveryStore.selectedVeiculoId
);

const handleCalculate = async () => {
  if (!canCalculate.value) return;
  await deliveryStore.calcularRota();
};

const clearSelection = () => {
  deliveryStore.selectedEnderecoIds = [];
  deliveryStore.selectedVeiculoId = null;
};

// Normalização do path para evitar problemas com '/' final ou espaços
const currentPath = computed(() => route.path.replace(/\/$/, '') || '/');
</script>

<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    
    <!-- MODO DASHBOARD -->
    <template v-if="currentPath === '/'">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="stat in stats" :key="stat.label" class="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
          <div :class="['absolute right-0 top-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-10 transition-transform group-hover:scale-110', stat.bg]"></div>
          <div class="flex items-center gap-4">
            <div :class="['p-3 rounded-xl shrink-0', stat.bg, stat.color]">
              <component :is="stat.icon" class="w-6 h-6" />
            </div>
            <div>
              <p class="text-xs font-bold text-muted-foreground uppercase tracking-wider">{{ stat.label }}</p>
              <h3 class="text-2xl font-black mt-1">{{ stat.value }}</h3>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div class="lg:col-span-8 space-y-8">
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-black flex items-center gap-2">
              <Package class="w-6 h-6 text-primary" />
              Operações em Tempo Real
            </h2>
            <div class="relative hidden md:block">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input v-model="deliveryStore.searchQuery" placeholder="Filtrar dados..." class="pl-9 pr-4 py-2 bg-muted/50 border rounded-full text-sm focus:ring-2 ring-primary/20 outline-none w-64" />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AddressList />
            <div class="space-y-6">
               <VehicleList />
               <DriverList />
            </div>
          </div>
        </div>

        <!-- Sidebar Dashboard -->
        <div class="lg:col-span-4 space-y-6 sticky top-8">
          <div class="bg-card border rounded-3xl p-6 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-black flex items-center gap-2">
                <Layers class="w-5 h-5 text-primary" />
                Atribuição de Rota
              </h3>
              <button @click="clearSelection" v-if="deliveryStore.selectedEnderecoIds.length || deliveryStore.selectedVeiculoId" class="text-[10px] text-muted-foreground hover:text-primary underline uppercase font-bold">Limpar</button>
            </div>

            <div class="space-y-4">
              <div class="p-4 rounded-2xl bg-muted/30 border border-dashed flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-primary/10 rounded-lg"><Package class="w-4 h-4 text-primary" /></div>
                  <div>
                    <p class="text-[10px] uppercase font-bold text-muted-foreground">Entregas</p>
                    <p class="text-sm font-black">{{ deliveryStore.selectedEnderecoIds.length }} selecionadas</p>
                  </div>
                </div>
              </div>

              <div class="p-4 rounded-2xl border transition-all" :class="deliveryStore.selectedVeiculoId ? 'bg-primary/5 border-primary/20' : 'bg-muted/30 border-dashed'">
                <div class="flex items-center gap-3">
                  <div :class="['p-2 rounded-lg', deliveryStore.selectedVeiculoId ? 'bg-primary/20' : 'bg-muted']"><Truck class="w-4 h-4" :class="deliveryStore.selectedVeiculoId ? 'text-primary' : 'text-muted-foreground'" /></div>
                  <div>
                    <p class="text-[10px] uppercase font-bold text-muted-foreground">Veículo</p>
                    <p class="text-sm font-black" v-if="deliveryStore.selectedVeiculoId">{{ deliveryStore.veiculos.find(v => String(v.id) === deliveryStore.selectedVeiculoId)?.placa || 'Selecionado' }}</p>
                    <p class="text-xs text-muted-foreground italic" v-else>Nenhum selecionado</p>
                  </div>
                </div>
              </div>

              <div class="pt-4">
                <AppButton class="w-full rounded-2xl h-14 font-bold text-base shadow-lg shadow-primary/20" variant="primary" :disabled="!canCalculate" :loading="deliveryStore.loading" @click="handleCalculate">
                  <Play class="w-5 h-5 mr-2" />
                  Iniciar Roteirização
                </AppButton>
              </div>
            </div>
          </div>

          <!-- Rota Result -->
          <div v-if="deliveryStore.results" class="bg-primary text-white rounded-3xl p-6 shadow-xl animate-in fade-in zoom-in duration-300">
             <div class="flex justify-between items-start mb-4">
               <div class="bg-white/20 p-2 rounded-lg"><TrendingUp class="w-5 h-5" /></div>
               <button @click="deliveryStore.results = null" class="p-1 hover:bg-white/10 rounded-full transition-colors"><X class="w-4 h-4" /></button>
             </div>
             <h4 class="font-black text-xl mb-1">Rota Otimizada</h4>
             <div class="grid grid-cols-2 gap-4 border-t border-white/10 pt-4 mt-4">
                <div><p class="text-[10px] text-white/60 uppercase font-black">Distância</p><p class="text-lg font-black">{{ deliveryStore.results.distancia_total_km || 0 }} km</p></div>
                <div><p class="text-[10px] text-white/60 uppercase font-black">Tempo Est.</p><p class="text-lg font-black">{{ deliveryStore.results.tempo_total_estimado || '0 min' }}</p></div>
             </div>
             <AppButton variant="outline" class="w-full mt-6 bg-white text-primary hover:bg-white/90 font-bold rounded-xl h-12 transition-all active:scale-95" @click="deliveryStore.concluirRota(deliveryStore.results.id)">Finalizar Entrega</AppButton>
          </div>
        </div>
      </div>
    </template>

    <!-- MODO RELATÓRIO DE ROTAS -->
    <template v-else-if="currentPath === '/rotas'">
       <div class="space-y-6">
          <div class="flex items-center gap-3">
             <div class="p-3 bg-primary/10 rounded-2xl text-primary"><History class="w-6 h-6" /></div>
             <div>
                <h2 class="text-2xl font-black tracking-tight">Relatório de Roteirização</h2>
                <p class="text-muted-foreground text-sm font-medium uppercase tracking-widest text-[10px]">Todas as rotas atribuídas e finalizadas</p>
             </div>
          </div>

          <div v-if="deliveryStore.finalizedRoutes.length === 0" class="bg-card border rounded-3xl p-20 text-center flex flex-col items-center gap-4">
             <div class="w-20 h-20 bg-muted rounded-full flex items-center justify-center opacity-30"><FileText class="w-10 h-10" /></div>
             <p class="text-muted-foreground font-medium italic">Nenhuma rota finalizada para exibir no relatório.</p>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <div v-for="routeItem in deliveryStore.finalizedRoutes" :key="routeItem.id" class="bg-card border rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
                <div class="flex justify-between items-center mb-4 pb-4 border-b">
                   <div class="flex items-center gap-2">
                      <Truck class="w-4 h-4 text-primary" />
                      <span class="font-black text-sm uppercase">{{ routeItem.veiculo }}</span>
                   </div>
                   <span class="text-[9px] font-bold bg-muted px-2 py-1 rounded-full text-muted-foreground">{{ routeItem.data }}</span>
                </div>
                
                <div class="space-y-3">
                   <div class="flex justify-between">
                      <span class="text-xs font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Distância</span>
                      <span class="font-black text-sm">{{ routeItem.distancia_total_km }} km</span>
                   </div>
                   <div class="flex justify-between">
                      <span class="text-xs font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Tempo Estimado</span>
                      <span class="font-black text-sm">{{ routeItem.tempo_total_estimado }}</span>
                   </div>
                   <div class="flex justify-between">
                      <span class="text-xs font-bold text-muted-foreground uppercase tracking-widest text-[9px]">Status</span>
                      <span class="text-[10px] font-black uppercase text-emerald-600 flex items-center gap-1"><CheckCircle2 class="w-3 h-3"/> Finalizada</span>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </template>

    <!-- MODO ENDEREÇOS -->
    <template v-else-if="currentPath === '/enderecos'">
       <div class="flex flex-col lg:flex-row gap-8">
          <div class="flex-1 space-y-4">
             <div class="flex items-center gap-2 mb-4">
                <MapPin class="w-5 h-5 text-primary" />
                <h2 class="text-xl font-black">Cadastro de Destinos</h2>
             </div>
             <AddressList :show-all="true" />
          </div>
          <div class="w-full lg:w-96"><AddressForm /></div>
       </div>
    </template>

    <!-- MODO VEÍCULOS -->
    <template v-else-if="currentPath === '/veiculos'">
       <div class="flex flex-col lg:flex-row gap-8">
          <div class="flex-1 space-y-4">
             <div class="flex items-center gap-2 mb-4">
                <Truck class="w-5 h-5 text-primary" />
                <h2 class="text-xl font-black">Frota Registrada</h2>
             </div>
             <VehicleList />
          </div>
          <div class="w-full lg:w-96"><VehicleForm /></div>
       </div>
    </template>

    <!-- MODO MOTORISTAS -->
    <template v-else-if="currentPath === '/motoristas'">
       <div class="flex flex-col lg:flex-row gap-8">
          <div class="flex-1 space-y-4">
             <div class="flex items-center gap-2 mb-4">
                <Users class="w-5 h-5 text-primary" />
                <h2 class="text-xl font-black">Motoristas Ativos</h2>
             </div>
             <DriverList />
          </div>
          <div class="w-full lg:w-96"><DriverForm /></div>
       </div>
    </template>

  </div>
</template>