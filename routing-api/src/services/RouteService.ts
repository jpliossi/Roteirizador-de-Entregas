import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import axios from 'axios';

export interface Endereco {
  id: string;
  latitude: number;
  longitude: number;
}

export class RouteService {
  private prisma: PrismaClient;
  private managementApiUrl = process.env.MANAGEMENT_API_URL || 'http://management-api:3000';

  constructor() {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    this.prisma = new PrismaClient({ adapter });
  }

  /**
   * Salva a rota no banco local e atualiza o status dos endereços na management-api.
   */
  async efetivarRota(veiculo_id: string, ordem_ids: string[]) {
    // 1. Salva a rota no histórico
    const rota = await this.prisma.rota.create({
      data: {
        //status: 'em_rota',
        veiculo_id,
        ordem_ids,
      },
    });

    // 2. IMPORTANTE: O Rails precisa saber QUAL veículo pegou esses endereços
    // Adicione o veiculo_id no corpo da requisição para a management-api
    await axios.put(`${this.managementApiUrl}/enderecos/atualizar_status`, {
      endereco_ids: ordem_ids, // plural e snake_case
      veiculo_id: veiculo_id,  // EXATAMENTE assim para o Rails entender
      status: 'em rota'        // use "em rota" com espaço, como está no seu Rails
    });

    return {
      message: 'Rota efetivada e status dos endereços atualizados.',
      rota_id: rota.id,
      veiculo_id: rota.veiculo_id,
      ordem_ids: rota.ordem_ids,
      status: 'em_rota'
    };
  }

  /**
   * Busca a última rota ativa de um veículo.
   */
  async buscarUltimaRotaPorVeiculo(veiculo_id: string) {
    const rota = await this.prisma.rota.findFirst({
      where: { veiculo_id: String(veiculo_id) },
      orderBy: { createdAt: 'desc' }
    });

    if (!rota) throw new Error('Rota não encontrada');
    return rota;
  }

  /**
   * Ordena endereços com base na proximidade das coordenadas (ponto a ponto).
   * Começando do primeiro endereço fornecido.
   */

  async calculateRoute(veiculo_id: string, enderecos: Endereco[]) {
    if (enderecos.length === 0) return { ordem_ids: [], distancia_total: 0, tempo_estimado: 0 };

    const orderedEnderecos: Endereco[] = [];
    const remaining = [...enderecos];
    let totalDistance = 0;

    let current = remaining.shift()!;
    orderedEnderecos.push(current);

    while (remaining.length > 0) {
      let closestIndex = 0;
      
      // Usamos o operador "!" ou uma verificação simples para garantir o primeiro item
      let firstRemaining = remaining[0];
      if (!firstRemaining) break; 

      let minDistance = this.calculateDistance(current, firstRemaining);

      for (let i = 1; i < remaining.length; i++) {
        const nextCandidate = remaining[i];
        if (!nextCandidate) continue;

        const dist = this.calculateDistance(current, nextCandidate);
        if (dist < minDistance) {
          minDistance = dist;
          closestIndex = i;
        }
      }

      // Acumula a distância (multiplicamos por 111 para converter graus em KM aprox.)
      totalDistance += minDistance;

      // Remove o escolhido do array de "restantes" e torna ele o "atual"
      current = remaining.splice(closestIndex, 1)[0]!;
      orderedEnderecos.push(current);
    }

    // Cálculos simples de logística:
    // 1. Converter distância euclidiana para KM aproximado (fator de correção de 111km por grau)
    const distanciaEmKm = totalDistance * 111; 
    
    // 2. Tempo estimado (Velocidade média de 40km/h + 10 min por entrega)
    const tempoEmMinutos = (distanciaEmKm / 40) * 60 + (orderedEnderecos.length * 10);

    // Persistir no banco...
    const rota = await this.prisma.rota.create({
      data: {
        veiculo_id: String(veiculo_id),
        ordem_ids: orderedEnderecos.map(e => String(e.id)),
      },
    });

  return {
    id: rota.id,
    veiculo_id: rota.veiculo_id,
    ordem_ids: rota.ordem_ids,
    ordem_sugerida: orderedEnderecos,
    distancia_total: Number(distanciaEmKm.toFixed(2)), // Envia para o Front
    tempo_estimado: Math.round(tempoEmMinutos)    // Envia para o Front
    
  };
}

  private calculateDistance(p1: Endereco, p2: Endereco): number {
    // Distância Euclidiana simples 
    return Math.sqrt(
      Math.pow(p2.latitude - p1.latitude, 2) + Math.pow(p2.longitude - p1.longitude, 2)
    );
  }
}
