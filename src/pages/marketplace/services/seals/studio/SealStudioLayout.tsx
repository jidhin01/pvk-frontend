
import React, { useState } from 'react';
import { StudioProvider, useStudio } from './StudioContext';
import CanvasStage from './CanvasStage';
import ControlPanel from './ControlPanel';
import OrderReviewModal from './OrderReviewModal';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Undo, Redo, Check, ChevronLeft, ZoomIn, ZoomOut, Grid } from 'lucide-react';
import { SealTemplate, StampBlock } from '@/data/mockSealCatalog';
import { cn } from '@/lib/utils';

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
        <header className="h-14 flex-none bg-white dark:bg-slate-900 border-b dark:border-slate-800 flex items-center justify-between px-4 z-40 relative shadow-sm">
            {/* LEFT: BACK & TITLE */}
            <div className="flex items-center gap-2 md:gap-4 flex-1">
                <Button variant="ghost" size="sm" onClick={onBack} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 -ml-2">
                    <ChevronLeft className="h-4 w-4 md:mr-1" /> <span className="hidden md:inline">Back</span>
                </Button>
                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden md:block" />
                <h1 className="font-bold text-slate-800 dark:text-slate-200 text-sm md:text-base truncate max-w-[150px] md:max-w-none">
                    {template?.name || 'Untitled Design'}
                </h1>
            </div>

            {/* CENTER: MODE SWITCH */}
            <div className="flex items-center justify-center gap-1 flex-1">
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full border dark:border-slate-700">
                    <Switch checked={isEasyMode} onCheckedChange={toggleEasyMode} id="mode-switch" className="scale-75" />
                    <Label htmlFor="mode-switch" className="text-xs font-bold text-slate-600 dark:text-slate-300 cursor-pointer min-w-[60px] select-none">
                        {isEasyMode ? 'Easy Mode' : 'Pro Mode'}
                    </Label>
                </div>
            </div>

            {/* RIGHT: ACTIONS */}
            <div className="flex items-center gap-2 md:gap-3 flex-1 justify-end">
                <div className="flex bg-slate-50 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-100 dark:border-slate-700">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 dark:text-slate-400" disabled={!canUndo} onClick={undo}>
                        <Undo className="h-4 w-4" />
                    </Button>
                    <div className="w-px bg-slate-200 dark:bg-slate-700 my-1" />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 dark:text-slate-400" disabled={!canRedo} onClick={redo}>
                        <Redo className="h-4 w-4" />
                    </Button>
                </div>

                <Button
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-100 dark:shadow-none h-9 px-4 text-xs md:text-sm"
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
    const { blocks, zoom, setZoom, gridVisible, toggleGrid, selectBlock } = useStudio();

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] w-full bg-slate-50 dark:bg-slate-950 overflow-hidden">
            {/* 1. Header (Fixed Height) */}
            <StudioHeader onBack={onBack} onFinish={() => onSave(blocks)} />

            {/* 2. Main Workspace (Takes all remaining height) */}
            <div className="flex-1 flex overflow-hidden relative">

                {/* A. LEFT SIDEBAR: Tools (Fixed Width on Desktop) */}
                <aside className="
                    hidden md:flex flex-col 
                    w-[360px] lg:w-[400px] flex-none 
                    bg-white dark:bg-slate-900 border-r dark:border-slate-800
                    z-20 shadow-xl
                ">
                    <div className="flex-1 overflow-y-auto">
                        <ControlPanel />
                    </div>
                </aside>

                {/* B. CENTER STAGE: Canvas (Takes ALL remaining space) */}
                <main
                    className="
                        flex-1 
                        bg-slate-100 dark:bg-slate-950/50 
                        relative flex items-center justify-center 
                        overflow-hidden
                    "
                    onClick={() => selectBlock(null)}
                >
                    {/* The Dot Grid Pattern Background */}
                    <div
                        className="absolute inset-0 opacity-[0.2] dark:opacity-[0.1] pointer-events-none bg-[radial-gradient(#64748b_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"
                    />

                    {/* The Actual Stamp Paper */}
                    <CanvasStage />

                    {/* Floating Zoom Controls (Bottom Right of Canvas Area) */}
                    <div className="absolute bottom-6 right-6 flex items-center gap-2 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1.5 rounded-full border dark:border-slate-800 shadow-lg">
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full dark:text-slate-200 dark:hover:bg-slate-800" onClick={(e) => { e.stopPropagation(); setZoom(z => Math.max(z - 0.1, 0.5)); }}>
                            <ZoomOut className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                        </Button>
                        <div className="text-xs font-mono font-bold w-12 text-center text-slate-600 dark:text-slate-300">{Math.round(zoom * 100)}%</div>
                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full dark:text-slate-200 dark:hover:bg-slate-800" onClick={(e) => { e.stopPropagation(); setZoom(z => Math.min(z + 0.1, 2)); }}>
                            <ZoomIn className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                        </Button>
                        <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
                        <Button size="icon" variant={gridVisible ? "secondary" : "ghost"} className={cn("h-8 w-8 rounded-full", gridVisible ? "dark:bg-slate-700" : "dark:hover:bg-slate-800")} onClick={(e) => { e.stopPropagation(); toggleGrid(); }}>
                            <Grid className="h-4 w-4 text-slate-600 dark:text-slate-300" />
                        </Button>
                    </div>
                </main>
            </div>

            {/* C. MOBILE LAYOUT (< md) - Bottom Sheet */}
            <div className="md:hidden h-[50vh] bg-white dark:bg-slate-900 border-t dark:border-slate-800 flex flex-col z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
                <ControlPanel />
            </div>
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
