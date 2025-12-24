
import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEAL_TYPES, SEAL_TEMPLATES, INK_COLORS, StampBlock } from '@/data/mockSealCatalog';
import { cn } from '@/lib/utils';
import Step1_TypeSelector from './Step1_TypeSelector';
import Step2_TemplateSelector from './Step2_TemplateSelector';
import SealStudioLayout from './studio/SealStudioLayout';

interface WizardProps {
    onConfigurationComplete: (config: any) => void;
    onPriceUpdate: (price: number) => void;
}

export default function SealWizardLayout({ onConfigurationComplete, onPriceUpdate }: WizardProps) {
    const [step, setStep] = useState(1);

    // Selection State
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

    // NEW: Block-Based State
    const [blocks, setBlocks] = useState<StampBlock[]>([
        { id: '1', type: 'TEXT', content: '', align: 'center', bold: true, fontSize: 18 },
        { id: '2', type: 'TEXT', content: '', align: 'center', bold: false, fontSize: 16 },
        { id: '3', type: 'TEXT', content: '', align: 'center', bold: false, fontSize: 14 }
    ]);

    const [color, setColor] = useState<string>(INK_COLORS[0].hex);

    // Derived Data
    const currentType = SEAL_TYPES.find(t => t.id === selectedType);
    const currentTemplate = SEAL_TEMPLATES.find(t => t.id === selectedTemplate);

    // Price Calculation
    useEffect(() => {
        let price = 0;
        if (currentType) price += currentType.basePrice;
        if (currentTemplate) price += currentTemplate.priceModifier;
        onPriceUpdate(price);
    }, [selectedType, selectedTemplate, onPriceUpdate]);

    // Handlers
    const handleShapeChange = (shape: 'RECTANGLE' | 'ROUND') => {
        const match = SEAL_TEMPLATES.find(t => t.shape === shape);
        if (match) {
            setSelectedTemplate(match.id);
        }
    };

    // Navigation
    const nextStep = () => {
        if (step === 1 && selectedType) setStep(2);
        else if (step === 2 && selectedTemplate) setStep(3);
        else if (step === 3) {
            // Finalize from wizard (fallback)
            onConfigurationComplete({
                type: selectedType,
                template: selectedTemplate,
                blocks: blocks,
                color: color,
                textLines: blocks.filter(b => b.type === 'TEXT').map(b => (b as any).content)
            });
        }
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    // INTEGRATION: If Step 3, render the Full Screen Studio
    if (step === 3 && currentTemplate) {
        return (
            <SealStudioLayout
                template={currentTemplate}
                initialBlocks={blocks}
                color={color}
                onBack={() => setStep(2)}
                onComplete={({ blocks: finalBlocks }) => {
                    onConfigurationComplete({
                        type: selectedType,
                        template: selectedTemplate,
                        blocks: finalBlocks,
                        color: color,
                        textLines: finalBlocks.filter(b => b.type === 'TEXT').map(b => (b as any).content)
                    });
                }}
            />
        );
    }

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background border rounded-xl overflow-hidden shadow-sm animate-in fade-in">
            {/* 1. Header & Progress */}
            <header className="bg-background/95 backdrop-blur-sm border-b sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="font-bold text-foreground leading-none">Seal Studio</h1>
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Step {step}: {step === 1 ? 'Select Type' : 'Select Template'}</span>
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center gap-4">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={cn(
                                    "h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-500",
                                    step === s ? "bg-primary text-primary-foreground shadow-primary/30 shadow-lg scale-110" :
                                        step > s ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                                )}>
                                    {step > s ? <Check className="h-4 w-4" /> : s}
                                </div>
                                <span className={cn(
                                    "hidden md:block text-sm font-medium transition-colors duration-300",
                                    step >= s ? "text-foreground" : "text-muted-foreground"
                                )}>
                                    {s === 1 ? 'Select Type' : s === 2 ? 'Template' : 'Design'}
                                </span>
                                {s < 3 && <div className="hidden md:block w-8 h-0.5 bg-muted mx-2" />}
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            {/* 2. Main Canvas */}
            <main className="flex-1 w-full max-w-6xl mx-auto p-6 pb-32">
                {step === 1 && (
                    <Step1_TypeSelector selectedType={selectedType} onSelect={setSelectedType} />
                )}

                {step === 2 && (
                    <Step2_TemplateSelector selectedTemplate={selectedTemplate} onSelect={setSelectedTemplate} />
                )}
            </main>

            {/* 3. Sticky Footer */}
            <footer className="fixed bottom-0 left-0 right-0 lg:left-64 bg-background/95 backdrop-blur-md border-t p-4 z-40 transition-all duration-300">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Button
                        variant="ghost"
                        onClick={prevStep}
                        disabled={step === 1}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>

                    <Button
                        size="lg"
                        onClick={nextStep}
                        disabled={(step === 1 && !selectedType) || (step === 2 && !selectedTemplate)}
                        className="min-w-[160px] shadow-lg shadow-primary/20 transition-all bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        Continue <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </footer>
        </div>
    );
}
