import express from 'express'
import { createColumn, deleteColumnById, getColumnsByBoardId } from '../controllers/ColumnController'

const router = express.Router()




router.post('/', createColumn)
router.get('/:boardId', getColumnsByBoardId)
router.delete('/:id',deleteColumnById)

export default router