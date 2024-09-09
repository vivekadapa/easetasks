import express from "express"
import { editSubCardStatus } from "../controllers/SubcardController"

const router = express.Router()



router.put('/:id',editSubCardStatus)




export default router;