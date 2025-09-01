import { useState, useEffect } from 'react';
import { useAuth } from '../components/auth/AuthContext';
import LeaveList from '../components/leave/LeaveList';
import LeaveForm from '../components/leave/LeaveForm';
import type { LeaveRequest } from '../types/leave';
import api from '../types/api';

const Leave = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [pendingRequests, setPendingRequests] = useState<LeaveRequest[]>([]);
  const [employeeRequests, setEmployeeRequests] = useState<LeaveRequest[]>([]);
  const { currentUser } = useAuth();
  
  const getLeaves = async () => {
    try {
      const response = await api<LeaveRequest[]>(`/leaves?employeeId=${currentUser?.uid}`);
      setLeaves(response.data);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    }
  };
  const getManagerLeaves = async () => {
    try {
      const response = await api<LeaveRequest[]>(`/leaves?managerId=${currentUser?.uid}`);
      
      setPendingRequests(response.data.filter(leave => leave.status == 'PENDING'));
      setEmployeeRequests(response.data.filter(leave => leave.status != 'PENDING'));
    } catch (error) {
      console.error('Error fetching manager leaves:', error);
    }
  };
  const handleAdd = () => {
    setSelectedLeave(null);
    setShowForm(true);
  };

  const handleEdit = (leave: LeaveRequest) => {
    setSelectedLeave(leave);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Czy na pewno chcesz usunąć ten wniosek?')) {
      try {
        await api.delete(`/leaves/${id}`);
        if (leaves.find(l => l.id == id)) {
          setLeaves(leaves.filter(leave => leave.id != id));
        } else if (employeeRequests.find(l => l.id == id)) {
          setEmployeeRequests(employeeRequests.filter(leave => leave.id != id));
        }
      } catch (error) {
        console.error('Error deleting leave:', error);
      }
    }
  };
  const handleSubmit = async (leaveData: Partial<LeaveRequest>) => {
    try {
      if (selectedLeave) {
        // Update existing leave
        const updatedLeaveData = {
          ...selectedLeave,
          ...leaveData,
          status: selectedLeave.status,
          uuid: currentUser?.uid
        };
        const response = await api.put<LeaveRequest>(`/leaves/${selectedLeave.id}`, updatedLeaveData);
        
        setLeaves(leaves.map(leave =>
          leave.id == selectedLeave.id ? response.data : leave
        ));
      } else {
        // Create new leave
        const newLeaveData = {
          ...leaveData,
          uuid: currentUser?.uid
        };
        const response = await api.post<LeaveRequest>('/leaves', newLeaveData);
        const newLeave = response.data;
        setLeaves([...leaves, newLeave]);
      }
      setShowForm(false);
      setSelectedLeave(null);
      await getLeaves();
    } catch (error) {
      console.error('Error saving leave:', error);
    }
  };
  useEffect(() => {
    getLeaves();
    getManagerLeaves();
  }, []);getManagerLeaves

  const getWorkingDays = (start: Date, end: Date): number => {
    let count = 0;
    const current = new Date(start);
    
    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek != 0 && dayOfWeek != 6) {
        count++;
      }
      current.setDate(current.getDate() + 1);
    }
    return count;
  };

  const handleStatusChange = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      // Jeśli status to APPROVED, sprawdź limit dni
      if (status === 'APPROVED') {
        // Znajdź wniosek
        const leaveRequest = pendingRequests.find(leave => leave.id === id);
        if (!leaveRequest) return;

        // Pobierz dostępne dni dla pracownika
        const statsResponse = await api.get(`/dashboard/stats/${leaveRequest.employeeUid}`);
        const { leaveDaysAvailable } = statsResponse.data;

        // Oblicz dni robocze dla wniosku
        const workDays = getWorkingDays(
          new Date(leaveRequest.startDate),
          new Date(leaveRequest.endDate)
        );

        // Sprawdź czy nie przekracza limitu
        if (workDays > leaveDaysAvailable) {
          alert(`Nie można zaakceptować wniosku. Przekroczono limit dostępnych dni urlopowych.
            Dostępne dni: ${leaveDaysAvailable}
            Wnioskowane dni: ${workDays}`);
          return;
        }
      }
      // Aktualizuj status wniosku
      await api.put(`/leaves/${id}/status`, { status });
      await getManagerLeaves();
    } catch (error) {
      console.error('Error updating leave status:', error);
    }
  };

  return (
    <div className="container mx-auto p-2 sm:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-xl font-bold">Moje wnioski urlopowe</h1> 
        <button
          onClick={handleAdd}
          className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Nowy wniosek
        </button>
      </div>

      {leaves.length == 0 ? (
        <p className="text-center text-gray-500 py-4">Brak wniosków urlopowych</p>
      ) : (
        <LeaveList 
          leaves={leaves}
          mode="MY_REQUESTS"
          onEdit={handleEdit}
          onDelete={handleDelete}
          onStatusChange={() => {}}
        />
      )}

      {pendingRequests.length > 0 && (
        <div className="mt-8">
          <h1 className="sm:text-xl font-bold mb-4">Wnioski podwładnych do akceptacji</h1>
          <LeaveList 
            leaves={pendingRequests}
            mode="PENDING_APPROVAL"
            onEdit={() => {}}
            onDelete={() => {}}
            onStatusChange={handleStatusChange}
          />
        </div>
      )}

      {employeeRequests.length > 0 && (
        <div className="mt-8">
          <h1 className="sm:text-xl font-bold mb-4">Wnioski podwładnych (zaakceptowane / odrzucone)</h1>
          <LeaveList 
            leaves={employeeRequests}
            mode="EMPLOYEE_HISTORY"
            onEdit={() => {}}
            onDelete={handleDelete}
            onStatusChange={() => {}}
          />
        </div>
      )}

      {showForm && (
        <LeaveForm
          leave={selectedLeave}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Leave;