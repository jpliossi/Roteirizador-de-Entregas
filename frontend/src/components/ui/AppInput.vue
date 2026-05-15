<script setup lang="ts">
defineProps<{
  label?: string;
  error?: string;
  modelValue?: string | number;
}>();
defineEmits(['update:modelValue']);
</script>

<template>
  <div class="space-y-2">
    <label v-if="label" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {{ label }}
    </label>
    <input
      :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      v-bind="$attrs"
      class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    />
    <p v-if="error" class="text-xs font-medium text-destructive">{{ error }}</p>
  </div>
</template>
