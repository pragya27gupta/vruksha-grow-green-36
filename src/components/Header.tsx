import { Button } from "@/components/ui/button";
import { LogIn, User, LogOut } from "lucide-react";
import vrukshaLogo from "@/assets/vrukshachain-logo-main.png";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
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

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardPath = (role: string) => {
    return `/dashboard/${role}`;
  };

  return (
    <header className="w-full bg-background/95 border-b border-border/30 sticky top-0 z-50 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-2">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => navigate('/')}>
            <img src={vrukshaLogo} alt="VrukshaChain Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
            <span className="text-lg sm:text-2xl font-bold text-foreground hidden xs:block">VrukshaChain</span>
            <span className="text-sm font-bold text-foreground block xs:hidden">VC</span>
          </div>

          {/* Navigation - Simplified */}
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

          {/* Right side */}
          <div className="flex items-center gap-1 sm:gap-2 lg:gap-4 flex-shrink-0">
            <div className="hidden xl:flex items-center gap-2 text-xs lg:text-sm text-muted-foreground bg-accent/5 px-2 lg:px-4 py-1 lg:py-2 rounded-full border border-accent/20">
              <span className="text-accent font-medium">📞 +91 99725 24322</span>
            </div>
            
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1 text-xs sm:text-sm px-2 sm:px-3">
                    <User className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline truncate max-w-20 lg:max-w-none">
                      {user.name || user.email}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate(getDashboardPath(user.role))}>
                    <User className="w-4 h-4 mr-2" />
                    {t('dashboard')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    {t('logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Button variant="outline" size="sm" onClick={handleLogin} className="text-xs sm:text-sm px-2 sm:px-3">
                  <LogIn className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">{t('login')}</span>
                  <span className="sm:hidden">Login</span>
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  className="hidden md:inline-flex text-xs lg:text-sm px-2 lg:px-4"
                  onClick={() => navigate('/request-demo')}
                >
                  {t('requestDemo')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;