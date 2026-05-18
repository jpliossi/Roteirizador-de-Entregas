<script setup lang="ts">
import VehicleForm from '../components/VehicleForm.vue';
import VehicleList from '../components/VehicleList.vue';
</script>

<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div class="flex flex-col md:flex-row gap-8">
      <div class="flex-1">
        <VehicleList />
      </div>
      <div class="w-full md:w-96">
        <VehicleForm />
      </div>
    </div>
  </div>
</template>