import { useState, ReactNode, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { UserRole, useAuth } from '@/contexts/AuthContext';
import { getRoleConfig } from '@/config/navigation';
import { Sidebar } from './Sidebar';
import { useLocation } from 'react-router-dom';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NotificationBell } from './NotificationBell';

interface DashboardLayoutProps {
  children: (props: {
    selectedRole: UserRole;
    activeTab: string;
    onTabChange: (tab: string) => void;
  }) => ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const location = useLocation();
  const [selectedRole, setSelectedRole] = useState<UserRole>(user?.role || 'admin');

  // Get initial tab from role config
  const getInitialTab = (role: UserRole) => {
    const roleConfig = getRoleConfig(role);
    return roleConfig?.tabs[0]?.id || 'dashboard';
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab(user?.role || 'admin'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sync activeTab with location state if provided (e.g. redirects)
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      // Optional: Clear state to prevent stickiness? No, it's fine.
    }
  }, [location]);

  // Reset active tab when user role changes
  useEffect(() => {
    if (user?.role) {
      setSelectedRole(user.role);
      setActiveTab(getInitialTab(user.role));
    }
  }, [user?.role]);

  // Reset active tab when role changes
  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    const roleConfig = getRoleConfig(role);
    if (roleConfig && roleConfig.tabs.length > 0) {
      setActiveTab(roleConfig.tabs[0].id);
    }
    setMobileMenuOpen(false); // Close mobile menu on role change
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false); // Close mobile menu on tab change
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <Sidebar
        selectedRole={selectedRole}
        onRoleChange={handleRoleChange}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-background sticky top-0 z-30">
        <div className="font-bold text-lg">PVK Enterprises</div>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-r-0 w-72 [&>button]:hidden">
              <Sidebar
                selectedRole={selectedRole}
                onRoleChange={handleRoleChange}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                mobile={true}
                mobileOpen={mobileMenuOpen}
                onMobileOpenChange={setMobileMenuOpen}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Top Bar */}
      <div className="hidden md:flex fixed top-0 left-64 right-0 h-14 items-center justify-end px-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-30">
        <NotificationBell />
      </div>

      {/* Main Content */}
      <main
        className="min-h-screen transition-all duration-300 md:pl-64"
      >

        <div className="p-4 md:p-8 md:pt-20">
          {children({ selectedRole, activeTab, onTabChange: handleTabChange })}

        </div>
      </main>
    </div>
  );
}
