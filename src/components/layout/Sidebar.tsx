
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut,
  Sun,
  Moon,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getRoleConfig, ROLE_CONFIGS } from '@/config/navigation';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import pvkLogo from '@/assets/pvk-logo.jpeg';

interface SidebarProps {
  selectedRole?: UserRole; // Make optional if derived
  onRoleChange?: (role: UserRole) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;

  // Layout Props
  mobile?: boolean;
  mobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
}

export function Sidebar({
  selectedRole,
  onRoleChange,
  activeTab,
  onTabChange,
  mobile = false,
  mobileOpen = false,
  onMobileOpenChange,
}: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const isMobile = useIsMobile(); // System check, overrides 'mobile' prop if needed
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

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

  // Admin and Manager should see their own tabs, not all roles
  // Only super_admin sees all ROLE_CONFIGS for role switching
  const isSuperAdmin = user?.role === 'super_admin';

  // Get navigation items based on user role
  const navItems = isSuperAdmin
    ? ROLE_CONFIGS  // Super admin can switch between all roles
    : getRoleConfig(user?.role || 'admin')?.tabs || [];  // All other users see their own tabs

  const handleNavClick = (item: any) => {
    if (isSuperAdmin && onRoleChange) {
      // Super admin switches between roles
      onRoleChange(item.id as UserRole);
    } else if (onTabChange) {
      // All other users switch between tabs
      onTabChange(item.id);
    }
    // Close mobile menu on click
    if (isMobile && onMobileOpenChange) {
      onMobileOpenChange(false);
    }
  };

  // --- CONTENT ---
  const sidebarContent = (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground">
      {/* Logo Section */}
      <div className="flex items-center border-b border-sidebar-border h-16 px-3 flex-shrink-0 justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <img
            src={pvkLogo}
            alt="PVK Enterprises"
            className="h-9 w-9 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-sm text-sidebar-accent-foreground truncate">PVK</span>
            <span className="text-[10px] text-sidebar-foreground/60 truncate">Enterprises</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Theme Toggle */}
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
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Close Button (Mobile Only) */}
          {isMobile && onMobileOpenChange && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={() => onMobileOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-2">
        <div className="mb-3 px-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-sidebar-foreground/50">
            {isSuperAdmin ? 'Modules' : 'My Workspace'}
          </span>
        </div>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = isSuperAdmin
              ? selectedRole === item.id
              : activeTab === item.id;

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
      <div className="border-t border-sidebar-border p-3 flex-shrink-0">
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
            <div className="h-8 w-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary font-medium text-sm flex-shrink-0">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-sidebar-accent-foreground truncate">{user.name}</p>
              <p className="text-[10px] text-sidebar-foreground/60 truncate">{user.email}</p>
            </div>
          </button>
        )}

        {/* Logout Button with Confirmation Dialog */}
        <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="sm:max-w-[400px]">
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to logout? You will need to sign in again to access your account.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogout}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );

  // --- RENDER ---

  // 1. Explicit Mobile Prop (e.g. inside a Sheet/Drawer)
  if (mobile) {
    return (
      <aside className="h-full w-full bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col">
        {sidebarContent}
      </aside>
    );
  }

  // 2. Viewport Mobile (Auto-detect Check) - Uses internal overlay logic
  if (isMobile) {
    return (
      <>
        {/* Mobile Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden animate-in fade-in"
            onClick={() => onMobileOpenChange?.(false)}
          />
        )}

        {/* Mobile Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-0 z-50 h-screen w-72 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out md:hidden shadow-2xl",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebarContent}
        </aside>
      </>
    );
  }

  // Desktop: Fixed sidebar
  return (
    <aside
      className="fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border hidden md:flex flex-col w-64"
    >
      {sidebarContent}
    </aside>
  );
}
