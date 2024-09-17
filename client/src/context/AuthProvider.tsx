import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRenderCount } from "@uidotdev/usehooks";



const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { },
    login: async () => { },
    logout: () => { },
    isAuthenticated: false,
    verifyToken: () => { },
    currBoard: null,
    setCurrBoard: () => { },
    currBoardWColumns: null,
    setCurrBoardWColumns: () => { },
    cards: null,
    setCards: () => { },
    fetchColumnsWCards: () => {
        return { columns: [], cards: [] };
    }
})

interface Board {
    id: string,
    title: string,
    ownerId: string,
    columns: Column[]
}

interface Column {
    boardId: string,
    id: string,
    order: number,
    title: string
}

type AuthProviderProps = {
    children: ReactNode
}
interface User {
    id: string;
    email: string;
    boards: Board[];
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    verifyToken: (token: string) => void
    currBoard: Board | null
    setCurrBoard: (board: Board | null) => void;
    currBoardWColumns: any,
    setCurrBoardWColumns: (board: any | null) => void;
    cards: any,
    setCards: (card: any | null) => void,
    fetchColumnsWCards: (data: string | null) => { columns: any[]; cards: any[] };
}


export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const [currBoard, setCurrBoard] = useState({})
    const [currBoardWColumns, setCurrBoardWColumns] = useState([])
    const [cards, setCards] = useState([])
    const renderCount = useRenderCount();
    console.log("Render Count " + renderCount)
    const token = localStorage.getItem('token');
    useEffect(() => {
        console.log(token)
        if (token) {
            verifyToken(token);
        }

    }, [currBoard, token]);

    const verifyToken = async (token: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/auth/verify`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();
                setUser(userData.data);
                if (currBoard === null || Object.keys(currBoard).length === 0) {
                    setCurrBoard(userData.data.boards[0]);
                }
            } else {
                localStorage.removeItem('token');
                setUser(null);
            }
        } catch (error) {
            console.error('Error verifying token:', error);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                setUser(data.user);
                navigate('/');
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    const value = {
        user,
        login,
        logout,
        verifyToken,
        isAuthenticated: !!user,
        currBoard,
        setCurrBoard,
        currBoardWColumns,
        setCurrBoardWColumns,
        cards,
        setCards,
    };

    //@ts-ignore
    return (<AuthContext.Provider value={value} >
        {children}
    </AuthContext.Provider >
    );
};


export const useAuth = () => {
    return useContext(AuthContext);
}