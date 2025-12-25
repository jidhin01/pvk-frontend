import React, { useState } from 'react';
import {
    Store,
    User,
    Users,
    ShoppingCart,
    IndianRupee,
    Activity,
    Search,
    Eye,
    Mail,
    Phone,
    MapPin,
    MoreVertical,
    Edit,
    UserCheck,
    UserX,
    Building2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UnifiedPricingTab from './components/UnifiedPricingTab';
import PartnersOrdersTab from './components/PartnersOrdersTab';
import PartnersActivityTab from './components/PartnersActivityTab';

// Mock data for all partners
const MOCK_DEALERS = [
    { id: '1', name: 'ABC Prints & Graphics', email: 'abc@prints.com', phone: '+91 98765 43280', type: 'dealer', status: 'active', totalOrders: 145, revenue: '₹2,45,000', location: 'Kochi', company: 'ABC Enterprises' },
    { id: '2', name: 'Quick Print Hub', email: 'quick@hub.com', phone: '+91 98765 43281', type: 'dealer', status: 'active', totalOrders: 98, revenue: '₹1,82,000', location: 'Trivandrum', company: 'Quick Hub Pvt Ltd' },
    { id: '3', name: 'Express Graphics', email: 'express@gfx.com', phone: '+91 98765 43282', type: 'dealer', status: 'active', totalOrders: 67, revenue: '₹1,15,000', location: 'Kozhikode', company: 'Express Gfx' },
];

const MOCK_CUSTOMERS = [
    { id: '4', name: 'Ramesh Kumar', email: 'ramesh@gmail.com', phone: '+91 98765 43290', type: 'customer', status: 'active', totalOrders: 5, lastOrder: '2024-12-20' },
    { id: '5', name: 'Priya Nair', email: 'priya@gmail.com', phone: '+91 98765 43291', type: 'customer', status: 'active', totalOrders: 3, lastOrder: '2024-12-18' },
    { id: '6', name: 'Arun Menon', email: 'arun@outlook.com', phone: '+91 98765 43292', type: 'customer', status: 'active', totalOrders: 8, lastOrder: '2024-12-22' },
    { id: '7', name: 'Lakshmi Devi', email: 'lakshmi@yahoo.com', phone: '+91 98765 43293', type: 'customer', status: 'inactive', totalOrders: 1, lastOrder: '2024-11-15' },
];

const ALL_PARTNERS = [...MOCK_DEALERS, ...MOCK_CUSTOMERS];

const PartnersManagement: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [partnerFilter, setPartnerFilter] = useState<'all' | 'dealer' | 'customer'>('all');

    const filteredPartners = ALL_PARTNERS.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = partnerFilter === 'all' || p.type === partnerFilter;
        return matchesSearch && matchesType;
    });

    const dealerCount = MOCK_DEALERS.length;
    const customerCount = MOCK_CUSTOMERS.length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Partners & Pricing</h1>
                <p className="text-muted-foreground">Manage partners and product pricing</p>
            </div>

            {/* Main Tabs - Large and Prominent */}
            <Tabs defaultValue="pricing" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4 h-14 p-1">
                    <TabsTrigger value="pricing" className="h-12 text-base gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <IndianRupee className="h-5 w-5" />
                        Pricing
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="h-12 text-base gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <ShoppingCart className="h-5 w-5" />
                        Orders
                    </TabsTrigger>
                    <TabsTrigger value="partners" className="h-12 text-base gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Users className="h-5 w-5" />
                        Partners
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="h-12 text-base gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        <Activity className="h-5 w-5" />
                        Activity
                    </TabsTrigger>
                </TabsList>

                {/* Pricing Tab */}
                <TabsContent value="pricing" className="space-y-4">
                    <UnifiedPricingTab />
                </TabsContent>

                {/* Orders Tab */}
                <TabsContent value="orders" className="space-y-4">
                    <PartnersOrdersTab partnerType="dealer" />
                </TabsContent>

                {/* Partners Tab */}
                <TabsContent value="partners" className="space-y-4">
                    {/* Filter Controls */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search partners..."
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={partnerFilter === 'all' ? 'default' : 'outline'}
                                onClick={() => setPartnerFilter('all')}
                            >
                                All ({ALL_PARTNERS.length})
                            </Button>
                            <Button
                                variant={partnerFilter === 'dealer' ? 'default' : 'outline'}
                                onClick={() => setPartnerFilter('dealer')}
                                className="gap-2"
                            >
                                <Store className="h-4 w-4" />
                                Dealers ({dealerCount})
                            </Button>
                            <Button
                                variant={partnerFilter === 'customer' ? 'default' : 'outline'}
                                onClick={() => setPartnerFilter('customer')}
                                className="gap-2"
                            >
                                <User className="h-4 w-4" />
                                Customers ({customerCount})
                            </Button>
                        </div>
                    </div>

                    {/* Partners List */}
                    <div className="space-y-3">
                        {filteredPartners.map((partner) => (
                            <Card key={partner.id} className="hover:bg-muted/50 transition-colors">
                                <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            {/* Avatar with type indicator */}
                                            <div className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-medium ${partner.type === 'dealer'
                                                    ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                                                    : 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                                                }`}>
                                                {partner.type === 'dealer' ? (
                                                    <Store className="h-6 w-6" />
                                                ) : (
                                                    <User className="h-6 w-6" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <p className="font-semibold">{partner.name}</p>
                                                    {/* Clear Dealer/Customer Badge */}
                                                    {partner.type === 'dealer' ? (
                                                        <Badge className="bg-green-100 text-green-700 border-green-300 gap-1">
                                                            <Store className="h-3 w-3" />
                                                            DEALER
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-blue-100 text-blue-700 border-blue-300 gap-1">
                                                            <User className="h-3 w-3" />
                                                            CUSTOMER
                                                        </Badge>
                                                    )}
                                                    {partner.status === 'active' ? (
                                                        <Badge variant="outline" className="text-green-600 border-green-300 text-xs">Active</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-orange-500 border-orange-300 text-xs">Inactive</Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
                                                    {/* Show company for dealers */}
                                                    {partner.type === 'dealer' && 'company' in partner && (
                                                        <span className="flex items-center gap-1 text-green-600 font-medium">
                                                            <Building2 className="h-3 w-3" />
                                                            {partner.company}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {partner.email}
                                                    </span>
                                                    <span className="hidden sm:flex items-center gap-1">
                                                        <Phone className="h-3 w-3" />
                                                        {partner.phone}
                                                    </span>
                                                    {partner.type === 'dealer' && 'location' in partner && (
                                                        <span className="hidden md:flex items-center gap-1">
                                                            <MapPin className="h-3 w-3" />
                                                            {partner.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-sm font-semibold flex items-center justify-end gap-1">
                                                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                                                    {partner.totalOrders} orders
                                                </p>
                                                {partner.type === 'dealer' && 'revenue' in partner && (
                                                    <p className="text-xs text-green-600 font-medium">{partner.revenue}</p>
                                                )}
                                                {partner.type === 'customer' && 'lastOrder' in partner && (
                                                    <p className="text-xs text-muted-foreground">Last: {partner.lastOrder}</p>
                                                )}
                                            </div>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>
                                                        <Eye className="h-4 w-4 mr-2" />
                                                        View Orders
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem>
                                                        <Edit className="h-4 w-4 mr-2" />
                                                        Edit Details
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    {partner.status === 'active' ? (
                                                        <DropdownMenuItem className="text-orange-600">
                                                            <UserX className="h-4 w-4 mr-2" />
                                                            Deactivate
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem className="text-green-600">
                                                            <UserCheck className="h-4 w-4 mr-2" />
                                                            Activate
                                                        </DropdownMenuItem>
                                                    )}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        {filteredPartners.length === 0 && (
                            <Card>
                                <CardContent className="py-12 text-center">
                                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">No partners found.</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                {/* Activity Tab */}
                <TabsContent value="activity" className="space-y-4">
                    <PartnersActivityTab partnerType="dealer" />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default PartnersManagement;
