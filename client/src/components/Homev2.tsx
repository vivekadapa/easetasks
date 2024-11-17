
import { useSocket } from "@/hooks/useSocket"
import { useEffect } from "react"
import { useAuth } from "@/context/AuthProvider"

const Homev2 = () => {

    const value = useAuth();
    const sidebarStatus = value.sidebarOff;
    const token = localStorage.getItem('token');
    const socket = useSocket(token || '');
    useEffect(() => {
        if (!socket) return;
        socket.onmessage = (event) => {
            console.log(JSON.parse(event.data));
        }
    }, [socket])

    if (!token || !socket) return;
    return (
        <>
            <div className={`${sidebarStatus ? 'ml-16' : 'ml-[20.1rem]'} transform transition-all duration-300 overflow-y-hidden`}>
            </div>

        </>
    )
}

export default Homev2