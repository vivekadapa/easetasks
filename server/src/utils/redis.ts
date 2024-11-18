import { createClient } from 'redis';


const redisClient = createClient({
    password: process.env.REDIS_PASS || "",
    socket: {
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT) || 6379, // Ensure port is a number
    },
});

redisClient.on("error", (error) => console.error(`Redis Client Error: ${error.message}`));

(async () => {
    try {
        await redisClient.connect();
        console.log("Connected to Redis");
    } catch (error: any) {
        console.error(`Failed to connect to Redis: ${error.message}`);
    }
})();

export default redisClient;
