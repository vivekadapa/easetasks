import express from 'express'
import { createBoard, deleteBoard, getBoardById, getBoards, updateBoard } from '../controllers/BoardController'

const router = express.Router()


router.post('/', createBoard)
router.get('/board/:id', getBoardById)
router.get('/:userId', getBoards)
router.patch('/:id', updateBoard)
router.delete('/:id', deleteBoard)



export default router