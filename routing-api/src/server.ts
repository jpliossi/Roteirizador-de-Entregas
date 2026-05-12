import express, { type Request, type Response } from 'express';
import { RouteController } from './controllers/RouteController.js';

const app = express();
const port = 3001;

app.use(express.json());

const routeController = new RouteController();
app.post('/rotas/calcular', routeController.calcular);

app.get('/ping', (req: Request, res: Response) => {
  res.status(200).json({ message: 'pong' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Routing API listening at http://0.0.0.0:${port}`);
});

