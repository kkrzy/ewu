import { IoMdArrowDroprightCircle } from "react-icons/io";
import { useSidebar } from "./SidebarContext";
import Logo from '../assets/logo.png';
import { useAuth } from "./auth/AuthContext";
import { Navigate, Link } from 'react-router';
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const Navbar = () => {
  const { expanded, toggleSidebar } = useSidebar();
  const { setUserLoggedIn } = useAuth();

  const handleLogout = () => {
    setUserLoggedIn(false);
    signOut(auth); //   
    <Navigate to="/login" replace />;
  };
  return (
    <nav className="bg-gray-800 text-white w-full flex justify-between items-center shadow-md h-16 z-50">
        <div className="flex items-center pl-2 sm:pl-4 gap-2 sm:gap-4">
          <button 
                onClick={toggleSidebar}
                className={`text-xl transition-transform duration-375 ${expanded ? 'rotate-180' : ''} hidden sm:block`}>
                <IoMdArrowDroprightCircle />
          </button>
          <Link to="/">
            <img src={Logo} alt="Logo" className="h-8 sm:h-10" />
          </Link>
          <div className="text-sm sm:text-xl font-bold text-center">
            Elektroniczny wniosek urlopowy
          </div>
        </div>
        <div className="flex items-center pr-2 sm:pr-4">
          <button
            onClick={handleLogout}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm transition-colors duration-300"
          >
            Wyloguj
          </button>
        </div>
    </nav>
  );
};

export default Navbar