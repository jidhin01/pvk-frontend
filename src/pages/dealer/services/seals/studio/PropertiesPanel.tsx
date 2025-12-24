
import React from 'react';
import { useStudio } from './StudioContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Assuming we have this or use Input
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import { Type, Bold, Italic, AlignLeft, AlignCenter, AlignRight, Plus, Box, Minus, MoveVertical } from 'lucide-react';
import { STAMP_FONTS } from '@/data/mockSealCatalog';
import LayerManager from './LayerManager';
import { Separator } from '@/components/ui/separator';

const PropertiesPanel: React.FC = () => {
    const { selectedBlockId, blocks, updateBlock, addBlock } = useStudio();

    const selectedBlock = blocks.find(b => b.id === selectedBlockId);

    return (
        <div className="flex flex-col h-full bg-white border-r shadow-xl z-20 w-80">
            {/* 1. TOP SECTION: CONTEXTUAL TOOLS */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">

                {/* TOOLBAR (Always available?) Or only when nothing selected? 
                    User said: State A (Nothing Selected) -> Add Blocks.
                    But user might want to add block while something is selected. 
                    I'll keep a mini-toolbar always visible or just follow the dynamic rule strictly.
                */}

                {!selectedBlock ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
                        <div className="space-y-2">
                            <h3 className="font-bold text-lg text-slate-800">Add Element</h3>
                            <p className="text-sm text-slate-500">Choose a component to add to the stamp.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline" className="h-20 flex flex-col gap-2 hover:border-blue-500 hover:bg-blue-50" onClick={() => addBlock('TEXT')}>
                                <Type className="h-6 w-6 text-blue-600" />
                                <span className="text-xs font-semibold">Text</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex flex-col gap-2 hover:border-blue-500 hover:bg-blue-50" onClick={() => addBlock('LINE')}>
                                <Minus className="h-6 w-6 text-slate-600" />
                                <span className="text-xs font-semibold">Divider</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex flex-col gap-2 hover:border-blue-500 hover:bg-blue-50" onClick={() => addBlock('GAP')}>
                                <MoveVertical className="h-6 w-6 text-slate-600" />
                                <span className="text-xs font-semibold">Spacer</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex flex-col gap-2 hover:border-blue-500 hover:bg-blue-50" onClick={() => addBlock('PLACEHOLDER')}>
                                <Box className="h-6 w-6 text-slate-600" />
                                <span className="text-xs font-semibold">Box</span>
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-slate-800">Properties</h3>
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono">
                                {selectedBlock.type}
                            </span>
                        </div>

                        {selectedBlock.type === 'TEXT' && (
                            <>
                                <div className="space-y-2">
                                    <Label>Content</Label>
                                    <textarea
                                        className="w-full min-h-[80px] p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        value={selectedBlock.content}
                                        onChange={(e) => updateBlock(selectedBlock.id, { content: e.target.value })}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Typography</Label>
                                    <Select
                                        value={selectedBlock.fontFamily || 'serif'}
                                        onValueChange={(val) => updateBlock(selectedBlock.id, { fontFamily: val })}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {STAMP_FONTS.map(f => (
                                                <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <Label>Size</Label>
                                            <span className="text-slate-500">{selectedBlock.fontSize}px</span>
                                        </div>
                                        <Slider
                                            value={[selectedBlock.fontSize]}
                                            min={8} max={36} step={1}
                                            onValueChange={([v]) => updateBlock(selectedBlock.id, { fontSize: v })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <Label>Letter Spacing</Label>
                                            <span className="text-slate-500">{selectedBlock.letterSpacing || 0}px</span>
                                        </div>
                                        <Slider
                                            value={[selectedBlock.letterSpacing || 0]}
                                            min={-2} max={10} step={0.5}
                                            onValueChange={([v]) => updateBlock(selectedBlock.id, { letterSpacing: v })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <Label>Vertical Offset</Label>
                                            <span className="text-slate-500">{selectedBlock.yOffset || 0}px</span>
                                        </div>
                                        <Slider
                                            value={[selectedBlock.yOffset || 0]}
                                            min={-20} max={20} step={1}
                                            onValueChange={([v]) => updateBlock(selectedBlock.id, { yOffset: v })}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-2 p-1 bg-slate-100 rounded-lg justify-center">
                                    <Toggle pressed={selectedBlock.bold} onPressedChange={(v) => updateBlock(selectedBlock.id, { bold: v })} aria-label="Toggle bold">
                                        <Bold className="h-4 w-4" />
                                    </Toggle>
                                    <Toggle pressed={selectedBlock.inverted} onPressedChange={(v) => updateBlock(selectedBlock.id, { inverted: v })} aria-label="Toggle inverted">
                                        <div className="h-4 w-4 bg-black border border-white" />
                                    </Toggle>
                                    <div className="w-px bg-slate-300 mx-1" />
                                    <Toggle pressed={selectedBlock.align === 'left'} onPressedChange={() => updateBlock(selectedBlock.id, { align: 'left' })}>
                                        <AlignLeft className="h-4 w-4" />
                                    </Toggle>
                                    <Toggle pressed={selectedBlock.align === 'center'} onPressedChange={() => updateBlock(selectedBlock.id, { align: 'center' })}>
                                        <AlignCenter className="h-4 w-4" />
                                    </Toggle>
                                    <Toggle pressed={selectedBlock.align === 'right'} onPressedChange={() => updateBlock(selectedBlock.id, { align: 'right' })}>
                                        <AlignRight className="h-4 w-4" />
                                    </Toggle>
                                </div>
                            </>
                        )}

                        {(selectedBlock.type === 'GAP' || selectedBlock.type === 'LINE' || selectedBlock.type === 'PLACEHOLDER') && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <Label>Height / Spacing</Label>
                                        <span className="text-slate-500">{selectedBlock.type === 'GAP' ? selectedBlock.height : 10}px</span>
                                    </div>
                                    {selectedBlock.type === 'GAP' && (
                                        <Slider value={[selectedBlock.height]} min={5} max={100} step={5} onValueChange={([v]) => updateBlock(selectedBlock.id, { height: v })} />
                                    )}
                                    {selectedBlock.type !== 'GAP' && (
                                        <Slider value={[selectedBlock.yOffset || 0]} min={-10} max={10} step={1} onValueChange={([v]) => updateBlock(selectedBlock.id, { yOffset: v })} />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <Separator />

            {/* 2. BOTTOM SECTION: LAYER MANAGER */}
            <div className="h-1/3 min-h-[200px] flex flex-col bg-slate-50/50">
                <LayerManager />
            </div>
        </div>
    );
};

export default PropertiesPanel;
