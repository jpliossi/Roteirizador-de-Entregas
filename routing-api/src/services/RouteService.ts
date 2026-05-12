import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

export interface Endereco {
  id: string;
  latitude: number;
  longitude: number;
}

export class RouteService {
  private prisma: PrismaClient;

  constructor() {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    this.prisma = new PrismaClient({ adapter });
  }

  /**
   * Ordena endereços com base na proximidade das coordenadas (ponto a ponto).
   * Começando do primeiro endereço fornecido.
   */
  async calculateRoute(veiculo_id: string, enderecos: Endereco[]) {
    
    if (enderecos.length === 0) return [];

    const orderedEnderecos: Endereco[] = [];
    const remaining = [...enderecos];

    // Começamos pelo primeiro endereço da lista (ponto de partida)
    const first = remaining.shift();
    if (!first) return [];
    
    let current: Endereco = first;
    orderedEnderecos.push(current);

    while (remaining.length > 0) {
      let closestIndex = 0;
      const nextPotential = remaining[0];
      if (!nextPotential) break;

      let minDistance = this.calculateDistance(current, nextPotential);

      for (let i = 1; i < remaining.length; i++) {
        const potential = remaining[i];
        if (!potential) continue;

        const dist = this.calculateDistance(current, potential);
        if (dist < minDistance) {
          minDistance = dist;
          closestIndex = i;
        }
      }

      const next = remaining.splice(closestIndex, 1)[0];
      if (!next) break;

      current = next;
      orderedEnderecos.push(current);
    }

    // Persistir no banco de dados
    const rota = await this.prisma.rota.create({
      data: {
        veiculo_id,
        endereco_ids: orderedEnderecos.map(e => e.id),
      },
    });

    return {
      id: rota.id,
      veiculo_id: rota.veiculo_id,
      ordem_sugerida: orderedEnderecos,
    };
  }

  private calculateDistance(p1: Endereco, p2: Endereco): number {
    // Distância Euclidiana simples 
    return Math.sqrt(
      Math.pow(p2.latitude - p1.latitude, 2) + Math.pow(p2.longitude - p1.longitude, 2)
    );
  }
}
