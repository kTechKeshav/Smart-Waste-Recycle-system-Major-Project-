import express from 'express';
import { processRecycleItems } from '../controllers/recycleController.js';
import multer from 'multer';

// Configure Multer to use memory storage (easier for forwarding buffers)
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { files: 6 } // Max 6 files
});

const recycleRouter = express.Router();

recycleRouter.post('/analyze', upload.array('images', 6), processRecycleItems);

export default recycleRouter;
