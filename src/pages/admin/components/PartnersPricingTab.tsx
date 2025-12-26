import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { IndianRupee, Tag, Percent } from 'lucide-react';

interface PartnersPricingTabProps {
    partnerType: 'dealer' | 'customer';
}

const PartnersPricingTab: React.FC<PartnersPricingTabProps> = ({ partnerType }) => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Tag className="h-5 w-5 text-primary" />
                            Base Pricing
                        </CardTitle>
                        <CardDescription>Default pricing structure for {partnerType}s</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Standard Markup (%)</Label>
                            <Input type="number" defaultValue={partnerType === 'dealer' ? 15 : 25} />
                            <p className="text-xs text-muted-foreground">Percentage added to base production cost</p>
                        </div>
                        <div className="space-y-2">
                            <Label>Minimum Order Value (₹)</Label>
                            <Input type="number" defaultValue={partnerType === 'dealer' ? 1000 : 0} />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Percent className="h-5 w-5 text-primary" />
                            Discounts & Offers
                        </CardTitle>
                        <CardDescription>Manage promotional pricing</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="space-y-0.5">
                                <Label>Bulk Discount</Label>
                                <p className="text-xs text-muted-foreground">Apply discount for large orders</p>
                            </div>
                            <Switch defaultChecked={partnerType === 'dealer'} />
                        </div>
                        <div className="space-y-2">
                            <Label>Bulk Discount Threshold (Items)</Label>
                            <Input type="number" defaultValue={50} />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <IndianRupee className="h-5 w-5 text-primary" />
                        Specific Product Pricing
                    </CardTitle>
                    <CardDescription>Override base pricing for specific categories</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {['PVC Card', 'Normal Seal', 'Self Ink Seal', 'Flex Banner'].map((product) => (
                            <div key={product} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                <span className="font-medium">{product}</span>
                                <div className="flex items-center gap-3">
                                    <Input className="w-24 text-right" placeholder="Price" defaultValue={Math.floor(Math.random() * 500) + 100} />
                                    <span className="text-muted-foreground text-sm">₹ per unit</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                        <Button>Save Pricing Changes</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default PartnersPricingTab;
