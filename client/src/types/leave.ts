export interface LeaveRequest {
    id: number;
    employeeUid: string;
    startDate: string;
    endDate: string;
    type: 'VACATION' | 'SICK' | 'UNPAID' | 'CASUAL' | 'OTHER';
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    description: string;
    createdAt: string;
    updatedAt: string;
}