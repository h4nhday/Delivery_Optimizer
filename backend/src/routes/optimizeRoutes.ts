import { Router } from 'express';
import { handleOptimization } from '../controllers/optimizeController';

const router = Router();

router.post('/', handleOptimization);

export default router;