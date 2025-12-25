import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Search,
    Copy,
    FileIcon,
    Calendar,
    Filter,
    Download,
    Clock,
    DollarSign,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

const MOCK_ARCHIVE = [
    {
        id: 'SEAL-A-2025-001',
        date: '2025-12-20',
        client: 'Apex Architect',
        content: 'SEAL: ARCHITECT',
        type: 'SELF_INK',
        language: 'English',
        price: 350,
        processingTime: '2.5 hours',
        dealerId: 'DLR-001'
    },
    {
        id: 'SEAL-A-2025-002',
        date: '2025-12-19',
        client: 'Dr. Smith Clinic',
        content: 'MBBS SEAL',
        type: 'POCKET',
        language: 'English',
        price: 450,
        processingTime: '3 hours',
        dealerId: 'DLR-005'
    },
    {
        id: 'SEAL-A-2025-003',
        date: '2025-12-18',
        client: 'Govt School',
        content: 'PRINCIPAL STAMP',
        type: 'WOODEN',
        language: 'English',
        price: 200,
        processingTime: '2 hours',
        dealerId: 'DLR-003'
    },
    {
        id: 'SEAL-A-2025-004',
        date: '2025-12-17',
        client: 'Kerala Bank',
        content: 'BRANCH MANAGER',
        type: 'SELF_INK',
        language: 'English',
        price: 380,
        processingTime: '2.5 hours',
        dealerId: 'DLR-002'
    },
    {
        id: 'SEAL-A-2025-005',
        date: '2025-12-16',
        client: 'Legal Associates',
        content: 'NOTARY PUBLIC',
        type: 'SELF_INK',
        language: 'English',
        price: 420,
        processingTime: '3 hours',
        dealerId: 'DLR-004'
    },
    {
        id: 'SEAL-A-2025-006',
        date: '2025-12-15',
        client: 'Govt Office',
        content: 'കേരള സർക്കാർ',
        type: 'WOODEN',
        language: 'Malayalam',
        price: 350,
        processingTime: '4 hours',
        dealerId: 'DLR-008'
    },
    {
        id: 'SEAL-A-2025-007',
        date: '2025-12-14',
        client: 'Medical College',
        content: 'DEAN SEAL',
        type: 'SELF_INK',
        language: 'English',
        price: 400,
        processingTime: '2.5 hours',
        dealerId: 'DLR-005'
    },
    {
        id: 'SEAL-A-2025-008',
        date: '2025-12-13',
        client: 'Quick Print',
        content: 'RECEIVED',
        type: 'SELF_INK',
        language: 'English',
        price: 280,
        processingTime: '1.5 hours',
        dealerId: 'DLR-006'
    }
];

const DEALERS = [
    { id: 'all', name: 'All Dealers' },
    { id: 'DLR-001', name: 'Arun Traders' },
    { id: 'DLR-002', name: 'Office Plus' },
    { id: 'DLR-003', name: 'Kerala Stationary' },
    { id: 'DLR-004', name: 'Legal Docs Center' },
    { id: 'DLR-005', name: 'MedSupply Kerala' },
    { id: 'DLR-006', name: 'Quick Print Shop' },
    { id: 'DLR-008', name: 'Kerala Govt Press' }
];

