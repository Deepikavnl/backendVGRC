import { Navigate, Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { useAuthStore } from "@/store/auth";

export function ReviewerLayout() {

    const { user } = useAuthStore();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role === "VENDOR") {
        return <Navigate to="/vendor" replace />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
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