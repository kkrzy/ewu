import {
  FaHome,
  FaUsers,
  FaUmbrellaBeach,
  FaCalendarAlt,
} from "react-icons/fa";

export const menuItems = [
  { icon: <FaHome />, text: "Strona główna", path: "/" },
  { icon: <FaUsers />, text: "Pracownicy", path: "/employees" },
  { icon: <FaUmbrellaBeach />, text: "Wnioski urlopowe", path: "/leaves" },
  { icon: <FaCalendarAlt />, text: "Kalendarz", path: "/calendar" },
];