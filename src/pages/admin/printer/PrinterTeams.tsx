import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Users, MapPin, BarChart3, MoreVertical, Settings } from 'lucide-react';
import { MOCK_PRINTER_TEAMS } from '@/data/mockPrinterData';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function PrinterTeams() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">Printer Teams</h2>
                    <p className="text-muted-foreground">Manage printing agents and monitor their load.</p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Team
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {MOCK_PRINTER_TEAMS.map((team) => (
                    <Card key={team.id} className="overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted/20">
                            <div className="flex flex-col">
                                <CardTitle className="text-base font-semibold">{team.name}</CardTitle>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                    <MapPin className="mr-1 h-3 w-3" />
                                    {team.location}
                                </div>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                    <DropdownMenuItem>Edit Team</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            {/* Status and Active Jobs */}
                            <div className="flex justify-between items-center">
                                <Badge variant={team.status === 'active' ? 'default' : team.status === 'overloaded' ? 'destructive' : 'secondary'} className="capitalize">
                                    {team.status}
                                </Badge>
                                <div className="text-sm font-medium">
                                    {team.activeJobs} Jobs Active
                                </div>
                            </div>

                            {/* Performance Bar */}
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">Performance Score</span>
                                    <span className="font-bold">{team.performance}%</span>
                                </div>
                                <Progress value={team.performance} className="h-2" />
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4 pt-2 border-t mt-4">
                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground">Completed Today</span>
                                    <div className="text-xl font-bold">{team.completedToday}</div>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs text-muted-foreground">Staff Count</span>
                                    <div className="text-xl font-bold flex items-center">
                                        4 <Users className="ml-1 h-3 w-3 text-muted-foreground" />
                                    </div>
                                </div>
                            </div>

                            <Button variant="outline" className="w-full mt-2">
                                <Settings className="mr-2 h-4 w-4" /> Manage Queue
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
