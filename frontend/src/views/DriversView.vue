<script setup lang="ts">
import DriverForm from '../components/DriverForm.vue';
import DriverList from '../components/DriverList.vue';
</script>

<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div class="flex flex-col md:flex-row gap-8">
      <div class="flex-1">
        <DriverList />
      </div>
      <div class="w-full md:w-96">
        <DriverForm />
      </div>
    </div>
  </div>
</template>