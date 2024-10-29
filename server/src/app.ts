import express from 'express'
import { authRouter, boardRouter, columnRouter, cardRouter, subCardRouter } from './routes'
import cors from "cors";
import dotenv from 'dotenv'
import auth from './middleware/auth'
import { Request, Response } from 'express';


dotenv.config()
const app = express()

app.use(express.json())
app.use(cors())

app.get('/readiness', (req: Request, res: Response) => {
    res.status(200).json("Server is awake")
})


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/board', auth, boardRouter)
app.use('/api/v1/column', auth, columnRouter)
app.use('/api/v1/card', auth, cardRouter)
app.use('/api/v1/subcard', auth, subCardRouter)



app.listen(3001, () => {
    console.log("app is running at 3001")
})

