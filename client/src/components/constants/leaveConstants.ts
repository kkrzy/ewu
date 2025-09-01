export const LEAVE_TYPES = {
    VACATION: 'Wypoczynkowy',
    SICK: 'Chorobowy',
    UNPAID: 'Bezpłatny',
    CASUAL: 'Okazjonalny',
    OTHER: 'Inny'
} as const;

export const LEAVE_STATUS = {
    PENDING: 'Planowany',
    APPROVED: 'Zaakceptowany',
    REJECTED: 'Odrzucony'
} as const;

export type LeaveType = keyof typeof LEAVE_TYPES;
export type LeaveStatus = keyof typeof LEAVE_STATUS;