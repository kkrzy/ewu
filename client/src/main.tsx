import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App.tsx'
import { EmployeeProvider } from './components/employee/EmployeeContext.tsx'
import { SidebarProvider } from './components/SidebarContext.tsx';
import { AuthProvider } from './components/auth/AuthContext.tsx';
import { BrowserRouter } from 'react-router'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <SidebarProvider>
                    <EmployeeProvider>
                        <App />
                    </EmployeeProvider>
                </SidebarProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
);