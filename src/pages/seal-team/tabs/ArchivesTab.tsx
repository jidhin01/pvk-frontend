import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Copy, FileIcon, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export const ArchivesTab = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const MOCK_ARCHIVE = [
        { id: "SEAL-A-2023-001", date: "2023-11-01", client: "Apex Architect", content: "SEAL: ARCHITECT", type: "SELF_INK" },
        { id: "SEAL-A-2023-042", date: "2023-10-15", client: "Dr. Smith Clinic", content: "MBBS SEAL", type: "POCKET" },
        { id: "SEAL-A-2022-885", date: "2022-05-20", client: "Govt School", content: "PRINCIPAL STAMP", type: "WOODEN" },
    ];

    const handleCopy = (id: string) => {
        toast.success(`Order ${id} cloned to current queue!`, {
            description: "Design file retrieved. Please verify details."
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-4">
                <div>
                    <h2 className="text-xl font-bold tracking-tight">Archives & Re-Runs</h2>
                    <p className="text-sm text-muted-foreground">Search past jobs to quickly re-issue stamps.</p>
                </div>

                <div className="relative max-w-lg">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by Company, Content or Date..."
                        className="pl-9 h-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-4">
                {MOCK_ARCHIVE.map(job => (
                    <Card key={job.id} className="hover:border-purple-300 transition-all cursor-default">
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                                    <FileIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-slate-800 dark:text-slate-200">{job.client}</div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-2">
                                        <span>{job.content}</span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {job.date}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Badge variant="secondary">{job.type}</Badge>
                                <Button size="sm" variant="secondary" onClick={() => handleCopy(job.id)}>
                                    <Copy className="mr-2 h-3.5 w-3.5" />
                                    Clone to New
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
