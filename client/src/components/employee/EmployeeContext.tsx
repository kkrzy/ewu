import { useContext, createContext, useState, useEffect } from 'react'; 
import api from '../../types/api';
import type { EmployeeProps } from '../../types/employee';
import type { AuthResponse } from '../../types/apiResponse';

type EmployeeContextType = { 
  employees: EmployeeProps[], 
  addEmployee: (employee: EmployeeProps) => void 
  updateEmployee: (employee: EmployeeProps) => void 
  refreshEmployees: () => void
};

const EmployeeContext = createContext<EmployeeContextType>({
  employees: [], 
  addEmployee: () => {},
  updateEmployee: () => {},
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

  const addEmployee = async (employee: EmployeeProps) => {
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
    } catch (error) {
      console.error("Error adding employee:", error);
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

  const updateEmployee = async (employee: EmployeeProps) => {
    try {
      // Update Firebase auth
      if (employee.uid) {
        await updateEmployeeAuth(
          employee.uid,
          `${employee.firstName} ${employee.lastName}`,
          employee.email
        );
      };

      const response = await api.put<EmployeeProps>(`/employees/${employee.id}`, employee);
      
      setEmployees((prev) => prev.map(emp => emp.id == employee.id ? response.data : emp));
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  }

  const updateEmployeeAuth = async (uid: string, displayName: string, email: string) => {
    try {
      await api.put('/auth/users', {
        uid,
        displayName,
        email
      });
    } catch (error) {
      console.error("Error updating Firebase auth:", error);
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