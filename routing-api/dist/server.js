import express, {} from 'express';
const app = express();
const port = 3001;
app.use(express.json());
app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'pong' });
});
app.listen(port, '0.0.0.0', () => {
    console.log(`Routing API listening at http://0.0.0.0:${port}`);
});
//# sourceMappingURL=server.js.map