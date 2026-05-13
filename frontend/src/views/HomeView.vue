<script setup lang="ts">
import AddressList from '../components/AddressList.vue';
import VehicleList from '../components/VehicleList.vue';
import { useDeliveryStore } from '../stores/useDeliveryStore';
import { onMounted } from 'vue';

const deliveryStore = useDeliveryStore();

onMounted(() => {
  deliveryStore.loadInitialData();
});
</script>

<template>
  <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-4xl font-extrabold text-blue-800 tracking-tight sm:text-5xl">
          Painel de Operação Logística
        </h1>
        <p class="mt-4 text-xl text-gray-500">
          Gerencie as rotas e acompanhe o status das entregas em tempo real.
        </p>
      </div>

      <div v-if="deliveryStore.error" class="mb-8 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm">{{ deliveryStore.error }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <!-- Coluna de Veículos -->
        <section>
          <header class="mb-4">
            <h2 class="text-2xl font-bold text-gray-900">Frota</h2>
          </header>
          <VehicleList />
        </section>

        <!-- Coluna de Endereços -->
        <section>
          <header class="mb-4">
            <h2 class="text-2xl font-bold text-gray-900">Pedidos de Entrega</h2>
          </header>
          <AddressList />
        </section>
      </div>
    </div>
  </div>
</template>
