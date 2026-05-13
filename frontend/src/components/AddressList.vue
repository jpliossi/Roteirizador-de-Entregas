<script setup lang="ts">
import { useDeliveryStore } from '../stores/useDeliveryStore';
import { onMounted } from 'vue';

const deliveryStore = useDeliveryStore();

onMounted(() => {
  if (deliveryStore.enderecos.length === 0) {
    deliveryStore.fetchEnderecos();
  }
});

const getStatusColor = (status?: string) => {
  switch (status?.toLowerCase()) {
    case 'pendente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'em rota': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'entregue': return 'bg-green-100 text-green-800 border-green-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
</script>

<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
    <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
      <h3 class="text-lg font-semibold text-gray-800">Endereços para Entrega</h3>
      <button 
        @click="deliveryStore.fetchEnderecos()" 
        class="text-sm text-blue-600 hover:text-blue-800 font-medium"
        :disabled="deliveryStore.loading"
      >
        {{ deliveryStore.loading ? 'Atualizando...' : 'Atualizar' }}
      </button>
    </div>

    <div v-if="deliveryStore.loading && deliveryStore.enderecos.length === 0" class="p-8 text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-2 text-gray-500">Carregando endereços...</p>
    </div>

    <div v-else-if="deliveryStore.enderecos.length === 0" class="p-8 text-center text-gray-500">
      Nenhum endereço encontrado.
    </div>

    <ul v-else class="divide-y divide-gray-200">
      <li v-for="addr in deliveryStore.enderecos" :key="addr.id" class="px-6 py-4 hover:bg-gray-50 transition-colors">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ addr.logradouro }}, {{ addr.numero }}
            </p>
            <p class="text-sm text-gray-500 truncate">
              {{ addr.bairro }} - {{ addr.cidade }}/{{ addr.estado }}
            </p>
            <p class="text-xs text-gray-400 mt-1">CEP: {{ addr.cep }}</p>
          </div>
          <div class="ml-4">
            <span 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
              :class="getStatusColor(addr.status)"
            >
              {{ addr.status || 'Pendente' }}
            </span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
