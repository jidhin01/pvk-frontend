
import { Box, Stamp, MousePointer2 } from 'lucide-react';

export interface SealType {
    id: string;
    name: string;
    description: string;
    icon: any;
    category: 'PREMIUM' | 'BUDGET' | 'PORTABLE';
    basePrice: number;
}

export interface SealTemplate {
    id: string;
    shape: 'RECTANGLE' | 'ROUND' | 'OVAL';
    name: string;
    dimensions: string;
    maxLines: number;
    recommendedFor: string;
    priceModifier: number;
    renderType: 'circular' | 'rectangular' | 'oval';
    defaultFontSize: number;
    characterLimit: number;
    previewScale: number;
    layout?: {
        curveRadius?: number;
    };
}

export type StampBlock =
    | {
        id: string;
        type: 'TEXT';
        content: string;
        align: 'center' | 'left' | 'right';
        bold: boolean;
        fontSize: number;
        fontFamily?: string;
        letterSpacing?: number;
        yOffset?: number;
        inverted?: boolean;
        label?: string; // For Easy Mode mapping (e.g., "Company Name")
    }
    | { id: string; type: 'GAP'; height: number }
    | { id: string; type: 'LINE'; style: 'solid' | 'dashed'; yOffset?: number }
    | { id: string; type: 'PLACEHOLDER'; label: string; width: string; yOffset?: number }
    | { id: string; type: 'DATER_HOLE'; yOffset?: number };

export const STAMP_FONTS = [
    { id: 'serif', name: 'Official Serif', family: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' },
    { id: 'sans', name: 'Modern Sans', family: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
    { id: 'mono', name: 'Typewriter', family: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace' }
];

export const PRESET_LAYOUTS = [
    {
        id: 'round-standard',
        name: 'Standard Round',
        type: 'ROUND',
        blocks: [
            { id: 'top', type: 'TEXT', content: 'YOUR COMPANY NAME', fontSize: 24, bold: true, label: 'Company Name (Top)' },
            { id: 'center', type: 'TEXT', content: 'DIRECTOR', fontSize: 20, bold: true, align: 'center', label: 'Designation (Center)' },
            { id: 'bottom', type: 'TEXT', content: 'LOCATION / CITY', fontSize: 18, bold: false, label: 'Location (Bottom)' }
        ] as StampBlock[]
    },
    {
        id: 'round-bank',
        name: 'Bank / Date',
        type: 'ROUND',
        blocks: [
            { id: 'top', type: 'TEXT', content: 'STATE BANK OF INDIA', fontSize: 22, bold: true, label: 'Bank Name' },
            { id: 'date', type: 'DATER_HOLE', label: 'Date' },
            { id: 'bottom', type: 'TEXT', content: 'BRANCH MANAGER', fontSize: 16, bold: true, label: 'Designation' }
        ] as StampBlock[]
    },
    {
        id: 'rect-sign',
        name: 'Signature Style',
        type: 'RECTANGLE',
        blocks: [
            { id: 'l1', type: 'TEXT', content: 'For, YOUR COMPANY NAME', fontSize: 14, align: 'left', label: 'Pre-Text' },
            { id: 'gap1', type: 'GAP', height: 40 },
            { id: 'l2', type: 'TEXT', content: 'Authorized Signatory', fontSize: 14, align: 'right', bold: true, label: 'Sign Title' }
        ] as StampBlock[]
    }
];


export const INK_COLORS = [
    { name: 'Classic Blue', hex: '#1e3a8a', tailwind: 'text-blue-900', ring: 'ring-blue-900' },
    { name: 'Office Black', hex: '#0f172a', tailwind: 'text-slate-900', ring: 'ring-slate-900' },
    { name: 'Urgent Red', hex: '#b91c1c', tailwind: 'text-red-700', ring: 'ring-red-700' },
    { name: 'Legal Violet', hex: '#6d28d9', tailwind: 'text-violet-700', ring: 'ring-violet-700' },
    { name: 'Green', hex: '#15803d', tailwind: 'text-green-700', ring: 'ring-green-700' }
];

export const SEAL_TYPES: SealType[] = [
    {
        id: 'self-ink',
        name: 'Self-Inking Stamp',
        description: 'Built-in ink pad. Good for 10,000+ impressions. Automatic re-inking mechanism.',
        icon: Stamp,
        category: 'PREMIUM',
        basePrice: 250
    },
    {
        id: 'wooden',
        name: 'Traditional Wooden',
        description: 'Classic wood handle. Requires separate ink pad. Economical choice.',
        icon: Box,
        category: 'BUDGET',
        basePrice: 150
    },
    {
        id: 'pocket',
        name: 'Pocket / Mouse Stamp',
        description: 'Compact, portable design. Folds flat. Ideal for mobile professionals.',
        icon: MousePointer2,
        category: 'PORTABLE',
        basePrice: 300
    }
];

export const SEAL_TEMPLATES: SealTemplate[] = [
    {
        id: 'rect-small',
        shape: 'RECTANGLE',
        name: 'Address Stamp (Small)',
        dimensions: '38mm x 14mm',
        maxLines: 3,
        recommendedFor: 'Name & Designation',
        priceModifier: 0,
        renderType: 'rectangular',
        defaultFontSize: 12,
        characterLimit: 25,
        previewScale: 1
    },
    {
        id: 'rect-medium',
        shape: 'RECTANGLE',
        name: 'Address Stamp (Medium)',
        dimensions: '47mm x 18mm',
        maxLines: 4,
        recommendedFor: 'Name, Designation & Phone',
        priceModifier: 50,
        renderType: 'rectangular',
        defaultFontSize: 14,
        characterLimit: 30,
        previewScale: 1.1
    },
    {
        id: 'rect-large',
        shape: 'RECTANGLE',
        name: 'Address Stamp (Large)',
        dimensions: '58mm x 22mm',
        maxLines: 5,
        recommendedFor: 'Full Address & GST No.',
        priceModifier: 100,
        renderType: 'rectangular',
        defaultFontSize: 16,
        characterLimit: 40,
        previewScale: 1.2
    },
    {
        id: 'round-small',
        shape: 'ROUND',
        name: 'Round Seal (Small)',
        dimensions: '25mm Diameter',
        maxLines: 3,
        recommendedFor: 'Logos or Initials',
        priceModifier: 50,
        renderType: 'circular',
        defaultFontSize: 10,
        characterLimit: 20,
        previewScale: 1,
        layout: { curveRadius: 40 }
    },
    {
        id: 'round-director',
        shape: 'ROUND',
        name: 'Director Seal',
        dimensions: '30mm Diameter',
        maxLines: 3,
        recommendedFor: 'Company/Official Seals',
        priceModifier: 100,
        renderType: 'circular',
        defaultFontSize: 12,
        characterLimit: 35,
        previewScale: 1.2,
        layout: { curveRadius: 45 }
    },
    {
        id: 'oval-library',
        shape: 'OVAL',
        name: 'Library Seal',
        dimensions: '45mm x 30mm',
        maxLines: 4,
        recommendedFor: 'Library Books / Institutions',
        priceModifier: 80,
        renderType: 'oval',
        defaultFontSize: 12,
        characterLimit: 30,
        previewScale: 1
    }
];
