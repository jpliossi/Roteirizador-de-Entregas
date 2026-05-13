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
      <li 
        v-for="addr in deliveryStore.enderecosPendentes" 
        :key="addr.id" 
        class="group px-6 py-5 transition-all cursor-pointer border-l-4"
        :class="[
          deliveryStore.selectedEnderecoIds.includes(addr.id!) 
            ? 'bg-blue-100/50 border-blue-600' 
            : 'hover:bg-gray-50 border-transparent'
        ]"
        @click="deliveryStore.toggleEnderecoSelection(addr.id!)"
      >
        <div class="flex items-center space-x-6">
          <div class="flex-shrink-0">
            <div 
              class="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all"
              :class="[
                deliveryStore.selectedEnderecoIds.includes(addr.id!)
                  ? 'bg-blue-600 border-blue-600'
                  : 'bg-white border-gray-200 group-hover:border-blue-400'
              ]"
            >
              <svg v-if="deliveryStore.selectedEnderecoIds.includes(addr.id!)" class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-width="3"/></svg>
            </div>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
               <p class="text-sm font-black text-gray-900 truncate">
                {{ addr.rua }}, {{ addr.numero }}
              </p>
              <span v-if="addr.complemento" class="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded font-bold text-gray-400">{{ addr.complemento }}</span>
            </div>
            <p class="text-[11px] font-bold text-gray-400 uppercase tracking-tighter mt-0.5">
              {{ addr.cidade }} - {{ addr.estado }}
            </p>
          </div>
          <div class="ml-4 flex flex-col items-end gap-1">
            <span 
              class="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase border shadow-sm"
              :class="getStatusColor(addr.status)"
            >
              {{ addr.status || 'Pendente' }}
            </span>
            <span class="text-[9px] font-black text-gray-300 uppercase letter tracking-widest">REF: #{{ addr.id }}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>
