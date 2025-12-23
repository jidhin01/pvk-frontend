import React from 'react';
import {
    Plus,
    ArrowRight,
    ShoppingCart,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MARKETPLACE_PRODUCTS, Product } from '@/data/mockMarketplaceData';
import { cn } from '@/lib/utils'; // Assuming you have a utility for classnames
import { useNavigate } from 'react-router-dom';

interface DashboardHomeProps {
    onNavigate: (tab: string) => void;
}

export default function DashboardHome({ onNavigate }: DashboardHomeProps) {
    const navigate = useNavigate();

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Hero / Quick Action Section */}
            <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-background p-8 border border-primary/10">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
                    <div className="space-y-2 max-w-2xl">
                        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                            Welcome to Dealer Marketplace
                        </h1>
                        <p className="text-muted-foreground text-lg">
                            Access premium B2B rates. Upload your own designs or choose from our extensive catalog.
                        </p>
                    </div>
                    <div>
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 h-12 px-8 text-base"
                            onClick={() => onNavigate('new-order')}
                        >
                            <Plus className="mr-2 h-5 w-5" />
                            Upload New Order
                        </Button>
                    </div>
                </div>
            </div>

            {/* Marketplace Grid */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">Explore Categories</h2>
                    <Button variant="ghost" className="text-primary hover:text-primary/80">View All <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {MARKETPLACE_PRODUCTS.map((product: Product) => (
                        <Card
                            key={product.id}
                            className="group relative cursor-pointer overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-card/50 backdrop-blur-sm"
                            onClick={() => console.log(`Navigating to ${product.slug}`)} // To be replaced with actual navigation
                        >
                            {/* Offer Badge */}
                            {product.offerBadge && (
                                <div className="absolute top-0 right-0 z-10">
                                    <div className="bg-red-500 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg shadow-sm">
                                        {product.offerBadge}
                                    </div>
                                </div>
                            )}

                            <CardContent className="p-0">
                                {/* Product Image / Icon Area */}
                                <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center p-6 group-hover:bg-primary/5 transition-colors">
                                    <product.icon
                                        className="h-16 w-16 text-muted-foreground group-hover:text-primary transition-all duration-300 group-hover:scale-110"
                                        strokeWidth={1.5}
                                    />
                                </div>

                                {/* Product Details */}
                                <div className="p-5 space-y-3">
                                    <div>
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{product.category}</p>
                                        <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
                                    </div>

                                    {/* Price Block */}
                                    <div className="flex items-end gap-2">
                                        <div className="flex flex-col">
                                            <span className="text-2xl font-bold text-emerald-600">₹{product.dealerPrice}</span>
                                            <span className="text-[10px] text-emerald-600/80 font-medium">Dealer Price</span>
                                        </div>
                                        <div className="flex flex-col mb-1.5 pl-2 border-l border-border/60">
                                            <span className="text-xs text-muted-foreground line-through decoration-muted-foreground/50">₹{product.retailPrice}</span>
                                            <span className="text-[10px] text-muted-foreground">Market Rate</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Hover Action Overlay (Optional Flair) */}
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
