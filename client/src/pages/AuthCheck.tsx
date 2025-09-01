import {Navigate, useLocation} from 'react-router';
import type { AuthCheckProps } from '../types/auth.types';

const AuthCheck: React.FC<AuthCheckProps> = ({ children }) => {
    const isAuthenticated = false;//localStorage.getItem('isAuthenticated') === 'true';
    const location = useLocation();

    if (!isAuthenticated && location.pathname !== '/auth/login' && location.pathname !== '/auth/register') {
        return <Navigate to="/auth/login" state={
            { 
                from: location 
            }
        } replace />;
    }

    return children
};

export default AuthCheck;