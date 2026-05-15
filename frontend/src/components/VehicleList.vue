<script setup lang="ts">
import { useDeliveryStore } from '../stores/useDeliveryStore';
import { onMounted, ref, watch } from 'vue';

const deliveryStore = useDeliveryStore();
const extraInfosPorVeiculo = ref<Record<string, { ordemIds: string[], distancia?: number, tempo?: number, paradas?: number }>>({});

const carregarDadosDinamicos = async (veiculoId: string) => {
  return;
  if (veiculoId) {
    try {
      // O endpoint de geRotaPorVeiculo na Routing API retorna { ordem_ids, distancia_total, tempo_estimado }
      const rota = await deliveryStore.fetchRotaOrdenada(veiculoId);
      // Como o backend de roteamento já retorna esses dados, precisamos de um método na store que nos dê o objeto completo
      // Vou ajustar a store para retornar o objeto inteiro da rota se disponível
      const res = await fetch(`http://localhost:3001/rota/${veiculoId}`);
      if (res.ok) {
        const data = await res.json();
        extraInfosPorVeiculo.value[veiculoId] = {
          ordemIds: data.ordem_ids || [],
          distancia: data.distancia_total,
          tempo: data.tempo_estimado,
          paradas: data.ordem_ids?.length || 0
        };
      }
    } catch (err) {
      console.error('Erro ao carregar dados da rota:', err);
    }
  }
};

const getEnderecosOrdenados = (veiculo: any) => {
  // 1. Pegamos as informações extras (distância/tempo) que o Node calculou
  const info = extraInfosPorVeiculo.value[veiculo.id];
  
  // 2. Pegamos os endereços que estão vinculados a este veículo na Store
  // Se o veiculo.enderecosAtribuidos vier vazio, tentamos buscar na lista global por segurança
  const enderecosAtivos = veiculo.enderecosAtribuidos?.length > 0 
    ? veiculo.enderecosAtribuidos 
    : deliveryStore.enderecos.filter(e => String(e.veiculo_id) === String(veiculo.id));

  if (!info || !info.ordemIds || info.ordemIds.length === 0) {
    return enderecosAtivos;
  }
  
  // 3. Ordenamos os endereços baseados na array de IDs que veio do Node
  return [...enderecosAtivos].sort((a, b) => {
    const indexA = info.ordemIds.indexOf(String(a.id));
    const indexB = info.ordemIds.indexOf(String(b.id));
    return indexA - indexB;
  });
};

const concluirRota = async (veiculoId: string) => {
  if (confirm('Deseja concluir a rota e liberar o veículo?')) {
    await deliveryStore.concluirRota(veiculoId);
    delete extraInfosPorVeiculo.value[veiculoId];
  }
};

onMounted(() => {
  if (deliveryStore.veiculos.length === 0) deliveryStore.fetchVeiculos();
  if (deliveryStore.motoristas.length === 0) deliveryStore.fetchMotoristas();
  if (deliveryStore.enderecos.length === 0) deliveryStore.fetchEnderecos();
});

watch(() => deliveryStore.veiculosComRotas, (novosVeiculos) => {
  novosVeiculos.forEach(v => {
    if (v.id && v.enderecosAtribuidos.length > 0 && !extraInfosPorVeiculo.value[v.id]) {
      carregarDadosDinamicos(String(v.id));
    }
  });
}, { immediate: true, deep: true });
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
      <!-- Veículos em Rota -->
      <div 
        v-for="veiculo in deliveryStore.veiculosComRotas" 
        :key="veiculo.id" 
        class="bg-white shadow-sm rounded-xl overflow-hidden border-2 border-blue-300 transition-all hover:shadow-md"
      >
        <div class="px-5 py-4 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <div class="p-2 bg-blue-600 rounded-lg text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
              </svg>
            </div>
            <div>
              <h4 class="font-black text-gray-900 leading-none">{{ veiculo.placa }}</h4>
              <p v-if="veiculo.motorista" class="text-[10px] font-bold text-blue-600 uppercase mt-1 tracking-tight">
                👨‍✈️ {{ veiculo.motorista.nome }}
              </p>
            </div>
          </div>
          <div class="text-right">
             <span class="text-[10px] font-black px-2 py-1 rounded uppercase bg-blue-600 text-white">
               Em Rota
             </span>
             <p class="text-[9px] text-gray-400 mt-1 font-bold">{{ veiculo.capacidade }}kg</p>
          </div>
        </div>

        <!-- Info de Distância e Tempo (Resolução do Pedido) -->
        <div v-if="extraInfosPorVeiculo[veiculo.id!]" class="grid grid-cols-2 border-b border-gray-100 bg-gray-50/50">
            <div class="p-2 text-center border-r border-gray-100">
                <p class="text-[8px] uppercase font-bold text-gray-400">Distância</p>
                <p class="text-sm font-black text-blue-700">{{ extraInfosPorVeiculo[veiculo.id!].distancia }} km</p>
            </div>
            <div class="p-2 text-center">
                <p class="text-[8px] uppercase font-bold text-gray-400">Tempo (Est.)</p>
                <p class="text-sm font-black text-blue-700">{{ extraInfosPorVeiculo[veiculo.id!].tempo }} min</p>
            </div>
        </div>

        <div class="p-3">
          <ul class="space-y-2">
            <li 
              v-for="(addr, index) in getEnderecosOrdenados(veiculo)" 
              :key="addr.id"
              class="flex items-center p-3 bg-white rounded-lg border border-gray-100 shadow-sm"
            >
              <div class="w-6 h-6 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center mr-3 flex-shrink-0">
                {{ Number(index) + 1 }}
              </div>
              <div class="min-w-0 pr-2">
                <p class="text-xs font-bold text-gray-800 truncate">{{ addr.rua }}, {{ addr.numero }}</p>
                <p class="text-[9px] font-medium text-gray-500 uppercase tracking-tighter">{{ addr.bairro }}</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div class="px-3 pb-3">
           <button 
             @click="concluirRota(String(veiculo.id))"
             class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase rounded shadow-sm transition-all"
           >
             Concluir Rota e Liberar
           </button>
        </div>
      </div>

      <!-- Veículos Disponíveis -->
      <div 
        v-for="veiculo in deliveryStore.veiculos.filter(v => !deliveryStore.veiculosComRotas.find(vr => vr.id === v.id))" 
        :key="'disp-' + veiculo.id" 
        class="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200 opacity-75"
      >
        <div class="px-5 py-4 bg-gray-50 flex items-center justify-between">
          <div class="flex items-center space-x-3 text-gray-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
            </svg>
            <div>
              <h4 class="font-bold text-gray-600 leading-none">{{ veiculo.placa }}</h4>
              <p class="text-[9px] font-bold uppercase mt-1">{{ veiculo.modelo }}</p>
            </div>
          </div>
          <span class="text-[10px] font-black px-2 py-1 rounded uppercase bg-green-100 text-green-700">
             Disponível
          </span>
        </div>
      </div>
    </template>
  </div>
</template>
