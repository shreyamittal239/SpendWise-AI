import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">

            {/* Background */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-10 left-10 w-[420px] h-[420px] rounded-full bg-indigo-300 blur-[180px] opacity-20" />
                <div className="absolute bottom-10 right-10 w-[420px] h-[420px] rounded-full bg-purple-300 blur-[180px] opacity-20" />
                <div className="absolute top-1/2 left-1/2 w-[350px] h-[350px] rounded-full bg-cyan-300 blur-[180px] opacity-10" />
            </div>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="flex">

                {/* Sidebar */}
                <Sidebar
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />

                {/* Main */}
                <div className="flex-1 lg:ml-72">

                    <Header
                        setSidebarOpen={setSidebarOpen}
                    />

                    <main className="p-4 sm:p-6 lg:p-8">
                        {children}
                    </main>

                </div>

            </div>
        </div>
    );
};

export default DashboardLayout;