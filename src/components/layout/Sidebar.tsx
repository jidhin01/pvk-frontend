import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
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
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function Sidebar({
  selectedRole,
  onRoleChange,
  collapsed,

  onCollapsedChange,
  activeTab,
  onTabChange
}: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isSpecialRole = user?.role === 'designer' || user?.role === 'printer' || user?.role === 'finance' || user?.role === 'dealer' || user?.role === 'sales' || user?.role === 'stock_keeper' || user?.role === 'pan_card_team' || user?.role === 'seal_team';
  const navItems = isSpecialRole
    ? getRoleConfig(user?.role as UserRole)?.tabs || []
    : ROLE_CONFIGS;

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo Section */}
      <div className={cn(
        "flex items-center border-b border-sidebar-border h-16 px-3",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
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
        )}
        {collapsed && (
          <img
            src={pvkLogo}
            alt="PVK"
            className="h-9 w-9 rounded-lg object-cover"
          />
        )}
      </div>

      {/* Collapse Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onCollapsedChange(!collapsed)}
        className="absolute -right-3 top-20 h-6 w-6 rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shadow-sm z-50"
      >
        {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin py-4 px-2">
        <div className={cn("mb-3 px-2", collapsed && "text-center")}>
          {!collapsed && (
            <span className="text-[10px] font-medium uppercase tracking-wider text-sidebar-foreground/50">
              {isSpecialRole ? 'My Workspace' : 'Modules'}
            </span>
          )}
        </div>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = isSpecialRole
              ? activeTab === item.id
              : selectedRole === item.id;

            const handleClick = () => {
              if (isSpecialRole && onTabChange) {
                onTabChange(item.id);
              } else {
                onRoleChange(item.id as UserRole);
              }
            };

            return (
              <li key={item.id}>
                {collapsed ? (
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleClick}
                        className={cn(
                          "w-full flex items-center justify-center p-2.5 rounded-lg transition-all duration-150",
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="font-medium">
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                ) : (
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
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className={cn(
        "border-t border-sidebar-border p-3",
        collapsed && "flex flex-col items-center gap-2"
      )}>
        {!collapsed && user && (
          <div className="flex items-center gap-3 mb-3 px-1">
            <div className="h-8 w-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary font-medium text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-accent-foreground truncate">{user.name}</p>
              <p className="text-[10px] text-sidebar-foreground/60 truncate">{user.email}</p>
            </div>
          </div>
        )}

        {/* Theme Toggle */}
        {collapsed ? (
          <DropdownMenu>
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">Toggle theme</TooltipContent>
            </Tooltip>
            <DropdownMenuContent side="right" align="end">
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
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mb-1"
              >
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute ml-0 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="ml-5">Theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
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
        )}

        {/* Logout Button */}
        {collapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
          </Tooltip>
        ) : (
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        )}
      </div>
    </aside>
  );
}
