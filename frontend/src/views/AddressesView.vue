<script setup lang="ts">
import AddressForm from '../components/AddressForm.vue';
import AddressList from '../components/AddressList.vue';
</script>

<template>
  <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div class="flex flex-col md:flex-row gap-8">
      <div class="flex-1">
        <AddressList />
      </div>
      <div class="w-full md:w-96">
        <AddressForm />
      </div>
    </div>
  </div>
</template>