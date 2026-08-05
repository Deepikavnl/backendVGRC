import { Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useAuthStore } from "@/store/auth";

export function AppLayout() {

    const { user } = useAuthStore();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role === "REVIEWER") {
        return <Navigate to="/reviewer" replace />;
    }

    if (user.role === "VENDOR") {
        return <Navigate to="/vendor" replace />;
    }

    return (
        <div className="flex h-screen">
            <Sidebar />

            <div className="flex flex-1 flex-col">
                <Header />

                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export function VendorLayout() {

    const { user } = useAuthStore();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "VENDOR") {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="flex h-screen">
            <Sidebar vendor />

            <div className="flex flex-1 flex-col">
                <Header />

                <main className="flex-1 overflow-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}