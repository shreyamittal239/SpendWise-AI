import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import NotificationBell from "./NotificationBell";
import NotificationDropdown from "./NotificationDropdown";
import { useState } from "react";
import { useNotification } from "../context/NotificationContext";
import {
    Menu,
    Search,
    Bell,
    ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = ({setSidebarOpen}) => {
    const { markAllAsRead } = useNotification();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const { user } = useContext(AuthContext);

    const hour = new Date().getHours();

    const handleNotificationClick = () => {

    setOpen(!open);

    if (!open) {

        markAllAsRead();

    }

};

    const greeting =
        hour < 12
            ? "Good Morning"
            : hour < 18
            ? "Good Afternoon"
            : "Good Evening";

    return (

        <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl border-b border-gray-200">

            <div className="flex justify-between items-center px-4 sm:px-6 lg:px-10 py-4">

                {/* Left Section */}

                <div className="flex items-center gap-3">

                    <button
    onClick={() => setSidebarOpen(true)}
    className="lg:hidden p-2 rounded-xl hover:bg-slate-100"
>
    <Menu size={24} />
</button>

                      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900">
        {greeting}
        <span className="ml-2">👋</span>
    </h1>

    <p className="mt-1 text-sm sm:text-base text-slate-500">
        Welcome back,
        <span className="ml-1 font-semibold text-indigo-600">
            {user?.name}
        </span>
    </p>
  

                </div>

                {/* Right Section */}

                <div className="flex items-center gap-2 sm:gap-4 lg:gap-5">

                    {/* Search */}

                    
                    {/* Notifications */}

                    <div className="flex items-center justify-between">

    <NotificationBell
        onClick={handleNotificationClick}
    />

    {

        open &&

        <NotificationDropdown />

    }

</div>

                    {/* Profile */}

    <div
    
     onClick={() => navigate("/profile")}
    className="flex items-center gap-3 cursor-pointer hover:bg-slate-100 px-3 py-2 rounded-xl transition-all"
>

    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">

        {user?.profileImage ? (

            <img
                src={user.profileImage}
                alt={user.name}
                className="w-full h-full object-cover"
            />

        ) : (

            user?.name?.charAt(0).toUpperCase()

        )}

    </div>

    <div className="hidden md:block">

        <p className="font-semibold text-slate-800">
            {user?.name}
        </p>

        <p className="text-xs text-slate-500">
            View Profile
        </p>

    </div>

</div>
                </div>

            </div>

        </header>

    );

};

export default Header;