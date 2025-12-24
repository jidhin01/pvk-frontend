import React, { useState } from 'react';
import { Bell, Package, AlertTriangle, MessageSquare, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Notification {
    id: string;
    type: 'order' | 'alert' | 'message' | 'success';
    title: string;
    description: string;
    time: string;
    read: boolean;
}

// Mock notifications data
const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'order',
        title: 'New Order Received',
        description: 'Order #1234 from ABC Enterprises',
        time: '2 min ago',
        read: false,
    },
    {
        id: '2',
        type: 'alert',
        title: 'Low Stock Alert',
        description: 'PVC Card stock below threshold',
        time: '15 min ago',
        read: false,
    },
    {
        id: '3',
        type: 'success',
        title: 'Payment Received',
        description: '₹25,000 from XYZ Corp',
        time: '1 hour ago',
        read: false,
    },
    {
        id: '4',
        type: 'message',
        title: 'New Message',
        description: 'Designer team needs clarification',
        time: '2 hours ago',
        read: true,
    },
    {
        id: '5',
        type: 'order',
        title: 'Order Completed',
        description: 'Order #1230 ready for delivery',
        time: '3 hours ago',
        read: true,
    },
];

const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
        case 'order':
            return <Package className="h-4 w-4 text-blue-500" />;
        case 'alert':
            return <AlertTriangle className="h-4 w-4 text-amber-500" />;
        case 'message':
            return <MessageSquare className="h-4 w-4 text-purple-500" />;
        case 'success':
            return <CheckCircle className="h-4 w-4 text-green-500" />;
        default:
            return <Bell className="h-4 w-4" />;
    }
};

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
    const [open, setOpen] = useState(false);

    const unreadCount = notifications.filter((n) => !n.read).length;

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    };

    const removeNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9 hover:bg-accent"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end" sideOffset={8}>
                {/* Header */}
                <div className="flex items-center justify-between border-b px-4 py-3">
                    <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">Notifications</h4>
                        {unreadCount > 0 && (
                            <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                                {unreadCount} new
                            </Badge>
                        )}
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs text-muted-foreground hover:text-foreground"
                            onClick={markAllAsRead}
                        >
                            Mark all read
                        </Button>
                    )}
                </div>

                {/* Notifications List */}
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                            <Bell className="h-8 w-8 mb-2 opacity-50" />
                            <p className="text-sm">No notifications</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "flex items-start gap-3 px-4 py-3 hover:bg-muted/50 cursor-pointer transition-colors group",
                                        !notification.read && "bg-muted/30"
                                    )}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className={cn(
                                                "text-sm truncate",
                                                !notification.read && "font-medium"
                                            )}>
                                                {notification.title}
                                            </p>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeNotification(notification.id);
                                                }}
                                            >
                                                <X className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {notification.description}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground/70 mt-1">
                                            {notification.time}
                                        </p>
                                    </div>
                                    {!notification.read && (
                                        <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {/* Footer */}
                {notifications.length > 0 && (
                    <div className="border-t p-2">
                        <Button
                            variant="ghost"
                            className="w-full h-8 text-xs text-muted-foreground hover:text-foreground"
                            onClick={() => setOpen(false)}
                        >
                            View all notifications
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}
