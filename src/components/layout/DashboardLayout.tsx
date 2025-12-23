import { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { UserRole, useAuth } from '@/contexts/AuthContext';
import { getRoleConfig } from '@/config/navigation';
import { Sidebar } from './Sidebar';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface DashboardLayoutProps {
  children: (props: {
    selectedRole: UserRole;
    activeTab: string;
    onTabChange: (tab: string) => void;
  }) => ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(user?.role || 'admin');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-background sticky top-0 z-30">
        <div className="font-bold text-lg">PVK Enterprises</div>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 border-r-0 w-72">
            <Sidebar
              selectedRole={selectedRole}
              onRoleChange={handleRoleChange}
              collapsed={false}
              onCollapsedChange={() => { }}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              mobile={true}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          sidebarCollapsed ? "md:pl-16" : "md:pl-64"
        )}
      >

        <div className="p-4 md:p-8">
          {children({ selectedRole, activeTab, onTabChange: handleTabChange })}

        </div>
      </main>
    </div>
  );
}
