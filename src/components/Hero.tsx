import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { aiSensyAPI } from "@/lib/aisensy-api";

import dashboardMockup from "@/assets/dashboard-mockup.png";
import farmToForkHero from "@/assets/farm-to-fork-hero.jpg";

const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleWhatsAppClick = () => {
    // Open WhatsApp directly with pre-filled farmer onboarding message
    window.open('https://api.whatsapp.com/send/?phone=917755062281&text=Hello+I+am+a+Farmer+Onboarding+!%21&type=phone_number&app_absent=0', '_blank');
  };
  
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={farmToForkHero} 
          alt="Farm to fork journey" 
          className="w-full h-full object-cover opacity-5"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/98 to-background/95"></div>
      </div>
      
      {/* Blockchain Network Pattern */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(135deg,_hsl(var(--accent)/0.06)_0_12px,_transparent_12px_24px)] opacity-40"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-12 xl:gap-16 min-h-[calc(100vh-80px)] py-6 sm:py-8 md:py-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left w-full order-2 lg:order-1">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-foreground mb-3 sm:mb-4 lg:mb-6 leading-tight drop-shadow-sm">
              {t('farmToFork')}
              <br />
              <span className="text-accent font-black">{t('traceabilityPlatform')}</span>
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-3 sm:mb-4 lg:mb-6 max-w-2xl mx-auto lg:mx-0">
              {t('endToEndJourney')}
            </p>
            
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-4 sm:mb-6 lg:mb-8 max-w-3xl leading-relaxed mx-auto lg:mx-0">
              {t('heroDescription')}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="rounded-full h-11 sm:h-12 lg:h-14 px-6 sm:px-8 text-sm sm:text-base lg:text-lg font-bold bg-foreground text-background hover:bg-foreground/90 shadow-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300 w-full sm:w-auto"
                onClick={() => navigate('/book-demo')}
              >
                {t('bookDemo')}
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Right Content - Dashboard Mockup */}
          <div className="flex-1 relative w-full order-1 lg:order-2">
            <div className="relative z-10 max-w-lg sm:max-w-2xl lg:max-w-4xl mx-auto">
              <img 
                src={dashboardMockup} 
                alt="VrukshaChain Dashboard" 
                className="w-full h-auto rounded-lg sm:rounded-xl lg:rounded-2xl shadow-2xl border border-border/20"
              />
              {/* Floating Cards - Mobile optimized */}
              <div className="absolute -top-1 sm:-top-2 lg:-top-4 -left-1 sm:-left-2 lg:-left-4 bg-card border border-border rounded-md sm:rounded-lg p-1.5 sm:p-2 lg:p-4 shadow-lg scale-50 sm:scale-75 lg:scale-100">
                <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <span className="text-accent font-bold text-xs sm:text-sm lg:text-base">5.2</span>
                  </div>
                  <div className="hidden md:block">
                    <p className="font-semibold text-xs lg:text-sm">{t('acresMapped')}</p>
                    <p className="text-xs text-muted-foreground">{t('realTimeTracking')}</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-1 sm:-bottom-2 lg:-bottom-4 -right-1 sm:-right-2 lg:-right-4 bg-card border border-border rounded-md sm:rounded-lg p-1.5 sm:p-2 lg:p-4 shadow-lg scale-50 sm:scale-75 lg:scale-100">
                <div className="text-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-16 lg:h-16 mx-auto mb-1 lg:mb-2 bg-gradient-to-br from-accent to-accent/60 rounded-full flex items-center justify-center">
                    <span className="text-accent-foreground font-bold text-xs sm:text-sm lg:text-base">✓</span>
                  </div>
                  <p className="font-semibold text-xs lg:text-sm hidden md:block">{t('verifiedOrigin')}</p>
                  <p className="text-xs text-muted-foreground hidden md:block">{t('blockchainSecured')}</p>
                </div>
              </div>
            </div>
            
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent/10 rounded-lg sm:rounded-xl lg:rounded-2xl blur-3xl scale-110 -z-10"></div>
          </div>
        </div>

        {/* Trust Markers */}
        <div className="mt-6 sm:mt-8 lg:mt-12 xl:mt-16 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 lg:mb-6">{t('trustedBy')}</p>
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 lg:gap-6 xl:gap-8 opacity-60">
            <Badge variant="outline" className="px-2 sm:px-3 lg:px-4 py-1 lg:py-2 text-xs sm:text-sm whitespace-nowrap">AYUSH Ministry</Badge>
            <Badge variant="outline" className="px-2 sm:px-3 lg:px-4 py-1 lg:py-2 text-xs sm:text-sm whitespace-nowrap">NMPB Board</Badge>
            <Badge variant="outline" className="px-2 sm:px-3 lg:px-4 py-1 lg:py-2 text-xs sm:text-sm whitespace-nowrap">Organic India NGO</Badge>
            <Badge variant="outline" className="px-2 sm:px-3 lg:px-4 py-1 lg:py-2 text-xs sm:text-sm whitespace-nowrap">Fair Trade Alliance</Badge>
          </div>
        </div>
      </div>

      {/* WhatsApp/Chatbot Floating Button - Mobile optimized */}
      <div className="fixed bottom-3 sm:bottom-4 lg:bottom-6 xl:bottom-8 right-3 sm:right-4 lg:right-6 xl:right-8 z-50">
        <Button 
          size="lg"
          className="bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl p-2.5 sm:p-3 lg:p-4 animate-pulse text-xs sm:text-sm lg:text-base"
          onClick={handleWhatsAppClick}
        >
          <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">{t('farmerOnboarding')}</span>
          <span className="inline sm:hidden">Chat</span>
        </Button>
      </div>
    </section>
  );
};

export default Hero;