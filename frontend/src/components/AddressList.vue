<script setup lang="ts">
import { useDeliveryStore } from '../stores/useDeliveryStore';
import { Package, RotateCcw } from 'lucide-vue-next';
import AppButton from './ui/AppButton.vue';

const props = defineProps<{
  showAll?: boolean
}>();

const deliveryStore = useDeliveryStore();

const toggleSelection = (id: any) => {
  deliveryStore.toggleEnderecoSelection(String(id));
};
</script>

<template>
  <div class="bg-card border rounded-3xl overflow-hidden shadow-sm flex flex-col h-full">
    <div class="px-6 py-5 border-b flex justify-between items-center bg-muted/30">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-primary/10 rounded-lg">
          <Package class="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 class="font-black text-sm uppercase tracking-tight">Endereços</h3>
          <p class="text-[10px] text-muted-foreground font-bold uppercase">{{ showAll ? 'Base Completa' : 'Pendentes e em Rota' }}</p>
        </div>
      </div>
      <AppButton variant="ghost" size="sm" @click="deliveryStore.fetchEnderecos()" :loading="deliveryStore.loading" class="rounded-full w-10 h-10 p-0">
        <RotateCcw class="w-4 h-4" v-if="!deliveryStore.loading" />
      </AppButton>
    </div>

    <div v-if="(showAll ? deliveryStore.filteredEnderecos : deliveryStore.operationalEnderecos).length === 0" class="p-12 text-center text-muted-foreground italic flex-1 flex flex-col items-center justify-center gap-4">
      <div class="w-16 h-16 bg-muted rounded-full flex items-center justify-center opacity-20">
        <Package class="w-8 h-8" />
      </div>
      <p class="text-sm font-medium">Nenhum endereço encontrado.</p>
    </div>

    <div v-else class="divide-y overflow-y-auto flex-1 scrollbar-thin">
      <div 
        v-for="e in (showAll ? deliveryStore.filteredEnderecos : deliveryStore.operationalEnderecos)" 
        :key="e.id" 
        class="group p-4 hover:bg-muted/50 transition-all cursor-pointer flex items-center gap-4 border-l-4"
        :class="[
          deliveryStore.selectedEnderecoIds.includes(String(e.id)) 
            ? 'bg-primary/5 border-primary shadow-inner' 
            : 'border-transparent'
        ]"
        @click="toggleSelection(e.id)"
      >
        <div class="w-10 h-10 rounded-xl bg-muted flex items-center justify-center shrink-0 group-hover:bg-white transition-colors">
          <Package class="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        
        <div class="flex-1 min-w-0">
          <p class="font-black text-sm text-slate-900 truncate tracking-tight">{{ e.rua }}, {{ e.numero }}</p>
          <p class="text-xs text-muted-foreground font-bold uppercase truncate mt-0.5">{{ e.bairro }}</p>
        </div>

        <div class="flex items-center gap-3">
          <span 
            class="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter shadow-sm"
            :class="{
              'bg-amber-100 text-amber-700': e.status === 'pendente',
              'bg-blue-100 text-blue-700': e.status === 'em rota',
              'bg-emerald-100 text-emerald-700': e.status === 'entregue'
            }"
          >
            {{ e.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>