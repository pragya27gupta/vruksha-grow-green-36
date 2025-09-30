import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft, Mail, Phone, Key, CheckCircle } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';
import vrukshaLogo from '@/assets/vrukshachain-logo-new.png';
import authenticFarmer from '@/assets/authentic-farmer.jpg';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { forgotPassword, resetPassword } = useAuth();
  
  const [step, setStep] = useState<'input' | 'otp' | 'newPassword' | 'success'>('input');
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailOrPhone.trim()) {
      toast({
        title: "Error",
        description: `Please enter your ${method}`,
        variant: "destructive"
      });
      return;
    }

    // Validate email format
    if (method === 'email' && !emailOrPhone.includes('@')) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    // Validate phone format
    if (method === 'phone' && (emailOrPhone.length !== 10 || !/^\d+$/.test(emailOrPhone))) {
      toast({
        title: "Error",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await forgotPassword(emailOrPhone);
      
      if (result.success) {
        toast({
          title: "Success",
          description: result.message
        });
        setStep('otp');
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process request",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast({
        title: "Error",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive"
      });
      return;
    }

    // For demo, show success message and move to next step
    toast({
      title: "Success",
      description: "OTP verified successfully"
    });
    setStep('newPassword');
  };

  const handleNewPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword || newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await resetPassword(emailOrPhone, otp, newPassword);
      
      if (success) {
        setStep('success');
        toast({
          title: "Success",
          description: "Password reset successfully"
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to reset password. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset password",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep('input');
    setEmailOrPhone('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="h-screen w-full overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex flex-col lg:flex-row">
      {/* Top Navigation for Mobile */}
      <div className="lg:hidden flex justify-between items-center px-3 py-1 bg-background/80 backdrop-blur-sm border-b border-border/20 z-50 w-full flex-shrink-0 h-12">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/login')}
          className="gap-1 text-muted-foreground hover:text-foreground text-xs p-1 h-8"
        >
          <ArrowLeft className="h-3 w-3" />
          <span>Back to Login</span>
        </Button>
        
        <div className="bg-card/95 backdrop-blur-sm rounded p-1 border border-border/20 shadow-lg">
          <LanguageSelector />
        </div>
      </div>

      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-2 lg:p-4 relative flex-1 overflow-hidden min-h-0">
        {/* Desktop Navigation */}
        <div className="hidden lg:block">
          {/* Back to Login Button */}
          <div className="absolute top-2 left-2 z-10">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/login')}
              className="gap-1 text-muted-foreground hover:text-foreground text-sm p-2 h-8"
            >
              <ArrowLeft className="h-3 w-3" />
              Back to Login
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
              <CardTitle className="text-2xl font-bold text-primary">
                {step === 'input' && 'Forgot Password'}
                {step === 'otp' && 'Verify OTP'}
                {step === 'newPassword' && 'Reset Password'}
                {step === 'success' && 'Password Reset'}
              </CardTitle>
              <CardDescription className="text-base">
                {step === 'input' && 'Enter your email or phone number to reset your password'}
                {step === 'otp' && `Enter the verification code sent to your ${method}`}
                {step === 'newPassword' && 'Create a new password for your account'}
                {step === 'success' && 'Your password has been successfully reset'}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="pt-3 pb-6 px-6">
              {step === 'input' && (
                <Tabs value={method} onValueChange={(value) => setMethod(value as 'email' | 'phone')} className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </TabsTrigger>
                    <TabsTrigger value="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="email" className="space-y-4 mt-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={emailOrPhone}
                          onChange={(e) => setEmailOrPhone(e.target.value)}
                          placeholder="Enter your email address"
                          className="h-11"
                        />
                      </div>
                      <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoading}>
                        {isLoading ? "Sending..." : "Send Reset Code"}
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="phone" className="space-y-4 mt-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone Number
                        </Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                            +91
                          </span>
                          <Input
                            id="phone"
                            value={emailOrPhone}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                              setEmailOrPhone(value);
                            }}
                            placeholder="Enter 10-digit phone number"
                            maxLength={10}
                            className="rounded-l-none h-11"
                          />
                        </div>
                      </div>
                      <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoading}>
                        {isLoading ? "Sending..." : "Send Reset Code"}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              )}

              {step === 'otp' && (
                <form onSubmit={handleOTPSubmit} className="space-y-4">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    {method === 'email' ? (
                      <Mail className="h-8 w-8 mx-auto mb-2 text-accent" />
                    ) : (
                      <Phone className="h-8 w-8 mx-auto mb-2 text-accent" />
                    )}
                    <p className="text-sm">
                      Reset code sent to {method === 'email' ? emailOrPhone : `+91 ${emailOrPhone}`}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-sm font-medium">Enter Reset Code</Label>
                    <Input
                      id="otp"
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setOtp(value);
                      }}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="text-center text-lg tracking-widest h-11"
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      Use 123456 for demo
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={resetForm}
                      className="flex-1"
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1"
                      disabled={otp.length !== 6}
                    >
                      Verify Code
                    </Button>
                  </div>
                </form>
              )}

              {step === 'newPassword' && (
                <form onSubmit={handleNewPasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="h-11"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Confirm Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="h-11"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full h-11 text-base font-semibold" disabled={isLoading}>
                    {isLoading ? "Resetting..." : "Reset Password"}
                  </Button>
                </form>
              )}

              {step === 'success' && (
                <div className="text-center space-y-4">
                  <div className="p-4">
                    <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
                    <h3 className="text-lg font-semibold mb-2">Password Reset Successfully!</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Your password has been updated. You can now login with your new password.
                    </p>
                    <Button 
                      onClick={() => navigate('/login')}
                      className="w-full"
                    >
                      Back to Login
                    </Button>
                  </div>
                </div>
              )}

              {step === 'input' && (
                <div className="text-center text-sm pt-4">
                  <span className="text-muted-foreground">Remember your password? </span>
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Back to Login
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-trust-organic/30"></div>
        <img 
          src={authenticFarmer} 
          alt="Authentic Indian farmer in field" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-8 left-8 text-white">
          <h2 className="text-3xl font-bold mb-2">Secure Recovery</h2>
          <p className="text-lg opacity-90">Reset your password safely and securely</p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;