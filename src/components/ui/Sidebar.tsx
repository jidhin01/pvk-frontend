import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Shield,
    Users,
    Palette,
    Printer,
    TrendingUp,
    Landmark,
    Package,
    ChevronDown,
    ChevronRight
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const menuItems = [
    {
        title: 'Admin',
        icon: Shield,
        path: '/admin',
        submenu: [
            { title: 'Dashboard', path: '/admin/dashboard' },
            { title: 'User Management', path: '/admin/users' },
            { title: 'Role Management', path: '/admin/roles' },
            { title: 'Activity Logs', path: '/admin/logs' },
            { title: 'Settings', path: '/admin/settings' },
        ],
    },
    {
        title: 'Dealer',
        icon: Users,
        path: '/dealer',
        submenu: [
            { title: 'Dashboard', path: '/dealer/dashboard' },
            { title: 'PAN', path: '/dealer/pan' },
            { title: 'Seal', path: '/dealer/seal' },
            { title: 'Printing Orders', path: '/dealer/orders' },
            { title: 'Live Status', path: '/dealer/status' },
        ],
    },
    {
        title: 'Designer',
        icon: Palette,
        path: '/designer',
        submenu: [
            { title: 'Dashboard', path: '/designer/dashboard' },
            { title: 'Work Pool', path: '/designer/work-pool' },
            { title: 'My Work', path: '/designer/my-work' },
            { title: 'Earnings', path: '/designer/earnings' },
        ],
    },
    {
        title: 'Printer',
        icon: Printer,
        path: '/printer',
        submenu: [
            { title: 'Dashboard', path: '/printer/dashboard' },
            { title: 'Pending', path: '/printer/pending' },
            { title: 'Completed', path: '/printer/completed' },
            { title: 'Rejected', path: '/printer/rejected' },
        ],
    },
    {
        title: 'Sales',
        icon: TrendingUp,
        path: '/sales',
        submenu: [
            { title: 'Dashboard', path: '/sales/dashboard' },
            { title: 'Delivery List', path: '/sales/delivery' },
            { title: 'Payment Collection', path: '/sales/payments' },
            { title: 'Expenses', path: '/sales/expenses' },
        ],
    },
    {
        title: 'Finance',
        icon: Landmark,
        path: '/finance',
        submenu: [
            { title: 'Dashboard', path: '/finance/dashboard' },
            { title: 'Revenue', path: '/finance/revenue' },
            { title: 'Credit', path: '/finance/credit' },
            { title: 'Refunds', path: '/finance/refunds' },
            { title: 'Designer Earnings', path: '/finance/designer-earnings' },
        ],
    },
    {
        title: 'Stock',
        icon: Package,
        path: '/stock',
        submenu: [
            { title: 'Dashboard', path: '/stock/dashboard' },
            { title: 'Inventory', path: '/stock/inventory' },
            { title: 'Dead Stock', path: '/stock/dead-stock' },
            { title: 'Transfer', path: '/stock/transfer' },
        ],
    },
];

const Sidebar = () => {
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

    const toggleMenu = (title: string) => {
        setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    return (
        <div className="h-screen w-64 bg-white text-slate-600 flex flex-col font-sans border-r border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                {/* Logo Icon using brand colors */}
                <div className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-pvk-blue to-pvk-green opacity-10"></div>
                    <span className="font-bold text-xl text-pvk-blue">P</span>
                </div>
                <span className="text-lg font-bold text-slate-800 tracking-tight">PVK Enterprises</span>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 scrollbar-simple">
                <ul className="space-y-1">
                    {menuItems.map((item) => (
                        <li key={item.title} className="rounded-lg overflow-hidden">
                            {item.submenu ? (
                                <>
                                    <button
                                        onClick={() => toggleMenu(item.title)}
                                        className={cn(
                                            "w-full flex items-center justify-between p-3 text-sm font-medium transition-all duration-200 rounded-lg",
                                            openMenus[item.title]
                                                ? "bg-slate-50 text-pvk-blue"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon size={18} className={cn("transition-colors", openMenus[item.title] ? "text-pvk-blue" : "text-slate-400")} />
                                            <span>{item.title}</span>
                                        </div>
                                        {openMenus[item.title] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                    </button>

                                    <div className={cn(
                                        "overflow-hidden transition-all duration-300 ease-in-out",
                                        openMenus[item.title] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                                    )}>
                                        <ul className="pl-4 py-1 space-y-1">
                                            {item.submenu.map((subItem) => (
                                                <li key={subItem.path}>
                                                    <NavLink
                                                        to={subItem.path}
                                                        className={({ isActive }) =>
                                                            cn(
                                                                "flex items-center gap-2 p-2 rounded-md text-xs font-medium transition-all duration-200 border-l-2 ml-2",
                                                                isActive
                                                                    ? "border-pvk-green text-pvk-green bg-green-50"
                                                                    : "border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                                                            )
                                                        }
                                                        end
                                                    >
                                                        {subItem.title}
                                                    </NavLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </>
                            ) : (
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        cn(
                                            "flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-all",
                                            isActive
                                                ? "bg-gradient-to-r from-pvk-blue/10 to-transparent text-pvk-blue border-l-2 border-pvk-blue"
                                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-2 border-transparent"
                                        )
                                    }
                                >
                                    <item.icon size={18} />
                                    <span>{item.title}</span>
                                </NavLink>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-slate-100 mt-auto">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-300">
                        JD
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-700">John Doe</p>
                        <p className="text-xs text-slate-500">Admin</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
