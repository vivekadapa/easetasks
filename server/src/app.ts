import express from 'express'
import cron from 'node-cron'
import axios from 'axios'
// import dbConnect from './utils/dbConnect'
import { authRouter,boardRouter } from './routes'
import cors from "cors";
import dotenv from 'dotenv'


dotenv.config()
const app = express()

app.use(express.json())
app.use(cors())


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/board',boardRouter)



// cron.schedule('* * * * *', async () => {
//     try {
//         const response = await axios.request({
//             method: "get",
//             url: `https://talkies-frontend.onrender.com/`
//         })
//         if (response.status == 200) {
//             console.log("talkies server is awake")
//         }
//     } catch (error) {
//         console.log(error)
//     }
// })


// dbConnect()

app.listen(3000, () => {
    console.log("app is running at 3000")
})

