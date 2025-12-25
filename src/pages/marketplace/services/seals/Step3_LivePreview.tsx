import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { SealTemplate, StampBlock } from '@/data/mockSealCatalog';

interface Step3PreviewProps {
    template: SealTemplate;
    blocks: StampBlock[];
    color: string;
    scale?: number;
}

// Helper for AutoFit (Synced with CanvasStage)
const getAutoFitSize = (text: string, baseSize: number, charLimit: number) => {
    if (!text || text.length === 0) return baseSize;
    if (text.length <= charLimit) return baseSize;
    // Scale down, but not below 6px
    return Math.max(6, baseSize * (charLimit / text.length));
};

const Step3_LivePreview: React.FC<Step3PreviewProps> = ({ template, blocks, color, scale = 1 }) => {
    // SVG CONFIG
    const size = 300;
    const center = size / 2;
    const radius = 110;
    const filterId = `preview-grunge-${template.id}`; // Unique ID

    // Auto-Fit Limits
    const CIRCULAR_LIMIT = 25;
    const RECT_LIMIT = 40;

    // RENDER LOGIC (Synced with CanvasStage)
    const renderedContent = useMemo(() => {
        if (template.renderType === 'circular' || template.renderType === 'oval') {
            // Mapped Mode
            const textBlocks = blocks.filter(b => b.type === 'TEXT');
            const topBlock = textBlocks[0];
            const centerBlock = textBlocks[1];
            const bottomBlock = textBlocks[2];

            const pathTopId = `preview-path-top-${template.id}`;
            const pathBottomId = `preview-path-bottom-${template.id}`;
            const dTop = `M ${center - radius},${center} A ${radius},${radius} 0 1,1 ${center + radius},${center}`;
            const dBottom = `M ${center + radius},${center} A ${radius},${radius} 0 0,1 ${center - radius},${center}`;

            return (
                <g>
                    <defs>
                        <path id={pathTopId} d={dTop} fill="none" />
                        <path id={pathBottomId} d={dBottom} fill="none" />
                    </defs>

                    {topBlock && (
                        <g>
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
                        <g>
                            <text
                                x={center} y={center}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={getAutoFitSize(centerBlock.content, centerBlock.fontSize, 15)}
                                fontWeight={centerBlock.bold ? "bold" : "normal"}
                                fill="currentColor"
                                letterSpacing={centerBlock.letterSpacing}
                            >
                                {centerBlock.content.toUpperCase()}
                            </text>
                        </g>
                    )}

                    {bottomBlock && (
                        <g>
                            <text
                                fontSize={getAutoFitSize(bottomBlock.content, bottomBlock.fontSize, CIRCULAR_LIMIT)}
                                fontWeight={bottomBlock.bold ? "bold" : "normal"}
                                fill="currentColor"
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
                        return (
                            <g
                                key={block.id}
                                transform={`translate(0, ${block.y})`}
                            >
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
                                        {!block.inverted && block.content.toUpperCase()}
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
    }, [template, blocks, center, radius]);

    return (
        <div className="relative animate-in zoom-in-95 duration-700">
            <div className={cn(
                "bg-white shadow-2xl relative overflow-hidden flex items-center justify-center ring-1 ring-slate-900/5 transition-all duration-500",
                template.renderType === 'circular' ? "rounded-full w-[300px] h-[300px]" :
                    template.renderType === 'oval' ? "rounded-[50%] w-[350px] h-[220px]" :
                        "rounded-md w-[350px] h-[150px]"
            )}>
                {/* Paper Texture */}
                <div className="absolute inset-0 opacity-20 bg-stone-100 mix-blend-multiply pointer-events-none" />

                <svg
                    viewBox={`0 0 ${size} ${size}`}
                    preserveAspectRatio={template.renderType === 'oval' ? "none" : "xMidYMid meet"}
                    className="w-full h-full z-10"
                    style={{
                        color: color,
                        filter: `url(#${filterId})`
                    }}
                >
                    <defs>
                        {/* TUNED FILTER: Less opacity for clearer text */}
                        <filter id={filterId}>
                            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
                            {/* Reduced offset to -4 (less noise density) */}
                            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 15 -4" in="noise" result="coloredNoise" />
                            <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite" />
                            <feComposite operator="atop" in="SourceGraphic" in2="composite" />
                        </filter>
                    </defs>

                    {/* Interactive Content */}
                    <g className="opacity-95 text-slate-900">
                        {renderedContent}
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default Step3_LivePreview;
