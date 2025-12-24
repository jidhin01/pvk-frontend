import React from 'react';
import { User, Mail, Shield, Calendar, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { getRoleLabel, getDashboardPath } from '@/config/navigation';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const { user } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <p className="text-muted-foreground">No user logged in.</p>
            </div>
        );
    }

    const roleLabel = getRoleLabel(user.role);
    const initials = user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const goBack = () => {
        navigate(getDashboardPath(user.role));
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
                {/* Back Button */}
                <Button variant="ghost" onClick={goBack} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Button>

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
                    <p className="text-muted-foreground">Your account information</p>
                </div>

                {/* Profile Card */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                            {/* Avatar */}
                            <Avatar className="h-20 w-20 mb-4">
                                {user.avatar ? (
                                    <AvatarImage src={user.avatar} alt={user.name} />
                                ) : null}
                                <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>

                            {/* Name & Role */}
                            <h3 className="text-xl font-semibold">{user.name}</h3>
                            <Badge variant="secondary" className="mt-2">
                                <Shield className="h-3 w-3 mr-1" />
                                {roleLabel}
                            </Badge>

                            {/* Email */}
                            <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                <span>{user.email}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Account Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <User className="h-5 w-5 text-primary" />
                            Account Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-muted-foreground text-xs uppercase tracking-wide">Full Name</Label>
                                <p className="font-medium">{user.name}</p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-muted-foreground text-xs uppercase tracking-wide">Email</Label>
                                <p className="font-medium">{user.email}</p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-muted-foreground text-xs uppercase tracking-wide">User ID</Label>
                                <p className="font-medium font-mono text-sm">#{user.id}</p>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-muted-foreground text-xs uppercase tracking-wide">Role</Label>
                                <p className="font-medium">{roleLabel}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
