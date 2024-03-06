import { Router } from 'express';
import { namesController } from '../controllers/namesController';

const router = Router();

router.get('/getNamesSync', namesController.getNamesSync);
router.get('/getNamesAsync', namesController.getNamesAsync);
router.get('/getNamesBatchingAsync', namesController.getNamesBatchingAsync);

export { router as names };