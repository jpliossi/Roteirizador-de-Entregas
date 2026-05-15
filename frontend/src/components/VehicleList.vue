<script setup lang="ts">
import { useDeliveryStore } from '../stores/useDeliveryStore';
import { onMounted, ref, watch } from 'vue';
import { Truck, CheckCircle, User } from 'lucide-vue-next';
import AppCard from './ui/AppCard.vue';
import AppButton from './ui/AppButton.vue';
import AppBadge from './ui/AppBadge.vue';

const deliveryStore = useDeliveryStore();
const extraInfosPorVeiculo = ref<Record<string, { ordemIds: string[], distancia?: number, tempo?: number, paradas?: number }>>({});

const carregarDadosDinamicos = async (veiculoId: string) => {
  try {
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
    // Silent fail if no route
  }
};

const concluirRota = async (veiculoId: string) => {
  await deliveryStore.concluirRota(veiculoId);
  delete extraInfosPorVeiculo.value[veiculoId];
};

onMounted(() => {
  deliveryStore.loadInitialData();
});

watch(() => deliveryStore.veiculos, (novosVeiculos) => {
  novosVeiculos.forEach(v => {
    if (v.id && !extraInfosPorVeiculo.value[v.id]) {
       carregarDadosDinamicos(String(v.id));
    }
  });
}, { immediate: true, deep: true });
</script>

<template>
  <div class="space-y-4">
    <div v-if="deliveryStore.loading && deliveryStore.veiculos.length === 0" class="p-12 text-center text-muted-foreground bg-card border border-dashed rounded-xl">
       <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-4"></div>
       <p class="text-sm">Sincronizando frota...</p>
    </div>

    <div v-else-if="deliveryStore.veiculos.length === 0" class="p-12 text-center text-muted-foreground bg-card border border-dashed rounded-xl">
       <Truck class="w-12 h-12 mx-auto mb-4 opacity-10" />
       <p class="text-sm font-medium">Nenhum veículo operacional.</p>
    </div>

    <template v-else>
      <AppCard 
        v-for="veiculo in deliveryStore.veiculos" 
        :key="veiculo.id" 
        class="border transition-all hover:shadow-md"
        :class="extraInfosPorVeiculo[veiculo.id!] ? 'border-primary/30 ring-1 ring-primary/10' : ''"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-4">
            <div class="p-3 bg-secondary rounded-xl">
              <Truck class="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 class="font-bold text-lg leading-none">{{ veiculo.placa }}</h4>
              <p class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-1.5">{{ veiculo.modelo }} • {{ veiculo.capacidade }}kg</p>
            </div>
          </div>
          <AppBadge :variant="extraInfosPorVeiculo[veiculo.id!] ? 'default' : 'outline'">
            {{ extraInfosPorVeiculo[veiculo.id!] ? 'Em Rota' : 'Estacionado' }}
          </AppBadge>
        </div>

        <div v-if="extraInfosPorVeiculo[veiculo.id!]" class="space-y-4 mt-6 animate-in slide-in-from-top-2">
          <div class="grid grid-cols-2 gap-2">
            <div class="bg-muted px-4 py-3 rounded-xl">
              <p class="text-[10px] font-bold text-muted-foreground uppercase">KM Estimado</p>
              <p class="text-lg font-bold">{{ extraInfosPorVeiculo[veiculo.id!].distancia }} km</p>
            </div>
            <div class="bg-muted px-4 py-3 rounded-xl">
              <p class="text-[10px] font-bold text-muted-foreground uppercase">Tempo ETA</p>
              <p class="text-lg font-bold">{{ extraInfosPorVeiculo[veiculo.id!].tempo }} min</p>
            </div>
          </div>
          
          <AppButton 
            variant="outline" 
            size="md" 
            class="w-full text-emerald-600 border-emerald-200 hover:bg-emerald-50 font-bold"
            @click="concluirRota(String(veiculo.id))"
            :icon="CheckCircle"
          >
            Finalizar Operação
          </AppButton>
        </div>
        
        <div v-else class="mt-4 flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
          <div class="flex items-center gap-2">
            <div class="w-5 h-5 rounded-full bg-secondary flex items-center justify-center">
               <User class="w-3 h-3" />
            </div>
            <span class="font-medium">Motorista não escalado</span>
          </div>
          <AppButton variant="ghost" size="sm" class="h-8 text-[10px] uppercase font-bold tracking-widest text-primary">Escalar</AppButton>
        </div>
      </AppCard>
    </template>
  </div>
</template>