export const ArchivesTab = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [dealerFilter, setDealerFilter] = useState('all');
    const [dateRange, setDateRange] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const handleCopy = (id: string) => {
        toast.success(`Order ${id} cloned to current queue!`, {
            description: 'Design file retrieved. Please verify details.'
        });
    };

    // Filter logic
    const filteredArchive = MOCK_ARCHIVE.filter(job => {
        const matchesSearch =
            job.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.id.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = typeFilter === 'all' || job.type === typeFilter;
        const matchesDealer = dealerFilter === 'all' || job.dealerId === dealerFilter;

        // Date filter (simplified)
        let matchesDate = true;
        if (dateRange === 'week') {
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            matchesDate = new Date(job.date) >= weekAgo;
        } else if (dateRange === 'month') {
            const monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            matchesDate = new Date(job.date) >= monthAgo;
        }

        return matchesSearch && matchesType && matchesDealer && matchesDate;
    });

    // Pagination
    const totalPages = Math.ceil(filteredArchive.length / itemsPerPage);
    const paginatedArchive = filteredArchive.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const clearFilters = () => {
        setSearchTerm('');
        setTypeFilter('all');
        setDealerFilter('all');
        setDateRange('all');
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold tracking-tight">Archives & Re-Runs</h2>
                    <p className="text-sm text-muted-foreground">Search past jobs to quickly re-issue stamps</p>
                </div>
                <Button variant="outline" onClick={() => toast.info('Exporting archive data...')}>
                    <Download className="mr-2 h-4 w-4" />
                    Export
                </Button>
            </div>

            {/* Filters */}
            <Card className="shadow-sm">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by Company, Content or ID..."
                                className="pl-9"
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>

                        {/* Type Filter */}
                        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}>
                            <SelectTrigger className="w-[140px]">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="SELF_INK">Self-Ink</SelectItem>
                                <SelectItem value="WOODEN">Wooden</SelectItem>
                                <SelectItem value="POCKET">Pocket</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Dealer Filter */}
                        <Select value={dealerFilter} onValueChange={(v) => { setDealerFilter(v); setCurrentPage(1); }}>
                            <SelectTrigger className="w-[160px]">
                                <SelectValue placeholder="Dealer" />
                            </SelectTrigger>
                            <SelectContent>
                                {DEALERS.map(dealer => (
                                    <SelectItem key={dealer.id} value={dealer.id}>{dealer.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Date Range */}
                        <Select value={dateRange} onValueChange={(v) => { setDateRange(v); setCurrentPage(1); }}>
                            <SelectTrigger className="w-[140px]">
                                <Calendar className="h-4 w-4 mr-2" />
                                <SelectValue placeholder="Date" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Time</SelectItem>
                                <SelectItem value="week">Last 7 Days</SelectItem>
                                <SelectItem value="month">Last 30 Days</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Clear Filters */}
                        {(searchTerm || typeFilter !== 'all' || dealerFilter !== 'all' || dateRange !== 'all') && (
                            <Button variant="ghost" size="sm" onClick={clearFilters}>
                                Clear
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Showing {paginatedArchive.length} of {filteredArchive.length} results</span>
                {totalPages > 1 && (
                    <span>Page {currentPage} of {totalPages}</span>
                )}
            </div>

            {/* Results List */}
            <div className="space-y-3">
                {paginatedArchive.length === 0 ? (
                    <Card className="shadow-sm">
                        <CardContent className="py-12 text-center">
                            <FileIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                            <p className="text-muted-foreground">No matching records found</p>
                            <Button variant="link" onClick={clearFilters} className="mt-2">
                                Clear filters
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    paginatedArchive.map(job => (
                        <Card key={job.id} className="hover:border-purple-300 dark:hover:border-purple-700 transition-all shadow-sm">
                            <CardContent className="p-4">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-500 shrink-0">
                                            <FileIcon className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="font-bold text-sm text-slate-800 dark:text-slate-200">{job.client}</div>
                                            <div className="text-sm text-muted-foreground">{job.content}</div>
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(job.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {job.processingTime}
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                                                    <DollarSign className="h-3 w-3" />
                                                    ₹{job.price}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-2">
                                            <Badge variant="secondary">{job.type.replace('_', '-')}</Badge>
                                            <Badge variant="outline">{job.language}</Badge>
                                        </div>
                                        <Button size="sm" variant="secondary" onClick={() => handleCopy(job.id)}>
                                            <Copy className="mr-2 h-3.5 w-3.5" />
                                            Clone
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <Button
                                key={page}
                                variant={currentPage === page ? 'default' : 'ghost'}
                                size="sm"
                                className="w-8 h-8 p-0"
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            )}
        </div>
    );
};
