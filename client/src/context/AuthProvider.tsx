import axios from "axios";
import { Loader } from "lucide-react";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


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
    currBoardWColumns: Board | null,
    setCurrBoardWColumns: (board: Board | null) => void;
}


export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
    const [currBoard, setCurrBoard] = useState({})
    const [currBoardWColumns, setCurrBoardWColumns] = useState([])


    console.log("Context re-render")
    const token = localStorage.getItem('token');
    useEffect(() => {

        if (token) {
            verifyToken(token);
        }
        if (currBoard && currBoard.id) {
            fetchBoard()
        }
    }, [token]);


    const fetchBoard = async () => {
        try {
            const response = await axios.request({
                url: `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/board/board/${currBoard?.id}`,
                method: "get",
            })
            setCurrBoardWColumns(response.data)
        } catch (error) {
            console.log(error);
        }
        // setColumns(response.data.columns)
    }

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
                if (Object.keys(currBoard).length === 0) {
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
        setCurrBoardWColumns
    };

    return (
        <AuthContext.Provider value={value} >
            {children}
        </AuthContext.Provider >
    );
};


export const useAuth = () => {
    return useContext(AuthContext);
}