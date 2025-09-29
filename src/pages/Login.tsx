import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Phone, CreditCard, CheckCircle } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';
import vrukshaLogo from '@/assets/vrukshachain-logo-new.png';
import authenticFarmer from '@/assets/authentic-farmer.jpg';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, loginWithPhone } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
    role: '' as UserRole | ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [phoneLogin, setPhoneLogin] = useState({
    step: 1, // 1: phone input, 2: otp verification
    otp: '',
    isVerifying: false
  });
  const [isQuickSignupOpen, setIsQuickSignupOpen] = useState(false);
  const [quickSignupData, setQuickSignupData] = useState({
    aadhaar: '',
    phone: '',
    name: '',
    otp: '',
    step: 1 // 1: details, 2: otp verification, 3: success
  });
  const [isVerifying, setIsVerifying] = useState(false);

  const roles = [
    { value: 'farmer', label: t('farmer'), icon: '🌱', description: 'Record harvests and track origins' },
    { value: 'processor', label: t('processor'), icon: '⚙️', description: 'Process raw materials and add steps' },
    { value: 'laboratory', label: t('laboratory'), icon: '🔬', description: 'Test quality and validate batches' },
    { value: 'manufacturer', label: t('manufacturer'), icon: '🏭', description: 'Create products and generate QR codes' },
    { value: 'regulator', label: t('regulator'), icon: '🏛️', description: 'Monitor compliance and regulations' },
    { value: 'consumer', label: t('consumer'), icon: '👤', description: 'Scan products and view transparency' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password || !formData.role) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(formData.email, formData.password, formData.role);
      if (success) {
        toast({
          title: "Success",
          description: `Welcome! Redirecting to ${formData.role} dashboard...`
        });
        navigate(`/dashboard/${formData.role}`);
      } else {
        toast({
          title: "Error",
          description: "Invalid credentials. Try demo@vrukshachain.com / demo123",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Login failed",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickSignup = async () => {
    if (!quickSignupData.aadhaar || !quickSignupData.phone || !quickSignupData.name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (quickSignupData.aadhaar.length !== 12) {
      toast({
        title: "Error",
        description: "Aadhaar number must be 12 digits",
        variant: "destructive"
      });
      return;
    }

    if (quickSignupData.phone.length !== 10) {
      toast({
        title: "Error",
        description: "Phone number must be 10 digits",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    // Simulate API call
    setTimeout(() => {
      setQuickSignupData(prev => ({ ...prev, step: 2 }));
      setIsVerifying(false);
      toast({
        title: "OTP Sent",
        description: `Verification code sent to +91 ${quickSignupData.phone}`
      });
    }, 2000);
  };

  const handleOTPVerification = async () => {
    if (!quickSignupData.otp || quickSignupData.otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    // Simulate OTP verification
    setTimeout(() => {
      setQuickSignupData(prev => ({ ...prev, step: 3 }));
      setIsVerifying(false);
      toast({
        title: "Success",
        description: "Account created successfully!"
      });
      
      // Auto-close after 2 seconds and redirect to regular signup for role selection
      setTimeout(() => {
        setIsQuickSignupOpen(false);
        navigate('/signup');
      }, 2000);
    }, 1500);
  };

  const resetQuickSignup = () => {
    setQuickSignupData({
      aadhaar: '',
      phone: '',
      name: '',
      otp: '',
      step: 1
    });
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.phone || !formData.role) {
      toast({
        title: "Error",
        description: "Please fill in phone number and select role",
        variant: "destructive"
      });
      return;
    }

    if (formData.phone.length !== 10) {
      toast({
        title: "Error", 
        description: "Phone number must be 10 digits",
        variant: "destructive"
      });
      return;
    }

    setPhoneLogin(prev => ({ ...prev, isVerifying: true }));
    
    // Simulate OTP sending
    setTimeout(() => {
      setPhoneLogin(prev => ({ ...prev, step: 2, isVerifying: false }));
      toast({
        title: "OTP Sent",
        description: `Verification code sent to +91 ${formData.phone}`
      });
    }, 1500);
  };

  const handleOTPLogin = async () => {
    if (!phoneLogin.otp || phoneLogin.otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    setPhoneLogin(prev => ({ ...prev, isVerifying: true }));
    
    // Simulate OTP verification and login
    setTimeout(async () => {
      try {
        if (!formData.role) {
          toast({
            title: "Error",
            description: "Please select a role",
            variant: "destructive"
          });
          return;
        }
        const success = await loginWithPhone(formData.phone, formData.role as UserRole);
        if (success) {
          toast({
            title: "Success",
            description: `Welcome! Redirecting to ${formData.role} dashboard...`
          });
          navigate(`/dashboard/${formData.role}`);
        } else {
          toast({
            title: "Error",
            description: "Phone login failed",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Login failed",
          variant: "destructive"
        });
      } finally {
        setPhoneLogin(prev => ({ ...prev, isVerifying: false }));
      }
    }, 1000);
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex flex-col lg:flex-row">
      {/* Top Navigation for Mobile */}
      <div className="lg:hidden flex justify-between items-center px-3 py-1 bg-background/80 backdrop-blur-sm border-b border-border/20 z-50 w-full flex-shrink-0 h-12">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/')}
          className="gap-1 text-muted-foreground hover:text-foreground text-xs p-1 h-8"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>Back</span>
        </Button>
        
        <div className="bg-card/95 backdrop-blur-sm rounded p-1 border border-border/20 shadow-lg">
          <LanguageSelector />
        </div>
      </div>

      {/* Left side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-2 lg:p-4 relative flex-1 overflow-hidden min-h-0">
        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          {/* Back to Home Button */}
          <div className="absolute top-2 left-2 z-10">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="gap-1 text-muted-foreground hover:text-foreground text-sm p-2 h-8"
            >
              <ArrowLeft className="h-3 w-3" />
              Back
            </Button>
          </div>
          
          {/* Language Selector */}
          <div className="absolute top-2 right-2 z-10">
            <div className="bg-card/95 backdrop-blur-sm rounded p-1 border border-border/20 shadow-lg">
              <LanguageSelector />
            </div>
          </div>
        </div>
        
        <div className="w-full max-w-md mx-auto">
          <Card className="w-full shadow-xl border-border/20 bg-card/98 backdrop-blur-sm">
            <CardHeader className="text-center pb-3 pt-6">
              <div className="flex justify-center mb-3">
                <img src={vrukshaLogo} alt="VrukshaChain" className="h-12" />
              </div>
              <CardTitle className="text-2xl font-bold text-primary">{t('welcomeBack')}</CardTitle>
              <CardDescription className="text-base">
              {t('loginToAccount')}
              </CardDescription>
              <div className="mt-3 p-3 bg-accent/10 rounded-lg">
                <Dialog open={isQuickSignupOpen} onOpenChange={(open) => {
                  setIsQuickSignupOpen(open);
                  if (!open) resetQuickSignup();
                }}>
                  <DialogTrigger asChild>
                    <button className="w-full text-left hover:bg-accent/20 rounded p-2 transition-colors">
                      <p className="text-sm text-accent font-medium">
                        🆕 New User? Sign up with Aadhaar/Phone in 2 mins
                      </p>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Quick Signup with Aadhaar
                      </DialogTitle>
                      <DialogDescription>
                        {quickSignupData.step === 1 && "Enter your details to get started instantly"}
                        {quickSignupData.step === 2 && "Enter the OTP sent to your phone"}
                        {quickSignupData.step === 3 && "Account created successfully!"}
                      </DialogDescription>
                    </DialogHeader>

                    {quickSignupData.step === 1 && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            value={quickSignupData.name}
                            onChange={(e) => setQuickSignupData(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter your full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="aadhaar">Aadhaar Number</Label>
                          <Input
                            id="aadhaar"
                            value={quickSignupData.aadhaar}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 12);
                              setQuickSignupData(prev => ({ ...prev, aadhaar: value }));
                            }}
                            placeholder="Enter 12-digit Aadhaar number"
                            maxLength={12}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                              +91
                            </span>
                            <Input
                              id="phone"
                              value={quickSignupData.phone}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                                setQuickSignupData(prev => ({ ...prev, phone: value }));
                              }}
                              placeholder="Enter 10-digit phone number"
                              maxLength={10}
                              className="rounded-l-none"
                            />
                          </div>
                        </div>
                        <Button 
                          onClick={handleQuickSignup} 
                          disabled={isVerifying}
                          className="w-full"
                        >
                          {isVerifying ? "Sending OTP..." : "Send OTP"}
                        </Button>
                      </div>
                    )}

                    {quickSignupData.step === 2 && (
                      <div className="space-y-4">
                        <div className="text-center p-4 bg-muted rounded-lg">
                          <Phone className="h-8 w-8 mx-auto mb-2 text-accent" />
                          <p className="text-sm">
                            OTP sent to +91 {quickSignupData.phone}
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="otp">Enter OTP</Label>
                          <Input
                            id="otp"
                            value={quickSignupData.otp}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                              setQuickSignupData(prev => ({ ...prev, otp: value }));
                            }}
                            placeholder="Enter 6-digit OTP"
                            maxLength={6}
                            className="text-center text-lg tracking-widest"
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            onClick={() => setQuickSignupData(prev => ({ ...prev, step: 1 }))}
                            disabled={isVerifying}
                          >
                            Back
                          </Button>
                          <Button 
                            onClick={handleOTPVerification} 
                            disabled={isVerifying}
                            className="flex-1"
                          >
                            {isVerifying ? "Verifying..." : "Verify OTP"}
                          </Button>
                        </div>
                      </div>
                    )}

                    {quickSignupData.step === 3 && (
                      <div className="text-center space-y-4">
                        <div className="p-4">
                          <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                          <h3 className="text-lg font-semibold mb-2">Account Created!</h3>
                          <p className="text-sm text-muted-foreground">
                            Welcome {quickSignupData.name}! Redirecting to complete your profile...
                          </p>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="pt-3 pb-6 px-6">
              <Tabs defaultValue="email" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="email">Email Login</TabsTrigger>
                  <TabsTrigger value="phone">Phone Login</TabsTrigger>
                </TabsList>
                
                <TabsContent value="email" className="space-y-4 mt-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-sm font-medium">{t('selectRole')}</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder={t('selectRole')} />
                        </SelectTrigger>
                        <SelectContent className="max-h-48">
                          {roles.map((role) => (
                            <SelectItem key={role.value} value={role.value}>
                              <div className="flex items-center gap-3 py-2">
                                <span className="text-base">{role.icon}</span>
                                <div>
                                  <span className="font-medium text-sm">{role.label}</span>
                                  <p className="text-xs text-muted-foreground">{role.description}</p>
                                </div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">{t('email')}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="demo@vrukshachain.com"
                        className="h-11"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">{t('password')}</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="demo123"
                        className="h-11"
                      />
                    </div>

                    <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoading}>
                      {isLoading ? "Loading..." : t('login')}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="phone" className="space-y-4 mt-4">
                  {phoneLogin.step === 1 ? (
                    <form onSubmit={handlePhoneLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone-role" className="text-sm font-medium">{t('selectRole')}</Label>
                        <Select
                          value={formData.role}
                          onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder={t('selectRole')} />
                          </SelectTrigger>
                          <SelectContent className="max-h-48">
                            {roles.filter(role => role.value === 'farmer').map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                <div className="flex items-center gap-3 py-2">
                                  <span className="text-base">{role.icon}</span>
                                  <div>
                                    <span className="font-medium text-sm">{role.label}</span>
                                    <p className="text-xs text-muted-foreground">{role.description}</p>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Phone login is currently available for farmers only
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                            +91
                          </span>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                              setFormData({ ...formData, phone: value });
                            }}
                            placeholder="Enter 10-digit phone number"
                            maxLength={10}
                            className="rounded-l-none h-11"
                          />
                        </div>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-11 text-base font-semibold" 
                        disabled={phoneLogin.isVerifying || formData.role !== 'farmer'}
                      >
                        {phoneLogin.isVerifying ? "Sending OTP..." : "Send OTP"}
                      </Button>
                    </form>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <Phone className="h-8 w-8 mx-auto mb-2 text-accent" />
                        <p className="text-sm">
                          OTP sent to +91 {formData.phone}
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone-otp" className="text-sm font-medium">Enter OTP</Label>
                        <InputOTP
                          maxLength={6}
                          value={phoneLogin.otp}
                          onChange={(value) => setPhoneLogin(prev => ({ ...prev, otp: value }))}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setPhoneLogin(prev => ({ ...prev, step: 1, otp: '' }))}
                          disabled={phoneLogin.isVerifying}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button 
                          onClick={handleOTPLogin} 
                          disabled={phoneLogin.isVerifying || phoneLogin.otp.length !== 6}
                          className="flex-1"
                        >
                          {phoneLogin.isVerifying ? "Verifying..." : "Verify & Login"}
                        </Button>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <div className="flex justify-between text-sm pt-2">
                  <Link to="/forgot-password" className="text-primary hover:underline">
                    {t('forgotPassword')}
                  </Link>
                  <Link to="/signup" className="text-primary hover:underline">
                    {t('signup')}
                  </Link>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Authentic Farmer Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-trust-organic/30"></div>
        <img 
          src={authenticFarmer} 
          alt="Authentic Indian farmer in field" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-3xl font-bold mb-2">VrukshaChain</h2>
          <p className="text-lg opacity-90">Farm-to-Fork Traceability Platform</p>
          <div className="mt-4 flex gap-2">
            <Badge className="bg-white/20 text-white border-white/30">Blockchain Verified</Badge>
            <Badge className="bg-white/20 text-white border-white/30">Fair Trade</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;