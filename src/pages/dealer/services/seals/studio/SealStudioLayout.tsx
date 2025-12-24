
import React, { useState } from 'react';
import { StudioProvider, useStudio } from './StudioContext';
import CanvasStage from './CanvasStage';
import ControlPanel from './ControlPanel';
import OrderSummaryModal from './OrderSummaryModal';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Undo, Redo, Check, ChevronLeft } from 'lucide-react';
import { SealTemplate, StampBlock } from '@/data/mockSealCatalog';

// TYPES
interface SealStudioProps {
    template: SealTemplate;
    initialBlocks?: StampBlock[];
    color?: string;
    onBack: () => void;
    onComplete: (data: { blocks: StampBlock[], previewImage?: string }) => void;
}

const StudioHeader: React.FC<{ onBack: () => void; onFinish: () => void }> = ({ onBack, onFinish }) => {
    const { undo, redo, canUndo, canRedo, template, isEasyMode, toggleEasyMode } = useStudio();

    return (
        <header className="h-14 bg-white border-b flex items-center justify-between px-4 z-40 relative shadow-sm">
            {/* LEFT: BACK & TITLE */}
            <div className="flex items-center gap-2 md:gap-4 flex-1">
                <Button variant="ghost" size="sm" onClick={onBack} className="text-slate-500 hover:text-slate-800 -ml-2">
                    <ChevronLeft className="h-4 w-4 md:mr-1" /> <span className="hidden md:inline">Back</span>
                </Button>
                <div className="h-4 w-px bg-slate-200 hidden md:block" />
                <h1 className="font-bold text-slate-800 text-sm md:text-base truncate max-w-[150px] md:max-w-none">
                    {template?.name || 'Untitled Design'}
                </h1>
            </div>

            {/* CENTER: MODE SWITCH */}
            <div className="flex items-center justify-center gap-1 flex-1">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border">
                    <Switch checked={isEasyMode} onCheckedChange={toggleEasyMode} id="mode-switch" className="scale-75" />
                    <Label htmlFor="mode-switch" className="text-xs font-bold text-slate-600 cursor-pointer min-w-[60px] select-none">
                        {isEasyMode ? 'Easy Mode' : 'Pro Mode'}
                    </Label>
                </div>
            </div>

            {/* RIGHT: ACTIONS */}
            <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end">
                <div className="flex bg-slate-50 rounded-lg p-0.5 border border-slate-100">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500" disabled={!canUndo} onClick={undo}>
                        <Undo className="h-4 w-4" />
                    </Button>
                    <div className="w-px bg-slate-200 my-1" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500" disabled={!canRedo} onClick={redo}>
                        <Redo className="h-4 w-4" />
                    </Button>
                </div>

                <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-100 h-9 px-4 text-xs md:text-sm"
                    onClick={onFinish}
                >
                    <span className="hidden md:inline">Finish Design</span>
                    <span className="md:hidden">Finish</span>
                    <Check className="ml-2 h-3 w-3 md:h-4 md:w-4" />
                </Button>
            </div>
        </header>
    );
};

const StudioShell: React.FC<{
    onBack: () => void;
    onSave: (blocks: StampBlock[]) => void;
    template: SealTemplate;
    color: string;
}> = ({ onBack, onSave, template, color }) => {
    const { blocks } = useStudio();
    const [isSummaryOpen, setSummaryOpen] = useState(false);

    return (
        <div className="fixed inset-0 z-50 bg-slate-100 flex flex-col h-[100dvh]">
            <StudioHeader onBack={onBack} onFinish={() => setSummaryOpen(true)} />

            <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

                {/* 1. CONTROL PANEL (Sidebar on Desktop, Bottom Sheet on Mobile) */}
                <div className="
                    order-2 md:order-1 
                    w-full md:w-80 
                    h-[55%] md:h-full 
                    flex-shrink-0 relative z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:shadow-xl border-t md:border-t-0 md:border-r
                ">
                    <ControlPanel />
                </div>

                {/* 2. CENTER STAGE (Canvas) */}
                <div className="
                    order-1 md:order-2 
                    flex-1 
                    h-[45%] md:h-full 
                    relative z-10
                ">
                    <CanvasStage />
                </div>
            </div>

            {/* MODALS */}
            <OrderSummaryModal
                isOpen={isSummaryOpen}
                onClose={() => setSummaryOpen(false)}
                onConfirm={() => onSave(blocks)}
                template={template}
                blocks={blocks}
                color={color}
            />
        </div>
    );
};

const SealStudioLayout: React.FC<SealStudioProps> = ({ template, initialBlocks, color = '#000000', onBack, onComplete }) => {
    return (
        <StudioProvider initialTemplate={template} initialBlocks={initialBlocks}>
            <StudioShell
                onBack={onBack}
                onSave={(blocks) => onComplete({ blocks })}
                template={template}
                color={color}
            />
        </StudioProvider>
    );
};

export default SealStudioLayout;
