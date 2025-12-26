import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Shield,
  Palette,
  Globe,
  Building2,
  Mail,
  MessageSquare,
  Save,
  RotateCcw,
  IndianRupee,
  ChevronDown,
  ChevronUp,
  Store,
  User,
  Printer as PrinterIcon,
  IdCard,
  Stamp,
  Package,
  Plus,
  Pencil,
  ImageIcon,
  Trash2,
  Upload,
  Truck,
  MapPin,
  Route
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

// Product type
interface Product {
  id: string;
  name: string;
  dealerPrice: number;
  customerPrice: number;
  image?: string;
  description?: string;
  unit?: string;
}

interface ProductCategory {
  id: string;
  name: string;
  icon: any;
  products: Product[];
}

// Product pricing data
const INITIAL_PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: 'pvc-printing',
    name: 'PVC Card Printing',
    icon: PrinterIcon,
    products: [
      { id: 'pvc-single', name: 'PVC Card (Single Side)', dealerPrice: 12, customerPrice: 18, unit: 'per card' },
      { id: 'pvc-both', name: 'PVC Card (Both Side)', dealerPrice: 20, customerPrice: 30, unit: 'per card' },
      { id: 'pvc-premium', name: 'Premium PVC Card', dealerPrice: 32, customerPrice: 50, unit: 'per card' },
      { id: 'pvc-hologram', name: 'Hologram PVC Card', dealerPrice: 48, customerPrice: 75, unit: 'per card' },
    ]
  },
  {
    id: 'offset-printing',
    name: 'Offset Printing',
    icon: PrinterIcon,
    products: [
      { id: 'offset-visiting', name: 'Visiting Card (100 pcs)', dealerPrice: 150, customerPrice: 200, unit: 'per 100' },
      { id: 'offset-letterhead', name: 'Letterhead A4 (100 pcs)', dealerPrice: 400, customerPrice: 550, unit: 'per 100' },
      { id: 'offset-invoice', name: 'Invoice Book (50 pcs)', dealerPrice: 250, customerPrice: 350, unit: 'per book' },
      { id: 'offset-brochure', name: 'Brochure A4 (100 pcs)', dealerPrice: 600, customerPrice: 800, unit: 'per 100' },
    ]
  },
  {
    id: 'digital-printing',
    name: 'Digital Printing',
    icon: PrinterIcon,
    products: [
      { id: 'digital-a4-color', name: 'A4 Color Print', dealerPrice: 8, customerPrice: 12, unit: 'per page' },
      { id: 'digital-a3-color', name: 'A3 Color Print', dealerPrice: 15, customerPrice: 25, unit: 'per page' },
      { id: 'digital-poster', name: 'Poster A2', dealerPrice: 40, customerPrice: 60, unit: 'per piece' },
    ]
  },
  {
    id: 'pan-services',
    name: 'PAN Card Services',
    icon: IdCard,
    products: [
      { id: 'pan-normal', name: 'Normal PAN Card', dealerPrice: 80, customerPrice: 120, unit: 'per card' },
      { id: 'pan-emergency', name: 'Emergency PAN Card', dealerPrice: 200, customerPrice: 300, unit: 'per card' },
      { id: 'pan-correction', name: 'PAN Card Correction', dealerPrice: 100, customerPrice: 150, unit: 'per card' },
    ]
  },
  {
    id: 'rubber-seals',
    name: 'Rubber Seal & Stamps',
    icon: Stamp,
    products: [
      { id: 'seal-self-ink', name: 'Self-Ink Stamp', dealerPrice: 250, customerPrice: 350, unit: 'per piece' },
      { id: 'seal-rubber', name: 'Normal Rubber Seal', dealerPrice: 160, customerPrice: 250, unit: 'per piece' },
      { id: 'seal-pre-ink', name: 'Pre-Ink Stamp', dealerPrice: 400, customerPrice: 600, unit: 'per piece' },
    ]
  },
];

