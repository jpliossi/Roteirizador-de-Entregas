<script setup lang="ts">
import { ref } from 'vue';
import { useDeliveryStore } from '../stores/useDeliveryStore';
import { Users, X, UserCheck } from 'lucide-vue-next';
import AppButton from './ui/AppButton.vue';
import AppInput from './ui/AppInput.vue';
import AppCard from './ui/AppCard.vue';

const deliveryStore = useDeliveryStore();
const emit = defineEmits(['close']);

const isSubmitting = ref(false);
const form = ref({
  nome: '',
  cpf: ''
});

const handleSubmit = async () => {
  if (!form.value.nome || !form.value.cpf) return;
  isSubmitting.value = true;
  try {
    await deliveryStore.addMotorista(form.value);
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
             <Users class="w-5 h-5 text-primary" />
           </div>
           <div>
             <h2 class="text-xl font-bold">Credenciar Motorista</h2>
             <p class="text-xs text-muted-foreground uppercase font-semibold">RH Logística</p>
           </div>
        </div>
        <button @click="emit('close')" class="p-2 hover:bg-muted rounded-full transition-colors">
          <X class="w-5 h-5" />
        </button>
      </div>
    </template>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <AppInput v-model="form.nome" label="Nome Completo" placeholder="Ex: João Silva" />
      <AppInput v-model="form.cpf" label="CPF" placeholder="000.000.000-00" />

      <div class="flex gap-3 pt-2">
        <AppButton type="submit" variant="primary" class="w-full h-12 text-md font-bold" :loading="isSubmitting" :icon="UserCheck">
          Finalizar Cadastro
        </AppButton>
      </div>
    </form>
  </AppCard>
</template>
