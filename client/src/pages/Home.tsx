import { useAuth } from '../components/auth/AuthContext';
import { Navigate } from 'react-router';
import { useState, useEffect } from 'react';
import api from '../types/api';
import type { LeaveRequest } from '../types/leave';
import useEmployeeContext from '../components/employee/EmployeeContext';
import { LEAVE_TYPES } from '../components/constants/leaveConstants';

interface DashboardStats {
    leaveDaysAvailable: number;
    pendingLeaves: number;
    upcomingLeaves: LeaveRequest[];
}

const Home = () => {
    const { currentUser, hasManagementAccess } = useAuth();
    const [stats, setStats] = useState<DashboardStats>({
        leaveDaysAvailable: 0,
        pendingLeaves: 0,
        upcomingLeaves: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const { employees } = useEmployeeContext();

    if (!currentUser) {
        return <Navigate to='/login'/>;
    }
    
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get(`/dashboard/stats/${currentUser?.uid}`);
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (currentUser) {
            fetchDashboardData();
        }
    }, [currentUser]);


    if (isLoading) {
        return <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Panel główny</h1>
            
            {/* Informacje o zalogowanym użytkowniku */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Profil</h2>
                    <div className="space-y-2">
                        <p className="text-gray-600">
                            <span className="font-medium">Użytkownik:</span>{' '}
                            {currentUser.displayName || 'Brak nazwy'}
                        </p>
                        <p className="text-gray-600">
                            <span className="font-medium">Email:</span>{' '}
                            {currentUser.email}
                        </p>
                    </div>
                </div>

                {/* Statystyki */}
                <div className="bg-yellow-50 shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-yellow-800">Liczba dni wolnych do wykorzystania</h3>
                    <p className="text-3xl font-bold text-yellow-600">{stats.leaveDaysAvailable}</p>
                </div>
                {hasManagementAccess && (
                    <div className="bg-purple-50 shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-purple-800">Wnioski oczekujące</h3>
                        <p className="text-3xl font-bold text-purple-600">{stats.pendingLeaves}</p>
                    </div> 
                )}
            </div>

            {/* Nadchodzące urlopy */}
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Nadchodzące urlopy</h2>
                {stats.upcomingLeaves.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {stats.upcomingLeaves.map((leave) => (
                            <div key={leave.id} className="py-3">
                                <p className="font-medium">{(currentUser.uid == leave.employeeUid ? "Mój urlop" : [...employees].filter(e => e.uid == leave.employeeUid).map(e => e.firstName + ' ' + e.lastName)) + ", urlop " + LEAVE_TYPES[leave.type].toLocaleLowerCase()} </p>
                                <p className="text-sm text-gray-500">
                                    {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                </p>
                                {leave.description && <p className="text-sm text-gray-700 mt-1
                                ">{leave.description}</p>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Brak nadchodzących urlopów</p>
                )}
            </div>
        </div>
    );
};

export default Home;