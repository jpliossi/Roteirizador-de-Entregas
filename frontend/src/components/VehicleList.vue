<script setup lang="ts">
import { useDeliveryStore } from '../stores/useDeliveryStore';
import { Truck, RotateCcw, Trash2 } from 'lucide-vue-next';
import AppButton from './ui/AppButton.vue';

const deliveryStore = useDeliveryStore();

const deleteVehicle = async (id: any) => {
  if (confirm('Tem certeza que deseja remover este veículo?')) {
    await deliveryStore.removeVeiculo(String(id));
  }
};
</script>

<template>
  <div class="bg-card border rounded-xl overflow-hidden shadow-sm">
    <div class="px-4 py-3 border-b flex justify-between items-center bg-muted/30">
      <div class="flex items-center gap-2">
        <Truck class="w-3.5 h-3.5 text-primary" />
        <h3 class="font-bold text-[10px] uppercase tracking-wider">Frota</h3>
      </div>
      <AppButton variant="ghost" size="sm" @click="deliveryStore.fetchVeiculos()" :loading="deliveryStore.loading" class="h-6 w-6 p-0">
        <RotateCcw class="w-3 h-3" v-if="!deliveryStore.loading" />
      </AppButton>
    </div>

    <div v-if="deliveryStore.filteredVeiculos.length === 0" class="p-4 text-center text-muted-foreground italic text-[10px]">
      Vazio.
    </div>

    <div v-else class="divide-y overflow-y-auto max-h-40 scrollbar-thin">
      <div 
        v-for="v in deliveryStore.filteredVeiculos" 
        :key="v.id" 
        class="group p-2 hover:bg-muted/50 transition-all cursor-pointer flex items-center gap-2 border-l-2"
        :class="[
          deliveryStore.selectedVeiculoId === String(v.id) 
            ? 'bg-primary/5 border-primary' 
            : 'border-transparent'
        ]"
        @click="deliveryStore.toggleVeiculoSelection(String(v.id))"
      >
        <div class="flex-1 min-w-0">
          <p class="font-black text-[10px] uppercase truncate">{{ v.placa }}</p>
          <p class="text-[9px] text-muted-foreground truncate uppercase">{{ v.modelo }}</p>
        </div>
        <button @click.stop="deleteVehicle(v.id)" class="opacity-0 group-hover:opacity-100 p-1 text-red-500"><Trash2 class="w-3 h-3"/></button>
      </div>
    </div>
  </div>
</template>