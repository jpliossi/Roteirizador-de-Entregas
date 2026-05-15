<script setup lang="ts">
import { ref } from 'vue';
import { useDeliveryStore } from '../stores/useDeliveryStore';
import { GeocodingService } from '../services/ManagementApiService';
import { MapPin, Search, Plus, Save, Building2, Navigation, X } from 'lucide-vue-next';
import AppButton from './ui/AppButton.vue';
import AppInput from './ui/AppInput.vue';
import AppCard from './ui/AppCard.vue';

const emit = defineEmits(['close']);
const deliveryStore = useDeliveryStore();
const isSearching = ref(false);
const isSubmitting = ref(false);

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
  const cleanCep = form.value.cep.replace(/\D/g, '');
  if (cleanCep.length === 8) {
    isSearching.value = true;
    try {
      const data = await GeocodingService.buscarEnderecoPorCEP(cleanCep);
      form.value = { ...form.value, ...data };
    } catch (err) {
      deliveryStore.addToast('CEP não encontrado.', 'error');
    } finally {
      isSearching.value = false;
    }
  }
};

const handleSubmit = async () => {
  if (!form.value.rua || !form.value.numero) {
    deliveryStore.addToast('Preencha o logradouro e o número.', 'error');
    return;
  }
  isSubmitting.value = true;
  try {
    const success = await deliveryStore.addEndereco(form.value);
    if (success) {
      form.value = { cep: '', rua: '', numero: '', bairro: '', cidade: '', estado: '', latitude: 0, longitude: 0 };
      emit('close');
    }
  } catch (err) { /* Erro tratado na store */ } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <AppCard class="max-w-2xl w-full mx-auto overflow-hidden border-none shadow-2xl bg-white">
    <div class="bg-[#171717] p-6 text-white flex justify-between items-center">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
          <MapPin :size="24" class="text-white" />
        </div>
        <div>
          <h2 class="text-lg font-bold tracking-tight uppercase">Novo Destino</h2>
          <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Logística Receptiva</p>
        </div>
      </div>
      <button @click="emit('close')" class="text-gray-500 hover:text-white transition-colors">
        <X :size="20" />
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="p-8 space-y-6">
      <div class="space-y-6">
        <div class="relative group">
          <label class="text-[10px] font-black uppercase text-muted-foreground ml-1 mb-2 block tracking-widest">CEP Principal</label>
          <AppInput 
            v-model="form.cep" 
            placeholder="Ex: 01001-000" 
            @blur="handleCepBlur"
            class="pl-12"
          />
          <Search 
            class="absolute left-4 bottom-3.5 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" 
            :class="{'animate-spin': isSearching}" 
          />
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-9">
            <label class="text-[10px] font-black uppercase text-muted-foreground ml-1 mb-2 block tracking-widest">Logradouro</label>
            <AppInput v-model="form.rua" placeholder="Rua / Avenida" readonly class="bg-gray-50/50" />
          </div>
          <div class="col-span-3">
            <label class="text-[10px] font-black uppercase text-muted-foreground ml-1 mb-2 block tracking-widest">Nº</label>
            <AppInput v-model="form.numero" placeholder="123" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="relative group">
            <label class="text-[10px] font-black uppercase text-muted-foreground ml-1 mb-2 block tracking-widest">Bairro</label>
            <AppInput v-model="form.bairro" placeholder="Bairro" readonly class="pl-10 bg-gray-50/50" />
            <Building2 class="absolute left-3 bottom-4 w-4 h-4 text-muted-foreground" />
          </div>
          <div class="relative group">
            <label class="text-[10px] font-black uppercase text-muted-foreground ml-1 mb-2 block tracking-widest">Cidade</label>
            <AppInput v-model="form.cidade" placeholder="Cidade" readonly class="pl-10 bg-gray-50/50" />
            <Navigation class="absolute left-3 bottom-4 w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div class="pt-4">
        <AppButton 
          type="submit" 
          class="w-full h-14 bg-[#171717] hover:bg-black text-white rounded-2xl font-bold shadow-xl active:scale-[0.98] transition-all"
          :loading="isSubmitting"
        >
          <Save class="w-5 h-5 mr-3" />
          Registrar Destino
        </AppButton>
      </div>
    </form>
  </AppCard>
</template>