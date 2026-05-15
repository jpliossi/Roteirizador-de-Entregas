<script setup lang="ts">
import { ref } from 'vue';
import { useDeliveryStore } from '../stores/useDeliveryStore';
import { Truck, X, Save } from 'lucide-vue-next';
import AppButton from './ui/AppButton.vue';
import AppInput from './ui/AppInput.vue';
import AppCard from './ui/AppCard.vue';

const deliveryStore = useDeliveryStore();
const emit = defineEmits(['close']);

const isSubmitting = ref(false);
const form = ref({
  placa: '',
  modelo: '',
  capacidade: 1000
});

const handleSubmit = async () => {
  if (!form.value.placa || !form.value.modelo) return;
  isSubmitting.value = true;
  try {
    await deliveryStore.addVeiculo(form.value);
    emit('close');
  } catch (err) {
    console.error(err);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <AppCard class="shadow-2xl border-none p-0 overflow-hidden">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
           <div class="p-2 bg-primary/10 rounded-lg">
             <Truck class="w-5 h-5 text-primary" />
           </div>
           <div>
             <h2 class="text-xl font-bold">Incorporar Veículo</h2>
             <p class="text-xs text-muted-foreground uppercase font-semibold">Expansão de Frota</p>
           </div>
        </div>
        <button @click="emit('close')" class="p-2 hover:bg-muted rounded-full transition-colors">
          <X class="w-5 h-5" />
        </button>
      </div>
    </template>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="grid grid-cols-2 gap-4">
        <AppInput v-model="form.placa" label="Placa" placeholder="ABC-1234" />
        <AppInput v-model="form.modelo" label="Modelo" placeholder="MB Sprinter" />
      </div>

      <AppInput v-model="form.capacidade" label="Capacidade de Carga (kg)" type="number" />

      <div class="flex gap-3 pt-2">
        <AppButton type="submit" variant="primary" class="w-full h-12 text-md font-bold" :loading="isSubmitting" :icon="Save">
          Confirmar Cadastro
        </AppButton>
      </div>
    </form>
  </AppCard>
</template>
