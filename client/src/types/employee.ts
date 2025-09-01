export interface EmployeeProps {
    id: number | null;
    uid: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    position: string;
    departmentId: number | null;
    employmentDate: string;
    managerUid: string;
    role: string;
    leaveDaysAvailable: number | null;
}