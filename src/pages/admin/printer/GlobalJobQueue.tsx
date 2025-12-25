import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Search,
    Filter,
    MoreHorizontal,
    AlertCircle,
    Printer,
    CheckCircle2,
    Clock,
    XCircle,
    ArrowRight,
    Briefcase
} from 'lucide-react';
import { MOCK_PRINTER_JOBS, MOCK_PRINTER_TEAMS, PrinterJob } from '@/data/mockPrinterData';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

export default function GlobalJobQueue() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [technologyFilter, setTechnologyFilter] = useState<string>('all');

    const formatStatus = (status: string) => {
        return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 gap-1.5 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" /> Completed
                    </Badge>
                );
            case 'printing':
                return (
                    <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 gap-1.5 shadow-sm animate-pulse">
                        <Printer className="w-3 h-3 animate-bounce" /> Printing
                    </Badge>
                );
            case 'ready_for_print':
                return (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1.5 shadow-sm">
                        <Clock className="w-3 h-3" /> Ready
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1.5 shadow-sm">
                        <XCircle className="w-3 h-3" /> Rejected
                    </Badge>
                );
            case 'handed_over':
                return (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 gap-1.5 shadow-sm">
                        <ArrowRight className="w-3 h-3" /> Handed Over
                    </Badge>
                );
            default:
                return <Badge variant="outline">{formatStatus(status)}</Badge>;
        }
    };

    const filteredJobs = MOCK_PRINTER_JOBS.filter(job => {
        const matchesSearch = job.jobName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
        const matchesTech = technologyFilter === 'all' || job.technology === technologyFilter;

        return matchesSearch && matchesStatus && matchesTech;
    });

    const getTeamName = (teamId?: string) => {
        if (!teamId) return <span className="text-muted-foreground italic text-xs">Unassigned</span>;
        const team = MOCK_PRINTER_TEAMS.find(t => t.id === teamId);
        return <span className="text-sm font-medium">{team ? team.name : 'Unknown Team'}</span>;
    };

    const getTeamInitials = (teamId?: string) => {
        const team = MOCK_PRINTER_TEAMS.find(t => t.id === teamId);
        if (!team) return "UN";
        return team.name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="space-y-6 pb-10 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Live Operations</h2>
                    <p className="text-muted-foreground">Monitor global printing queue and job status</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">
                        {filteredJobs.length} Active Jobs
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="p-4 bg-card rounded-xl border shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by Job ID or Name..."
                        className="pl-9 bg-background/50"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[160px]">
                            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="ready_for_print">Ready for Print</SelectItem>
                            <SelectItem value="printing">Printing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="handed_over">Handed Over</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={technologyFilter} onValueChange={setTechnologyFilter}>
                        <SelectTrigger className="w-full sm:w-[160px]">
                            <SelectValue placeholder="Technology" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Technologies</SelectItem>
                            <SelectItem value="PVC">PVC</SelectItem>
                            <SelectItem value="DIGITAL">Digital</SelectItem>
                            <SelectItem value="OFFSET">Offset</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Jobs Table */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-muted/40">
                        <TableRow>
                            <TableHead className="w-[100px]">Job ID</TableHead>
                            <TableHead>Job Detail</TableHead>
                            <TableHead>Placed At</TableHead>
                            <TableHead>Assigned Team</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Origin</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredJobs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                    <div className="flex flex-col items-center justify-center gap-2">
                                        <div className="p-3 bg-muted/50 rounded-full">
                                            <Search className="h-6 w-6" />
                                        </div>
                                        <p>No jobs found matching your filters.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredJobs.map((job) => (
                                <TableRow key={job.id} className="group hover:bg-muted/30 transition-colors">
                                    <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                                        {job.id}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-sm group-hover:text-primary transition-colors">{job.jobName}</span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="secondary" className="text-[10px] px-1.5 h-5">
                                                    {job.technology}
                                                </Badge>
                                                {job.technology === 'PVC' && (
                                                    <span className="text-[10px] text-muted-foreground">
                                                        {job.items.length} items
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-xs text-muted-foreground">
                                            {job.createdAt}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6 text-[10px]">
                                                <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                                    {getTeamInitials(job.assignedTo)}
                                                </AvatarFallback>
                                            </Avatar>
                                            {getTeamName(job.assignedTo)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusBadge(job.status)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-1.5">
                                                <Briefcase className="h-3 w-3 text-muted-foreground" />
                                                <span className="text-sm font-medium">{job.dealerName}</span>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground capitalize ml-4.5">{job.dealerType}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                <DropdownMenuItem>Reassign Team</DropdownMenuItem>
                                                {job.status !== 'completed' && job.status !== 'rejected' && (
                                                    <DropdownMenuItem className="text-red-600 focus:text-red-700 focus:bg-red-50">
                                                        Force Cancel
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}