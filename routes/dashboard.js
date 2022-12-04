import express from 'express';
import { createAnnouncement, updateAnnouncement, getAnnouncement, createInitialSetup, updateInitialSetup, getInitialSetup, getCustomers, updateExistingBookDate } from '../controllers/dashboard.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/announcement/:id', getAnnouncement);
router.post('/announcement', auth, createAnnouncement);
router.patch('/announcement/:id', auth, updateAnnouncement);

router.get('/initialsetup/:id', auth, getInitialSetup);
router.post('/initialsetup', auth, createInitialSetup);
router.patch('/initialsetup/:id', auth, updateInitialSetup);
router.patch('/date/:id', auth, updateExistingBookDate);

router.get('/date/:date', auth, getCustomers);

export default router;