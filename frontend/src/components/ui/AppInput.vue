<script setup lang="ts">
import { useAttrs } from 'vue';

// 1. Desabilitamos a herança automática de atributos na raiz (div)
defineOptions({
  inheritAttrs: false
});

defineProps<{
  label?: string;
  error?: string;
  modelValue?: string | number;
}>();

defineEmits(['update:modelValue']);
// Pegamos os atributos (classes, IDs, eventos)
const attrs = useAttrs();
</script>

<template>
  <div class="space-y-1.5 w-full">
    <label v-if="label" class="text-[11px] font-black uppercase text-muted-foreground ml-1 tracking-widest">
      {{ label }}
    </label>
    
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      v-bind="attrs"
      class="flex h-12 w-full rounded-lg border border-input bg-background px-4 py-2 text-sm shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50"
    />
    
    <p v-if="error" class="text-xs font-medium text-destructive mt-1">{{ error }}</p>
  </div>
</template>