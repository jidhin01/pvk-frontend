
import { useReducer, useCallback, useEffect } from 'react';
import { SealTemplate, StampBlock, PRESET_LAYOUTS } from '@/data/mockSealCatalog';

// --- TYPES ---

export interface SealState {
    template: SealTemplate | null;
    blocks: StampBlock[];
    selectedId: string | null;
    zoom: number;
    gridVisible: boolean;
    isEasyMode: boolean;
    history: {
        past: StampBlock[][];
        future: StampBlock[][];
    };
}

export type SealAction =
    | { type: 'SET_TEMPLATE'; payload: SealTemplate }
    | { type: 'SET_BLOCKS'; payload: StampBlock[] }
    | { type: 'ADD_BLOCK'; payload: { type: StampBlock['type']; label?: string } }
    | { type: 'UPDATE_BLOCK'; payload: { id: string; updates: Partial<StampBlock> } }
    | { type: 'REMOVE_BLOCK'; payload: string }
    | { type: 'REORDER_BLOCKS'; payload: { fromIndex: number; toIndex: number } }
    | { type: 'APPLY_LAYOUT'; payload: StampBlock[] }
    | { type: 'SELECT_BLOCK'; payload: string | null }
    | { type: 'SET_ZOOM'; payload: number | ((prev: number) => number) }
    | { type: 'TOGGLE_GRID' }
    | { type: 'TOGGLE_EASY_MODE' }
    | { type: 'UNDO' }
    | { type: 'REDO' };

// --- REDUCER ---

const MAX_HISTORY = 20;

const initialHistory = { past: [], future: [] };

const reducer = (state: SealState, action: SealAction): SealState => {
    switch (action.type) {
        case 'SET_TEMPLATE':
            return { ...state, template: action.payload };

        case 'SET_BLOCKS':
            return {
                ...state,
                blocks: action.payload,
                history: {
                    past: [...state.history.past, state.blocks].slice(-MAX_HISTORY),
                    future: []
                }
            };

        case 'ADD_BLOCK': {
            const newBlock: StampBlock = {
                id: Math.random().toString(36).substr(2, 9),
                type: action.payload.type,
                label: action.payload.label,
                ...(action.payload.type === 'TEXT' ? { content: 'New Text', align: 'center', bold: true, fontSize: 16, fontFamily: 'serif' } : {}),
                ...(action.payload.type === 'GAP' ? { height: 20 } : {}),
                ...(action.payload.type === 'LINE' ? { style: 'solid' } : {}),
                ...(action.payload.type === 'PLACEHOLDER' ? { label: 'Box', width: '100px' } : {})
            } as StampBlock;

            // Smart Positioning Logic (Basic)
            // If we wanted to check overlap, we'd need render metrics. 
            // Here we just append. For 'Smart Layouts', APPLY_LAYOUT is used.

            return {
                ...state,
                blocks: [...state.blocks, newBlock],
                selectedId: newBlock.id, // Auto-select new block
                history: {
                    past: [...state.history.past, state.blocks].slice(-MAX_HISTORY),
                    future: []
                }
            };
        }

        case 'UPDATE_BLOCK': {
            const newBlocks = state.blocks.map(b =>
                b.id === action.payload.id ? { ...b, ...action.payload.updates } as StampBlock : b
            );
            return {
                ...state,
                blocks: newBlocks,
                history: {
                    past: [...state.history.past, state.blocks].slice(-MAX_HISTORY),
                    future: []
                }
            };
        }

        case 'REMOVE_BLOCK': {
            const newBlocks = state.blocks.filter(b => b.id !== action.payload);
            return {
                ...state,
                blocks: newBlocks,
                selectedId: state.selectedId === action.payload ? null : state.selectedId,
                history: {
                    past: [...state.history.past, state.blocks].slice(-MAX_HISTORY),
                    future: []
                }
            };
        }

        case 'REORDER_BLOCKS': {
            if (action.payload.toIndex < 0 || action.payload.toIndex >= state.blocks.length) return state;
            const newBlocks = [...state.blocks];
            const [moved] = newBlocks.splice(action.payload.fromIndex, 1);
            newBlocks.splice(action.payload.toIndex, 0, moved);

            return {
                ...state,
                blocks: newBlocks,
                history: {
                    past: [...state.history.past, state.blocks].slice(-MAX_HISTORY),
                    future: []
                }
            };
        }

        case 'APPLY_LAYOUT': {
            // Generate new IDs
            const newBlocks = action.payload.map(b => ({ ...b, id: Math.random().toString(36).substr(2, 9) } as StampBlock));
            return {
                ...state,
                blocks: newBlocks,
                selectedId: null,
                history: {
                    past: [...state.history.past, state.blocks].slice(-MAX_HISTORY),
                    future: []
                }
            };
        }

        case 'SELECT_BLOCK':
            return { ...state, selectedId: action.payload };

        case 'SET_ZOOM':
            const newZoom = typeof action.payload === 'function' ? action.payload(state.zoom) : action.payload;
            return { ...state, zoom: newZoom };

        case 'TOGGLE_GRID':
            return { ...state, gridVisible: !state.gridVisible };

        case 'TOGGLE_EASY_MODE':
            return { ...state, isEasyMode: !state.isEasyMode, selectedId: null };

        case 'UNDO': {
            if (state.history.past.length === 0) return state;
            const previous = state.history.past[state.history.past.length - 1];
            const newPast = state.history.past.slice(0, -1);
            return {
                ...state,
                blocks: previous,
                history: {
                    past: newPast,
                    future: [state.blocks, ...state.history.future]
                }
            };
        }

        case 'REDO': {
            if (state.history.future.length === 0) return state;
            const next = state.history.future[0];
            const newFuture = state.history.future.slice(1);
            return {
                ...state,
                blocks: next,
                history: {
                    past: [...state.history.past, state.blocks],
                    future: newFuture
                }
            };
        }

        default:
            return state;
    }
};

