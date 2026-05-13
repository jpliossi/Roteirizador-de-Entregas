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
  <div class="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
    <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-800">Veículos Disponíveis</h3>
      <button 
        @click="deliveryStore.fetchVeiculos()" 
        class="text-sm text-blue-600 hover:text-blue-800 font-medium"
        :disabled="deliveryStore.loading"
      >
        {{ deliveryStore.loading ? 'Atualizando...' : 'Atualizar' }}
      </button>
    </div>

    <div v-if="deliveryStore.loading && deliveryStore.veiculos.length === 0" class="p-8 text-center text-gray-500">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-2 text-gray-500">Carregando veículos...</p>
    </div>

    <div v-else-if="deliveryStore.veiculos.length === 0" class="p-8 text-center text-gray-500">
      Nenhum veículo encontrado.
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6">
      <div 
        v-for="veiculo in deliveryStore.veiculos" 
        :key="veiculo.id" 
        class="flex flex-col p-4 bg-blue-50 border border-blue-100 rounded-lg"
      >
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-bold text-blue-600 uppercase tracking-wider">Placa</span>
          <span class="px-2 py-1 bg-white border border-blue-200 rounded font-mono text-sm text-gray-800">
            {{ veiculo.placa }}
          </span>
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-semibold text-gray-800">{{ veiculo.modelo }}</span>
          <div class="flex items-center mt-1 text-gray-500">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span class="text-xs">Capacidade: {{ veiculo.capacidade }} m³</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
