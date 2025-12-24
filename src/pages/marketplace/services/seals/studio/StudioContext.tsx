
import React, { createContext, useContext, ReactNode } from 'react';
import { StampBlock, SealTemplate } from '@/data/mockSealCatalog';
import { useSealStudio, SealState } from './useSealStudio';

// TYPES (Aligning with useSealStudio, but exposing flattened structure)
interface StudioContextType extends Omit<SealState, 'selectedId' | 'history'> {
    selectedBlockId: string | null;
    canUndo: boolean;
    canRedo: boolean;

    // Actions
    setTemplate: (template: SealTemplate) => void;
    setBlocks: (blocks: StampBlock[]) => void;
    selectBlock: (id: string | null) => void;
    setZoom: (zoom: number | ((prev: number) => number)) => void;
    toggleGrid: () => void;
    toggleEasyMode: () => void;
    applyLayout: (presetBlocks: StampBlock[]) => void;
    addBlock: (type: StampBlock['type'], label?: string) => void;
    updateBlock: (id: string, updates: Partial<StampBlock>) => void;
    removeBlock: (id: string) => void;
    reorderBlock: (fromIndex: number, toIndex: number) => void;
    undo: () => void;
    redo: () => void;
}

const StudioContext = createContext<StudioContextType | null>(null);

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
    // Check-list:
    // [x] Header Undo/Redo
    // [x] Sidebar "Add Text" Button
    // [x] Sidebar "Delete Layer" Icon
    // [x] Property Inputs

    const { state, actions, canUndo, canRedo } = useSealStudio(initialTemplate, initialBlocks);

    return (
        <StudioContext.Provider value={{
            template: state.template,
            blocks: state.blocks,
            selectedBlockId: state.selectedId,
            zoom: state.zoom,
            gridVisible: state.gridVisible,
            isEasyMode: state.isEasyMode,
            canUndo,
            canRedo,
            ...actions
        }}>
            {children}
        </StudioContext.Provider>
    );
};
