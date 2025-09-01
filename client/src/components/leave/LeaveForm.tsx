import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import type { LeaveRequest } from '../../types/leave';
import { LEAVE_TYPES } from '../constants/leaveConstants';
import { useFormData } from '../../hooks/useFormData';

interface LeaveFormProps {
  leave?: LeaveRequest | null;
  onSubmit: (data: Partial<LeaveRequest>) => void;
  onClose: () => void;
}

interface ExistingLeave {
  id: number;
  startDate: string;
  endDate: string;
}

const formatDateForInput = (dateString: string | undefined): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

const LeaveForm = ({ leave, onSubmit, onClose }: LeaveFormProps) => {
  const { currentUser, leaveDaysAvailable } = useAuth();
  const [formData, setFormData] = useState({
    id: leave?.id || undefined,
    startDate: formatDateForInput(leave?.startDate),
    endDate: formatDateForInput(leave?.endDate),
    type: leave?.type || 'VACATION',
    description: leave?.description || ''
  });
  const { leaves } = useFormData({ dataTypes: ['leaves'], userId: currentUser?.uid });
  const [dateError, setDateError] = useState('');

  const validateDates = (start: string, end: string): boolean => {
    if (!start || !end) return true;
    const startDate = new Date(start);
    const endDate = new Date(end);
    return startDate <= endDate;
  };

  const checkDateOverlap = (id: number, start: string, end: string): boolean => {
    const newStart = new Date(start);
    const newEnd = new Date(end);
    const filteredLeaves = leaves.filter((l: LeaveRequest) => l.id != id && l.status != 'REJECTED');

    return filteredLeaves.some((existingLeave: ExistingLeave) => {
      const existingStart: Date = new Date(existingLeave.startDate);
      const existingEnd: Date = new Date(existingLeave.endDate);

      return (
        (newStart >= existingStart && newStart <= existingEnd) || 
        (newEnd >= existingStart && newEnd <= existingEnd) || 
        (newStart <= existingStart && newEnd >= existingEnd)
      );
    });
  };
  
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

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    if (!validateDates(newFormData.startDate, newFormData.endDate)) {
      setDateError('Data rozpoczęcia nie może być późniejsza niż data zakończenia');
      return;
    } 
    if (
      newFormData.startDate &&
      newFormData.endDate &&
      checkDateOverlap(newFormData.id ?? 0, newFormData.startDate, newFormData.endDate)
    ) {
      setDateError('Wybrany termin pokrywa się z innym wnioskiem urlopowym');
      return;
    } 
    if (newFormData.startDate && newFormData.endDate) {
      const workingDays = getWorkingDays(new Date(newFormData.startDate), new Date(newFormData.endDate));
      if (workingDays > leaveDaysAvailable) {
        setDateError(`Nie masz wystarczającej liczby dni wolnych. Dostępne dni: ${leaveDaysAvailable}`);
        return;
      }
    }
    setDateError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateDates(formData.startDate, formData.endDate) || dateError) {
      return;
    }
    onSubmit({
      ...formData,
      employeeUid: leave?.employeeUid || currentUser?.uid,
      status: leave?.status
    });
  };
  
  const inputClassName = "mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm";
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {leave ? 'Edycja wniosku' : 'Nowy wniosek'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data rozpoczęcia<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="date"
              value={formData.startDate}
              onChange={e => handleDateChange('startDate', e.target.value)}
              className={inputClassName}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Data zakończenia<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={e => handleDateChange('endDate', e.target.value)}
              className={inputClassName}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Typ urlopu<span className="text-red-500 ml-1">*</span>
            </label>
            <select
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value as LeaveRequest['type']})}
              className={inputClassName}
              required
            >
              {Object.entries(LEAVE_TYPES).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Opis
            </label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className={inputClassName}
              placeholder="Dodatkowe informacje o wniosku..."
              rows={3}
            />
          </div>
          {dateError && <p className="text-red-500 text-sm">{dateError}</p>}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Anuluj
            </button>
            <button
              type="submit"
              disabled={!!dateError}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                dateError 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {leave ? 'Zapisz zmiany' : 'Złóż wniosek'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveForm;