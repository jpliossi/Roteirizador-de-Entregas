<script setup lang="ts">
// 1. Desabilitamos a herança automática
defineOptions({
  inheritAttrs: false
});

defineProps<{
  label?: string;
  error?: string;
  modelValue?: string | number;
}>();

defineEmits(['update:modelValue']);
</script>

<template>
  <div class="space-y-1.5">
    <label v-if="label" class="text-[10px] font-black uppercase text-muted-foreground ml-1 tracking-widest">
      {{ label }}
    </label>
    
    <input
      :value="modelValue"
      @input="$event => $emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      v-bind="$attrs"
      class="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    />
    
    <p v-if="error" class="text-xs font-medium text-destructive mt-1">{{ error }}</p>
  </div>
</template>