import express from 'express'
import { createColumn, getColumnsByBoardId } from '../controllers/ColumnController'

const router = express.Router()




router.post('/', createColumn)
router.get('/:boardId', getColumnsByBoardId)


export default router