<script setup lang="ts">
defineProps<{
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}>();
</script>

<template>
  <div
    :class="[
      'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
      variant === 'secondary' ? 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80' : '',
      variant === 'destructive' ? 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80' : '',
      variant === 'outline' ? 'text-foreground' : '',
      variant === 'success' ? 'border-transparent bg-emerald-500/15 text-emerald-600' : '',
      variant === 'warning' ? 'border-transparent bg-amber-500/15 text-amber-600' : '',
      !variant || variant === 'default' ? 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80' : '',
    ]"
  >
    <slot />
  </div>
</template>
