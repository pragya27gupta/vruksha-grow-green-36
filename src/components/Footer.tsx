import vrukshaLogo from "@/assets/vrukshachain-logo-main.png";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  
  // Essential links only for mobile-first design
  const essentialLinks = [
    { name: t('about'), href: "#" },
    { name: t('contact'), href: "#" },
    { name: "Partnership", href: "#" },
    { name: "EUDR", href: "#" },
    { name: "Case Studies", href: "#" },
    { name: "Dairy Chain", href: "#" }
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer - Mobile First */}
      <div className="py-6 md:py-12">
        <div className="container mx-auto px-4">
          {/* Brand Section */}
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4 md:mb-6">
            <img src={vrukshaLogo} alt="VrukshaChain Logo" className="w-8 h-8 md:w-10 md:h-10" />
            <span className="text-xl md:text-2xl font-bold">VrukshaChain</span>
          </div>

          {/* Links - Single column on mobile, grid on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-2 md:gap-6 mb-4 md:mb-6">
            {essentialLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.href} 
                className="text-primary-foreground/80 hover:text-accent transition-colors text-xs md:text-sm"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Newsletter - Compact */}
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-primary-foreground/80 text-xs md:text-sm">
              Subscribe to VrukshaChain Times
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/20 py-3 md:py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
            <p className="text-primary-foreground/60 text-xs md:text-sm mb-2 md:mb-0">
              © 2024 VrukshaChain. {t('allRightsReserved')}
            </p>
            <div className="flex gap-4 text-xs md:text-sm">
              <a href="#" className="text-primary-foreground/60 hover:text-accent">{t('privacyPolicy')}</a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent">{t('termsOfService')}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;