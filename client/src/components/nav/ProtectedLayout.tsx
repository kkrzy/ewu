import { Navigate, Outlet } from 'react-router';
import Navbar from '../Navbar';
import Sidebar from '../Sidebar';
import { useAuth } from '../auth/AuthContext';

const ProtectedLayout = () => {
    const { userLoggedIn } = useAuth();
    if (!userLoggedIn) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="h-screen flex flex-col">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <div className="bg-gray-800 overflow-y-auto overflow-x-hidden no-scrollbar">
                    <Sidebar />
                </div>
                <main className="flex-1 p-4 overflow-y-auto bg-gray-100">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ProtectedLayout;