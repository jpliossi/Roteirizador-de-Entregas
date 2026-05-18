<script setup lang="ts">
import { useDeliveryStore, type ToastInfo } from '../../stores/useDeliveryStore';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  X
} from 'lucide-vue-next';

const deliveryStore = useDeliveryStore();

const getIcon = (type: string) => {
  if (type === 'success') return CheckCircle2;
  if (type === 'error') return AlertCircle;
  return Info;
};

const getColor = (type: string) => {
  if (type === 'success') return 'bg-emerald-500 text-white';
  if (type === 'error') return 'bg-red-500 text-white';
  return 'bg-blue-500 text-white';
};
defineOptions({
  inheritAttrs: false // ISSO AQUI MATA A DUPLICIDADE DE BORDAS
})
</script>

<template>
  <div class="fixed top-6 right-6 z-50 space-y-3 pointer-events-none">
    <TransitionGroup 
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform translate-x-20 opacity-0"
      enter-to-class="transform translate-x-0 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform translate-x-0 opacity-100"
      leave-to-class="transform translate-x-20 opacity-0"
    >
      <div 
        v-for="toast in deliveryStore.toasts" 
        :key="toast.id"
        class="pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl min-w-[320px] max-w-md border border-white/10 backdrop-blur-md"
        :class="getColor(toast.type)"
      >
        <div class="shrink-0 p-2 bg-white/20 rounded-lg">
          <component :is="getIcon(toast.type)" class="w-5 h-5" />
        </div>
        <div class="flex-1">
          <p class="font-black text-sm tracking-tight">{{ toast.message }}</p>
        </div>
        <button 
          @click="deliveryStore.toasts = deliveryStore.toasts.filter((t: ToastInfo) => t.id !== toast.id)"
          class="shrink-0 p-1 hover:bg-black/10 rounded-full transition-colors"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>