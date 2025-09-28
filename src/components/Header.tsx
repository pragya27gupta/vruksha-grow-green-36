import { Button } from "@/components/ui/button";
import { LogIn, User, LogOut, Menu, X } from "lucide-react";
import vrukshaLogo from "@/assets/vrukshachain-logo-main.png";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LanguageSelector from "./LanguageSelector";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = () => {
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const getDashboardPath = (role: string) => {
    return `/dashboard/${role}`;
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-background/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>
            <img src={vrukshaLogo} alt="VrukshaChain Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
            <span className="text-lg sm:text-2xl font-bold text-foreground hidden sm:block">VrukshaChain</span>
            <span className="text-lg font-bold text-foreground block sm:hidden">VC</span>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            <button 
              onClick={() => navigate('/about')} 
              className="text-foreground hover:text-accent transition-colors font-medium hover:scale-105 transform duration-200 text-sm lg:text-base"
            >
              {t('about')}
            </button>
            <button 
              onClick={() => navigate('/features')} 
              className="text-foreground hover:text-accent transition-colors font-medium hover:scale-105 transform duration-200 text-sm lg:text-base"
            >
              {t('features')}
            </button>
            <button 
              onClick={() => navigate('/contact')} 
              className="text-foreground hover:text-accent transition-colors font-medium hover:scale-105 transform duration-200 text-sm lg:text-base"
            >
              {t('contact')}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          {/* Right side - Desktop */}
          <div className="hidden md:flex items-center gap-1 sm:gap-2 lg:gap-4 flex-shrink-0">
            <div className="hidden xl:flex items-center gap-2 text-xs lg:text-sm text-muted-foreground bg-accent/10 px-2 lg:px-4 py-1 lg:py-2 rounded-full border border-accent/20">
              <span className="text-accent font-medium">📞 +91 99725 24322</span>
            </div>
            
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 text-xs sm:text-sm px-2 sm:px-3 bg-background text-foreground border-border hover:bg-accent/10 hover:text-accent-foreground">
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline truncate max-w-20 lg:max-w-none">
                      {user.name || user.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-card border-border">
                  <DropdownMenuItem onClick={() => navigate(getDashboardPath(user.role))} className="text-card-foreground hover:bg-accent/10">
                    <User className="w-4 h-4 mr-2" />
                    {t('dashboard')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout} className="text-card-foreground hover:bg-accent/10">
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogin} 
                  className="text-xs sm:text-sm px-2 sm:px-3 bg-background text-foreground border-border hover:bg-accent/10 hover:text-accent-foreground"
                >
                  <LogIn className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{t('login')}</span>
                  <span className="sm:hidden">Login</span>
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  className="hidden md:inline-flex text-xs lg:text-sm px-2 lg:px-4 bg-foreground text-background hover:bg-foreground/90"
                  onClick={() => navigate('/request-demo')}
                >
                  {t('requestDemo')}
                </Button>
              </div>
            )}
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border shadow-lg">
            <div className="container mx-auto px-4 py-4 space-y-4">
              {/* Mobile Navigation */}
              <div className="space-y-3">
                <button 
                  onClick={() => handleNavigation('/about')} 
                  className="block w-full text-left text-foreground hover:text-accent transition-colors font-medium py-2"
                >
                  {t('about')}
                </button>
                <button 
                  onClick={() => handleNavigation('/features')} 
                  className="block w-full text-left text-foreground hover:text-accent transition-colors font-medium py-2"
                >
                  {t('features')}
                </button>
                <button 
                  onClick={() => handleNavigation('/contact')} 
                  className="block w-full text-left text-foreground hover:text-accent transition-colors font-medium py-2"
                >
                  {t('contact')}
                </button>
              </div>

              {/* Mobile Auth Buttons */}
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <LanguageSelector />
                  <div className="text-xs text-muted-foreground">📞 +91 99725 24322</div>
                </div>
                
                {user ? (
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start bg-background text-foreground border-border hover:bg-accent/10"
                      onClick={() => {
                        navigate(getDashboardPath(user.role));
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <User className="w-4 h-4 mr-2" />
                      {t('dashboard')}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start bg-background text-foreground border-border hover:bg-accent/10"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('logout')}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full justify-start bg-background text-foreground border-border hover:bg-accent/10"
                      onClick={handleLogin}
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      {t('login')}
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      className="w-full bg-foreground text-background hover:bg-foreground/90"
                      onClick={() => handleNavigation('/request-demo')}
                    >
                      {t('requestDemo')}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </header>
  );
};

export default Header;