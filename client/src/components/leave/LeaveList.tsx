import type { LeaveRequest } from "../../types/leave";
import { LEAVE_TYPES, LEAVE_STATUS } from '../constants/leaveConstants';
import useEmployeeContext from "../employee/EmployeeContext";

type ListMode = 'MY_REQUESTS' | 'PENDING_APPROVAL' | 'EMPLOYEE_HISTORY';

interface LeaveListProps {
  leaves: LeaveRequest[];
  mode: ListMode;
  onEdit: (leave: LeaveRequest) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: 'APPROVED' | 'REJECTED') => void;
}

const LeaveList = ({ leaves, mode, onEdit, onDelete, onStatusChange }: LeaveListProps) => {
  const getStatusBadgeColor = (status: LeaveRequest['status']) => {
    return status == 'PENDING'  ? 'bg-yellow-100 text-yellow-800' :
           status == 'APPROVED' ? 'bg-green-100 text-green-800' :
           status == 'REJECTED' ? 'bg-red-100 text-red-800' :
           'bg-gray-100 text-gray-800';
  };
  const { employees } = useEmployeeContext();
  const headerClassName = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
  const btnInfoClassName = "text-blue-600 hover:text-blue-900 cursor-pointer";
  const btnDangerClassName = "text-red-600 hover:text-red-900 cursor-pointer";
  const btnSuccessClassName = "text-green-600 hover:text-green-900 cursor-pointer";

  return (
    <>
    <div className="hidden sm:block overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            {(mode == 'PENDING_APPROVAL' || mode == 'EMPLOYEE_HISTORY') && (
              <th className={headerClassName}>Pracownik</th>
            )}
            <th className={headerClassName}>Data od</th>
            <th className={headerClassName}>Data do</th>
            <th className={headerClassName}>Typ</th>
            <th className={headerClassName}>Status</th>
            <th className={headerClassName}>Data złożenia wniosku</th>
            <th className={headerClassName}>Akcje</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {leaves.map(leave => (
            <tr key={leave.id}>
              {(mode == 'PENDING_APPROVAL' || mode == 'EMPLOYEE_HISTORY') && (
                <td className="px-6 py-4">{[...employees].filter(e => e.uid == leave.employeeUid).map(e => e.firstName + ' ' + e.lastName)}</td>
              )}
              <td className="px-6 py-4">{new Date(leave.startDate).toLocaleDateString()}</td>
              <td className="px-6 py-4">{new Date(leave.endDate).toLocaleDateString()}</td>
              <td className="px-6 py-4">{LEAVE_TYPES[leave.type]}</td>
              <td className="px-6 py-4">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(leave.status)}`}>
                    {LEAVE_STATUS[leave.status]}
                </span>
              </td>
              <td className="px-6 py-4">{
              leave.createdAt ? new Date(leave.createdAt).toLocaleString('pl-PL', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }) : '-'}
              </td>
              <td className="px-6 py-4 space-x-2">
                {mode == 'MY_REQUESTS' && leave.status == "PENDING" && (
                  <>
                    <button
                      onClick={() => onEdit(leave)}
                      className={btnInfoClassName}
                    >
                      Edytuj
                    </button>
                    <button
                      onClick={() => onDelete(leave.id)}
                      className={btnDangerClassName}
                    >
                      Usuń
                    </button>
                  </>
                )}
                {mode == 'PENDING_APPROVAL' && (
                  <>
                    <button
                      onClick={() => onStatusChange(leave.id, 'APPROVED')}
                      className={btnSuccessClassName}
                    >
                      Akceptuj
                    </button>
                    <button
                      onClick={() => onStatusChange(leave.id, 'REJECTED')}
                      className={btnDangerClassName}
                    >
                      Odrzuć
                    </button>
                </>
                )}
                {mode == 'EMPLOYEE_HISTORY' && leave.status == 'APPROVED' && new Date() <= new Date(leave.startDate) && (
                  <>
                    <button
                      onClick={() => onDelete(leave.id)}
                      className={btnDangerClassName}
                    >
                      Wycofaj
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="sm:hidden">
        {leaves.map(leave => (
          <div key={leave.id} className="bg-white mb-4 rounded-lg shadow p-4">
            {(mode == 'PENDING_APPROVAL' || mode == 'EMPLOYEE_HISTORY') && (
              <div className="mb-2">
                <span className="font-medium text-gray-500">Pracownik:</span>
                <span className="ml-2">
                  {[...employees].filter(e => e.uid == leave.employeeUid).map(e => e.firstName + ' ' + e.lastName)}
                </span>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <span className="font-medium text-gray-500">Od:</span>
                <span className="ml-2">{new Date(leave.startDate).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="font-medium text-gray-500">Do:</span>
                <span className="ml-2">{new Date(leave.endDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mb-2">
              <span className="font-medium text-gray-500">Typ:</span>
              <span className="ml-2">{LEAVE_TYPES[leave.type]}</span>
            </div>

            <div className="mb-2">
              <span className="font-medium text-gray-500">Utworzono:</span>
              <span className="ml-2">
                  {leave.createdAt ? new Date(leave.createdAt).toLocaleString('pl-PL', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                  }) : '-'}
              </span>
            </div>

            <div className="mb-3">
              <span className="font-medium text-gray-500">Status:</span>
              <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(leave.status)}`}>
                {LEAVE_STATUS[leave.status]}
              </span>
            </div>
            <div className="flex justify-end gap-3 pt-2 border-t">
              {mode == 'MY_REQUESTS' && leave.status == "PENDING" && (
                <>
                  <button
                    onClick={() => onEdit(leave)}
                    className={btnInfoClassName}
                  >
                    Edytuj
                  </button>
                  <button
                    onClick={() => onDelete(leave.id)}
                    className={btnDangerClassName}
                  >
                    Usuń
                  </button>
                </>
              )}
              {mode == 'PENDING_APPROVAL' && (
                <>
                  <button
                    onClick={() => onStatusChange(leave.id, 'APPROVED')}
                    className={btnSuccessClassName}
                  >
                    Akceptuj
                  </button>
                  <button
                    onClick={() => onStatusChange(leave.id, 'REJECTED')}
                    className={btnDangerClassName}
                  >
                    Odrzuć
                  </button>
                </>
              )}
              {mode == 'EMPLOYEE_HISTORY' && leave.status == 'APPROVED' && new Date() <= new Date(leave.startDate) && (
                  <button
                      onClick={() => onDelete(leave.id)}
                      className={btnDangerClassName}
                  >
                    Wycofaj
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default LeaveList;