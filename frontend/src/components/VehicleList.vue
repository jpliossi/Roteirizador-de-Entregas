<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useDeliveryStore } from '../stores/useDeliveryStore';
import { Trash2, User, Truck, CheckCircle2, Navigation2, LogIn } from 'lucide-vue-next';

interface Veiculo {
  id: string;
  placa: string;
  modelo: string;
  capacidade: number;
  motorista_id: string | number | null;
  status: string;
}

const deliveryStore = useDeliveryStore();
const selectMotoristaId = ref<{ [key: string]: string | number }>({});

onMounted(async () => {
  await deliveryStore.fetchInitialData();
  // Inicializar o select com o ID do motorista atual de cada veículo
  deliveryStore.veiculos.forEach(v => {
    if (v.motorista_id) {
      selectMotoristaId.value[v.id!] = v.motorista_id;
    }
  });
});

const vincularMotorista = async (veiculoId: string) => {
  const motoristaId = selectMotoristaId.value[veiculoId];
  await deliveryStore.updateVeiculoMotorista(veiculoId, String(motoristaId) || null);
};

const deletarVeiculo = async (id: string) => {
  if (confirm('Tem certeza que deseja excluir este veículo?')) {
    await deliveryStore.removeVeiculo(id);
  }
};
</script>

<template>
  <div class="space-y-6">
    <div v-if="deliveryStore.veiculos.length === 0" class="text-center py-20 bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
      <Truck class="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <p class="text-slate-500 font-bold uppercase tracking-widest text-xs">Nenhum veículo cadastrado na frota</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      <div v-for="veiculo in deliveryStore.veiculos" :key="veiculo.id" 
           class="group bg-white border border-slate-100 rounded-[32px] p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col justify-between">
        
        <div class="space-y-4">
          <div class="flex items-start justify-between">
            <div class="p-4 bg-slate-900 text-white rounded-2xl shadow-lg shadow-slate-200">
              <p class="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Placa</p>
              <p class="font-black text-lg tracking-tighter">{{ veiculo.placa }}</p>
            </div>
            <div :class="veiculo.status === 'em rota' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'" 
                 class="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <span class="w-2 h-2 rounded-full animate-pulse" :class="veiculo.status === 'em rota' ? 'bg-blue-600' : 'bg-emerald-600'"></span>
              {{ veiculo.status }}
            </div>
          </div>

          <div>
            <h3 class="text-xl font-black text-slate-900 tracking-tight">{{ veiculo.modelo }}</h3>
            <p class="text-sm text-slate-500 font-bold uppercase tracking-widest">Capacidade: {{ veiculo.capacidade }} m³</p>
          </div>

          <!-- VINCULAR MOTORISTA -->
          <div class="pt-4 border-t border-slate-50">
            <label class="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Motorista Responsável</label>
            <div class="flex gap-2">
              <select 
                v-model="selectMotoristaId[veiculo.id!]"
                class="flex-1 bg-slate-50 border-0 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-slate-900 transition-all appearance-none"
              >
                <option :value="undefined">Nenhum Selecionado</option>
                <option v-for="m in deliveryStore.motoristas" :key="m.id" :value="m.id">
                  {{ m.nome }}
                </option>
              </select>
              <button 
                @click="vincularMotorista(veiculo.id!)"
                class="p-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-95"
                title="Salvar Vínculo"
              >
                <LogIn class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div class="mt-8 flex items-center justify-between gap-4">
          <button @click="deletarVeiculo(veiculo.id!)" 
                  class="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300">
            <Trash2 class="w-5 h-5" />
          </button>
          
          <div class="flex-1 flex gap-2">
            <div v-if="veiculo.status === 'em rota'" class="flex-1 py-4 text-center bg-blue-50 text-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
              <Navigation2 class="w-4 h-4" /> Em Rota
            </div>
            <div v-else class="flex-1 py-4 text-center bg-emerald-50 text-emerald-600 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
              <CheckCircle2 class="w-4 h-4" /> Disponível
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>