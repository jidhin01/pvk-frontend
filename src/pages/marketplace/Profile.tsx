import React from 'react';
import {
    Building2,
    MapPin,
    Phone,
    Mail,
    Plus,
    ShieldCheck,
    Store,
    Camera,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CURRENT_DEALER } from '@/data/mockMarketplaceData';
import { useAuth } from '@/contexts/AuthContext';

export default function Profile() {
    const { user } = useAuth();
    const isDealer = user?.role === 'dealer';

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h2 className="text-2xl font-bold tracking-tight"> {isDealer ? 'Business Profile' : 'My Profile'}</h2>
                <p className="text-muted-foreground">{isDealer ? 'Manage your business details and shipping preferences.' : 'Manage your personal details and addresses.'}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Business Details - Only for Dealers */}
                {isDealer && (
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
                )}

                {/* Shop Front Image - Only for Dealers */}
                {isDealer && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Store className="h-5 w-5 text-primary" />
                                Shop Front Image
                            </CardTitle>
                            <CardDescription>Your shop front as submitted during registration.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="relative rounded-lg overflow-hidden border border-border bg-muted/30">
                                {/* Dummy shop front image */}
                                <img
                                    src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=800&auto=format&fit=crop&q=60"
                                    alt="Shop Front"
                                    className="w-full h-48 object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                    <p className="text-white text-sm font-medium">PVK Enterprise Store</p>
                                    <p className="text-white/80 text-xs">Verified on Dec 15, 2024</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                                    <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">Image Verified</span>
                                </div>
                                <span className="text-xs text-muted-foreground">Last updated: Dec 2024</span>
                            </div>

                            <Button variant="outline" className="w-full">
                                <Camera className="h-4 w-4 mr-2" />
                                Update Shop Front Image
                            </Button>
                        </CardContent>
                    </Card>
                )}

            </div>

            {/* Account Status Section - Full Width Horizontal Layout */}
            <div className="grid gap-6 md:grid-cols-3">
                {/* Current Tier Card */}
                <Card className="bg-gradient-to-br from-amber-50/50 to-amber-100/30 dark:from-amber-950/20 dark:to-amber-900/10 border-amber-200/50 dark:border-amber-800/30">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-full">
                                <ShieldCheck className="h-6 w-6 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Current Tier</p>
                                <p className="text-xl font-bold text-amber-600 dark:text-amber-400">Gold Partner</p>
                            </div>
                            <p className="text-xs text-muted-foreground">Based on monthly volume</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Credit Limit Card */}
                <Card className="bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 dark:from-emerald-950/20 dark:to-emerald-900/10 border-emerald-200/50 dark:border-emerald-800/30">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 rounded-full">
                                <Building2 className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Credit Limit</p>
                                <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">₹{CURRENT_DEALER.creditLimit.toLocaleString()}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">Monthly revolving credit</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Payment Terms Card */}
                <Card className="bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200/50 dark:border-blue-800/30">
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center space-y-3">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-full">
                                <Mail className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Payment Terms</p>
                                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">Net 30 Days</p>
                            </div>
                            <p className="text-xs text-muted-foreground">Invoice payment period</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Saved Addresses - Full Width */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            Saved Addresses
                        </CardTitle>
                        <CardDescription>Manage your shipping locations.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" /> Add New
                    </Button>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-4">
                    <div className="flex items-start gap-3 p-4 border rounded-lg bg-primary/5 border-primary/20">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div className="space-y-1 flex-1">
                            <div className="flex items-center justify-between">
                                <p className="font-medium text-sm">Main Office</p>
                                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Default</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                123, Business Park, MG Road,<br />
                                Cochin, Kerala - 682001
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 border rounded-lg bg-background hover:bg-muted/30 transition-colors">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="space-y-1 flex-1">
                            <p className="font-medium text-sm">Branch Office</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                456, Industrial Area,<br />
                                Trivandrum, Kerala - 695001
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 border rounded-lg bg-background hover:bg-muted/30 transition-colors">
                        <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div className="space-y-1 flex-1">
                            <p className="font-medium text-sm">Warehouse</p>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                                789, Logistics Hub,<br />
                                Kochi, Kerala - 682030
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
