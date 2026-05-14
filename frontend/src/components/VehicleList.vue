<script setup lang="ts">
import { useDeliveryStore } from '../stores/useDeliveryStore';
import { onMounted } from 'vue';

const deliveryStore = useDeliveryStore();

onMounted(() => {
  // Carrega os dados iniciais se a lista estiver vazia
  if (deliveryStore.veiculos.length === 0) {
    deliveryStore.fetchVeiculos();
  }
  if (deliveryStore.motoristas.length === 0) {
    deliveryStore.fetchMotoristas();
  }
});
</script>

<template>
  <div class="space-y-4">
    <div v-if="deliveryStore.loading && deliveryStore.veiculos.length === 0" class="p-8 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-2 text-sm text-gray-500 font-medium">Sincronizando frota...</p>
    </div>

    <div v-else-if="deliveryStore.veiculos.length === 0" class="p-8 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
      <p class="text-sm text-gray-400 font-bold italic">Nenhum veículo cadastrado na base.</p>
    </div>

    <template v-else>
      <div 
        v-for="veiculo in deliveryStore.veiculosComRotas" 
        :key="veiculo.id" 
        class="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200 transition-all hover:shadow-md"
      >
        <div class="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-blue-100 rounded-lg text-blue-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
              </svg>
            </div>
            <div>
              <h4 class="font-black text-gray-900 leading-none">{{ veiculo.placa }}</h4>
              <p v-if="(veiculo as any).motorista" class="text-[10px] font-bold text-blue-600 uppercase mt-1 tracking-tight">
                👨‍✈️ {{ (veiculo as any).motorista.nome }}
              </p>
            </div>
          </div>
          <div class="text-right">
            <span class="text-[10px] font-black bg-gray-200 text-gray-700 px-2 py-1 rounded uppercase">
              {{ veiculo.capacidade }}kg
            </span>
          </div>
        </div>

        <div class="p-3">
          <div v-if="veiculo.enderecosAtribuidos.length === 0" class="py-6 text-center">
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Disponível para Rota</p>
          </div>
          
          <ul v-else class="space-y-2">
            <li 
              v-for="(addr, index) in veiculo.enderecosAtribuidos" 
              :key="addr.id"
              class="flex items-center p-3 bg-blue-50/50 rounded-lg border border-blue-100 transition-colors hover:bg-blue-50"
            >
              <div class="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center mr-3 flex-shrink-0 shadow-sm">
                {{ index + 1 }}
              </div>
              <div class="min-w-0">
                <p class="text-xs font-bold text-gray-800 truncate">{{ addr.rua }}, {{ addr.numero }}</p>
                <p class="text-[9px] font-medium text-blue-500 uppercase tracking-tighter">{{ addr.bairro }}</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div v-if="veiculo.enderecosAtribuidos.length > 0" class="px-5 py-2 bg-blue-600">
           <p class="text-[9px] font-black text-white uppercase text-center tracking-widest">Em Operação / {{ veiculo.enderecosAtribuidos.length }} Paradas</p>
        </div>
      </div>
    </template>
  </div>
</template>