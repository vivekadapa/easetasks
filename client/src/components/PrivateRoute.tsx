import { useAuth } from '@/context/AuthProvider';
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ Component }: any) => {

    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div className='min-h-screen flex items-center justify-center'>Loading...</div>;
    }

    return isAuthenticated ? <Component /> : <Navigate to="/landing" />
}

export default PrivateRoute;