import express from 'express';
import { getDates, createBook, makeAppointment, getAppointment, getAllDates, deleteDate } from '../controllers/books.js';

import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/:date', getDates);
router.get('/all/:date', getAllDates);
router.patch('/:dateID', makeAppointment);
router.get('/:dateID/:bookID/shift', getAppointment);

router.post('/', auth, createBook);
router.delete('/:id', auth, deleteDate);

export default router;