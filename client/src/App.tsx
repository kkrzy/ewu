import { Route, Routes } from 'react-router';
import Home from './pages/Home';
import Employee from './pages/Employee';
import Error from './pages/Error';
import Login from './pages/Login';
import Leave from './pages/Leave';
import Calendar from './pages/Calendar';
import ProtectedLayout from './components/nav/ProtectedLayout';

const App = () => {
    return (
        <Routes>
            <Route path="login" element={<Login/>} />

            <Route element={<ProtectedLayout/>}>
                <Route path="/" element={<Home/>} />
                <Route path="employees" element={<Employee/>} />
                <Route path="leaves" element={<Leave/>} />
                <Route path="calendar" element={<Calendar/>} />
            </Route>

            <Route path="*" element={<Error/>} />
        </Routes>
    );
};

export default App;