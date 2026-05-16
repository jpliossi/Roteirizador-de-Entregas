<script setup lang="ts">
import { ref } from 'vue';
import { useDeliveryStore } from '../stores/useDeliveryStore';
import { Truck, X, Save, FileText, CreditCard } from 'lucide-vue-next';
import AppButton from './ui/AppButton.vue';
import AppInput from './ui/AppInput.vue';
import AppCard from './ui/AppCard.vue';

const deliveryStore = useDeliveryStore();
const emit = defineEmits(['close']);

const isSubmitting = ref(false);
const form = ref({
  placa: '',
  modelo: '',
  capacidade: 0
});

const maskPlate = (e: any) => {
  let val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
  if (val.length > 3) {
    // Formato AAA-9999 ou ABC-1D23 (Mercosul)
    const letters = val.slice(0, 3).replace(/[^A-Z]/g, '');
    const rest = val.slice(3).replace(/[^A-Z0-9]/g, '');
    val = letters + (rest ? '-' + rest : '');
  }
  form.value.placa = val.slice(0, 8);
};

const handleSubmit = async () => {
  if (form.value.placa.length < 8 || !form.value.modelo) {
    deliveryStore.addToast('Preencha a placa corretamente (Ex: AAA-9999) e o modelo.', 'error');
    return;
  }
  isSubmitting.value = true;
  try {
    const success = await deliveryStore.addVeiculo(form.value);
    if (success) {
      // Forçar atualização da lista para garantir visualização
      await deliveryStore.fetchVeiculos();
      form.value = { placa: '', modelo: '', capacidade: 0 };
      emit('close');
    }
  } catch (err) {
    deliveryStore.addToast('Erro ao registrar veículo.', 'error');
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <AppCard class="overflow-hidden border-none shadow-xl">
    <div class="bg-primary p-6 text-white flex justify-between items-center group">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
          <Truck class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-xl font-black tracking-tight uppercase">Novo Veículo</h2>
          <p class="text-[10px] text-white/70 font-bold uppercase tracking-widest">Frota Própria</p>
        </div>
      </div>
      <button @click="('close')" class="p-2 hover:bg-white/10 rounded-full transition-colors hidden lg:block">
        <X class="w-5 h-5" />
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="p-8 space-y-6">
      <div class="space-y-4">
        <div>
          <label class="text-[10px] font-black uppercase text-muted-foreground ml-1 mb-2 block">Placa</label>
          <div class="relative">
            <AppInput 
              v-model="form.placa" 
              placeholder="Ex: ABC-1234" 
              @input="maskPlate"
              maxlength="8"
              class="h-14 bg-muted/50 border-2 pl-12 font-mono text-lg font-bold" 
            />
            <CreditCard class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        <div>
           <label class="text-[10px] font-black uppercase text-muted-foreground ml-1 mb-2 block">Modelo / Marca</label>
           <div class="relative">
              <AppInput v-model="form.modelo" placeholder="Ex: Mercedes-Benz Sprinter" class="h-14 bg-muted/50 border-2 pl-12" />
              <FileText class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
           </div>
        </div>

        <div>
           <label class="text-[10px] font-black uppercase text-muted-foreground ml-1 mb-2 block">Capacidade (M³)</label>
           <AppInput v-model.number="form.capacidade" type="number" placeholder="Ex: 1500" class="h-14 bg-muted/50 border-2" />
        </div>
      </div>

      <div class="pt-4">
        <AppButton 
          type="submit" 
          variant="primary" 
          class="w-full h-14 rounded-2xl font-black text-base shadow-lg shadow-primary/20 active:scale-95 transition-all"
          :loading="isSubmitting"
        >
          <Save class="w-5 h-5 mr-3" />
          Salvar Veículo
        </AppButton>
      </div>
    </form>
  </AppCard>
</template>