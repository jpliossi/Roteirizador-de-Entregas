<script setup lang="ts">
import { ref } from 'vue';
import { useDeliveryStore } from '../stores/useDeliveryStore';
import { GeocodingService } from '../services/ManagementApiService'; // Certifique-se que o caminho está correto
import type { Endereco } from '../services/ManagementApiService';

const deliveryStore = useDeliveryStore();
const emit = defineEmits(['close']);

const isSubmitting = ref(false);
const cepInput = ref(''); // Ref separada para o input de busca

// Formulário único com todos os campos necessários
const form = ref<Omit<Endereco, 'id' | 'status' | 'veiculo_id'>>({
  cep: '',
  rua: '',
  numero: '',
  bairro: '', // Agora o TS reconhece porque está na interface!
  cidade: '',
  estado: '',
  latitude: 0,
  longitude: 0
});

// Função para buscar dados pelo CEP
const handleCepBlur = async () => {
  const cleanCep = cepInput.value.replace(/\D/g, '');
  if (cleanCep.length >= 8) {
    try {
      const data = await GeocodingService.buscarEnderecoPorCEP(cleanCep);
      // Mescla os dados recebidos no formulário
      form.value = { 
        ...form.value, 
        rua: data.rua,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
        latitude: data.latitude,
        longitude: data.longitude
      };
    } catch (error) {
      alert("Erro ao buscar CEP. Verifique os dados.");
    }
  }
};

const handleSubmit = async () => {
  if (!form.value.numero) {
    alert("Por favor, preencha o número.");
    return;
  }

  isSubmitting.value = true;
  try {
    await deliveryStore.addEndereco({
      ...form.value,
      status: 'pendente'
    });
    emit('close');
  } catch (err) {
    console.error(err);
    alert("Erro ao salvar endereço.");
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
          <label class="block text-sm font-medium text-gray-700">CEP (Busca automática)</label>
          <input 
            v-model="cepInput" 
            @blur="handleCepBlur" 
            type="text" 
            required 
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
            placeholder="00000-000"
          >
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Rua</label>
          <input v-model="form.rua" type="text" readonly class="mt-1 block w-full bg-gray-50 border-gray-300 rounded-md shadow-sm sm:text-sm" placeholder="Preenchido pelo CEP">
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Número</label>
            <input v-model="form.numero" type="text" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Bairro</label>
            <input v-model="form.bairro" type="text" readonly class="mt-1 block w-full bg-gray-50 border-gray-300 rounded-md shadow-sm sm:text-sm">
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Cidade</label>
            <input v-model="form.cidade" type="text" readonly class="mt-1 block w-full bg-gray-50 border-gray-300 rounded-md shadow-sm sm:text-sm">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Estado</label>
            <input v-model="form.estado" type="text" readonly class="mt-1 block w-full bg-gray-50 border-gray-300 rounded-md shadow-sm sm:text-sm">
          </div>
        </div>

        <div class="flex justify-end space-x-3 mt-8">
          <button type="button" @click="$emit('close')" class="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md shadow-sm">
            Cancelar
          </button>
          <button type="submit" :disabled="isSubmitting" class="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors">
            {{ isSubmitting ? 'Salvando...' : 'Salvar Endereço' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>