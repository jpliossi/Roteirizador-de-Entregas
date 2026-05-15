<script setup lang="ts">
import { ref } from 'vue';
import { useDeliveryStore } from '../stores/useDeliveryStore';
import { GeocodingService } from '../services/ManagementApiService';
import { MapPin, X, Navigation, Search } from 'lucide-vue-next';
import AppButton from './ui/AppButton.vue';
import AppInput from './ui/AppInput.vue';
import AppCard from './ui/AppCard.vue';

const deliveryStore = useDeliveryStore();
const emit = defineEmits(['close']);

const isSubmitting = ref(false);
const isSearching = ref(false);
const cepInput = ref('');

const form = ref({
  cep: '',
  rua: '',
  numero: '',
  bairro: '',
  cidade: '',
  estado: '',
  latitude: 0,
  longitude: 0
});

const handleCepBlur = async () => {
  const cleanCep = cepInput.value.replace(/\D/g, '');
  if (cleanCep.length >= 8) {
    isSearching.value = true;
    try {
      const data = await GeocodingService.buscarEnderecoPorCEP(cleanCep);
      form.value = { 
        ...form.value, 
        cep: cleanCep,
        rua: data.rua,
        bairro: data.bairro,
        cidade: data.cidade,
        estado: data.estado,
        latitude: data.latitude,
        longitude: data.longitude
      };
    } catch (error) {
       // Silent error for simplicity
    } finally {
      isSearching.value = false;
    }
  }
};

const handleSubmit = async () => {
  if (!form.value.numero || !form.value.rua) return;
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
  <AppCard class="shadow-2xl border-none p-0 overflow-hidden">
    <template #header>
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
           <div class="p-2 bg-primary/10 rounded-lg">
             <MapPin class="w-5 h-5 text-primary" />
           </div>
           <div>
             <h2 class="text-xl font-bold">Novo Destino</h2>
             <p class="text-xs text-muted-foreground uppercase font-semibold">Logística Receptiva</p>
           </div>
        </div>
        <button @click="emit('close')" class="p-2 hover:bg-muted rounded-full transition-colors">
          <X class="w-5 h-5" />
        </button>
      </div>
    </template>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <div class="relative">
        <AppInput 
          v-model="cepInput" 
          @blur="handleCepBlur" 
          label="CEP Principal"
          placeholder="Ex: 01001-000"
        />
        <div v-if="isSearching" class="absolute right-3 top-9">
          <div class="h-4 w-4 animate-spin border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="md:col-span-3">
          <AppInput v-model="form.rua" label="Logradouro" readonly class="bg-muted cursor-not-allowed" />
        </div>
        <div>
          <AppInput v-model="form.numero" label="Nº" type="text" required />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <AppInput v-model="form.bairro" label="Bairro" readonly class="bg-muted cursor-not-allowed" />
        <AppInput v-model="form.cidade" label="Cidade" readonly class="bg-muted cursor-not-allowed" />
      </div>

      <div class="bg-primary/5 p-4 rounded-xl flex items-center gap-4" v-if="form.latitude">
        <div class="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
          <Navigation class="w-5 h-5 text-primary" />
        </div>
        <div>
          <p class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Coordenadas Ativas</p>
          <p class="text-sm font-mono font-bold">{{ form.latitude.toFixed(4) }}, {{ form.longitude.toFixed(4) }}</p>
        </div>
      </div>

      <div class="flex gap-3 pt-2">
        <AppButton type="submit" variant="primary" class="w-full h-12 text-md font-bold" :loading="isSubmitting" :disabled="!form.rua">
          Registrar Destino
        </AppButton>
      </div>
    </form>
  </AppCard>
</template>
