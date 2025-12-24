
import React from 'react';
import { cn } from '@/lib/utils';
import { SEAL_TEMPLATES } from '@/data/mockSealCatalog';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

interface Step2Props {
    selectedTemplate: string | null;
    onSelect: (templateId: string) => void;
}

const Step2_TemplateSelector: React.FC<Step2Props> = ({ selectedTemplate, onSelect }) => {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Select Style & Size</h3>
                <p className="text-slate-500 text-sm">Choose the shape that fits your content.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {SEAL_TEMPLATES.map((tmpl) => {
                    const isSelected = selectedTemplate === tmpl.id;
                    return (
                        <div
                            key={tmpl.id}
                            onClick={() => onSelect(tmpl.id)}
                            className={cn(
                                "group cursor-pointer rounded-xl border-2 transition-all duration-300 p-1 bg-white hover:shadow-lg",
                                isSelected ? "border-emerald-500 shadow-md transform -translate-y-1" : "border-slate-100 hover:border-emerald-200"
                            )}
                        >
                            <div className={cn(
                                "rounded-lg p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[160px] transition-colors",
                                isSelected ? "bg-emerald-50/50" : "bg-slate-50 group-hover:bg-white"
                            )}>
                                {/* Grid Background */}
                                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:16px_16px]" />

                                {isSelected && (
                                    <div className="absolute top-2 right-2 text-emerald-600 animate-in zoom-in spin-in-45 duration-300">
                                        <Check className="h-5 w-5" />
                                    </div>
                                )}

                                {/* Shape Preview */}
                                <div
                                    className={cn(
                                        "border-2 border-dashed flex items-center justify-center text-[10px] sm:text-xs font-bold text-slate-400 group-hover:text-emerald-500 group-hover:border-emerald-300 transition-all duration-300 mb-3",
                                        tmpl.shape === 'ROUND' ? "rounded-full h-20 w-20" :
                                            tmpl.shape === 'OVAL' ? "rounded-[50%] h-16 w-24" :
                                                "rounded-md h-12 w-28"
                                    )}
                                >
                                    {tmpl.shape}
                                </div>
                                <span className="text-xs text-slate-400">{tmpl.dimensions}</span>
                            </div>

                            <div className="px-4 py-3">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className={cn("font-bold text-sm", isSelected ? "text-emerald-700" : "text-slate-700")}>{tmpl.name}</h4>
                                    {tmpl.priceModifier > 0 && (
                                        <Badge variant="outline" className="text-[10px] border-emerald-200 text-emerald-600 bg-emerald-50">
                                            +₹{tmpl.priceModifier}
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-[11px] text-slate-500 line-clamp-1">{tmpl.recommendedFor}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Step2_TemplateSelector;
