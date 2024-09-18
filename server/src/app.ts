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


// cron.schedule('*/15 * * * *', async () => {
//     try {
//         const response = await axios.request({
//             method: "get",
//             url: `https://talkies-frontend.onrender.com/`
//         })
//         const response1 = await axios.request({
//             method: "get",
//             url: `https://talkies-1.onrender.com/`
//         })
//         const response2 = await axios.request({
//             method: "get",
//             url: `https://medicare-server-2u9y.onrender.com/user/getAllUsers`
//         })

//         if (response.status == 200 && response1.status == 200 && response2.status == 200) {
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

