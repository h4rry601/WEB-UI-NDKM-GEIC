import { Router } from 'express';
import { batchImport } from '../controllers/employees';

const router = Router();

router.post('/batch', batchImport);

export default router;