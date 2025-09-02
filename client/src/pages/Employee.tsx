import { useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { useAuth } from '../components/auth/AuthContext';
import EmployeeCard from "../components/employee/EmployeeCard";
import type { EmployeeProps } from "../types/employee";
import useEmployeeContext from "../components/employee/EmployeeContext";
import EmployeeDetails from '../components/employee/EmployeeDetails';
import { useFormData } from '../hooks/useFormData';

export default function Employee() {
    const { employees, addEmployee, refreshEmployees } = useEmployeeContext();
    const { departments } = useFormData({ dataTypes: ['departments'] });
    const [filters, setFilters] = useState({
        employeeName: '',
        department: ''
    });
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const filteredEmployees = [...employees].filter(employee => {
        const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
        const nameMatch = fullName.includes(filters.employeeName.toLowerCase());
        const departmentMatch = !filters.department || employee.departmentId == +filters.department;
        
        return nameMatch && departmentMatch;
    });
    
    const groupedEmployees = filteredEmployees.reduce((groups, employee) => {
        const departmentId = employee.departmentId;
        const department = departments?.find(d => d.id == departmentId);
        const departmentName = department?.description || 'Brak działu';
        
        if (!groups[departmentName]) {
            groups[departmentName] = [];
        }
        groups[departmentName].push(employee);
        return groups;
    }, {} as Record<string, EmployeeProps[]>);
    
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleCreate = async (newEmployee: EmployeeProps) => {
        try {
            const result = await addEmployee(newEmployee);
            if (result.success) {
                refreshEmployees();
                setShowCreateForm(false);
            } else {
                setError(result.message);
            };
        } catch (error) {
            console.error("Error creating employee:", error);
            setError('Wystąpił błąd podczas dodawania pracownika');
        }
    };
    const [showFilters, setShowFilters] = useState(false);

    const { role } = useAuth();
    const isAdmin = role == 'ADMIN';

    return(
        <div className="flex flex-col gap-4">
            {/* Header section */}
            <div className="container mx-auto p-2">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                    <h1 className="text-xl font-bold text-gray-800">Lista pracowników</h1>
                    {isAdmin && ( <button 
                        onClick={() => setShowCreateForm(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors duration-300 w-full sm:w-auto"
                    >
                        Dodaj pracownika
                    </button>)}
                </div>

                {/* Mobile filter toggle */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="sm:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 w-full"
                >
                    <FaFilter />
                    {showFilters ? 'Ukryj filtry' : 'Pokaż filtry'}
                </button>
            </div>

            {/* Filters section */}
            <div className={`container mx-auto p-2 ${showFilters ? 'block' : 'hidden'} sm:block`}>
                <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-lg shadow">
                    {/* Employee name filter */}
                    <div className="flex-1">
                        <label htmlFor="name-filter" className="text-sm font-medium text-gray-700 mb-1 block">
                            Wyszukaj po nazwisku
                        </label>
                        <input
                            id="name-filter"
                            type="text"
                            name="employeeName"
                            value={filters.employeeName}
                            onChange={handleFilterChange}
                            placeholder="Wpisz imię lub nazwisko..."
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Department filter */}
                    <div className="flex-1">
                        <label htmlFor="department-filter" className="text-sm font-medium text-gray-700 mb-1 block">
                            Filtruj po dziale
                        </label>
                        <select
                            id="department-filter"
                            name="department"
                            value={filters.department}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Wszystkie działy</option>
                            {departments?.map(dept => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.description}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Clear filters button */}
                    <div className="flex items-end">
                        <button
                            onClick={() => setFilters({ employeeName: '', department: '' })}
                            className="w-full sm:w-auto px-4 py-2 text-sm border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md transition-colors duration-300"
                        >
                            Wyczyść filtry
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto p-2">
                {Object.entries(groupedEmployees).map(([departmentName, departmentEmployees]) => (
                    <div key={departmentName} className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 px-4 py-2 bg-gray-50 rounded-lg">
                            {departmentName} ({departmentEmployees.length})
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {departmentEmployees.map((employee) => ( 
                                <div key={employee.id} 
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                                    <EmployeeCard {...employee} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {showCreateForm && (
                <EmployeeDetails 
                    employee={{
                        id: null,
                        uid: '',
                        firstName: '',
                        lastName: '',
                        email: '',
                        phoneNumber: '',
                        position: '',
                        departmentId: null,
                        managerUid: '',
                        employmentDate: '',
                        role: '',
                        leaveDaysAvailable: null
                    }}
                    onClose={() => setShowCreateForm(false)} 
                    onCreate={handleCreate} 
                    mode="create"
                    error={error}
                />
            )}
        </div>
    );
}