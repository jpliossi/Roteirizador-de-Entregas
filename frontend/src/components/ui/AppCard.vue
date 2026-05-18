<template>
  <div v-bind="$attrs" class="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
    <div v-if="$slots.header" class="border-b px-6 py-4">
      <slot name="header" />
    </div>
    <div class="p-6"> <slot />
    </div>
    <div v-if="$slots.footer" class="border-t px-6 py-4 bg-muted/50">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Desabilitamos a herança automática para controlar onde as classes caem
defineOptions({
  inheritAttrs: false
})
</script>