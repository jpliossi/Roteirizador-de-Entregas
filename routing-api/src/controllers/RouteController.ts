import type { Request, Response } from 'express';
import { RouteService } from '../services/RouteService.js';

export class RouteController {
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
      
      res.status(200).json(result);
    } catch (error) {
      console.error('Erro ao calcular rota:', error);
      res.status(500).json({ error: 'Erro interno ao calcular rota.' });
    }
  }

  efetivar = async (req: Request, res: Response): Promise<void> => {
    try {
      const { veiculo_id, endereco_ids } = req.body;

      if (!veiculo_id || !endereco_ids || !Array.isArray(endereco_ids)) {
        res.status(400).json({ error: 'Payload inválido. Envie veiculo_id e endereco_ids (array).' });
        return;
      }

      const result = await this.routeService.efetivarRota(veiculo_id, endereco_ids);
      res.status(200).json(result);
    } catch (error: any) {
      console.error('Erro ao efetivar rota:', error);
      res.status(500).json({ 
        error: 'Erro ao efetivar rota.',
        details: error.response?.data || error.message 
      });
    }
  }
}
