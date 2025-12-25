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
  RotateCcw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const AdminSettings = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
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
    // System
    language: 'en',
    timezone: 'IST',
    dateFormat: 'DD/MM/YYYY',
    currency: 'INR',
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
        <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-4' : 'grid-cols-3'}`}>
          <TabsTrigger value="business" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Business</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
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

        {/* Business Rules - Admin Only */}
        {isAdmin && (
          <TabsContent value="rules">
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
