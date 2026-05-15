<script setup lang="ts">
import { ref } from 'vue';
import { useDeliveryStore } from '../stores/useDeliveryStore';
import { GeocodingService } from '../services/ManagementApiService';
import { MapPin, Search, Plus, Save, Building2, Navigation } from 'lucide-vue-next';
import AppButton from './ui/AppButton.vue';
import AppInput from './ui/AppInput.vue';
import AppCard from './ui/AppCard.vue';

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
  if (form.value.cep.replace(/\D/g, '').length === 8) {
    isSearching.value = true;
    try {
      const data = await GeocodingService.buscarEnderecoPorCEP(form.value.cep);
      form.value = { ...form.value, ...data };
    } catch (err) {
      alert('CEP não encontrado.');
    } finally {
      isSearching.value = false;
    }
  }
};

const handleSubmit = async () => {
  if (!form.value.rua || !form.value.numero) {
    alert('Preencha o logradouro e o número.');
    return;
  }
  isSubmitting.value = true;
  try {
    const success = await deliveryStore.addEndereco(form.value);
    if (success) {
      // Manter a lista atualizada
      await deliveryStore.fetchEnderecos();
      form.value = { cep: '', rua: '', numero: '', bairro: '', cidade: '', estado: '', latitude: 0, longitude: 0 };
      alert('Endereço registrado com sucesso!');
    }
  } catch (err) {
    alert('Erro ao registrar endereço.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>
<template>
  <AppCard class="overflow-hidden border-none shadow-xl bg-white">
    <div class="bg-primary p-6 text-white flex justify-between items-center group">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-white/20 rounded-xl group-hover:scale-110 transition-transform">
          <MapPin class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-xl font-black tracking-tight uppercase">Novo Destino</h2>
          <p class="text-[10px] text-white/70 font-bold uppercase tracking-widest">Logística Receptiva</p>
        </div>
      </div>
      <div class="hidden lg:block text-white/30">
        <Plus class="w-8 h-8" />
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="p-8 space-y-6">
      <div class="space-y-4">
        <div>
          <label class="text-[10px] font-black uppercase text-muted-foreground ml-1 mb-2 block tracking-widest">CEP Principal</label>
          <div class="relative group">
            <AppInput 
              v-model="form.cep" 
              placeholder="Ex: 01001-000" 
              @blur="handleCepBlur"
              class="h-14 pl-12 focus:ring-2 transition-all shadow-sm"
            />
            <Search 
              class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground transition-colors group-focus-within:text-primary" 
              :class="{'animate-spin': isSearching}" 
            />
          </div>
        </div>

        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-8">
            <label class="text-[10px] font-black uppercase text-muted-foreground ml-1 mb-2 block tracking-widest">Logradouro</label>
            <AppInput 
              v-model="form.rua" 
              placeholder="Rua / Avenida" 
              class="h-14 shadow-sm"
              readonly
            />
          </div>
          <div class="col-span-4">
            <label class="text-[10px] font-black uppercase text-muted-foreground ml-1 mb-2 block tracking-widest">Nº</label>
            <AppInput 
              v-model="form.numero" 
              placeholder="123" 
              class="h-14 shadow-sm"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="text-[10px] font-black uppercase text-muted-foreground ml-1 mb-2 block tracking-widest">Bairro</label>
            <div class="relative group">
              <AppInput 
                v-model="form.bairro" 
                placeholder="Bairro" 
                class="h-14 pl-10 shadow-sm"
                readonly
              />
              <Building2 class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
            </div>
          </div>
          <div>
            <label class="text-[10px] font-black uppercase text-muted-foreground ml-1 mb-2 block tracking-widest">Cidade</label>
            <div class="relative group">
              <AppInput 
                v-model="form.cidade" 
                placeholder="Cidade" 
                class="h-14 pl-10 shadow-sm"
                readonly
              />
              <Navigation class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
            </div>
          </div>
        </div>
      </div>

      <div class="pt-4">
        <AppButton 
          type="submit" 
          variant="primary" 
          class="w-full h-14 rounded-2xl font-black text-base shadow-lg shadow-primary/20 active:scale-[0.98] transition-all"
          :loading="isSubmitting"
        >
          <Save class="w-5 h-5 mr-3" />
          Registrar Destino
        </AppButton>
      </div>
    </form>
  </AppCard>
</template>