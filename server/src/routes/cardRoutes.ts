import express from 'express'
import { createCard, updateCard } from '../controllers/CardController'

const router = express.Router()


router.post('/', createCard)
router.put('/:id', updateCard)


export default router;
