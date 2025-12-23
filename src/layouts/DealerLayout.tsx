import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    PlusCircle,
    Package,
    User,
    Menu,
    CreditCard
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { CURRENT_DEALER } from '@/data/mockDealerData';
import { cn } from '@/lib/utils'; // Assuming this exists as standard in Shadcn projects

const SidebarNav = ({ pathname }: { pathname: string }) => {
    const links = [
        { href: '/dealer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dealer/new-order', label: 'New Order', icon: PlusCircle },
        { href: '/dealer/tracking', label: 'Tracking', icon: Package },
        { href: '/dealer/profile', label: 'Profile', icon: User },
    ];

    return (
        <nav className="space-y-2 p-4">
            {links.map((link) => (
                <Link
                    key={link.href}
                    to={link.href}
                    className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-muted/80",
                        pathname === link.href ? "bg-muted text-primary" : "text-muted-foreground"
                    )}
                >
                    <link.icon className="h-5 w-5" />
                    {link.label}
                </Link>
            ))}
        </nav>
    );
};

const CreditWidget = () => {
    const { currentBalance, creditLimit } = CURRENT_DEALER;
    const usagePercentage = Math.min((currentBalance / creditLimit) * 100, 100);
    const isHighUsage = usagePercentage > 90;
    const barColor = isHighUsage ? 'bg-red-500' : 'bg-emerald-500';

    return (
        <div className="flex flex-col min-w-[200px] max-w-[300px] gap-2">
            <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                <span>Credit Usage</span>
                <span>{Math.round(usagePercentage)}%</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div
                    className={cn("h-full transition-all duration-500 ease-out", barColor)}
                    style={{ width: `${usagePercentage}%` }}
                />
            </div>
            <p className="text-xs text-right font-medium text-foreground">
                ₹{currentBalance.toLocaleString()} / ₹{creditLimit.toLocaleString()} Used
            </p>
        </div>
    );
};

export default function DealerLayout() {
    const location = useLocation();

    return (
        <div className="min-h-screen flex bg-background w-full">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 border-r bg-card">
                <div className="p-6 border-b flex items-center gap-2">
                    {/* Logo placeholder or simple name */}
                    <div className="h-8 w-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground font-bold">
                        PVK
                    </div>
                    <span className="font-bold text-lg">Dealer Portal</span>
                </div>
                <SidebarNav pathname={location.pathname} />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-16 border-b bg-card px-6 flex items-center justify-between sticky top-0 z-10 transition-all">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-64 p-0">
                                <div className="p-6 border-b font-bold text-lg">PVK Menu</div>
                                <SidebarNav pathname={location.pathname} />
                            </SheetContent>
                        </Sheet>

                        <h1 className="text-xl font-bold truncate text-foreground hidden sm:block">
                            {CURRENT_DEALER.businessName}
                        </h1>
                    </div>

                    {/* Credit Widget */}
                    <CreditWidget />
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 md:p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
