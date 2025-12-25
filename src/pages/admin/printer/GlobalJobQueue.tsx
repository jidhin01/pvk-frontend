import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, MoreHorizontal, AlertCircle } from 'lucide-react';
import { MOCK_PRINTER_JOBS, MOCK_PRINTER_TEAMS, PrinterJob } from '@/data/mockPrinterData';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function GlobalJobQueue() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [technologyFilter, setTechnologyFilter] = useState<string>('all');

    const formatStatus = (status: string) => {
        return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300';
            case 'printing': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'ready_for_print': return 'bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300';
            case 'rejected': return 'bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300';
            case 'handed_over': return 'bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300';
            default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300';
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
        if (!teamId) return <span className="text-muted-foreground italic">Unassigned</span>;
        const team = MOCK_PRINTER_TEAMS.find(t => t.id === teamId);
        return team ? team.name : 'Unknown Team';
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Live Operations - Global Job Queue</h2>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search jobs..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                            <Filter className="mr-2 h-4 w-4" />
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="ready_for_print">Ready</SelectItem>
                            <SelectItem value="printing">Printing</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="handed_over">Handed Over</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={technologyFilter} onValueChange={setTechnologyFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Technology" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Tech</SelectItem>
                            <SelectItem value="PVC">PVC</SelectItem>
                            <SelectItem value="DIGITAL">Digital</SelectItem>
                            <SelectItem value="OFFSET">Offset</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Jobs Table */}
            <div className="rounded-md border bg-card">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Job ID</TableHead>
                            <TableHead>Job Detail</TableHead>
                            <TableHead>Placed At</TableHead>
                            <TableHead>Accepted By (Team)</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Dealer</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredJobs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                    No jobs found matching your filters.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredJobs.map((job) => (
                                <TableRow key={job.id}>
                                    <TableCell className="font-medium">{job.id}</TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{job.jobName}</span>
                                            <span className="text-xs text-muted-foreground">{job.technology}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">{job.createdAt}</span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {getTeamName(job.assignedTo)}
                                            {job.status === 'printing' && (
                                                <Badge variant="outline" className="text-xs border-orange-500 text-orange-600 animate-pulse">
                                                    Working
                                                </Badge>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`capitalize border-0 ${getStatusColor(job.status)}`}>
                                            {formatStatus(job.status)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm">{job.dealerName}</span>
                                            <span className="text-xs text-muted-foreground capitalize">{job.dealerType}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                <DropdownMenuItem>Reassign Team</DropdownMenuItem>
                                                {job.status !== 'completed' && job.status !== 'rejected' && (
                                                    <DropdownMenuItem className="text-red-600">Force Cancel</DropdownMenuItem>
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