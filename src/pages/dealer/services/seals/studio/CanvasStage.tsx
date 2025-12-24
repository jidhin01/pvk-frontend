
import React, { useMemo } from 'react';
import { useStudio } from './StudioContext';
import { cn } from '@/lib/utils';

// Helper for AutoFit
const getAutoFitSize = (text: string, baseSize: number, charLimit: number) => {
    if (!text || text.length === 0) return baseSize;
    if (text.length <= charLimit) return baseSize;
    // Scale down, but not below 6px
    return Math.max(6, baseSize * (charLimit / text.length));
};

const CanvasStage: React.FC = () => {
    const { template, blocks, selectedBlockId, selectBlock, zoom, gridVisible, isEasyMode } = useStudio();

    if (!template) return <div className="flex h-full items-center justify-center text-slate-400">No Template</div>;

    // SVG CONFIG
    const size = 300; // ViewBox size
    const center = size / 2;
    const radius = 110;
    const filterId = "studio-grunge";

    // Auto-Fit Limits
    const CIRCULAR_LIMIT = 25; // chars
    const RECT_LIMIT = 40; // chars

    // RENDER LOGIC
    const renderedContent = useMemo(() => {
        if (template.renderType === 'circular') {
            // Mapped Mode
            const textBlocks = blocks.filter(b => b.type === 'TEXT');
            const topBlock = textBlocks[0];
            const centerBlock = textBlocks[1];
            const bottomBlock = textBlocks[2];

            const pathTopId = `path-top`;
            const pathBottomId = `path-bottom`;
            const dTop = `M ${center - radius},${center} A ${radius},${radius} 0 1,1 ${center + radius},${center}`;
            const dBottom = `M ${center + radius},${center} A ${radius},${radius} 0 0,1 ${center - radius},${center}`;

            return (
                <g>
                    <defs>
                        <path id={pathTopId} d={dTop} fill="none" />
                        <path id={pathBottomId} d={dBottom} fill="none" />
                    </defs>

                    {topBlock && (
                        <g
                            onClick={(e) => { e.stopPropagation(); selectBlock(topBlock.id); }}
                            className={cn("cursor-pointer hover:opacity-80 transition-opacity", selectedBlockId === topBlock.id && "text-blue-600")}
                            style={{ color: selectedBlockId === topBlock.id ? '#2563eb' : 'currentColor' }}
                        >
                            <text
                                fontSize={getAutoFitSize(topBlock.content, topBlock.fontSize, CIRCULAR_LIMIT)}
                                fontWeight={topBlock.bold ? "bold" : "normal"}
                                fill="currentColor"
                                letterSpacing={topBlock.letterSpacing}
                            >
                                <textPath href={`#${pathTopId}`} startOffset="50%" textAnchor="middle">
                                    {topBlock.content.toUpperCase()}
                                </textPath>
                            </text>
                        </g>
                    )}

                    {centerBlock && (
                        <g
                            onClick={(e) => { e.stopPropagation(); selectBlock(centerBlock.id); }}
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            <text
                                x={center} y={center}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={getAutoFitSize(centerBlock.content, centerBlock.fontSize, 15)}
                                fontWeight={centerBlock.bold ? "bold" : "normal"}
                                fill={selectedBlockId === centerBlock.id ? "#2563eb" : "currentColor"}
                                letterSpacing={centerBlock.letterSpacing}
                            >
                                {centerBlock.content.toUpperCase()}
                            </text>
                        </g>
                    )}

                    {bottomBlock && (
                        <g
                            onClick={(e) => { e.stopPropagation(); selectBlock(bottomBlock.id); }}
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            <text
                                fontSize={getAutoFitSize(bottomBlock.content, bottomBlock.fontSize, CIRCULAR_LIMIT)}
                                fontWeight={bottomBlock.bold ? "bold" : "normal"}
                                fill={selectedBlockId === bottomBlock.id ? "#2563eb" : "currentColor"}
                                letterSpacing={bottomBlock.letterSpacing}
                            >
                                <textPath href={`#${pathBottomId}`} startOffset="50%" textAnchor="middle">
                                    {bottomBlock.content.toUpperCase()}
                                </textPath>
                            </text>
                        </g>
                    )}
                </g>
            );

        } else {
            // Rectangular Stack Mode
            let totalHeight = 0;
            const computedBlocks = blocks.map(block => {
                let h = 0;
                if (block.type === 'TEXT') h = (block.fontSize || 14) * 1.2 + (block.yOffset || 0);
                else if (block.type === 'GAP') h = block.height;
                else if (block.type === 'LINE') h = 10 + (block.yOffset || 0);
                else if (block.type === 'PLACEHOLDER') h = 30 + (block.yOffset || 0);
                else h = 30;

                const y = totalHeight;
                totalHeight += h;
                return { ...block, y, h };
            });

            const startY = center - (totalHeight / 2) + 12;

            return (
                <g transform={`translate(${center}, ${startY})`}>
                    {computedBlocks.map(block => {
                        const isSelected = selectedBlockId === block.id;
                        return (
                            <g
                                key={block.id}
                                transform={`translate(0, ${block.y})`}
                                onClick={(e) => { e.stopPropagation(); selectBlock(block.id); }}
                                className="cursor-pointer"
                            >
                                {isSelected && !isEasyMode && (
                                    <rect
                                        x="-135"
                                        y="0"
                                        width="270"
                                        height={block.h}
                                        fill="none"
                                        stroke="#3b82f6"
                                        strokeWidth="1"
                                        strokeDasharray="4 2"
                                        className="animate-pulse"
                                    />
                                )}

                                {block.type === 'TEXT' && (
                                    <text
                                        x="0"
                                        y={block.h / 2}
                                        textAnchor={block.align === 'left' ? "start" : block.align === 'right' ? "end" : "middle"}
                                        dx={block.align === 'left' ? -120 : block.align === 'right' ? 120 : 0}
                                        dominantBaseline="middle"
                                        fontSize={getAutoFitSize(block.content, block.fontSize, RECT_LIMIT)}
                                        fontWeight={block.bold ? "bold" : "normal"}
                                        fill={block.inverted ? "white" : "currentColor"}
                                        letterSpacing={block.letterSpacing}
                                        fontFamily={block.fontFamily || "serif"}
                                    >
                                        {block.inverted && <tspan fill="black" stroke="black" strokeWidth="4" strokeLinejoin="round">{block.content.toUpperCase()}</tspan>}
                                        {block.content.toUpperCase()}
                                    </text>
                                )}

                                {block.type === 'LINE' && (
                                    <line
                                        x1="-120" y1={block.h / 2} x2="120" y2={block.h / 2}
                                        stroke="currentColor" strokeWidth="2"
                                        strokeDasharray={block.style === 'dashed' ? "5,5" : "none"}
                                    />
                                )}

                                {block.type === 'PLACEHOLDER' && (
                                    <g transform={`translate(-100, ${block.h / 2 - 10})`}>
                                        <text fontSize="10" fill="currentColor" fontWeight="bold">{block.label}</text>
                                        <rect x="35" y="-8" width={Number(block.width) || 100} height="16" fill="none" stroke="currentColor" strokeWidth="1" />
                                    </g>
                                )}
                            </g>
                        );
                    })}
                </g>
            );
        }
    }, [template, blocks, selectedBlockId, center, radius, isEasyMode]);


    // Simplified Return: Just the Scalable Stage Object
    return (
        <div
            className="relative transition-transform duration-200 ease-out origin-center"
            style={{ transform: `scale(${zoom})` }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className={cn(
                    "bg-white shadow-2xl relative overflow-hidden flex items-center justify-center ring-1 ring-slate-900/5 transition-all duration-500", // Force BG White
                    template.renderType === 'circular' ? "rounded-full w-[300px] h-[300px]" :
                        template.renderType === 'oval' ? "rounded-[50%] w-[350px] h-[220px]" :
                            "rounded-md w-[350px] h-[150px]"
                )}
            >
                {/* Safety Zone */}
                <div className="absolute inset-2 border border-dashed border-red-300 rounded-[inherit] pointer-events-none z-20 opacity-40 mix-blend-multiply" />

                {/* Paper Texture */}
                <div className="absolute inset-0 opacity-20 bg-stone-100 mix-blend-multiply pointer-events-none" />

                <svg
                    viewBox={`0 0 ${size} ${size}`}
                    className="w-full h-full z-10"
                    style={{ filter: `url(#${filterId})` }}
                >
                    <defs>
                        <filter id={filterId}>
                            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
                            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -7" in="noise" result="coloredNoise" />
                            <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite" />
                            <feComposite operator="atop" in="SourceGraphic" in2="composite" />
                        </filter>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="cyan" strokeWidth="1" opacity="0.3" />
                        </pattern>
                    </defs>

                    {/* Grid Layer */}
                    {gridVisible && (
                        <rect x="0" y="0" width="100%" height="100%" fill="url(#grid)" className="pointer-events-none" />
                    )}

                    {/* Interactive Content */}
                    <g className="opacity-95 text-slate-900">
                        {renderedContent}
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default CanvasStage;
