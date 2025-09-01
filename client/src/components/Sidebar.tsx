import { motion } from "framer-motion";
import { menuItems } from "./nav/Icon";
import NavItem from "./nav/NavItem";
import { useSidebar } from "./SidebarContext";
import { Tooltip } from "react-tooltip";

const Sitebar = () => {
    const { expanded } = useSidebar();
    return (
        <div >
            <motion.div 
                initial={{ width: 52 }}
                animate={{ width: expanded ? 192 : 52 }}
                transition={{ duration: 0.375 }}
                >
                <nav className="flex flex-col gap-8 text-white p-4">
                    {menuItems.map((item, index) => (
                        <NavItem 
                            key={index} 
                            icon={item.icon} 
                            text={item.text}
                            expanded={expanded}
                            path={item.path}
                        />
                    ))}
                </nav>
            </motion.div>
            {!expanded && <Tooltip id="sidebar-tooltip" offset={24} className="z-100"/>}
        </div>
    );
};

export default Sitebar;