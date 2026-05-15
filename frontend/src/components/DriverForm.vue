<script setup lang="ts">
import { ref } from 'vue';
import { useDeliveryStore } from '../stores/useDeliveryStore';
import { Users, X, UserCheck, Save, CreditCard } from 'lucide-vue-next';
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

// Mascara CPF: 000.000.000-00
const maskCPF = (e: any) => {
  let val = e.target.value.replace(/\D/g, '');
  if (val.length > 3) val = val.slice(0, 3) + '.' + val.slice(3);
  if (val.length > 7) val = val.slice(0, 7) + '.' + val.slice(7);
  if (val.length > 11) val = val.slice(0, 11) + '-' + val.slice(11, 13);
  form.value.cpf = val;
};

const handleSubmit = async () => {
  if (!form.value.nome || form.value.cpf.length < 14) {
    alert('Preencha os dados corretamente (Nome e CPF completo).');
    return;
  }
  isSubmitting.value = true;
  try {
    const success = await deliveryStore.addMotorista(form.value);
    if (success) {
      form.value = { nome: '', cpf: '' };
      alert('Motorista cadastrado com sucesso!');
      emit('close');
    }
  } catch (err) {
    alert('Erro ao cadastrar motorista.');
    console.error(err);
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
          <Users class="w-6 h-6" />
        </div>
        <div>
          <h2 class="text-xl font-black tracking-tight uppercase">Novo Motorista</h2>
          <p class="text-[10px] text-white/70 font-bold uppercase tracking-widest">Gestão de Equipe</p>
        </div>
      </div>
      <button @click="('close')" class="p-2 hover:bg-white/10 rounded-full transition-colors hidden lg:block">
        <X class="w-5 h-5" />
      </button>
    </div>

    <form @submit.prevent="handleSubmit" class="p-8 space-y-6">
      <div class="space-y-4">
        <div>
          <label class="text-[10px] font-black uppercase text-muted-foreground ml-1 mb-2 block">Nome Completo</label>
          <div class="relative">
            <AppInput v-model="form.nome" placeholder="Ex: João Silva" class="h-14 bg-muted/50 border-2 pl-12" />
            <Users class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
        </div>

        <div>
          <label class="text-[10px] font-black uppercase text-muted-foreground ml-1 mb-2 block">CPF</label>
          <div class="relative">
            <AppInput 
              v-model="form.cpf" 
              placeholder="000.000.000-00" 
              @input="maskCPF"
              maxlength="14"
              class="h-14 bg-muted/50 border-2 pl-12 font-mono text-lg" 
            />
            <CreditCard class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </div>

      <div class="pt-4">
        <AppButton 
          type="submit" 
          variant="primary" 
          class="w-full h-14 rounded-2xl font-black text-base shadow-lg shadow-primary/20 active:scale-95 transition-all"
          :loading="isSubmitting"
        >
          <UserCheck class="w-5 h-5 mr-3" />
          Registrar Motorista
        </AppButton>
      </div>
    </form>
  </AppCard>
</template>