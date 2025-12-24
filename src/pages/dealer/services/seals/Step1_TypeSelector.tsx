
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Info } from 'lucide-react';
import { SEAL_TYPES, SealType } from '@/data/mockSealCatalog';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Step1Props {
    selectedType: string | null;
    onSelect: (typeId: string) => void;
}

const Step1_TypeSelector: React.FC<Step1Props> = ({ selectedType, onSelect }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {SEAL_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;

                return (
                    <Card
                        key={type.id}
                        className={cn(
                            "cursor-pointer transition-all duration-300 relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 bg-white dark:bg-slate-950",
                            isSelected
                                ? "border-primary ring-2 ring-primary shadow-lg"
                                : "border-slate-200 hover:border-primary/50"
                        )}
                        onClick={() => onSelect(type.id)}
                    >
                        {isSelected && (
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-2 py-1 rounded-bl-lg z-10 shadow-sm animate-in zoom-in spin-in-12 duration-300">
                                <Check className="h-4 w-4" />
                            </div>
                        )}

                        <CardHeader className="text-center pb-4 pt-8">
                            <div className={cn(
                                "mx-auto h-20 w-20 rounded-full flex items-center justify-center transition-all duration-300 mb-4",
                                isSelected
                                    ? "bg-primary/10 text-primary scale-110"
                                    : "bg-slate-100 text-slate-500 group-hover:bg-primary/5 group-hover:text-primary/70 group-hover:scale-105"
                            )}>
                                <Icon className="h-10 w-10" />
                            </div>

                            <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-primary transition-colors">
                                {type.name}
                            </CardTitle>

                            <div className="flex justify-center mt-2">
                                <Badge
                                    variant="secondary"
                                    className={cn(
                                        "font-normal text-[10px] uppercase tracking-wider",
                                        type.category === 'PREMIUM' ? "bg-blue-100 text-blue-700 hover:bg-blue-200" :
                                            type.category === 'BUDGET' ? "bg-amber-100 text-amber-800 hover:bg-amber-200" :
                                                "bg-purple-100 text-purple-700 hover:bg-purple-200"
                                    )}
                                >
                                    {type.category}
                                </Badge>
                            </div>
                        </CardHeader>

                        <CardContent className="text-center px-6 pb-6">
                            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 min-h-[40px]">
                                {type.description}
                            </p>
                            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Starting At</span>
                                <span className={cn("text-lg font-bold tabular-nums", isSelected ? "text-primary" : "text-slate-900 dark:text-white")}>
                                    ₹{type.basePrice}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

export default Step1_TypeSelector;
