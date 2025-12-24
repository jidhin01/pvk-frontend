
import React from 'react';
import { cn } from '@/lib/utils';
import { SealTemplate, StampBlock } from '@/data/mockSealCatalog';

interface Step3PreviewProps {
    template: SealTemplate;
    blocks: StampBlock[];
    color: string;
    scale?: number;
}

const LiveStampPreview: React.FC<Step3PreviewProps> = ({ template, blocks, color, scale = 1 }) => {
    const { renderType } = template;

    // SVG CONFIG
    const size = 300;
    const center = size / 2;
    const radius = 110;

    // FILTER DEFINITIONS
    const filterId = "stamp-grunge";

    // -------------------------------------------------------------------------
    // RENDER LOGIC: RECTANGULAR (STACK)
    // -------------------------------------------------------------------------
    const renderRectangularStack = () => {
        // 1. Calculate Total Height to Center vertically
        let totalHeight = 0;
        const renderedBlocks = blocks.map(block => {
            let blockHeight = 0;
            if (block.type === 'TEXT') blockHeight = (block.fontSize || 14) * 1.2;
            else if (block.type === 'GAP') blockHeight = block.height;
            else if (block.type === 'LINE') blockHeight = 10;
            else if (block.type === 'PLACEHOLDER') blockHeight = 25;
            else if (block.type === 'DATER_HOLE') blockHeight = 40;

            const yPos = totalHeight;
            totalHeight += blockHeight;
            return { ...block, yPos, height: blockHeight };
        });

        // Start Y (Centered)
        const startY = center - (totalHeight / 2) + 10; // +10 for baseline adjustment approx

        return (
            <g transform={`translate(${center}, ${startY})`}>
                {renderedBlocks.map((block) => (
                    <g key={block.id} transform={`translate(0, ${block.yPos})`}>
                        {block.type === 'TEXT' && (
                            <text
                                x="0"
                                y={block.height / 2}
                                textAnchor={block.align === 'left' ? "start" : block.align === 'right' ? "end" : "middle"}
                                // If align left/right, need bounds. Assuming width=200 for safe area.
                                dx={block.align === 'left' ? -100 : block.align === 'right' ? 100 : 0}
                                dominantBaseline="middle"
                                fontSize={block.fontSize}
                                fontWeight={block.bold ? "bold" : "normal"}
                                fill="currentColor"
                                fontFamily="serif"
                            >
                                {block.content.toUpperCase()}
                            </text>
                        )}

                        {block.type === 'LINE' && (
                            <line
                                x1="-120" y1={block.height / 2}
                                x2="120" y2={block.height / 2}
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeDasharray={block.style === 'dashed' ? "5,5" : "none"}
                            />
                        )}

                        {block.type === 'PLACEHOLDER' && (
                            <g transform={`translate(-100, ${block.height / 2 - 10})`}>
                                <text fontSize="10" fill="currentColor" fontWeight="bold">{block.label}</text>
                                <rect x="35" y="-8" width="165" height="16" fill="none" stroke="currentColor" strokeWidth="1" />
                            </g>
                        )}

                        {block.type === 'DATER_HOLE' && (
                            <g transform={`translate(-40, ${block.height / 2 - 15})`}>
                                <rect x="0" y="0" width="80" height="30" fill="none" stroke="currentColor" strokeWidth="2" rx="4" />
                                <text x="40" y="20" textAnchor="middle" fontSize="10" fill="currentColor">NOV 25 2024</text>
                            </g>
                        )}
                    </g>
                ))}
            </g>
        );
    };

    // -------------------------------------------------------------------------
    // RENDER LOGIC: CIRCULAR (MAPPED SLOT)
    // -------------------------------------------------------------------------
    const renderCircularMapped = () => {
        // Extract Text Blocks
        const textBlocks = blocks.filter(b => b.type === 'TEXT');
        const lineTop = textBlocks[0]?.content || '';
        const lineCenter = textBlocks[1]?.content || '';
        const lineBottom = textBlocks[2]?.content || '';

        const pathTopId = `path-top-${template.id}`;
        const pathBottomId = `path-bottom-${template.id}`;

        // Paths
        const dTop = `M ${center - radius},${center} A ${radius},${radius} 0 1,1 ${center + radius},${center}`;
        const dBottom = `M ${center + radius},${center} A ${radius},${radius} 0 0,1 ${center - radius},${center}`; // Reversed for readability

        return (
            <g>
                <defs>
                    <path id={pathTopId} d={dTop} fill="none" />
                    <path id={pathBottomId} d={dBottom} fill="none" />
                </defs>

                {lineTop && (
                    <text fontSize="28" fontWeight="bold" fill="currentColor">
                        <textPath href={`#${pathTopId}`} startOffset="50%" textAnchor="middle">
                            {lineTop.toUpperCase()}
                        </textPath>
                    </text>
                )}

                {lineCenter && (
                    <text x={center} y={center} textAnchor="middle" dominantBaseline="middle" fontSize="22" fontWeight="bold" fill="currentColor">
                        {lineCenter.toUpperCase()}
                    </text>
                )}

                {lineBottom && (
                    <text fontSize="24" fontWeight="bold" fill="currentColor">
                        <textPath href={`#${pathBottomId}`} startOffset="50%" textAnchor="middle">
                            {lineBottom.toUpperCase()}
                        </textPath>
                    </text>
                )}
            </g>
        );
    };


    return (
        <div className="relative animate-in zoom-in-95 duration-700">
            <div className="bg-white shadow-2xl rounded-lg overflow-hidden w-full max-w-[500px] aspect-square mx-auto border border-slate-100 flex items-center justify-center p-8 relative">
                {/* Paper Texture */}
                <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply pointer-events-none" />

                <svg
                    viewBox={`0 0 ${size} ${size}`}
                    className="w-full h-full max-h-[400px] z-10 transition-all duration-300"
                    style={{
                        color: color,
                        filter: `url(#${filterId}) drop-shadow(0px 2px 3px rgba(0,0,0,0.1))`
                    }}
                >
                    <defs>
                        <filter id={filterId} x="0%" y="0%" width="100%" height="100%">
                            <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" result="noise" />
                            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" in="noise" result="coloredNoise" />
                            <feComposite operator="in" in="coloredNoise" in2="SourceGraphic" result="composite" />
                            <feComposite operator="atop" in="SourceGraphic" in2="composite" />
                        </filter>
                    </defs>

                    {/* BASE SHAPES */}
                    <g className="opacity-90">
                        {renderType === 'circular' && (
                            <circle cx={center} cy={center} r={radius + 15} fill="none" stroke="currentColor" strokeWidth="6" />
                        )}
                        {renderType === 'rectangular' && (
                            <rect x={center - 130} y={center - 50} width={260} height={100} rx="4" fill="none" stroke="currentColor" strokeWidth="6" />
                        )}
                        {renderType === 'oval' && (
                            <ellipse cx={center} cy={center} rx={radius + 20} ry={radius - 20} fill="none" stroke="currentColor" strokeWidth="6" />
                        )}
                    </g>

                    {/* CONTENT LAYER */}
                    <g className="font-serif tracking-widest opacity-95">
                        {renderType === 'circular' ? renderCircularMapped() : renderRectangularStack()}
                    </g>

                </svg>
            </div>
            <div className="h-4 w-3/4 mx-auto bg-black/20 blur-xl rounded-[100%] mt-4 opacity-40"></div>
        </div>
    );
};

export default LiveStampPreview;