// --- HOOK ---

export const useSealStudio = (initialTemplate: SealTemplate | null, initialBlocks: StampBlock[]) => {
    const [state, dispatch] = useReducer(reducer, {
        template: initialTemplate,
        blocks: initialBlocks,
        selectedId: null,
        zoom: 1,
        gridVisible: false,
        isEasyMode: true,
        history: { past: [], future: [] }
    });

    // Helper Actions
    const setTemplate = useCallback((template: SealTemplate) => dispatch({ type: 'SET_TEMPLATE', payload: template }), []);
    const addBlock = useCallback((type: StampBlock['type'], label?: string) => dispatch({ type: 'ADD_BLOCK', payload: { type, label } }), []);
    const updateBlock = useCallback((id: string, updates: Partial<StampBlock>) => dispatch({ type: 'UPDATE_BLOCK', payload: { id, updates } }), []);
    const removeBlock = useCallback((id: string) => dispatch({ type: 'REMOVE_BLOCK', payload: id }), []);
    const reorderBlock = useCallback((fromIndex: number, toIndex: number) => dispatch({ type: 'REORDER_BLOCKS', payload: { fromIndex, toIndex } }), []);
    const applyLayout = useCallback((blocks: StampBlock[]) => dispatch({ type: 'APPLY_LAYOUT', payload: blocks }), []);
    const selectBlock = useCallback((id: string | null) => dispatch({ type: 'SELECT_BLOCK', payload: id }), []);
    const setZoom = useCallback((zoom: number | ((prev: number) => number)) => dispatch({ type: 'SET_ZOOM', payload: zoom }), []);
    const toggleGrid = useCallback(() => dispatch({ type: 'TOGGLE_GRID' }), []);
    const toggleEasyMode = useCallback(() => dispatch({ type: 'TOGGLE_EASY_MODE' }), []);
    const undo = useCallback(() => dispatch({ type: 'UNDO' }), []);
    const redo = useCallback(() => dispatch({ type: 'REDO' }), []);
    const setBlocks = useCallback((blocks: StampBlock[]) => dispatch({ type: 'SET_BLOCKS', payload: blocks }), []);

    // Derived State
    const canUndo = state.history.past.length > 0;
    const canRedo = state.history.future.length > 0;

    return {
        state,
        actions: {
            setTemplate,
            addBlock,
            updateBlock,
            removeBlock,
            reorderBlock,
            applyLayout,
            selectBlock,
            setZoom,
            toggleGrid,
            toggleEasyMode,
            undo,
            redo,
            setBlocks
        },
        canUndo,
        canRedo
    };
};
