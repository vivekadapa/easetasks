import { createContext, ReactNode, useContext, useEffect, useState } from "react";



const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => { },
    login: async () => { },
    logout: () => { },
    isAuthenticated: false,
    isLoading: true,
    verifyToken: () => { },
    boards: null,
    setBoards: () => { },
    currBoard: null,
    setCurrBoard: () => { },
    cards: null,
    setCards: () => { },
    fetchColumnsWCards: () => {
        return { columns: [], cards: [] };
    },
    sidebarOff: false,
    setSideBarOff: () => {

    },
    checkLoginStatus: () => { }

})

export interface Board {
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
    isLoading: boolean;
    verifyToken: (token: string) => void,
    boards: any[] | null;
    setBoards: (board: any) => void;
    currBoard: Board | null
    setCurrBoard: (board: Board | null) => void;
    cards: any,
    setCards: (card: any | null) => void,
    fetchColumnsWCards: (data: string | null) => { columns: any[]; cards: any[] },
    sidebarOff: Boolean,
    setSideBarOff: (prev: Boolean | null) => void,
    checkLoginStatus: () => void
}


export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<Boolean>(false);
    const [isLoading, setIsLoading] = useState<Boolean>(true);
    const [currBoard, setCurrBoard] = useState(null)
    const [sidebarOff, setSideBarOff] = useState(false);
    const [cards, setCards] = useState([])
    // const renderCount = useRenderCount();
    // console.log("Render Count " + renderCount)


    const checkLoginStatus = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/auth/refresh`, {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                const userData = await response.json();
                setIsAuthenticated(true);
                setUser(userData.data);
                if (localStorage.getItem("currBoard") === null || localStorage.getItem("currBoard") === undefined) {
                    localStorage.setItem("currBoard", JSON.stringify(userData?.data?.boards[0]));
                    setCurrBoard(userData?.data?.boards[0]);
                }
                else {
                    if (currBoard !== null) {
                        setCurrBoard(JSON.parse(localStorage.getItem("currBoard") || ""));
                    }
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            console.error('Error checking login status:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        checkLoginStatus();
    }, []);

    const value = {
        user,
        isAuthenticated,
        isLoading,
        currBoard,
        setCurrBoard,
        checkLoginStatus,
        cards,
        setCards,
        sidebarOff,
        setSideBarOff
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