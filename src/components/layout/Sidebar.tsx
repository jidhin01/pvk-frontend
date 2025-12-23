import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Sun,
  Moon,
  Menu,
  X
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
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

export function Sidebar({
  selectedRole,
  onRoleChange,
  activeTab,
  onTabChange,
  mobileOpen = false,
  onMobileOpenChange
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

  const isSpecialRole = user?.role === 'designer' || user?.role === 'printer' || user?.role === 'finance' || user?.role === 'dealer' || user?.role === 'sales' || user?.role === 'stock_keeper' || user?.role === 'pan_card_team' || user?.role === 'seal_team';
  const navItems = isSpecialRole
    ? getRoleConfig(user?.role as UserRole)?.tabs || []
    : ROLE_CONFIGS;

  const handleNavClick = (item: RoleConfig | { id: string; label: string; icon: React.ComponentType<{ className?: string }> }) => {
    if (isSpecialRole && onTabChange) {
      onTabChange(item.id);
    } else {
      onRoleChange(item.id as UserRole);
    }
    // Close mobile sidebar on navigation
    if (isMobile && onMobileOpenChange) {
      onMobileOpenChange(false);
    }
  };

  const sidebarContent = (
    <>
      {/* Header Section with Logo, Title, and Theme Toggle */}
      <div className="flex items-center justify-between border-b border-sidebar-border h-16 px-4">
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
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-3">
        <div className="mb-3 px-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-sidebar-foreground/50">
            {isSpecialRole ? 'My Workspace' : 'Modules'}
          </span>
        </div>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = isSpecialRole
              ? activeTab === item.id
              : selectedRole === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item)}
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
            onClick={() => {
              navigate('/profile');
              if (isMobile && onMobileOpenChange) {
                onMobileOpenChange(false);
              }
            }}
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
    </>
  );

  // Mobile: Overlay sidebar
  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onMobileOpenChange?.(!mobileOpen)}
          className="fixed top-4 left-4 z-50 h-10 w-10 bg-background/80 backdrop-blur-sm border border-border shadow-sm md:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {/* Mobile Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => onMobileOpenChange?.(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-0 z-40 h-screen w-72 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-transform duration-300 ease-in-out flex flex-col md:hidden",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebarContent}
        </aside>
      </>
    );
  }

  // Desktop: Fixed sidebar (no collapse)
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-60 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col hidden md:flex">
      {sidebarContent}
    </aside>
  );
}
