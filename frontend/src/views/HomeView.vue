<script setup lang="ts">
import { ref, computed } from 'vue';
import AddressList from '../components/AddressList.vue';
import VehicleList from '../components/VehicleList.vue';
import AddressForm from '../components/AddressForm.vue';
import VehicleForm from '../components/VehicleForm.vue';
import { useDeliveryStore } from '../stores/useDeliveryStore';
import { RoutingApiService, type RotaCalculada } from '../services/RoutingApiService';
import { onMounted } from 'vue';

const deliveryStore = useDeliveryStore();
const showAddressForm = ref(false);
const showVehicleForm = ref(false);
const calculating = ref(false);
const rotaSugerida = ref<RotaCalculada | null>(null);

const canCalculate = computed(() => {
  return deliveryStore.selectedEnderecoIds.length > 0 && deliveryStore.selectedVeiculoId !== null;
});

const handleCalculate = async () => {
  if (!canCalculate.value) return;
  calculating.value = true;
  try {
    const ids = deliveryStore.selectedEnderecoIds.map(String);
    const veiculoId = String(deliveryStore.selectedVeiculoId);
    rotaSugerida.value = await RoutingApiService.calcularRota(veiculoId, ids);
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
    
    // Reset da seleção e recarga dos dados
    deliveryStore.selectedEnderecoIds = [];
    deliveryStore.selectedVeiculoId = null;
    rotaSugerida.value = null;
    await deliveryStore.fetchEnderecos();
    
    alert('Rota atribuída com sucesso! Os endereços agora estão em rota.');
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
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
        <div>
          <h1 class="text-4xl font-black text-gray-900 tracking-tight">
            Roteirizador de Rotas <span class="text-blue-600">.</span>
          </h1>
          <p class="mt-2 text-lg text-gray-600 font-medium">
            Otimize sua logística de entrega em poucos cliques.
          </p>
        </div>
        <div class="flex space-x-3">
          <button @click="showAddressForm = true" class="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all">
            + Novo Endereço
          </button>
          <button @click="showVehicleForm = true" class="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white hover:bg-blue-700 transition-all">
            + Novo Veículo
          </button>
        </div>
      </div>

      <!-- Toolbar de Ação -->
      <div v-if="deliveryStore.selectedEnderecoIds.length > 0" class="mb-8 p-6 bg-blue-600 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 transform transition-all animate-in fade-in slide-in-from-top">
        <div class="text-white">
          <p class="text-xl font-bold">{{ deliveryStore.selectedEnderecoIds.length }} endereços selecionados</p>
          <div class="mt-2 flex items-center bg-blue-700/50 rounded-lg p-2 max-w-sm">
            <span class="text-xs font-bold uppercase mr-3 text-blue-200">Veículo:</span>
            <select 
              v-model="deliveryStore.selectedVeiculoId"
              class="bg-transparent border-none text-white font-bold focus:ring-0 text-sm w-full cursor-pointer"
            >
              <option :value="null" class="text-gray-900">Selecione um veículo...</option>
              <option v-for="v in deliveryStore.veiculos" :key="v.id!" :value="v.id" class="text-gray-900">
                {{ v.placa }} - {{ v.modelo }}
              </option>
            </select>
          </div>
        </div>
        
        <div class="flex space-x-3">
          <button 
            @click="handleCalculate" 
            :disabled="!canCalculate || calculating"
            class="px-6 py-3 bg-white text-blue-700 rounded-xl font-black hover:bg-blue-50 disabled:opacity-50 transition-all shadow-lg"
          >
            {{ calculating ? 'Calculando...' : 'Calcular Rota' }}
          </button>
        </div>
      </div>

      <!-- Resultado da Rota sugerida -->
      <div v-if="rotaSugerida" class="mb-10 p-6 bg-emerald-50 border-2 border-emerald-200 rounded-2xl animate-in zoom-in">
        <h3 class="text-lg font-black text-emerald-900 flex items-center mb-4">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2" /></svg>
          Rota Sugerida Encontrada
        </h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 text-center">
            <p class="text-xs text-emerald-600 font-bold uppercase mb-1">Distância</p>
            <p class="text-2xl font-black text-emerald-900">{{ (rotaSugerida.distancia_total / 1000).toFixed(2) }} km</p>
          </div>
          <div class="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 text-center">
            <p class="text-xs text-emerald-600 font-bold uppercase mb-1">Tempo</p>
            <p class="text-2xl font-black text-emerald-900">{{ (rotaSugerida.tempo_estimado / 60).toFixed(0) }} min</p>
          </div>
          <div class="bg-white p-4 rounded-xl shadow-sm border border-emerald-100 text-center">
            <p class="text-xs text-emerald-600 font-bold uppercase mb-1">Paradas</p>
            <p class="text-2xl font-black text-emerald-900">{{ rotaSugerida.ordem_ids.length }}</p>
          </div>
          <div class="flex items-center justify-center">
            <button @click="handleConfirm" class="w-full h-full bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700 transition-all shadow-lg text-lg uppercase">
              Confirmar
            </button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-10 lg:grid-cols-12">
        <div class="lg:col-span-4">
          <h2 class="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <span class="w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
            Frota
          </h2>
          <VehicleList />
        </div>

        <div class="lg:col-span-8">
          <h2 class="text-2xl font-black text-gray-900 mb-6 flex items-center">
            <span class="w-2 h-8 bg-gray-900 rounded-full mr-3"></span>
            Pedidos de Entrega
          </h2>
          <AddressList />
        </div>
      </div>
    </div>

    <!-- Modais -->
    <AddressForm v-if="showAddressForm" @close="showAddressForm = false" />
    <VehicleForm v-if="showVehicleForm" @close="showVehicleForm = false" />
  </div>
</template>
