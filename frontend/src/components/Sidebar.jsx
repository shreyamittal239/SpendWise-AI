import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Receipt,
    Users,
    Bot,
    User,
    LogOut,
    Wallet,
} from "lucide-react";

import { useContext } from "react";
import AuthContext from "../context/AuthProvider";

const Sidebar = ({sidebarOpen , setSidebarOpen}) => {
   
    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const menu = [
        {
            title: "Dashboard",
            icon: LayoutDashboard,
            path: "/dashboard",
        },
        {
            title: "Expenses",
            icon: Receipt,
            path: "/expenses",
        },
        {
            title: "Groups",
            icon: Users,
            path: "/groups",
        },
        {
            title: "AI Assistant",
            icon: Bot,
            path: "/ai",
        },
        {
            title: "Profile",
            icon: User,
            path: "/profile",
        },
    ];

    const handleLogout = async () => {
         setSidebarOpen(false);
        await logout();
        navigate("/login");
    };

    return (

        <aside className={`
        fixed top-0 left-0 z-40
        h-screen w-72
        bg-white border-r border-gray-200 shadow-sm
        flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out

        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}

        lg:translate-x-0
    `}>

            <div>

                <div className="px-8 py-8 flex items-center gap-4">

                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">

                        <Wallet className="text-white"/>

                    </div>

                    <div>

                        <h1 className="font-bold text-2xl">

                            SpendWise

                        </h1>

                        <p className="text-indigo-600 font-semibold">

                            AI

                        </p>

                    </div>

                </div>

                <nav className="px-5 mt-10 space-y-2">

                    {menu.map((item) => {

                        const Icon = item.icon;

                        return (

                            <NavLink
                                key={item.path}
                                to={item.path}
                                 onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                                        isActive
                                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                                            : "hover:bg-gray-100 text-gray-600"
                                    }`
                                }
                            >

                                <Icon size={20}/>

                                <span className="font-medium">

                                    {item.title}

                                </span>

                            </NavLink>

                        );

                    })}

                </nav>

            </div>

            <div className="p-5">

                <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 text-white rounded-2xl py-4 flex justify-center items-center gap-3 transition"
                >

                    <LogOut size={18}/>

                    Logout

                </button>

            </div>

        </aside>

    );

};

export default Sidebar;