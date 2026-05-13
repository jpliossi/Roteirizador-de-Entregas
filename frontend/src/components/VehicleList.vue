<script setup lang="ts">
import { useDeliveryStore } from '../stores/useDeliveryStore';
import { onMounted } from 'vue';

const deliveryStore = useDeliveryStore();

onMounted(() => {
  if (deliveryStore.veiculos.length === 0) {
    deliveryStore.fetchVeiculos();
  }
});
</script>

<template>
  <div class="space-y-4">
    <div v-if="deliveryStore.loading && deliveryStore.veiculos.length === 0" class="p-8 text-center text-gray-500">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-2 text-gray-500">Carregando frota...</p>
    </div>

    <div v-else-if="deliveryStore.veiculos.length === 0" class="p-8 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
      Nenhum veículo disponível.
    </div>

    <template v-else>
      <div 
        v-for="veiculo in deliveryStore.veiculosComRotas" 
        :key="veiculo.id" 
        class="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200 transition-all hover:shadow-md"
      >
        <!-- Header do Veículo -->
        <div class="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-blue-100 rounded-lg text-blue-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" stroke-width="2"/><path d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" stroke-width="2"/></svg>
            </div>
            <div>
              <h4 class="font-black text-gray-900 leading-none">{{ veiculo.modelo }}</h4>
              <span class="text-[10px] font-bold uppercase text-gray-500 tracking-widest">{{ veiculo.placa }}</span>
            </div>
          </div>
          <div class="text-right">
            <span class="text-xs font-black text-blue-600">{{ veiculo.capacidade }}m³</span>
          </div>
        </div>

        <!-- Lista de Entregas do Veículo -->
        <div class="p-2">
          <div v-if="veiculo.enderecos.length === 0" class="py-4 text-center">
            <p class="text-xs font-bold text-gray-400 italic">Nenhuma entrega atribuída</p>
          </div>
          <ul v-else class="space-y-1">
            <li 
              v-for="(addr, index) in veiculo.enderecos" 
              :key="addr.id"
              class="flex items-center p-3 bg-blue-50/50 rounded-lg border border-blue-100"
            >
              <div class="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center mr-3 flex-shrink-0">
                {{ index + 1 }}
              </div>
              <div class="min-w-0">
                <p class="text-xs font-bold text-gray-800 truncate">{{ addr.logradouro }}, {{ addr.numero }}</p>
                <p class="text-[10px] text-gray-500 truncate">{{ addr.bairro }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </div>
</template>
