<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDeliveryStore } from '../stores/useDeliveryStore';
import { Truck, CheckCircle2, MapPin, Package, Route, Clock } from 'lucide-vue-next';

const deliveryStore = useDeliveryStore();
const selectedVehicleId = ref('');
const selectedAddressIds = ref<string[]>([]);
const isCalculating = ref(false);

const availableVehicles = computed(() => 
  deliveryStore.veiculos.filter(v => v.status === 'disponivel')
);

// 🎯 AJUSTE 1: Agora trazemos os pendentes E os que estão em rota para a lista
const pendingAddresses = computed(() => 
  deliveryStore.enderecos.filter(addr => addr.status === 'pendente' || addr.status === 'em rota' || addr.status === 'em_rota')
);

// Lógica de seleção múltipla de endereços
const toggleAddress = (id: string) => {
  const index = selectedAddressIds.value.indexOf(id);
  if (index > -1) {
    selectedAddressIds.value.splice(index, 1);
  } else {
    selectedAddressIds.value.push(id);
  }
};

const handleCalcular = async () => {
  if (!selectedVehicleId.value) {
    deliveryStore.addToast('Selecione um veículo.', 'error');
    return;
  }
  
  if (selectedAddressIds.value.length === 0) {
    deliveryStore.addToast('Selecione pelo menos um endereço para criar a rota.', 'error');
    return;
  }

  isCalculating.value = true;
  try {
    await deliveryStore.calcularRota(selectedAddressIds.value, selectedVehicleId.value);
    
    // Limpa a seleção após o sucesso
    selectedVehicleId.value = '';
    selectedAddressIds.value = [];
  } catch (error) {
    console.error(error);
  } finally {
    isCalculating.value = false;
  }
};

const getIniciais = (nome: string) => {
  return nome.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};
</script>

<template>
  <div class="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
    <div class="p-10 border-b border-slate-50 bg-slate-50/30">
      <div class="flex items-center gap-4 mb-4">
        <div class="p-3 bg-slate-900 text-white rounded-2xl">
          <Route class="w-6 h-6" />
        </div>
        <h2 class="text-3xl font-black text-slate-900 tracking-tight italic">Montar Rota</h2>
      </div>
      <p class="text-slate-500 font-medium max-w-xl">
        Selecione o veículo e os destinos específicos para calcular a rota ideal.
      </p>
    </div>

    <div class="p-10 space-y-10">
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">1. Escolha o Veículo</h3>
          <span class="px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full text-[10px] font-black uppercase">{{ availableVehicles.length }} livres</span>
        </div>
        
        <div v-if="availableVehicles.length === 0" class="p-8 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <Truck class="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p class="text-sm text-slate-500 font-bold uppercase tracking-wider">Nenhum veículo disponível</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button 
            v-for="veiculo in availableVehicles" 
            :key="veiculo.id"
            @click="selectedVehicleId = veiculo.id!"
            class="group text-left p-6 rounded-4x1 border-2 transition-all duration-300 relative overflow-hidden"
            :class="selectedVehicleId === veiculo.id 
              ? 'border-slate-900 bg-slate-900 text-white shadow-xl -translate-y-1' 
              : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md'"
          >
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-colors"
                   :class="selectedVehicleId === veiculo.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-900'">
                {{ getIniciais(veiculo.placa) }}
              </div>
              <div>
                <p class="font-black text-lg">{{ veiculo.modelo }}</p>
                <p class="text-[10px] font-bold uppercase tracking-widest opacity-60">{{ veiculo.placa }}</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div class="space-y-6 border-t border-slate-100 pt-10">
        <div class="flex items-center justify-between">
          <h3 class="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">2. Selecione os Destinos</h3>
          <span class="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-black uppercase">{{ pendingAddresses.length }} destinos</span>
        </div>

        <div v-if="pendingAddresses.length === 0" class="p-8 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <MapPin class="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p class="text-sm text-slate-500 font-bold uppercase tracking-wider">Nenhum destino pendente</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-75 overflow-y-auto pr-2 scrollbar-thin">
          <button 
            v-for="addr in pendingAddresses" 
            :key="addr.id"
            @click="toggleAddress(addr.id!)"
            class="text-left p-4 rounded-2xl border-2 transition-all flex items-start justify-between gap-4"
            :class="selectedAddressIds.includes(addr.id!)
              ? 'border-slate-900 bg-slate-50' 
              : 'border-slate-100 bg-white hover:border-slate-200'"
          >
            <div class="flex items-start gap-4">
              <div class="mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors"
                   :class="selectedAddressIds.includes(addr.id!) ? 'bg-slate-900 border-slate-900' : 'border-slate-300'">
                <CheckCircle2 v-if="selectedAddressIds.includes(addr.id!)" class="w-3 h-3 text-white" stroke-width="4" />
              </div>
              <div>
                <p class="font-bold text-sm text-slate-900 leading-tight">{{ addr.rua }}, {{ addr.numero }}</p>
                <p class="text-[10px] font-bold text-slate-400 uppercase mt-1">{{ addr.bairro }} • {{ addr.cidade }}</p>
              </div>
            </div>

            <div class="shrink-0 self-center">
              <span 
                v-if="addr.status === 'pendente'" 
                class="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-full text-[9px] font-black uppercase tracking-wider"
              >
                Pendente
              </span>
              <span 
                v-else-if="addr.status === 'em rota' || addr.status === 'em_rota' || !addr.status"
                class="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-[9px] font-black uppercase tracking-wider"
              >
                Em Rota
              </span>
              <span 
                v-else-if="addr.status === 'entregue'" 
                class="px-2.5 py-1 bg-slate-100 text-slate-900 rounded-full text-[9px] font-black uppercase tracking-wider"
              >
                Entregue
              </span>
            </div>
          </button>
        </div>
      </div>

      <div v-if="selectedAddressIds.length > 0" class="bg-slate-50 rounded-4x1 p-8 border border-slate-100">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Resumo da Rota</h3>
          <Package class="w-5 h-5 text-slate-400" />
        </div>

        <div class="grid grid-cols-2 gap-8">
           <div>
             <p class="text-[10px] font-black text-slate-400 uppercase leading-none mb-2">Entregas Selecionadas</p>
             <p class="font-black text-3xl text-slate-900 leading-none">{{ selectedAddressIds.length }}</p>
           </div>
           <div>
             <p class="text-[10px] font-black text-slate-400 uppercase leading-none mb-2">Previsão (Base)</p>
             <div class="flex items-center gap-2">
               <Clock class="w-4 h-4 text-slate-400" />
               <p class="font-black text-xl text-slate-900 leading-none">~{{ selectedAddressIds.length * 12 }} min</p>
             </div>
           </div>
        </div>
      </div>

      <button 
        @click="handleCalcular"
        :disabled="isCalculating || !selectedVehicleId || selectedAddressIds.length === 0"
        class="w-full py-6 rounded-4x1 font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl"
        :class="isCalculating || !selectedVehicleId || selectedAddressIds.length === 0
          ? 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none' 
          : 'bg-slate-900 text-white hover:bg-black active:scale-[0.98]'"
      >
        <div v-if="isCalculating" class="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        <template v-else>
          <Route class="w-5 h-5" />
          Calcular Rota
        </template>
      </button>
    </div>
  </div>
</template>