import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAuth } from '../components/auth/AuthContext';
import api from '../types/api';
import type { LeaveRequest } from '../types/leave';
import useEmployeeContext from "../components/employee/EmployeeContext";
import { LEAVE_TYPES, LEAVE_STATUS } from '../components/constants/leaveConstants';
import type { CalendarEvent } from '../types/calendarEvent';

const Calendar = () => {
    const [subordinatesLeaves, setSubordinatesLeaves] = useState<LeaveRequest[]>([]);
    const [myLeaves, setMyLeaves] = useState<LeaveRequest[]>([]);
    const { currentUser } = useAuth();
    const [isLoading, setIsLoading] = useState(true);

    const fetchAllLeaves = async () => {
        try {
            const [subordinatesResponse, myLeavesResponse] = await Promise.all([
                api.get(`/leaves?managerId=${currentUser?.uid}`),
                api.get(`/leaves?employeeId=${currentUser?.uid}`)
            ]);
            
            setSubordinatesLeaves(subordinatesResponse.data);
            setMyLeaves(myLeavesResponse.data);
        } catch (error) {
            console.error('Error fetching leaves:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser?.uid) {
            fetchAllLeaves();
        }
    }, [currentUser]);

    const getEventColor = (status: string): { bg: string, border: string } => {
        return status == 'APPROVED' ? { bg: '#34D399', border: '#059669' } :
               status == 'REJECTED' ? { bg: '#F87171', border: '#DC2626' } :
               { bg: '#FCD34D', border: '#D97706' };
    };
    const { employees } = useEmployeeContext();

    const addDays = (date: string, days: number) => {
        const d = new Date(date);
        d.setDate(d.getDate() + days);
        return d.toISOString().split('T')[0];
    };

    const events: CalendarEvent[] = [
        ...subordinatesLeaves.map(leave => {
            const colors = getEventColor(leave.status);
            return {
                title: `${[...employees].filter(e => e.uid == leave.employeeUid).map(e => e.firstName + ' ' + e.lastName)} - ${LEAVE_TYPES[leave.type]}`,
                start: leave.startDate,
                end: addDays(leave.endDate, 1),
                backgroundColor: colors.bg,
                borderColor: colors.border,
                allDay: true
            };
        }),
        ...myLeaves.map(leave => {
            const colors = getEventColor(leave.status);
            return {
                title: `Mój urlop - ${LEAVE_TYPES[leave.type]}`,
                start: leave.startDate,
                end: addDays(leave.endDate, 1),
                backgroundColor: colors.bg,
                borderColor: colors.border,
                allDay: true,
            };
        })
    ];

    const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

    const handleEventClick = (eventInfo: any) => {
        setExpandedEventId(expandedEventId === eventInfo.event.id ? null : eventInfo.event.id);
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>;
    }

    return (
        <div className="p-2 sm:p-4">
            <div className="mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Kalendarz urlopów</h1>
            </div>
            
            <div className="bg-white rounded-lg shadow p-2 sm:p-4">
                <div className="mb-4 flex flex-wrap gap-2 sm:gap-4">
                    <div className="flex items-center text-sm sm:text-base">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded mr-1 sm:mr-2 bg-[#34D399]"></div>
                        <span>{LEAVE_STATUS["APPROVED"]}</span>
                    </div>
                    <div className="flex items-center text-sm sm:text-base">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded mr-1 sm:mr-2 bg-[#F87171]"></div>
                        <span>{LEAVE_STATUS["REJECTED"]}</span>
                    </div>
                    <div className="flex items-center text-sm sm:text-base">
                        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded mr-1 sm:mr-2 bg-[#FCD34D]"></div>
                        <span>{LEAVE_STATUS["PENDING"]}</span>
                    </div>
                </div>

                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    height="auto"
                    locale="pl"
                    firstDay={1}
                    headerToolbar={{
                        left: 'prev,next',
                        center: 'title',
                        right: 'today'
                    }}
                    buttonText={{
                        today: 'Dziś',
                        prev: '<',
                        next: '>'
                    }}
                    eventClick={handleEventClick}
                    eventContent={(eventInfo) => {
                    const isExpanded = expandedEventId == eventInfo.event.id;
                        return {
                            html: `
                                <div class="event-content text-xs sm:text-sm p-1">
                                    <div class="truncate ${isExpanded ? 'whitespace-normal' : ''}">
                                        ${eventInfo.event.title}
                                    </div>
                                    ${isExpanded ? `
                                        <div class="text-xs mt-1 pt-1 border-t border-gray-200 not-sr-only">
                                            <div>Od: ${eventInfo.event.start?.toLocaleDateString()}</div>
                                            <div>Do: ${eventInfo.event.end?.toLocaleDateString()}</div>
                                        </div>
                                    ` : ''}
                                </div>
                            `
                        };
                    }}
                />
            </div>
        </div>
    );
};

export default Calendar;