import { Calendar, LayoutDashboard, List, Settings, WalletCards } from "lucide-react";

export const SidebarOptions = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
    },
    {
        name: "Scheduled Interviews",
        icon: Calendar,
        path: "/scheduled-interview",
    },
    {
        name: "All Interviews",
        icon: List,
        path: "/all-interview",
    },
    {
        name: "billing",
        icon: WalletCards,
        path: "/billing",
    },
    {
        name: "Settings",
        icon: Settings,
        path: "/settings",
    }
]