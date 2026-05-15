<script setup lang="ts">
import { ref } from 'vue';
import { 
  LayoutDashboard, 
  MapPin, 
  Truck, 
  Users, 
  Route, 
  Settings, 
  ChevronLeft, 
  Menu,
  Bell,
  Search
} from 'lucide-vue-next';

const isCollapsed = ref(false);

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Endereços', icon: MapPin, path: '/enderecos' },
  { name: 'Veículos', icon: Truck, path: '/veiculos' },
  { name: 'Motoristas', icon: Users, path: '/motoristas' },
  { name: 'Roteirização', icon: Route, path: '/rotas' },
];
</script>

<template>
  <div class="flex h-screen bg-secondary/30">
    <!-- Sidebar -->
    <aside 
      :class="[
        'relative bg-card border-r transition-all duration-300 flex flex-col',
        isCollapsed ? 'w-20' : 'w-64'
      ]"
    >
      <div class="p-6 flex items-center gap-3 h-16 border-b">
        <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground flex-shrink-0">
          <Truck class="w-5 h-5" />
        </div>
        <span v-if="!isCollapsed" class="font-bold text-lg tracking-tight">TrackLand</span>
      </div>

      <nav class="flex-1 p-4 space-y-2">
        <router-link 
          v-for="item in navItems" 
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group relative text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          active-class="bg-primary text-primary-foreground shadow-sm"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span v-if="!isCollapsed" class="font-medium text-sm">{{ item.name }}</span>
          
          <!-- Tooltip for collapsed -->
          <div 
            v-if="isCollapsed" 
            class="absolute left-full ml-4 px-2 py-1 bg-primary text-primary-foreground text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50"
          >
            {{ item.name }}
          </div>
        </router-link>
      </nav>

      <div class="p-4 border-t">
        <button 
          @click="isCollapsed = !isCollapsed"
          class="w-full flex items-center gap-3 p-3 rounded-lg text-muted-foreground hover:bg-accent transition-all"
        >
          <component :is="isCollapsed ? Menu : ChevronLeft" class="w-5 h-5" />
          <span v-if="!isCollapsed" class="font-medium text-sm">Recolher</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col overflow-hidden">
      <!-- Topbar -->
      <header class="h-16 border-b bg-card px-8 flex items-center justify-between">
        <div class="flex items-center gap-4 flex-1">
          <div class="relative w-96 max-w-full">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Pesquisar entregas, veículos..." 
              class="w-full pl-10 pr-4 py-2 bg-secondary/50 border-none rounded-full text-sm focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>

        <div class="flex items-center gap-4">
          <button class="relative p-2 rounded-full hover:bg-accent transition-colors">
            <Bell class="w-5 h-5" />
            <span class="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
          </button>
        </div>
      </header>

      <!-- Page Content -->
      <div class="flex-1 overflow-y-auto p-8">
        <div class="max-w-7xl mx-auto">
          <router-view v-slot="{ Component }">
            <transition name="page" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
