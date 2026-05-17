import express from 'express';
import cors from 'cors';
import optimizeRoutes from './routes/optimizeRoutes';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/optimize', optimizeRoutes);

app.listen(PORT, () => {
  console.log(`🚀 [Backend] Server đang vận hành mượt mà tại cổng: http://localhost:${PORT}`);
});