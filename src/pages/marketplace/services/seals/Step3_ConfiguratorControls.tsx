
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Circle, Square, Type, Plus, GripVertical, Trash2, AlignCenter, AlignLeft, AlignRight, Bold, Minus, Calendar } from 'lucide-react';
import { SealTemplate, INK_COLORS, StampBlock } from '@/data/mockSealCatalog';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface ConfigControlsProps {
    template: SealTemplate;
    blocks: StampBlock[];
    selectedColor: string;
    onBlocksChange: (blocks: StampBlock[]) => void;
    onColorChange: (hex: string) => void;
    onShapeChange: (shape: 'RECTANGLE' | 'ROUND') => void;
}

const Step3_ConfiguratorControls: React.FC<ConfigControlsProps> = ({
    template,
    blocks,
    selectedColor,
    onBlocksChange,
    onColorChange,
    onShapeChange
}) => {

    const addBlock = (type: StampBlock['type']) => {
        const newBlock = { id: Math.random().toString(36).substr(2, 9) } as any;
        newBlock.type = type;

        if (type === 'TEXT') {
            newBlock.content = '';
            newBlock.align = 'center';
            newBlock.bold = false;
            newBlock.fontSize = 14;
        } else if (type === 'GAP') {
            newBlock.height = 20;
        } else if (type === 'LINE') {
            newBlock.style = 'solid';
        } else if (type === 'PLACEHOLDER') {
            newBlock.label = 'Sign:';
            newBlock.width = '100px';
        }

        onBlocksChange([...blocks, newBlock]);
    };

    const updateBlock = (id: string, updates: Partial<StampBlock>) => {
        onBlocksChange(blocks.map(b => b.id === id ? { ...b, ...updates } as StampBlock : b));
    };

    const removeBlock = (id: string) => {
        onBlocksChange(blocks.filter(b => b.id !== id));
    };

    return (
        <div className="bg-white/90 backdrop-blur-md border rounded-xl p-6 shadow-xl h-full flex flex-col animate-in slide-in-from-left-6 duration-500">
            <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-800 mb-1">Customize Design</h3>
                <p className="text-xs text-slate-500">Add blocks to build your stamp layout.</p>
            </div>

            {/* Shape & Color Row */}
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <Label className="mb-2 block text-[10px] uppercase text-slate-400 font-bold tracking-wider">Shape</Label>
                    <Tabs value={template.shape} onValueChange={(v) => onShapeChange(v as any)} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-0.5 h-8">
                            <TabsTrigger value="ROUND" className="text-xs h-7"><Circle className="h-3 w-3 mr-1" />Round</TabsTrigger>
                            <TabsTrigger value="RECTANGLE" className="text-xs h-7"><Square className="h-3 w-3 mr-1" />Rect</TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
                <div>
                    <Label className="mb-2 block text-[10px] uppercase text-slate-400 font-bold tracking-wider">Color</Label>
                    <div className="flex gap-2">
                        {INK_COLORS.map((c) => (
                            <button
                                key={c.hex}
                                onClick={() => onColorChange(c.hex)}
                                className={cn("h-6 w-6 rounded-full border shadow-sm transition-transform", selectedColor === c.hex ? "scale-110 ring-2 ring-offset-1 " + c.ring : "")}
                                style={{ backgroundColor: c.hex }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <Separator className="mb-4" />

            {/* BLOCK LIST */}
            <Label className="mb-2 block text-[10px] uppercase text-slate-400 font-bold tracking-wider flex justify-between items-center">
                <span>Layers / Blocks</span>
                <span className="text-emerald-600">{blocks.length} Items</span>
            </Label>

            <ScrollArea className="flex-1 -mx-2 px-2">
                <div className="space-y-3 pb-4">
                    {blocks.map((block, idx) => (
                        <div key={block.id} className="group bg-slate-50 hover:bg-white border hover:border-emerald-200 rounded-lg p-3 transition-all relative">
                            {/* Drag Handle (Visual Only for now) & Type Icon */}
                            <div className="flex items-center gap-2 mb-2">
                                <GripVertical className="h-4 w-4 text-slate-300 cursor-move" />
                                <span className="text-[10px] font-bold uppercase bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded">
                                    {block.type}
                                </span>
                                <div className="flex-1" />
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-red-500" onClick={() => removeBlock(block.id)}>
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>

                            {/* Block Controls */}
                            {block.type === 'TEXT' && (
                                <div className="space-y-2">
                                    <div className="flex gap-2">
                                        <Input
                                            value={block.content}
                                            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                            placeholder="Enter text..."
                                            className="h-8 text-sm bg-white"
                                        />
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <div className="flex bg-slate-100 rounded-md p-0.5">
                                            <Button size="icon" variant={block.bold ? "secondary" : "ghost"} className="h-6 w-6" onClick={() => updateBlock(block.id, { bold: !block.bold })}>
                                                <Bold className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <div className="flex bg-slate-100 rounded-md p-0.5">
                                            <Button size="icon" variant={block.align === 'left' ? "secondary" : "ghost"} className="h-6 w-6" onClick={() => updateBlock(block.id, { align: 'left' })}>
                                                <AlignLeft className="h-3 w-3" />
                                            </Button>
                                            <Button size="icon" variant={block.align === 'center' ? "secondary" : "ghost"} className="h-6 w-6" onClick={() => updateBlock(block.id, { align: 'center' })}>
                                                <AlignCenter className="h-3 w-3" />
                                            </Button>
                                            <Button size="icon" variant={block.align === 'right' ? "secondary" : "ghost"} className="h-6 w-6" onClick={() => updateBlock(block.id, { align: 'right' })}>
                                                <AlignRight className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {block.type === 'GAP' && (
                                <div className="flex items-center gap-2">
                                    <Label className="text-xs">Height:</Label>
                                    <Input
                                        type="number"
                                        value={block.height}
                                        onChange={(e) => updateBlock(block.id, { height: parseInt(e.target.value) || 0 })}
                                        className="h-7 w-20 text-xs"
                                    />
                                    <span className="text-xs text-muted-foreground">px</span>
                                </div>
                            )}

                            {block.type === 'LINE' && (
                                <div className="flex items-center gap-2">
                                    <Label className="text-xs">Style:</Label>
                                    <select
                                        className="h-7 text-xs border rounded px-2"
                                        value={block.style}
                                        onChange={(e) => updateBlock(block.id, { style: e.target.value as any })}
                                    >
                                        <option value="solid">Solid</option>
                                        <option value="dashed">Dashed</option>
                                    </select>
                                </div>
                            )}

                            {block.type === 'PLACEHOLDER' && (
                                <div className="grid grid-cols-2 gap-2">
                                    <Input value={block.label} onChange={(e) => updateBlock(block.id, { label: e.target.value })} placeholder="Label (e.g. Date)" className="h-7 text-xs" />
                                    <Input value={block.width} onChange={(e) => updateBlock(block.id, { width: e.target.value })} placeholder="Width" className="h-7 text-xs" />
                                </div>
                            )}
                        </div>
                    ))}

                    {blocks.length === 0 && (
                        <div className="text-center py-8 text-slate-300 text-sm border-2 border-dashed rounded-lg">
                            No blocks added. Start building!
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* ADD ACTIONS */}
            <div className="grid grid-cols-4 gap-2 mt-2 pt-2 border-t">
                <Button variant="outline" size="sm" className="flex flex-col h-auto py-2 gap-1 text-[10px]" onClick={() => addBlock('TEXT')}>
                    <Type className="h-3 w-3" /> Text
                </Button>
                <Button variant="outline" size="sm" className="flex flex-col h-auto py-2 gap-1 text-[10px]" onClick={() => addBlock('LINE')}>
                    <Minus className="h-3 w-3" /> Line
                </Button>
                <Button variant="outline" size="sm" className="flex flex-col h-auto py-2 gap-1 text-[10px]" onClick={() => addBlock('GAP')}>
                    <GripVertical className="h-3 w-3" /> Gap
                </Button>
                <Button variant="outline" size="sm" className="flex flex-col h-auto py-2 gap-1 text-[10px]" onClick={() => addBlock('PLACEHOLDER')}>
                    <Square className="h-3 w-3" /> Box
                </Button>
            </div>
        </div>
    );
};

export default Step3_ConfiguratorControls;
