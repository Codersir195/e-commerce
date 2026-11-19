import express from 'express'
import { isAuthenticated } from '../middleware/isAuthenticated.js';
import { addToCard, getCard, removeFromCard, updateQuantity } from '../controllers/cardController.js';

const router = express.Router()

router.get('/', isAuthenticated, getCard)
router.post('/add', isAuthenticated, addToCard)
router.put('/update', isAuthenticated, updateQuantity)
router.delete('/remove', isAuthenticated, removeFromCard)

export default router;