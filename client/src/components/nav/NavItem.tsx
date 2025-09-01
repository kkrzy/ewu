import { Link } from "react-router";

type NavItemProps = {
    icon: React.ReactNode;
    text: string;
    expanded: boolean;
    path: string;
};

const NavItem = ({icon, text, expanded, path}: NavItemProps) => (
    <Link 
        to={path} 
        className="flex items-center gap-4 cursor-pointer w-full hover:text-blue-400 z-0">
        <span 
            data-tooltip-id={!expanded ? "sidebar-tooltip" : undefined} 
            data-tooltip-content={!expanded ? text : undefined} 
            className="text-xl">{icon}</span>
        <div className="text-nowrap ">{text}</div>
    </Link>
);

export default NavItem;