<script setup lang="ts">
import { ref } from 'vue';
import { useDeliveryStore } from '../stores/useDeliveryStore';

const emit = defineEmits(['close']);
const deliveryStore = useDeliveryStore();

const form = ref({
  placa: '',
  modelo: '',
  capacidade: 0,
  motorista_id: 1 // Temporário enquanto não há seleção de motorista
});

const isSubmitting = ref(false);

const handleSubmit = async () => {
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
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
      <h2 class="text-xl font-bold text-gray-900 mb-6">Novo Veículo</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Placa</label>
          <input v-model="form.placa" type="text" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="ABC-1234">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Modelo</label>
          <input v-model="form.modelo" type="text" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Capacidade (m³)</label>
          <input v-model.number="form.capacidade" type="number" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
        </div>

        <div class="flex justify-end space-x-3 mt-8">
          <button type="button" @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md shadow-sm">
            Cancelar
          </button>
          <button type="submit" :disabled="isSubmitting" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors">
            Salvar Veículo
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
