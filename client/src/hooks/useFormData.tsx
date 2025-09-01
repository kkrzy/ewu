import { useState, useEffect } from 'react';
import type { Department } from '../types/department';
import type { EmployeeProps } from '../types/employee';
import type { LeaveRequest } from '../types/leave';
import api from '../types/api';

type DataType = 'departments' | 'managers' | 'leaves';

interface UseFormDataProps {
    dataTypes: DataType[];
    userId?: string;
}

interface FormData {
    departments: Department[];
    managers: EmployeeProps[];
    leaves: LeaveRequest[];
    loading: boolean;
    error: string | null;
}

export function useFormData({ dataTypes, userId }: UseFormDataProps): FormData {
    const [data, setData] = useState<FormData>({
        departments: [],
        managers: [],
        leaves: [],
        loading: true,
        error: null
    });

    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            try {
                const requests = [];
                
                if (dataTypes.includes('departments')) {
                    requests.push(api.get<Department[]>('/departments'));
                }
                
                if (dataTypes.includes('managers')) {
                    requests.push(api.get<EmployeeProps[]>('/employees?role=MANAGER'));
                }

                if (dataTypes.includes('leaves') && userId) {
                    requests.push(api.get<LeaveRequest[]>(`/leaves?employeeId=${userId}`));
                }

                const responses = await Promise.all(requests);

                if (mounted) {
                    const newData = { ...data, loading: false };

                    let respIndex = 0;
                    if (dataTypes.includes('departments')) {
                        newData.departments = responses[respIndex++].data as Department[];
                    }
                    if (dataTypes.includes('managers')) {
                        newData.managers = responses[respIndex++].data as EmployeeProps[];
                    }
                    if (dataTypes.includes('leaves') && userId) {
                        newData.leaves = responses[respIndex].data as LeaveRequest[];
                    }

                    setData(newData);
                }
            } catch (err) {
                if (mounted) {
                    setData(prev => ({ ...prev, error: 'Błąd podczas ładowania danych', loading: false }));
                }
            }
        };

        fetchData();

        return () => {
            mounted = false;
        };
    }, [dataTypes.join(','), userId]);

    return data;
}