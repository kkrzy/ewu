import { useState } from 'react';
import type { EmployeeProps } from '../../types/employee';
import EmployeeDetails from './EmployeeDetails';
import useEmployeeContext from './EmployeeContext';
import { FaSuitcase, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

export default function Employee(props: EmployeeProps) {
    const [showDetails, setShowDetails] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { updateEmployee, refreshEmployees } = useEmployeeContext();

    const handleClose = () => {
        setShowDetails(false);
        setError(null);
    };

    const handleUpdate = async (updatedEmployee: EmployeeProps) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const result = await updateEmployee(updatedEmployee);
            if (!result.success) {
                setError(result.message);
                return;
            }
            refreshEmployees();
            setError(null);
            setShowDetails(false);
        } catch (err) {
            setError('Wystąpił błąd podczas aktualizacji');
            console.error('Error updating employee:', err);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <>
            <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-gray-800">
                        {props.firstName} {props.lastName}
                    </h2>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        ID: {props.id}
                    </span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                    <FaSuitcase className="mr-2"/>
                    <p className="font-medium text-sm">{props.position}</p>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                    <FaEnvelope className="mr-2"/>
                    <p className="text-sm truncate">{props.email}</p>
                </div>
                <div className="flex items-center text-gray-600 ">
                    <FaPhoneAlt className="mr-2"/>
                    <p className="text-sm truncate">{props.phoneNumber}</p>
                </div>
                <div className="flex justify-end">
                    <button 
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors duration-300"
                        onClick={() => setShowDetails(true)}
                    >
                        Szczegóły
                    </button>
                </div>
            </div>

            {showDetails && (
                <EmployeeDetails 
                    employee={props} 
                    onClose={handleClose} 
                    onUpdate={handleUpdate}
                    isLoading={isLoading}
                    error={error}
                    mode="edit"
                />
            )}
        </>
    );
}