import { useState } from 'react';
import type { EmployeeProps } from '../../types/employee';
import { useFormData } from '../../hooks/useFormData';
import { ROLE } from '../constants/employeeRoleConstants';
import { useAuth } from '../auth/AuthContext';

interface EmployeeDetailsProps {
    employee: EmployeeProps;
    onClose: () => void;
    onCreate?: (newEmployee: EmployeeProps) => void;
    onUpdate?: (updatedEmployee: EmployeeProps) => void;
    isLoading?: boolean;
    error?: string | null;
    mode?: 'create' | 'edit';
}

export default function EmployeeDetails({ employee, onClose, onUpdate, error, onCreate, mode}: EmployeeDetailsProps) {
    const [isEditing, setIsEditing] = useState(mode == 'create');
    const [editedEmployee, setEditedEmployee] = useState<EmployeeProps>(employee);
    const [validationError, setValidationError] = useState<string | null>(null);
    const { role } = useAuth();
    const { departments, managers, loading } = useFormData({ dataTypes: ['departments', 'managers'] });
    let requiredFields: (keyof EmployeeProps)[] = [
        'firstName',
        'lastName',
        'position',
        'email',
        'role',
        'departmentId',
        'phoneNumber',
        'employmentDate',
        'managerUid',
        'leaveDaysAvailable'
    ];
    const isAdmin = role == 'ADMIN';
    if (employee.id == 1) {
        requiredFields = requiredFields.filter(field => field != 'managerUid');
    }

    const validateForm = (): boolean => {
        for (const field of requiredFields) {
            if (!editedEmployee[field]) {
                return false;
            }
        }
        return true;
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = (e.target as HTMLInputElement).checked;
        setValidationError(null);
        setEditedEmployee(prev => ({
            ...prev,
            [name]: type == 'checkbox' ? (checked ? 1 : 0) : value
        }));
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            setValidationError('Proszę wypełnić wszystkie wymagane pola');
            return;
        }
        setValidationError(null);
        if (mode == 'create') {
            onCreate?.(editedEmployee)} 
        else {
            onUpdate?.(editedEmployee)};
        setIsEditing(false);
    };

    const inputClassName = "mt-1 p-1 h-8 block w-full rounded-md border-gray-300 shadow-sm";
    const inputClassNameReadOnly = "mt-1 p-1 h-8 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 shadow-sm";
    const labelClassName = "block text-sm font-medium text-gray-700";
    const selectClassName = "mt-1 h-8 block w-full rounded-md border-gray-300 shadow-sm";

    const renderField = (label: string, field: keyof EmployeeProps, type: string = 'text') => {
        const value = editedEmployee[field];
        const isRequired = requiredFields.includes(field);
        const isDateField = field == 'employmentDate';
        const formatDate = (date: string) => {
            if (!date) return '';
            const dateObj = new Date(date);
            const userTimezoneOffset = dateObj.getTimezoneOffset() * 60 * 1000;
            return new Date(dateObj.getTime() - userTimezoneOffset).toISOString().split('T')[0];
        };
        const labelContent = (
            <label className={labelClassName}>
                {label}
                {isEditing && isRequired && <span className="text-red-500 ml-1">*</span>}
            </label>
        );
       
        if (field == 'role') {
            return (
                <div>
                    {labelContent}
                    {isEditing ? (
                        <select
                            name={field}
                            value={value || ''}
                            onChange={(e) => handleInputChange(e)}
                            className={selectClassName}
                            disabled={loading}
                            required={isRequired}
                        >
                            <option value="">Wybierz rolę w systemie</option>
                            {Object.entries(ROLE).map(([key, value]) => (
                                <option key={key} value={key}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div className={inputClassNameReadOnly}>
                            {ROLE[value as keyof typeof ROLE] || 'Brak'}
                        </div>
                    )}
                </div>
            );
        }
        else if (field == 'departmentId') {
            return (
                <div>
                    {labelContent}
                    {isEditing ? (
                        <select
                            name={field}
                            value={value || ''}
                            onChange={(e) => handleInputChange(e)}
                            className={selectClassName}
                            disabled={loading}
                            required={isRequired}
                        >
                            <option value="">Wybierz dział</option>
                            {departments.map(dept => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.description}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div className={inputClassNameReadOnly}>
                            {departments.find(d => d.id == Number(value))?.description || 'Brak'}
                        </div>
                    )}
                </div>
            );
        }
        else if (field == 'managerUid') {
            return ( 
                <div>
                    {labelContent}
                    {isEditing && employee.id != 1 ? (
                        <select
                            name={field}
                            value={value || ''}
                            onChange={(e) => handleInputChange(e)}
                            className={selectClassName}
                            disabled={loading}
                            required={isRequired}
                        >
                            <option value="">Wybierz przełożonego</option>
                            {managers.map(manager => (
                                <option key={manager.uid} value={manager.uid ?? ''}>
                                    {manager.firstName} {manager.lastName}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div className={inputClassNameReadOnly}>
                            {managers.find(m => m.uid == value)
                                ? `${managers.find(m => m.uid == value)?.firstName} ${managers.find(m => m.uid == value)?.lastName}`
                                : 'Brak'}
                        </div>
                    )}
                </div>
            );
        }
        return (
            <div>
                {labelContent}
                {isEditing ? (
                    <input
                        type={type}
                        name={field}
                        value={isDateField ? formatDate(value as string) : (value ?? '')}
                        onChange={handleInputChange}
                        className={inputClassName}
                        required={isRequired}
                    />
                ) : (
                    <div className={inputClassNameReadOnly}>
                        {
                        isDateField && !!value
                            ? new Date(value as string).toLocaleDateString()
                            : value || 'N/A'}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="sm:text-2xl text-xl font-bold text-gray-800">
                        {mode == 'create' 
                            ? 'Nowy pracownik'
                            : isEditing 
                                ? `Edycja pracownika (ID: ${employee.id})`
                                : `Szczegóły pracownika (ID: ${employee.id})`
                        }
                    </h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-4">
                        {renderField('Imię', 'firstName')}
                        {renderField('Nazwisko', 'lastName')}
                        {renderField('Stanowisko', 'position')}
                        {renderField('Email', 'email')}
                        {isAdmin && renderField('Rola', 'role')}
                    </div>
                    
                    <div className="space-y-4">
                        {renderField('Dział', 'departmentId')}
                        {renderField('Telefon', 'phoneNumber')}
                        {renderField('Data zatrudnienia', 'employmentDate', 'date')}
                        {renderField('Przełożony', 'managerUid')}
                        {isAdmin && renderField('Dni wolne do wykorzystania', 'leaveDaysAvailable', 'number')}
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                    {validationError && (
                        <div className="text-red-500 text-sm mr-auto">
                            {validationError}
                        </div>
                    )}
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSubmit}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm"
                            >
                                {mode == 'create' ? 'Dodaj' : 'Zapisz'}
                            </button>
                            <button
                                onClick={onClose}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm"
                            >
                                Anuluj
                            </button>
                        </>
                    ): (
                        <>
                            {error && (
                                <div className="text-red-500 text-sm mt-2">
                                    {error}
                                </div>
                            )}
                            {isAdmin && (<button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors duration-300"
                            >
                                Edytuj
                            </button>)}
                            <button
                                onClick={onClose}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm transition-colors duration-300"
                            >
                                Zamknij
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}