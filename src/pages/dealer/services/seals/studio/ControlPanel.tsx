
import React from 'react';
import { useStudio } from './StudioContext';
import {
    Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input'; // Ensure Input is imported
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import { Type, Bold, AlignLeft, AlignCenter, AlignRight, Box, Minus, MoveVertical, LayoutTemplate } from 'lucide-react';
import { STAMP_FONTS, PRESET_LAYOUTS } from '@/data/mockSealCatalog';
import LayerManager from './LayerManager';

// --- SUB-COMPONENTS --- //

const LayoutsGrid = () => {
    const { template, applyLayout } = useStudio();
    // Match presets to shape. Map renderType 'circular' -> 'ROUND', etc.
    const shapeType = template?.renderType === 'rectangular' ? 'RECTANGLE' : 'ROUND';

    const validPresets = PRESET_LAYOUTS.filter(p => p.type === shapeType);

    return (
        <div className="grid grid-cols-2 gap-3 p-1">
            {validPresets.map(preset => (
                <Button
                    key={preset.id}
                    variant="outline"
                    className="h-24 flex flex-col gap-2 hover:border-emerald-500 hover:bg-emerald-50 transition-all border-slate-200"
                    onClick={() => applyLayout(preset.blocks)}
                >
                    <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                        <LayoutTemplate className="h-5 w-5" />
                    </div>
                    <span className="text-xs font-semibold text-slate-600 truncate w-full">{preset.name}</span>
                </Button>
            ))}
            {validPresets.length === 0 && <div className="text-sm text-slate-400 col-span-2 text-center py-4">No presets for this shape</div>}
        </div>
    );
};

const AddElementsGrid = () => {
    const { addBlock } = useStudio();
    return (
        <div className="grid grid-cols-2 gap-3 p-1">
            <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-blue-500 hover:bg-blue-50 transition-all border-slate-200" onClick={() => addBlock('TEXT')}>
                <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Type className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-600">Add Text</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-blue-500 hover:bg-blue-50 transition-all border-slate-200" onClick={() => addBlock('LINE')}>
                <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                    <Minus className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-600">Divider</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-blue-500 hover:bg-blue-50 transition-all border-slate-200" onClick={() => addBlock('GAP')}>
                <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                    <MoveVertical className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-600">Spacer</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 hover:border-blue-500 hover:bg-blue-50 transition-all border-slate-200" onClick={() => addBlock('PLACEHOLDER')}>
                <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                    <Box className="h-5 w-5" />
                </div>
                <span className="text-xs font-semibold text-slate-600">Box</span>
            </Button>
        </div>
    );
};

const EasyModeForm = () => {
    const { blocks, updateBlock } = useStudio();
    // Filter only blocks meaningful for "Easy Input" (Text with Labels + Placeholders)
    // If a block has NO label, we might skip it or show generic "Text Line"
    const visibleBlocks = blocks.filter(b => b.type === 'TEXT' || b.type === 'DATER_HOLE' || (b.type === 'PLACEHOLDER' && b.label));

    if (visibleBlocks.length === 0) return <div className="text-center text-slate-400 py-8 text-sm">No editable fields found. Try adding a Layout.</div>;

    return (
        <div className="space-y-6 p-1">
            {visibleBlocks.map((block, i) => (
                <div key={block.id} className="space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">
                        {/* Fallback label if none defined */}
                        {(block as any).label || (block.type === 'TEXT' ? `Text Line ${i + 1}` : block.type)}
                    </Label>

                    {block.type === 'TEXT' && (
                        <Input
                            value={block.content}
                            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                            className="bg-slate-50 border-slate-200 focus:bg-white transition-colors font-medium text-slate-700"
                        />
                    )}
                    {block.type === 'PLACEHOLDER' && (
                        <div className="p-3 bg-slate-100 rounded text-xs text-slate-500 text-center border border-dashed">
                            Placeholder Box (Fixed)
                        </div>
                    )}
                    {block.type === 'DATER_HOLE' && (
                        <div className="p-3 bg-slate-100 rounded text-xs text-slate-500 text-center border border-dashed">
                            Date Mechanism Area
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

const PropertiesForm = () => {
    const { selectedBlockId, blocks, updateBlock } = useStudio();
    const selectedBlock = blocks.find(b => b.id === selectedBlockId);

    if (!selectedBlock) return <div className="text-center text-slate-400 py-8 text-sm">Select an element to edit properties</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b">
                <span className="text-xs font-bold uppercase text-slate-400">Editing</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-mono">
                    {selectedBlock.type}
                </span>
            </div>

            {selectedBlock.type === 'TEXT' && (
                <>
                    <div className="space-y-2">
                        <Label>Content</Label>
                        <textarea
                            className="w-full min-h-[80px] p-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none font-serif"
                            value={selectedBlock.content}
                            onChange={(e) => updateBlock(selectedBlock.id, { content: e.target.value })}
                            placeholder="Enter Custom Text..."
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
                                    <SelectItem key={f.id} value={f.id}><span style={{ fontFamily: f.family }}>{f.name}</span></SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <Label>Font Size</Label>
                                <span className="text-slate-500">{selectedBlock.fontSize}px</span>
                            </div>
                            <Slider
                                value={[selectedBlock.fontSize]}
                                min={8} max={64} step={1}
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
                                min={-5} max={20} step={0.5}
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
                                min={-50} max={50} step={2}
                                onValueChange={([v]) => updateBlock(selectedBlock.id, { yOffset: v })}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 justify-between">
                        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                            <Toggle pressed={selectedBlock.bold} onPressedChange={(v) => updateBlock(selectedBlock.id, { bold: v })} size="sm" className="h-8 w-8">
                                <Bold className="h-4 w-4" />
                            </Toggle>
                            <Toggle pressed={selectedBlock.inverted} onPressedChange={(v) => updateBlock(selectedBlock.id, { inverted: v })} size="sm" className="h-8 w-8">
                                <div className="h-3 w-3 bg-black border border-white" />
                            </Toggle>
                        </div>

                        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                            <Toggle pressed={selectedBlock.align === 'left'} onPressedChange={() => updateBlock(selectedBlock.id, { align: 'left' })} size="sm" className="h-8 w-8">
                                <AlignLeft className="h-4 w-4" />
                            </Toggle>
                            <Toggle pressed={selectedBlock.align === 'center'} onPressedChange={() => updateBlock(selectedBlock.id, { align: 'center' })} size="sm" className="h-8 w-8">
                                <AlignCenter className="h-4 w-4" />
                            </Toggle>
                            <Toggle pressed={selectedBlock.align === 'right'} onPressedChange={() => updateBlock(selectedBlock.id, { align: 'right' })} size="sm" className="h-8 w-8">
                                <AlignRight className="h-4 w-4" />
                            </Toggle>
                        </div>
                    </div>
                </>
            )}

            {(selectedBlock.type !== 'TEXT') && (
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <Label>Height / Size</Label>
                            <span className="text-slate-500">{selectedBlock.type === 'GAP' ? selectedBlock.height : (selectedBlock.type === 'PLACEHOLDER' ? selectedBlock.width : 2)}px</span>
                        </div>
                        {selectedBlock.type === 'GAP' && (
                            <Slider value={[selectedBlock.height]} min={5} max={100} step={5} onValueChange={([v]) => updateBlock(selectedBlock.id, { height: v })} />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};


// --- MAIN PANEL --- //

const ControlPanel: React.FC = () => {
    const { isEasyMode } = useStudio();

    return (
        <div className="h-full bg-white flex flex-col overflow-hidden">
            {/* DESKTOP: Accordion View */}
            <div className="hidden md:block flex-1 overflow-y-auto">
                {/* LAYOUTS SECTION (Always visible first for non-designers) */}
                <div className="border-b">
                    <div className="px-4 py-3 bg-slate-50 border-b">
                        <h3 className="font-bold text-slate-700 text-sm">Smart Layouts</h3>
                    </div>
                    <div className="p-4 bg-slate-50/50">
                        <LayoutsGrid />
                    </div>
                </div>

                {isEasyMode ? (
                    <div className="flex-1 p-4">
                        <div className="mb-4">
                            <h3 className="font-bold text-slate-800">Quick Edit</h3>
                            <p className="text-xs text-slate-500">Fill in the fields below to customize.</p>
                        </div>
                        <EasyModeForm />
                    </div>
                ) : (
                    <Accordion type="multiple" defaultValue={["add", "props", "layers"]} className="w-full">
                        <AccordionItem value="add" className="border-b px-4">
                            <AccordionTrigger className="hover:no-underline py-4 font-bold text-slate-700">Add Elements</AccordionTrigger>
                            <AccordionContent>
                                <AddElementsGrid />
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="props" className="border-b px-4">
                            <AccordionTrigger className="hover:no-underline py-4 font-bold text-slate-700">Properties</AccordionTrigger>
                            <AccordionContent>
                                <PropertiesForm />
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="layers" className="border-b px-4">
                            <AccordionTrigger className="hover:no-underline py-4 font-bold text-slate-700">Layers</AccordionTrigger>
                            <AccordionContent>
                                <div className="h-64">
                                    <LayerManager />
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                )}
            </div>

            {/* MOBILE: Tabbed View */}
            <div className="md:hidden flex-1 flex flex-col">
                <Tabs defaultValue="layouts" className="flex-1 flex flex-col h-full">
                    <div className="px-4 pt-2 border-b bg-white shadow-sm z-10 sticky top-0">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="layouts" className="text-xs">Layouts</TabsTrigger>
                            <TabsTrigger value="add" className="text-xs">Add</TabsTrigger>
                            <TabsTrigger value="props" className="text-xs">Edit</TabsTrigger>
                            <TabsTrigger value="layers" className="text-xs">Layers</TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
                        <TabsContent value="layouts" className="mt-0 h-full">
                            <LayoutsGrid />
                            <div className="mt-6">
                                <h4 className="font-bold text-sm mb-2">Quick Edit</h4>
                                <EasyModeForm />
                            </div>
                        </TabsContent>
                        <TabsContent value="add" className="mt-0 h-full">
                            <AddElementsGrid />
                        </TabsContent>
                        <TabsContent value="props" className="mt-0 h-full">
                            <div className="bg-white p-4 rounded-xl shadow-sm border">
                                <PropertiesForm />
                            </div>
                        </TabsContent>
                        <TabsContent value="layers" className="mt-0 h-full">
                            <div className="bg-white rounded-xl shadow-sm border h-full overflow-hidden">
                                <LayerManager />
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    );
};

export default ControlPanel;
