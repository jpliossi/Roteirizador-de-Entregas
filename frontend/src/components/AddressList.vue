<script setup lang="ts">
import { useDeliveryStore } from '../stores/useDeliveryStore';
import { onMounted } from 'vue';
import { MapPin, RefreshCcw, CheckCircle2, Clock } from 'lucide-vue-next';
import AppBadge from './ui/AppBadge.vue';
import AppButton from './ui/AppButton.vue';

const deliveryStore = useDeliveryStore();

onMounted(() => {
  if (deliveryStore.enderecos.length === 0) {
    deliveryStore.fetchEnderecos();
  }
});

const getStatusVariant = (status?: string) => {
  switch (status?.toLowerCase()) {
    case 'pendente': return 'warning';
    case 'em rota': return 'secondary';
    case 'entregue': return 'success';
    default: return 'outline';
  }
};
</script>

<template>
  <div class="bg-card border rounded-xl overflow-hidden shadow-sm">
    <div class="px-6 py-4 border-b flex justify-between items-center bg-muted/30">
      <div class="flex items-center gap-2">
        <MapPin class="w-4 h-4 text-primary" />
        <h3 class="font-bold text-sm uppercase tracking-wider">Endereços Pendentes</h3>
      </div>
      <AppButton variant="ghost" size="sm" @click="deliveryStore.fetchEnderecos()" :loading="deliveryStore.loading">
        <RefreshCcw class="w-3.5 h-3.5 mr-2" v-if="!deliveryStore.loading" />
        Sincronizar
      </AppButton>
    </div>

    <div v-if="deliveryStore.loading && deliveryStore.enderecos.length === 0" class="p-12 text-center text-muted-foreground">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mb-4"></div>
      <p class="text-sm font-medium">Buscando geolocalização...</p>
    </div>

    <div v-else-if="deliveryStore.enderecos.length === 0" class="p-12 text-center text-muted-foreground border-dashed border-2 m-4 rounded-xl">
      <p class="text-sm">Sem pedidos pendentes no momento.</p>
    </div>

    <div v-else class="divide-y overflow-y-auto max-h-[600px] scrollbar-thin">
      <div 
        v-for="addr in deliveryStore.enderecos" 
        :key="addr.id" 
        class="group p-4 transition-all cursor-pointer flex items-center gap-4 relative border-l-4"
        :class="[
          deliveryStore.selectedEnderecoIds.includes(addr.id!) 
            ? 'bg-primary/5 border-primary' 
            : 'hover:bg-muted/50 border-transparent'
        ]"
        @click="deliveryStore.toggleEnderecoSelection(addr.id!)"
      >
        <div 
          class="w-5 h-5 rounded border-2 flex items-center justify-center transition-all flex-shrink-0"
          :class="[
            deliveryStore.selectedEnderecoIds.includes(addr.id!)
              ? 'bg-primary border-primary'
              : 'bg-transparent border-muted group-hover:border-primary/50'
          ]"
        >
          <svg v-if="deliveryStore.selectedEnderecoIds.includes(addr.id!)" class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke-width="3"/></svg>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <p class="font-bold text-sm truncate">{{ addr.rua }}, {{ addr.numero }}</p>
            <AppBadge :variant="getStatusVariant(addr.status || 'pendente')">{{ addr.status || 'Pendente' }}</AppBadge>
          </div>
          <p class="text-xs text-muted-foreground flex items-center mt-1">
            <span class="truncate">{{ addr.bairro }} • {{ addr.cidade }}</span>
          </p>
        </div>

        <div class="text-right flex-shrink-0">
          <p class="text-[10px] font-bold text-muted-foreground uppercase opacity-40">#{{ addr.id }}</p>
          <div class="flex gap-1 mt-2 justify-end">
             <CheckCircle2 class="w-3 h-3 text-emerald-500" v-if="addr.status === 'entregue'" />
             <Clock class="w-3 h-3 text-amber-500" v-if="addr.status === 'pendente'" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
