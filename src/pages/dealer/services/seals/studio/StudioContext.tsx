
import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { StampBlock, SealTemplate } from '@/data/mockSealCatalog';

// TYPES
interface StudioState {
    template: SealTemplate | null;
    blocks: StampBlock[];
    selectedBlockId: string | null;
    zoom: number;
    gridVisible: boolean;
    isEasyMode: boolean; // NEW
    canUndo: boolean;
    canRedo: boolean;
}

interface StudioActions {
    setTemplate: (template: SealTemplate) => void;
    setBlocks: (blocks: StampBlock[] | ((prev: StampBlock[]) => StampBlock[])) => void;
    selectBlock: (id: string | null) => void;
    setZoom: (zoom: number | ((prev: number) => number)) => void;
    toggleGrid: () => void;
    toggleEasyMode: () => void; // NEW
    applyLayout: (presetBlocks: StampBlock[]) => void; // NEW
    addBlock: (type: StampBlock['type']) => void;
    updateBlock: (id: string, updates: Partial<StampBlock>) => void;
    removeBlock: (id: string) => void;
    reorderBlock: (fromIndex: number, toIndex: number) => void;
    undo: () => void;
    redo: () => void;
}

const StudioContext = createContext<(StudioState & StudioActions) | null>(null);

export const useStudio = () => {
    const context = useContext(StudioContext);
    if (!context) throw new Error("useStudio must be used within a StudioProvider");
    return context;
};

interface ProviderProps {
    children: ReactNode;
    initialBlocks?: StampBlock[];
    initialTemplate?: SealTemplate | null;
}

export const StudioProvider: React.FC<ProviderProps> = ({ children, initialBlocks = [], initialTemplate = null }) => {
    // STATE
    const [template, setTemplateState] = useState<SealTemplate | null>(initialTemplate);
    const [blocks, setBlocksState] = useState<StampBlock[]>(initialBlocks);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [zoom, setZoom] = useState(1);
    const [gridVisible, setGridVisible] = useState(false);
    const [isEasyMode, setIsEasyMode] = useState(true); // Default to Easy

    // HISTORY
    const [history, setHistory] = useState<StampBlock[][]>([initialBlocks]);
    const [historyIndex, setHistoryIndex] = useState(0);

    // --- WRAPPERS FOR HISTORY ---
    const commitToHistory = (newBlocks: StampBlock[]) => {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newBlocks);
        if (newHistory.length > 50) newHistory.shift();

        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        setBlocksState(newBlocks);
    };

    const undo = useCallback(() => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setBlocksState(history[newIndex]);
        }
    }, [history, historyIndex]);

    const redo = useCallback(() => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setBlocksState(history[newIndex]);
        }
    }, [history, historyIndex]);

    // --- ACTIONS ---
    const setBlocks = useCallback((val: StampBlock[] | ((prev: StampBlock[]) => StampBlock[])) => {
        const newBlocks = typeof val === 'function' ? val(blocks) : val;
        commitToHistory(newBlocks);
    }, [blocks, history, historyIndex]);

    const updateBlock = useCallback((id: string, updates: Partial<StampBlock>) => {
        const newBlocks = blocks.map(b => b.id === id ? { ...b, ...updates } as StampBlock : b);
        commitToHistory(newBlocks);
    }, [blocks]);

    const addBlock = useCallback((type: StampBlock['type']) => {
        const newBlock = {
            id: Math.random().toString(36).substr(2, 9),
            type,
            ...(type === 'TEXT' ? { content: 'New Text', align: 'center', bold: true, fontSize: 16 } : {}),
            ...(type === 'GAP' ? { height: 20 } : {}),
            ...(type === 'LINE' ? { style: 'solid' } : {}),
            ...(type === 'PLACEHOLDER' ? { label: 'Box', width: '100px' } : {})
        } as StampBlock;

        commitToHistory([...blocks, newBlock]);
        setSelectedBlockId(newBlock.id);
    }, [blocks]);

    const applyLayout = useCallback((presetBlocks: StampBlock[]) => {
        // Generate new IDs to ensure distinctness if applied multiple times
        const newBlocks = presetBlocks.map(b => ({ ...b, id: Math.random().toString(36).substr(2, 9) } as StampBlock));
        commitToHistory(newBlocks);
        setSelectedBlockId(null);
    }, [blocks]); // Dependencies

    const removeBlock = useCallback((id: string) => {
        commitToHistory(blocks.filter(b => b.id !== id));
        if (selectedBlockId === id) setSelectedBlockId(null);
    }, [blocks, selectedBlockId]);

    const reorderBlock = useCallback((fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= blocks.length) return;
        const newBlocks = [...blocks];
        const [moved] = newBlocks.splice(fromIndex, 1);
        newBlocks.splice(toIndex, 0, moved);
        commitToHistory(newBlocks);
    }, [blocks]);

    return (
        <StudioContext.Provider value={{
            template, setTemplate: setTemplateState,
            blocks, setBlocks,
            selectedBlockId, selectBlock: setSelectedBlockId,
            zoom, setZoom,
            gridVisible, toggleGrid: () => setGridVisible(v => !v),
            isEasyMode, toggleEasyMode: () => setIsEasyMode(v => !v),
            applyLayout,
            undo, redo, canUndo: historyIndex > 0, canRedo: historyIndex < history.length - 1,
            addBlock, updateBlock, removeBlock, reorderBlock
        }}>
            {children}
        </StudioContext.Provider>
    );
};
