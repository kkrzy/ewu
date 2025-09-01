export const ROLE = {
    ADMIN: 'Administrator',
    MANAGER: 'Manager',
    SUBORDINATE: 'Pracownik'
} as const;

export type Role = keyof typeof ROLE;