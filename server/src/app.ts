import express from 'express'
import { authRouter, boardRouter, columnRouter, cardRouter, subCardRouter } from './routes'
import cors from "cors";
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import { Request, Response } from 'express';
import { WebSocketServer } from 'ws';
import url from 'url';
import { fetchBoard } from './utils/SocketFunctions';
import passport from 'passport';
import session from 'express-session';
import { initPassport } from './utils/Passport';
//@ts-ignore
import redisClient from './utils/redis';
import RedisStore from 'connect-redis';

const wss = new WebSocketServer({ port: 8000 });
console.log('Server started on port 8000');


dotenv.config()
const app = express()


app.use(cookieParser());
app.set("trust proxy", 1);
app.use(session({
    store: new RedisStore({
        //@ts-ignore
        client: redisClient
    }),
    secret: process.env.SESSION_SECRET || '',
    resave: false,
    saveUninitialized: true,
    proxy: true,
    cookie: {
        domain: process.env.DOMAIN,
        secure: process.env.CORS_ORIGIN === 'http://localhost:5173' ? false : true,
        // httpOnly: true,
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000 * 7
    },
}));
app.use(express.json())
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
    exposedHeaders: ["Set-Cookie"],
}));

initPassport()
app.use(passport.initialize());
app.use(passport.session());

app.get('/readiness', (req: Request, res: Response) => {
    res.status(200).json("Server is awake")
})
wss.on('connection', async function connection(ws, req) {
    const parameters = url.parse(req?.url || '', true).query;
    const token = parameters.token;

    try {
        // Fetch boards and ensure data is available
        const boards = await fetchBoard(token as string);
        if (!boards) {
            console.error("No boards data received");
            ws.send(JSON.stringify({ message: "Error fetching boards", payload: null }));
            return;
        }

        console.log("Boards fetched:", boards); // Log boards data
        ws.send(JSON.stringify({ message: "Fetching boards", payload: boards }));

    } catch (error) {
        console.error("Error fetching boards:", error);
        ws.send(JSON.stringify({ message: "Error fetching boards", payload: null }));
    }
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/board', boardRouter)
app.use('/api/v1/column', columnRouter)
app.use('/api/v1/card', cardRouter)
app.use('/api/v1/subcard', subCardRouter)



app.listen(3001, () => {
    console.log("app is running at 3001")
})

