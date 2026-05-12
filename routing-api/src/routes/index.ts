import { Router } from 'express';
// Voltando .js
import { RouteController } from '../controllers/RouteController.js';

const router = Router();
const routeController = new RouteController();

router.post('/calcular', routeController.calcular);

export default router;
