import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getRoleConfig, ROLE_CONFIGS, RoleConfig } from '@/config/navigation';
import { UserRole, useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import pvkLogo from '@/assets/pvk-logo.jpeg';

interface SidebarProps {
  selectedRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  mobile?: boolean; // New prop
}

export function Sidebar({
  selectedRole,
  onRoleChange,
  activeTab,
  onTabChange,
  mobile = false
}: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile();

  // Get theme display name
  const getThemeLabel = () => {
    switch (theme) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'system': return 'System';
      default: return 'Theme';
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine if single-role user (not admin/super_admin/manager who might see modules)
  // For simplcity, anyone not admin/super_admin sees their own tabs
  const isSingleRole = user?.role && !['super_admin', 'admin'].includes(user.role);

  const navItems = isSingleRole
    ? getRoleConfig(user!.role)?.tabs || []
    : ROLE_CONFIGS;

  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out flex flex-col h-full",
        mobile ? "w-full" : "fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border hidden md:flex w-64"
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center border-b border-sidebar-border h-16 px-3 justify-between">
        <div className="flex items-center gap-3">
          <img
            src={pvkLogo}
            alt="PVK Enterprises"
            className="h-9 w-9 rounded-lg object-cover"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-sidebar-accent-foreground">PVK</span>
            <span className="text-[10px] text-sidebar-foreground/60">Enterprises</span>
          </div>
        </div>

        {/* Theme Toggle next to PVK Enterprises */}
        <DropdownMenu>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                >
                  <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              {getThemeLabel()}
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>



      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-2">
        <div className="mb-3 px-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-sidebar-foreground/50">
            {isSingleRole ? 'My Workspace' : 'Modules'}
          </span>
        </div>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = isSingleRole
              ? activeTab === item.id
              : selectedRole === item.id;

            const handleClick = () => {
              if (isSingleRole && onTabChange) {
                onTabChange(item.id);
              } else {
                onRoleChange(item.id as UserRole);
              }
            };

            return (
              <li key={item.id}>
                <button
                  onClick={handleClick}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-sm",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="border-t border-sidebar-border p-3">
        {user && (
          <button
            onClick={() => navigate('/profile')}
            className="w-full flex items-center gap-3 mb-3 px-1 py-2 -my-2 rounded-lg hover:bg-sidebar-accent transition-colors cursor-pointer"
          >
            <div className="h-8 w-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary font-medium text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-sidebar-accent-foreground truncate">{user.name}</p>
              <p className="text-[10px] text-sidebar-foreground/60 truncate">{user.email}</p>
            </div>
          </button>
        )}

        {/* Logout Button */}
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
}
