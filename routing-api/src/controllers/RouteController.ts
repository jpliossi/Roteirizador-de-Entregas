import type { Request, Response } from 'express';
import { RouteService } from '../services/RouteService.js';

export class RouteController {
  [x: string]: any;
  private routeService: RouteService;

  constructor() {
    this.routeService = new RouteService();
  }

  calcular = async (req: Request, res: Response): Promise<void> => {
    try {
      const { veiculo_id, enderecos } = req.body;

      if (!veiculo_id || !enderecos || !Array.isArray(enderecos)) {
        res.status(400).json({ error: 'Payload inválido. Certifique-se de enviar veiculo_id e um array de endereços.' });
        return;
      }

      const result = await this.routeService.calculateRoute(veiculo_id, enderecos);
      console.log("Objeto enviado para o Front:", result);

      res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao calcular rota:', error);
      res.status(500).json({ error: 'Erro interno ao calcular rota.' });
    }
  }

  efetivar = async (req: Request, res: Response): Promise<void> => {
    try {
      const { veiculo_id, ordem_ids } = req.body;

      if (!veiculo_id || !ordem_ids || !Array.isArray(ordem_ids)) {
        res.status(400).json({ error: 'Payload inválido. Envie veiculo_id e ordem_ids (array).' });
        return;
      }

      const result = await this.routeService.efetivarRota(veiculo_id, ordem_ids);
      res.status(200).json(result);

      const verificacao = await this.prisma.endereco.findMany({
        where: { id: { in: ordem_ids } },
        select: { id: true, status: true, veiculo_id: true }
      });

      console.log("=== VERIFICAÇÃO DE ESTADO NO BANCO ===");
      console.table(verificacao);

    } catch (error: any) {
      console.error('Erro ao efetivar rota:', error);
      res.status(500).json({ 
        error: 'Erro ao efetivar rota.',
        details: error.response?.data || error.message 
      });
    }
  }

  buscarPorVeiculo = async (req: Request, res: Response): Promise<void> => {
    try {
      const { veiculo_id } = req.params;

      if (!veiculo_id) {
        res.status(400).json({ error: 'veiculo_id é obrigatório.' });
        return;
      }

      const result = await this.routeService.buscarUltimaRotaPorVeiculo(veiculo_id as string);
      res.status(200).json(result);
    } catch (error: any) {
      res.status(404).json({ error: 'Rota não encontrada para este veículo.' });
    }
  }
}