const AdminSettings = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';

  // Product categories state
  const [productCategories, setProductCategories] = useState<ProductCategory[]>(INITIAL_PRODUCT_CATEGORIES);

  // Product dialog state
  const [productDialog, setProductDialog] = useState<{
    open: boolean;
    mode: 'add' | 'edit';
    categoryId: string | null;
    product: Product | null;
  }>({ open: false, mode: 'add', categoryId: null, product: null });

  const [productForm, setProductForm] = useState<{
    name: string;
    dealerPrice: number;
    customerPrice: number;
    description: string;
    unit: string;
    image: string;
  }>({ name: '', dealerPrice: 0, customerPrice: 0, description: '', unit: 'per piece', image: '' });

  const [settings, setSettings] = useState({
    // Business
    businessName: 'PVK Enterprises',
    email: 'contact@pvkenterprises.com',
    phone: '+91 98765 43210',
    address: 'Industrial Area, Kochi, Kerala',
    gst: '32AABCU9603R1ZX',
    // Notifications
    emailNotifications: true,
    whatsappNotifications: true,
    pushNotifications: false,
    dealerApprovalAlert: true,
    lowStockAlert: true,
    paymentAlert: true,
    // Business Rules
    designerEarningPerDesign: 5,
    designerFinePerMistake: 50,
    uploadReward: 10,
    deadStockDays: 90,
    minStockThreshold: 10,
    // Designer Workflow Settings
    attentionAlertMinutes: 120,
    maxActiveJobs: 3,
    batchSizeForPrint: 5,
    autoAssignJobs: true,
    // System
    language: 'en',
    timezone: 'IST',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR',
    // Sales / Line Staff Settings
    salaryAdvanceLimit: 500,
    fuelAllowance: 200,
    cashDepositDeadline: 6,
    deliveryCommission: 10,
    enableGPS: true,
    autoAssignRoute: false,
  });

  const handleSave = () => {
    console.log('Saving settings:', settings);
    toast.success('Settings saved successfully');
  };

  const handleReset = () => {
    toast.info('Settings reset to default');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage system configuration and preferences</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="business" className="space-y-4">
        <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-5' : 'grid-cols-3'}`}>
          <TabsTrigger value="business" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Business</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="pricing" className="gap-2">
              <IndianRupee className="h-4 w-4" />
              <span className="hidden sm:inline">Pricing</span>
            </TabsTrigger>
          )}
          {isAdmin && (
            <TabsTrigger value="rules" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Rules</span>
            </TabsTrigger>
          )}
          <TabsTrigger value="system" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">System</span>
          </TabsTrigger>
        </TabsList>

        {/* Business Settings */}
        <TabsContent value="business">
          <Card>
            <CardHeader>
              <CardTitle>Business Information</CardTitle>
              <CardDescription>Manage your business details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    value={settings.businessName}
                    onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gst">GST Number</Label>
                  <Input
                    id="gst"
                    value={settings.gst}
                    onChange={(e) => setSettings({ ...settings, gst: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-muted-foreground">Channels</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive updates via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label>WhatsApp Notifications</Label>
                        <p className="text-xs text-muted-foreground">Receive updates on WhatsApp</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.whatsappNotifications}
                      onCheckedChange={(checked) => setSettings({ ...settings, whatsappNotifications: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-xs text-muted-foreground">Browser push notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium text-sm text-muted-foreground">Alert Types</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Dealer Approval Requests</Label>
                    <Switch
                      checked={settings.dealerApprovalAlert}
                      onCheckedChange={(checked) => setSettings({ ...settings, dealerApprovalAlert: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Low Stock Alerts</Label>
                    <Switch
                      checked={settings.lowStockAlert}
                      onCheckedChange={(checked) => setSettings({ ...settings, lowStockAlert: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Payment Received</Label>
                    <Switch
                      checked={settings.paymentAlert}
                      onCheckedChange={(checked) => setSettings({ ...settings, paymentAlert: checked })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing - Admin Only */}
        {isAdmin && (
          <TabsContent value="pricing">
            <div className="space-y-4">
              {/* Header Info */}
              <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                        <Store className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-700">Dealer Price</p>
                          <p className="text-xs text-green-600">(B2B Partners)</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-700">Customer Price</p>
                          <p className="text-xs text-blue-600">(Retail / Individual)</p>
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => toast.success('All prices saved successfully')}>
                      <Save className="h-4 w-4 mr-2" />
                      Save All Prices
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Product Categories */}
              <div className="space-y-3">
                {productCategories.map((category) => (
                  <Collapsible key={category.id} defaultOpen={category.id === 'pvc-printing'}>
                    <Card>
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors py-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <category.icon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <CardTitle className="text-base">{category.name}</CardTitle>
                                <CardDescription>{category.products.length} products</CardDescription>
                              </div>
                            </div>
                            <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform" />
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0 space-y-4">
                          <div className="border rounded-lg overflow-hidden">
                            <table className="w-full">
                              <thead className="bg-muted/50">
                                <tr>
                                  <th className="text-left p-3 font-medium text-sm">Product Name</th>
                                  <th className="text-center p-3 font-medium text-sm w-32">
                                    <div className="flex items-center justify-center gap-1 text-green-700">
                                      <Store className="h-4 w-4" />
                                      Dealer ₹
                                    </div>
                                  </th>
                                  <th className="text-center p-3 font-medium text-sm w-32">
                                    <div className="flex items-center justify-center gap-1 text-blue-700">
                                      <User className="h-4 w-4" />
                                      Customer ₹
                                    </div>
                                  </th>
                                  <th className="text-center p-3 font-medium text-sm w-24">Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {category.products.map((product, idx) => (
                                  <tr key={product.id} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/20'}>
                                    <td className="p-3">
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                                          <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium">{product.name}</p>
                                          {product.unit && (
                                            <p className="text-xs text-muted-foreground">{product.unit}</p>
                                          )}
                                        </div>
                                      </div>
                                    </td>
                                    <td className="p-3 text-center">
                                      <div className="flex items-center justify-center gap-1">
                                        <span className="text-muted-foreground">₹</span>
                                        <Input
                                          type="number"
                                          defaultValue={product.dealerPrice}
                                          className="w-20 h-8 text-center text-green-700 font-medium"
                                        />
                                      </div>
                                    </td>
                                    <td className="p-3 text-center">
                                      <div className="flex items-center justify-center gap-1">
                                        <span className="text-muted-foreground">₹</span>
                                        <Input
                                          type="number"
                                          defaultValue={product.customerPrice}
                                          className="w-20 h-8 text-center text-blue-700 font-medium"
                                        />
                                      </div>
                                    </td>
                                    <td className="p-3 text-center">
                                      <div className="flex items-center justify-center gap-1">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8"
                                          onClick={() => {
                                            setProductForm({
                                              name: product.name,
                                              dealerPrice: product.dealerPrice,
                                              customerPrice: product.customerPrice,
                                              description: product.description || '',
                                              unit: product.unit || 'per piece',
                                              image: product.image || ''
                                            });
                                            setProductDialog({
                                              open: true,
                                              mode: 'edit',
                                              categoryId: category.id,
                                              product: product
                                            });
                                          }}
                                        >
                                          <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-8 w-8 text-red-500 hover:text-red-600"
                                          onClick={() => {
                                            toast.success(`${product.name} deleted`);
                                          }}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          {/* Add Product Button */}
                          <Button
                            variant="outline"
                            className="w-full border-dashed"
                            onClick={() => {
                              setProductForm({
                                name: '',
                                dealerPrice: 0,
                                customerPrice: 0,
                                description: '',
                                unit: 'per piece',
                                image: ''
                              });
                              setProductDialog({
                                open: true,
                                mode: 'add',
                                categoryId: category.id,
                                product: null
                              });
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Product to {category.name}
                          </Button>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
              </div>
            </div>
          </TabsContent>
        )}

        {/* Product Add/Edit Dialog */}
        <Dialog open={productDialog.open} onOpenChange={(open) => setProductDialog(prev => ({ ...prev, open }))}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{productDialog.mode === 'add' ? 'Add New Product' : 'Edit Product'}</DialogTitle>
              <DialogDescription>
                {productDialog.mode === 'add'
                  ? 'Add a new product with pricing details'
                  : 'Update product information and pricing'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Product Image</Label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                    {productForm.image ? (
                      <img src={productForm.image} alt="Product" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
              </div>

              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Input
                  id="productName"
                  placeholder="Enter product name"
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              {/* Pricing Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dealerPrice" className="flex items-center gap-1 text-green-700">
                    <Store className="h-4 w-4" />
                    Dealer Price (₹)
                  </Label>
                  <Input
                    id="dealerPrice"
                    type="number"
                    placeholder="0"
                    value={productForm.dealerPrice}
                    onChange={(e) => setProductForm(prev => ({ ...prev, dealerPrice: Number(e.target.value) }))}
                    className="text-green-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPrice" className="flex items-center gap-1 text-blue-700">
                    <User className="h-4 w-4" />
                    Customer Price (₹)
                  </Label>
                  <Input
                    id="customerPrice"
                    type="number"
                    placeholder="0"
                    value={productForm.customerPrice}
                    onChange={(e) => setProductForm(prev => ({ ...prev, customerPrice: Number(e.target.value) }))}
                    className="text-blue-700"
                  />
                </div>
              </div>

              {/* Unit */}
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select value={productForm.unit} onValueChange={(value) => setProductForm(prev => ({ ...prev, unit: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="per piece">Per Piece</SelectItem>
                    <SelectItem value="per card">Per Card</SelectItem>
                    <SelectItem value="per page">Per Page</SelectItem>
                    <SelectItem value="per 100">Per 100</SelectItem>
                    <SelectItem value="per book">Per Book</SelectItem>
                    <SelectItem value="per set">Per Set</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Enter product description..."
                  value={productForm.description}
                  onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setProductDialog(prev => ({ ...prev, open: false }))}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (!productForm.name) {
                    toast.error('Please enter product name');
                    return;
                  }
                  if (productDialog.mode === 'add') {
                    toast.success(`${productForm.name} added successfully`);
                  } else {
                    toast.success(`${productForm.name} updated successfully`);
                  }
                  setProductDialog(prev => ({ ...prev, open: false }));
                }}
              >
                <Save className="h-4 w-4 mr-2" />
                {productDialog.mode === 'add' ? 'Add Product' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Business Rules - Admin Only */}
        {isAdmin && (
          <TabsContent value="rules">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Rules</CardTitle>
                  <CardDescription>Configure pricing and operational rules</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="designerEarning">Designer Earning per Design (₹)</Label>
                      <Input
                        id="designerEarning"
                        type="number"
                        value={settings.designerEarningPerDesign}
                        onChange={(e) => setSettings({ ...settings, designerEarningPerDesign: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="designerFine">Designer Fine per Mistake (₹)</Label>
                      <Input
                        id="designerFine"
                        type="number"
                        value={settings.designerFinePerMistake}
                        onChange={(e) => setSettings({ ...settings, designerFinePerMistake: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="uploadReward">Upload Reward (₹)</Label>
                      <Input
                        id="uploadReward"
                        type="number"
                        value={settings.uploadReward}
                        onChange={(e) => setSettings({ ...settings, uploadReward: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deadStockDays">Dead Stock Duration (Days)</Label>
                      <Input
                        id="deadStockDays"
                        type="number"
                        value={settings.deadStockDays}
                        onChange={(e) => setSettings({ ...settings, deadStockDays: parseInt(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minStock">Minimum Stock Threshold</Label>
                      <Input
                        id="minStock"
                        type="number"
                        value={settings.minStockThreshold}
                        onChange={(e) => setSettings({ ...settings, minStockThreshold: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Designer Workflow Settings</CardTitle>
                  <CardDescription>Configure designer job assignment and workflow rules</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="attentionAlert">Attention Alert (Minutes)</Label>
                      <Input
                        id="attentionAlert"
                        type="number"
                        value={settings.attentionAlertMinutes}
                        onChange={(e) => setSettings({ ...settings, attentionAlertMinutes: parseInt(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground">Alert when job is pending for too long</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxActiveJobs">Max Active Jobs</Label>
                      <Input
                        id="maxActiveJobs"
                        type="number"
                        value={settings.maxActiveJobs}
                        onChange={(e) => setSettings({ ...settings, maxActiveJobs: parseInt(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground">Maximum jobs a designer can work on at once</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="batchSize">Batch Size for Print</Label>
                      <Input
                        id="batchSize"
                        type="number"
                        value={settings.batchSizeForPrint}
                        onChange={(e) => setSettings({ ...settings, batchSizeForPrint: parseInt(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground">Number of designs per print batch</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <Label className="text-base">Auto-Assign Jobs</Label>
                      <p className="text-sm text-muted-foreground">Automatically assign jobs from pool to available designers</p>
                    </div>
                    <Switch
                      checked={settings.autoAssignJobs}
                      onCheckedChange={(checked) => setSettings({ ...settings, autoAssignJobs: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Sales / Line Staff Settings */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Truck className="h-5 w-5 text-blue-700" />
                    </div>
                    <div>
                      <CardTitle>Sales / Line Staff Settings</CardTitle>
                      <CardDescription>Configure delivery staff rules and allowances</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="salaryAdvance">Daily Salary Advance Limit (₹)</Label>
                      <Input
                        id="salaryAdvance"
                        type="number"
                        value={settings.salaryAdvanceLimit}
                        onChange={(e) => setSettings({ ...settings, salaryAdvanceLimit: parseInt(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground">Maximum advance salary staff can take per day</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fuelAllowance">Daily Fuel Allowance (₹)</Label>
                      <Input
                        id="fuelAllowance"
                        type="number"
                        value={settings.fuelAllowance}
                        onChange={(e) => setSettings({ ...settings, fuelAllowance: parseInt(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground">Fuel expense limit per day</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cashDeadline">Cash Deposit Deadline (PM)</Label>
                      <Input
                        id="cashDeadline"
                        type="number"
                        value={settings.cashDepositDeadline}
                        onChange={(e) => setSettings({ ...settings, cashDepositDeadline: parseInt(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground">Time by which cash must be deposited</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deliveryCommission">Delivery Commission (₹)</Label>
                      <Input
                        id="deliveryCommission"
                        type="number"
                        value={settings.deliveryCommission}
                        onChange={(e) => setSettings({ ...settings, deliveryCommission: parseInt(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground">Commission per successful delivery</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <Label className="text-base">Enable GPS Tracking</Label>
                          <p className="text-sm text-muted-foreground">Track staff location during deliveries</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.enableGPS}
                        onCheckedChange={(checked) => setSettings({ ...settings, enableGPS: checked })}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <Route className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <Label className="text-base">Auto-Assign Routes</Label>
                          <p className="text-sm text-muted-foreground">Automatically assign orders to nearest staff</p>
                        </div>
                      </div>
                      <Switch
                        checked={settings.autoAssignRoute}
                        onCheckedChange={(checked) => setSettings({ ...settings, autoAssignRoute: checked })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        {/* System Settings */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Preferences</CardTitle>
              <CardDescription>Configure system-level settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select value={settings.language} onValueChange={(value) => setSettings({ ...settings, language: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ml">Malayalam</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={settings.timezone} onValueChange={(value) => setSettings({ ...settings, timezone: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IST">India Standard Time (IST)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select value={settings.dateFormat} onValueChange={(value) => setSettings({ ...settings, dateFormat: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={settings.currency} onValueChange={(value) => setSettings({ ...settings, currency: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                      <SelectItem value="USD">US Dollar ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
