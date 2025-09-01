import { createContext, useContext, useState } from 'react';

type SidebarContextType = {
    expanded: boolean;
    toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
    const [expanded, setExpanded] = useState(false);
    const toggleSidebar = () => setExpanded(prev => !prev);

    return (
        <SidebarContext.Provider value={{ expanded, toggleSidebar }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};