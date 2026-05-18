<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppToast from './components/ui/AppToast.vue';
</script>

<template>
  <AppToast />
  <RouterView />
</template>

<style>
@import "tailwindcss";

:root {
  --primary: #0f172a;
  --primary-foreground: #f8fafc;
}

body {
  margin: 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.bg-primary { background-color: var(--primary); }
.text-primary { color: var(--primary); }
.border-primary { border-color: var(--primary); }
</style>