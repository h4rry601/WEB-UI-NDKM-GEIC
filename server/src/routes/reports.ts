import { Router } from 'express';
import { getAttendance, getStrangers } from '../controllers/reports';

const router = Router();

router.get('/attendance', getAttendance);
router.get('/strangers', getStrangers);

export default router;