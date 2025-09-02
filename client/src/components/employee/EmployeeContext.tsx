import { useContext, createContext, useState, useEffect } from 'react'; 
import api from '../../types/api';
import type { EmployeeProps } from '../../types/employee';
import type { AuthResponse } from '../../types/apiResponse';

type OperationResult = {
  success: boolean;
  message: string;
};

type EmployeeContextType = { 
  employees: EmployeeProps[], 
  addEmployee: (employee: EmployeeProps) => Promise<OperationResult>,
  updateEmployee: (employee: EmployeeProps) => Promise<OperationResult>,
  refreshEmployees: () => void
};

const EmployeeContext = createContext<EmployeeContextType>({
  employees: [], 
  addEmployee: () => Promise.resolve({success: false, message: ''}),
  updateEmployee: () => Promise.resolve({ success: false, message: '' }),
  refreshEmployees: () => {}
});

export function EmployeeProvider({ children }: { children: React.ReactNode }){ 

  const getEmployees = async () => {
    try {
      const response = await api<EmployeeProps[]>("/employees");
      //console.log("Response data:", response.data);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error details:", error);
    }
  }

  const addEmployee = async (employee: EmployeeProps): Promise<OperationResult> => {
    try {
      // Create Firebase auth
      const uid = await createEmployeeAuth(
        `${employee.firstName} ${employee.lastName}`,
        employee.email,
        'password'
      );
      
      const employeeWithUid = {
        ...employee,
        uid
      };
      const response = await api.post<EmployeeProps>("/employees", employeeWithUid);
      setEmployees((employeeWithUid) => [...employeeWithUid, response.data]);
      return { 
        success: true, 
        message: 'Pracownik został dodany pomyślnie' 
      };
    } catch (error) {
      console.error("Error adding employee:", error);
      return { 
                success: false, 
                message: 'Wystąpił błąd podczas dodawania pracownika'
            };
    }
  }
  
  const createEmployeeAuth = async (displayName: string, email: string, password: string) => {
    try {
      const response = await api.put<AuthResponse>('/auth/users', {
        displayName,
        email,
        password
      });
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      return response.data.message; // Return UID
    } catch (error) {
      console.error("Error updating Firebase auth:", error);
    }
  }

  const updateEmployee = async (employee: EmployeeProps): Promise<OperationResult> => {
    try {
      // Update Firebase auth
      if (employee.uid) {
        const response = await updateEmployeeAuth(
          employee.uid,
          `${employee.firstName} ${employee.lastName}`,
          employee.email
        );
        if (!response.success) {
          return response;
        }
      };
      
      const response = await api.put<EmployeeProps>(`/employees/${employee.id}`, employee);
      
      setEmployees((prev) => prev.map(emp => emp.id == employee.id ? response.data : emp));

      return {
        success: true,
        message: 'Dane pracownika zostały zaktualizowane'
      };
    } catch (error) {
      console.error("Error updating employee:", error);

      return {
        success: false,
        message: 'Wystąpił błąd podczas aktualizacji pracownika'
      };
    }
  }

  const updateEmployeeAuth = async (uid: string, displayName: string, email: string): Promise<OperationResult> => {
    try {
      await api.put('/auth/users', {
        uid,
        displayName,
        email
      });

      return {
        success: true,
        message: 'Dane uwierzytelniania zaktualizowane'
      };

    } catch (error) {
      console.error("Error updating Firebase auth:", error);
      return {
        success: false,
        message: (error as any)?.response.data?.message || 'Błąd aktualizacji danych uwierzytelniania'
      };
    }
  }

  const refreshEmployees = async () => {
    try {
      const response = await api<EmployeeProps[]>("/employees");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error refreshing employees:", error);
    }
  }

  const [employees, setEmployees] = useState<EmployeeProps[]>([]); 

  useEffect(() => {
    getEmployees();
  }, []);


  return ( 
    <EmployeeContext.Provider value={{ 
        employees, 
        addEmployee, 
        updateEmployee,
        refreshEmployees
    }}> 
        {children} 
    </EmployeeContext.Provider> ) 
} 
    
export default function useEmployeeContext() {
  return useContext(EmployeeContext);
}