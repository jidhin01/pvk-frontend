import React from 'react';
import {
    Building2,
    MapPin,
    Phone,
    Mail,
    Plus,
    ShieldCheck,
    CreditCard
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CURRENT_DEALER } from '@/data/mockDealerData';
import { Separator } from '@/components/ui/separator';

export default function Profile() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Business Profile</h2>
                <p className="text-muted-foreground">Manage your business details and shipping preferences.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Business Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            Business Details
                        </CardTitle>
                        <CardDescription>Official business information.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Business Name</Label>
                            <Input defaultValue={CURRENT_DEALER.businessName} />
                        </div>
                        <div className="space-y-2">
                            <Label>GST Number</Label>
                            <Input defaultValue={CURRENT_DEALER.gstNumber} />
                            <p className="text-[11px] text-muted-foreground">GST number requires admin approval to change.</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Phone</Label>
                                <div className="relative">
                                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input className="pl-9" defaultValue="+91 98765 43210" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input className="pl-9" defaultValue="dealer@example.com" />
                                </div>
                            </div>
                        </div>
                        <div className="pt-4">
                            <Button>Save Changes</Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Read-Only Status & Logic */}
                <div className="space-y-6">
                    <Card className="bg-muted/30">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                                Account Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-background rounded-lg border">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Current Tier</Label>
                                    <p className="text-xs text-muted-foreground">Based on monthly volume</p>
                                </div>
                                <span className="font-bold text-amber-500 bg-amber-50 px-3 py-1 rounded-full text-sm border border-amber-200">
                                    Gold Partner
                                </span>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-background rounded-lg border">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Credit Limit</Label>
                                    <p className="text-xs text-muted-foreground">Monthly revolving credit</p>
                                </div>
                                <div className="text-right">
                                    <span className="font-bold text-lg">₹{CURRENT_DEALER.creditLimit.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center p-3 bg-background rounded-lg border">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Payment Terms</Label>
                                </div>
                                <span className="text-sm font-medium">Net 30 Days</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <div className="space-y-1">
                                <CardTitle className="text-base">Saved Addresses</CardTitle>
                                <CardDescription>Shipping locations.</CardDescription>
                            </div>
                            <Button variant="outline" size="sm">
                                <Plus className="h-4 w-4 mr-1" /> Add New
                            </Button>
                        </CardHeader>
                        <CardContent className="grid gap-4 pt-4">
                            <div className="flex items-start gap-3 p-3 border rounded-lg bg-background">
                                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                <div className="space-y-1">
                                    <p className="font-medium text-sm">Main Office (Default)</p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        123, Business Park, MG Road,<br />
                                        Cochin, Kerala - 682001
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
