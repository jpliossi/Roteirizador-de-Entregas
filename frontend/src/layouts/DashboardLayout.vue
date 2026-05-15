<script setup lang="ts">
import { useDeliveryStore } from '../stores/useDeliveryStore';
import { LayoutDashboard, MapPin, Truck, Users, Map, PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const isCollapsed = ref(false);
const deliveryStore = useDeliveryStore();
const route = useRoute();

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: MapPin, label: 'Endereços', path: '/enderecos' },
  { icon: Truck, label: 'Veículos', path: '/veiculos' },
  { icon: Users, label: 'Motoristas', path: '/motoristas' },
  { icon: Map, label: 'Roteirização', path: '/rotas' },
];
</script>

<template>
  <div class="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
    <!-- Sidebar -->
    <aside 
      :class="[
        'bg-white border-r border-slate-200 transition-all duration-300 flex flex-col shadow-sm z-20',
        isCollapsed ? 'w-20' : 'w-72'
      ]"
    >
      <!-- Logo Area -->
      <div class="p-6 flex items-center gap-3 border-b border-slate-100">
        <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
          <Truck class="text-white w-6 h-6" />
        </div>
        <span v-if="!isCollapsed" class="font-black text-xl tracking-tighter text-slate-900 italic uppercase">
          Track<span class="text-primary">Land</span>
        </span>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 p-3.5 rounded-xl transition-all group relative overflow-hidden"
          active-class="bg-primary/5 text-primary"
          :class="[isCollapsed ? 'justify-center' : 'hover:bg-slate-50']"
        >
          <div class="relative z-10">
            <component :is="item.icon" class="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <span v-if="!isCollapsed" class="font-bold text-sm tracking-tight relative z-10">{{ item.label }}</span>
          
          <!-- Indicator active -->
          <div v-if="item.path === route.path" class="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r"></div>
        </router-link>
      </nav>

      <!-- Toggle Button -->
      <div class="p-4 border-t border-slate-100">
        <button 
          @click="isCollapsed = !isCollapsed"
          class="flex items-center gap-3 w-full p-3.5 rounded-xl hover:bg-slate-50 transition-all text-slate-500 hover:text-primary"
          :class="[isCollapsed ? 'justify-center' : '']"
        >
          <component :is="isCollapsed ? PanelLeftOpen : PanelLeftClose" class="w-5 h-5" />
          <span v-if="!isCollapsed" class="font-bold text-sm">Recolher</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden relative">
      <!-- Topbar -->
      <header class="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between z-10 sticky top-0">
        <div class="flex items-center gap-6 flex-1">
           <h1 class="text-lg font-black text-slate-900 capitalize hidden md:block">
             {{ menuItems.find(i => i.path === route.path)?.label || 'Bem-vindo' }}
           </h1>
        </div>

        <div class="flex items-center gap-4">
          <button class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors relative">
             <div class="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
             <Users class="w-5 h-5" />
          </button>
          
          <div class="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div class="text-right hidden sm:block">
              <p class="text-xs font-black text-slate-900 leading-none">Admin Jr</p>
              <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Logística</p>
            </div>
            <div class="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-sm border-2 border-white shadow-md">
               JD
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-8 bg-slate-50/50">
        <div class="max-w-7xl mx-auto">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>