import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../../firebase/firebase';
import { onAuthStateChanged, type User } from 'firebase/auth';
import api from '../../types/api';

interface AuthContextType {
    currentUser: User | null;
    userLoggedIn: boolean;
    role: string;
    hasManagementAccess: boolean;
    leaveDaysAvailable: number;
    setUserLoggedIn: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    const [userLoggedIn, setUserLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null); 
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState<string>('');
    const [hasManagementAccess, setHasManagementAccess] = useState(false);
    const [leaveDaysAvailable, setLeaveDaysAvailable] = useState(0);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            setUserLoggedIn(!!user);
            setLoading(false);
            if (user) {
                try {
                    const response = await api.get(`/employees?uid=${user.uid}`);
                    const employeeData = response.data[0];
                    if (employeeData) {
                        setHasManagementAccess(
                            employeeData.role == "ADMIN" || 
                            employeeData.role == "MANAGER"
                        );
                        setRole(employeeData.role);
                        setLeaveDaysAvailable(employeeData.leaveDaysAvailable);
                    }
                } catch (error) {
                    console.error('Error fetching user role:', error);
                }
            } else {
                setHasManagementAccess(false);
            }
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }
    return (
        <AuthContext.Provider value={{ 
            currentUser, 
            userLoggedIn, 
            role,
            hasManagementAccess,
            leaveDaysAvailable,
            setUserLoggedIn 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context == undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};