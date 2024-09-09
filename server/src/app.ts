import express from 'express'
import cron from 'node-cron'
import axios from 'axios'
import { authRouter, boardRouter, columnRouter, cardRouter, subCardRouter } from './routes'
import cors from "cors";
import dotenv from 'dotenv'


dotenv.config()
const app = express()

app.use(express.json())
app.use(cors())


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/board', boardRouter)
app.use('/api/v1/column', columnRouter)
app.use('/api/v1/card', cardRouter)
app.use('/api/v1/subcard', subCardRouter)


cron.schedule('* * * * *', async () => {
    try {
        const response = await axios.request({
            method: "get",
            url: `https://talkies-frontend.onrender.com/`
        })
        const response1 = await axios.request({
            method: "get",
            url: `https://talkies-1.onrender.com/`
        })
        const response2 = await axios.request({
            method: "get",
            url: `https://medicare-server-2u9y.onrender.com/user/getAllUsers`
        })

        if (response.status == 200 || response1.status == 200) {
            console.log("talkies server is awake")
        }
    } catch (error) {
        console.log(error)
    }
})


// dbConnect()

app.listen(3000, () => {
    console.log("app is running at 3000")
})

