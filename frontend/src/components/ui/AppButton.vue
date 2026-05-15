<script setup lang="ts">
/// <reference types="c:/Users/jplio/.vscode/extensions/vue.volar-3.2.9/types/template-helpers.d.ts" />
/// <reference types="c:/Users/jplio/.vscode/extensions/vue.volar-3.2.9/types/props-fallback.d.ts" />
import type { LucideIcon } from 'lucide-vue-next';

defineProps<{
  icon?: LucideIcon;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}>();
</script>

<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
      variant === 'primary' ? 'bg-primary text-primary-foreground shadow hover:bg-primary/90' : '',
      variant === 'secondary' ? 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80' : '',
      variant === 'outline' ? 'border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground' : '',
      variant === 'ghost' ? 'hover:bg-accent hover:text-accent-foreground' : '',
      variant === 'destructive' ? 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90' : '',
      size === 'sm' ? 'h-8 px-3 text-xs' : '',
      size === 'md' ? 'h-9 px-4 py-2 text-sm' : '',
      size === 'lg' ? 'h-10 px-8 text-sm' : '',
      size === 'icon' ? 'h-9 w-9' : '',
    ]"
  >
    <component :is="icon" v-if="icon && !loading" class="mr-2 h-4 w-4" />
    <span v-if="loading" class="mr-2 h-4 w-4 animate-spin border-2 border-current border-t-transparent rounded-full" />
    <slot />
  </button>
</template>
