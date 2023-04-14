import express from 'express';
import routeProtect from '../middlewares/routeProtection.js';
import { verifyPlate, generateKey } from '../controllers/manageApiController.js';

const router = express.Router();

// Get outputs page
router.get('/generateApiKey', routeProtect, generateKey);
router.get('/verify-plate/:key/:plate', verifyPlate);

export default router;