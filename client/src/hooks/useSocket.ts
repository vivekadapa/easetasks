import { useState, useEffect } from 'react'


const WS_URL = (token: string) => `ws://localhost:8000?token=${token}`

export const useSocket = (token: string) => {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    useEffect(() => {
        const ws = new WebSocket(WS_URL(token))
        ws.onopen = () => {
            console.log('Connected to the server')
            setSocket(ws)   
        }
        ws.onclose = () => {
            console.log('Disconnected from the server') 
            setSocket(null)
        }
        return () => {
            ws.close()
        }
    }, [])

    return socket
}