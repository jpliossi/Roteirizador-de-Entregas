<script setup lang="ts">
import { onMounted } from 'vue';
import { useDeliveryStore } from '../stores/useDeliveryStore';
import AddressList from '../components/AddressList.vue';

const deliveryStore = useDeliveryStore();

// CRUCIAL: Forçar o carregamento sempre que o usuário entrar nessa rota
onMounted(async () => {
  try {
    await deliveryStore.fetchEnderecos();
  } catch (error) {
    deliveryStore.addToast('Erro ao carregar a lista de endereços.', 'error');
  }
});
</script>

<template>
  <div class="p-8 space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-black tracking-tight text-[#171717]">Gerenciamento de Endereços</h1>
        <p class="text-sm text-muted-foreground">Cadastre e gerencie os pontos de entrega.</p>
      </div>
      </div>

    <AddressList />
  </div>
</template>