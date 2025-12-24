import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, UserPlus, LogIn as LogInIcon, ShieldCheck, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import pvkLogo from '@/assets/pvk-logo.jpeg';
import { getDashboardPath } from '@/config/navigation';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Registration States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<'customer' | 'dealer'>('customer');
  const [regCompany, setRegCompany] = useState('');
  const [regGST, setRegGST] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [shopFrontImage, setShopFrontImage] = useState<File | null>(null);
  const [shopFrontPreview, setShopFrontPreview] = useState<string | null>(null);

  const { login, isLoading } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({ title: 'Error', description: 'Please fill in all fields', variant: 'destructive' });
      return;
    }

    const result = await login(email, password);

    if (result.success && result.user) {
      toast({ title: 'Welcome!', description: 'Login successful' });
      navigate(getDashboardPath(result.user.role));
    } else {
      toast({ title: 'Login Failed', description: result.error, variant: 'destructive' });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!regName || !regEmail || !regPassword || !regPhone) {
      toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
      return;
    }

    if (regRole === 'dealer' && (!regCompany || !regGST || !regAddress)) {
      toast({ title: 'Error', description: 'Please fill in all company details', variant: 'destructive' });
      return;
    }

    // DUMMY REGISTRATION LOGIC
    setIsRegistering(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRegistering(false);

    if (regRole === 'dealer') {
      toast({
        title: 'Registration Successful',
        description: 'Your dealer account request has been sent for approval.',
        duration: 5000,
      });
    } else {
      toast({
        title: 'Registration Successful',
        description: 'Your customer account has been created successfully.',
        duration: 5000,
      });
    }

    // Switch to login
    setIsLogin(true);
    // Optional: prefill login
    setEmail(regEmail);
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="shadow-medium border-border/50 overflow-hidden">
          <CardContent className="p-0">
            <div className="p-8 pb-6 text-center">
              <img src={pvkLogo} alt="PVK Enterprises" className="h-16 w-16 mx-auto rounded-xl object-cover shadow-soft mb-4" />
              <h1 className="text-2xl font-semibold text-foreground">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
              <p className="text-muted-foreground mt-1">
                {isLogin ? 'Sign in to access your dashboard' : 'Join PVK Enterprises network'}
              </p>
            </div>

            <div className="px-8 pb-8">
              <Tabs value={isLogin ? 'login' : 'register'} onValueChange={(v) => setIsLogin(v === 'login')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="h-11 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Checkbox id="remember" checked={rememberMe} onCheckedChange={(c) => setRememberMe(!!c)} />
                        <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">Remember me</Label>
                      </div>
                      <Button variant="link" className="p-0 h-auto text-primary">Forgot password?</Button>
                    </div>

                    <Button type="submit" className="w-full h-11" disabled={isLoading}>
                      {isLoading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Signing in...</> : <><LogInIcon className="mr-2 h-4 w-4" /> Sign In</>}
                    </Button>
                  </form>
                  <p className="text-center text-xs text-muted-foreground mt-6 bg-secondary/30 p-3 rounded-md">
                    Demo: Use <b>admin@pvk.com</b> or <b>dealer@pvk.com</b><br />Password: <b>password123</b>
                  </p>
                </TabsContent>

                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-3">
                      <Label>Select Account Type</Label>
                      <RadioGroup value={regRole} onValueChange={(v: 'customer' | 'dealer') => setRegRole(v)} className="flex gap-4">
                        <div className={`flex flex-1 items-center space-x-2 border rounded-md p-3 cursor-pointer transition-colors ${regRole === 'customer' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                          <RadioGroupItem value="customer" id="r-customer" />
                          <Label htmlFor="r-customer" className="cursor-pointer flex-1 font-medium">Customer</Label>
                        </div>
                        <div className={`flex flex-1 items-center space-x-2 border rounded-md p-3 cursor-pointer transition-colors ${regRole === 'dealer' ? 'border-primary bg-primary/5' : 'border-border'}`}>
                          <RadioGroupItem value="dealer" id="r-dealer" />
                          <Label htmlFor="r-dealer" className="cursor-pointer flex-1 font-medium">Dealer</Label>
                        </div>
                      </RadioGroup>
                      {regRole === 'dealer' && (
                        <p className="text-xs text-yellow-600 flex items-center gap-1">
                          <ShieldCheck className="h-3 w-3" /> Dealer accounts require Admin approval.
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reg-name">Full Name</Label>
                        <Input id="reg-name" placeholder="John Doe" value={regName} onChange={e => setRegName(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reg-phone">Phone</Label>
                        <Input id="reg-phone" placeholder="9876543210" value={regPhone} onChange={e => setRegPhone(e.target.value)} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email Address</Label>
                      <Input id="reg-email" type="email" placeholder="john@example.com" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reg-pass">Password</Label>
                      <Input id="reg-pass" type="password" placeholder="Create a strong password" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
                    </div>

                    {regRole === 'dealer' && (
                      <div className="space-y-4 pt-2 border-t border-border/50 animate-in slide-in-from-top-2 fade-in duration-300">
                        <div className="space-y-2">
                          <Label htmlFor="reg-company">Company Name</Label>
                          <Input id="reg-company" placeholder="Business Name" value={regCompany} onChange={e => setRegCompany(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-gst">GST Number</Label>
                          <Input id="reg-gst" placeholder="GSTIN" value={regGST} onChange={e => setRegGST(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reg-address">Business Address</Label>
                          <Input id="reg-address" placeholder="Full address" value={regAddress} onChange={e => setRegAddress(e.target.value)} />
                        </div>

                        {/* Shop Front Image Upload */}
                        <div className="space-y-2">
                          <Label>Shop Front Image</Label>
                          <p className="text-xs text-muted-foreground">Upload a clear photo of your shop front for verification.</p>

                          {shopFrontPreview ? (
                            <div className="relative rounded-lg overflow-hidden border border-border">
                              <img
                                src={shopFrontPreview}
                                alt="Shop Front Preview"
                                className="w-full h-32 object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setShopFrontImage(null);
                                  setShopFrontPreview(null);
                                }}
                                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/80 transition-colors"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <label
                              htmlFor="shop-front-upload"
                              className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
                            >
                              <div className="p-2 bg-primary/10 rounded-full">
                                <Upload className="h-5 w-5 text-primary" />
                              </div>
                              <div className="text-center">
                                <p className="text-sm font-medium">Click to upload</p>
                                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                              </div>
                              <input
                                id="shop-front-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    setShopFrontImage(file);
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setShopFrontPreview(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    )}

                    <Button type="submit" className="w-full h-11 mt-2" disabled={isRegistering}>
                      {isRegistering ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Registering...</> : <><UserPlus className="mr-2 h-4 w-4" /> Create Account</>}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
