<script setup lang="ts">
import { ref } from 'vue';
import { useDeliveryStore } from '../stores/useDeliveryStore';

const emit = defineEmits(['close']);
const deliveryStore = useDeliveryStore();

const form = ref({
  nome: '',
  cpf: ''
});

const isSubmitting = ref(false);

const handleSubmit = async () => {
  if (form.value.cpf.replace(/\D/g, '').length !== 11) {
    alert('CPF deve ter 11 dígitos');
    return;
  }
  
  isSubmitting.value = true;
  try {
    await deliveryStore.addMotorista({
      nome: form.value.nome,
      cpf: form.value.cpf.replace(/\D/g, '')
    });
    emit('close');
  } catch (err) {
    console.error(err);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all scale-100">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-black text-gray-900 uppercase tracking-tighter">Novo Motorista</h2>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" stroke-width="2.5" /></svg>
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div>
          <label class="block text-xs font-black uppercase text-gray-500 mb-1 ml-1">Nome Completo</label>
          <input v-model="form.nome" type="text" required class="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-gray-900" placeholder="Ex: João Silva">
        </div>
        <div>
          <label class="block text-xs font-black uppercase text-gray-500 mb-1 ml-1">CPF (Apenas números)</label>
          <input v-model="form.cpf" type="text" maxlength="11" required class="block w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-gray-900" placeholder="000.000.000-00">
        </div>

        <div class="flex flex-col gap-3 pt-6">
          <button type="submit" :disabled="isSubmitting" class="w-full py-4 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200 uppercase tracking-widest text-sm">
            {{ isSubmitting ? 'Cadastrando...' : 'Finalizar Cadastro' }}
          </button>
          <button type="button" @click="$emit('close')" class="w-full py-3 text-gray-400 font-bold hover:text-gray-600 transition-all text-sm uppercase">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
