<script setup lang="ts">
import { useDeliveryStore } from '../stores/useDeliveryStore';
import { User as UserIcon, RotateCcw, Trash2} from 'lucide-vue-next';
import AppButton from './ui/AppButton.vue';

const deliveryStore = useDeliveryStore();

const formatCPF = (cpf: string) => {
  if (!cpf) return '---';
  const clean = cpf.replace(/\D/g, '');
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '***..-**');
};

const deleteDriver = async (id: any) => {
  if (confirm('Deseja realmente remover este motorista?')) {
    await deliveryStore.removeMotorista(String(id));
  }
};
</script>

<template>
  <div class="bg-card border rounded-xl overflow-hidden shadow-sm">
    <div class="px-4 py-3 border-b flex justify-between items-center bg-muted/30">
      <div class="flex items-center gap-2">
        <UserIcon class="w-3.5 h-3.5 text-primary" />
        <h3 class="font-bold text-[10px] uppercase tracking-wider">Equipe</h3>
      </div>
      <AppButton variant="ghost" size="sm" @click="deliveryStore.fetchMotoristas()" :loading="deliveryStore.loading" class="h-6 w-6 p-0">
        <RotateCcw class="w-3 h-3" v-if="!deliveryStore.loading" />
      </AppButton>
    </div>

    <div v-if="deliveryStore.filteredMotoristas.length === 0" class="p-4 text-center text-muted-foreground italic text-[10px]">
      Vazio.
    </div>

    <div v-else class="divide-y overflow-y-auto max-h-40 scrollbar-thin">
      <div 
        v-for="m in deliveryStore.filteredMotoristas" 
        :key="m.id" 
        class="group p-2 hover:bg-muted/50 transition-all flex items-center gap-2"
      >
        <div class="flex-1 min-w-0">
          <p class="font-bold text-[10px] truncate uppercase">{{ m.nome }}</p>
          <p class="text-[9px] font-mono text-muted-foreground">{{ formatCPF(m.cpf) }}</p>
        </div>
        <button @click="deleteDriver(m.id)" class="opacity-0 group-hover:opacity-100 p-1 text-red-500"><Trash2 class="w-3 h-3"/></button>
      </div>
    </div>
  </div>
</template>