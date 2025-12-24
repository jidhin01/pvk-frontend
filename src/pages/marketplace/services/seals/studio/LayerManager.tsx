
import React from 'react';
import { useStudio } from './StudioContext';
import { cn } from '@/lib/utils';
import { GripVertical, Eye, EyeOff, Trash2, ChevronUp, ChevronDown, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const LayerManager: React.FC = () => {
    const { blocks, selectedBlockId, selectBlock, removeBlock, reorderBlock, updateBlock } = useStudio();

    return (
        <div className="flex flex-col h-full">
            <div className="px-4 py-2 border-b bg-slate-50 flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-slate-500">Layers</span>
                <span className="text-[10px] bg-slate-200 px-1.5 rounded text-slate-600">{blocks.length}</span>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-2 space-y-1">
                    {blocks.map((block, index) => {
                        const isSelected = selectedBlockId === block.id;
                        return (
                            <div
                                key={block.id}
                                onClick={() => selectBlock(block.id)}
                                className={cn(
                                    "flex items-center gap-2 p-2 rounded-md border text-sm cursor-pointer transition-all group",
                                    isSelected ? "bg-blue-50 border-blue-200 shadow-sm" : "bg-white border-slate-100 hover:border-blue-100"
                                )}
                            >
                                <div className="text-slate-300">
                                    {block.type === 'TEXT' ? <Type className="h-4 w-4" /> : <GripVertical className="h-4 w-4" />}
                                </div>

                                <div className="flex-1 truncate font-medium text-slate-700">
                                    {block.type === 'TEXT' ? (block.content || 'Empty Text') : block.type}
                                </div>

                                {/* Quick Actions */}
                                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-0.5">
                                    <Button
                                        size="icon" variant="ghost" className="h-6 w-6"
                                        disabled={index === 0}
                                        onClick={(e) => { e.stopPropagation(); reorderBlock(index, index - 1); }}
                                    >
                                        <ChevronUp className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        size="icon" variant="ghost" className="h-6 w-6"
                                        disabled={index === blocks.length - 1}
                                        onClick={(e) => { e.stopPropagation(); reorderBlock(index, index + 1); }}
                                    >
                                        <ChevronDown className="h-3 w-3" />
                                    </Button>
                                    <Button
                                        size="icon" variant="ghost" className="h-6 w-6 text-red-400 hover:text-red-500 hover:bg-red-50"
                                        onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
};

export default LayerManager;
