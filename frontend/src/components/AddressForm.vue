<script setup lang="ts">
import { ref } from 'vue';
import { type Endereco } from '../services/ManagementApiService';
import { useDeliveryStore } from '../stores/useDeliveryStore';

const deliveryStore = useDeliveryStore();
const emit = defineEmits(['close']);

const form = ref<Omit<Endereco, 'id' | 'status'>>({
  logradouro: '',
  numero: '',
  bairro: '',
  cidade: '',
  estado: '',
  cep: '',
  latitude: 0,
  longitude: 0
});

const isSubmitting = ref(false);

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    await deliveryStore.addEndereco({
      ...form.value,
      status: 'pendente'
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
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6">Novo Endereço de Entrega</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Logradouro</label>
          <input v-model="form.logradouro" type="text" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Rua das Flores">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Número</label>
            <input v-model="form.numero" type="text" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">CEP</label>
            <input v-model="form.cep" type="text" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Cidade</label>
            <input v-model="form.cidade" type="text" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Estado</label>
            <input v-model="form.estado" type="text" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-8">
          <button type="button" @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md shadow-sm">
            Cancelar
          </button>
          <button type="submit" :disabled="isSubmitting" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors">
            Salvar Endereço
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
