import React, { useState, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { UserRole, useAuth } from '@/contexts/AuthContext';
import { getRoleConfig } from '@/config/navigation';
import { Sidebar } from './Sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

interface DashboardLayoutProps {
  children: (props: {
    selectedRole: UserRole;
    activeTab: string;
  }) => ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [selectedRole, setSelectedRole] = useState<UserRole>(user?.role || 'admin');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Reset active tab when role changes
  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    const roleConfig = getRoleConfig(role);
    if (roleConfig && roleConfig.tabs.length > 0) {
      setActiveTab(roleConfig.tabs[0].id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        selectedRole={selectedRole}
        onRoleChange={handleRoleChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
      />

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen transition-all duration-300",
          isMobile ? "pl-0" : "pl-60"
        )}
      >
        <div className={cn("p-6", isMobile && "pt-20")}>
          {children({ selectedRole, activeTab })}
        </div>
      </main>
    </div>
  );
}
