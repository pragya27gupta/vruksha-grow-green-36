import vrukshaLogo from "@/assets/vrukshachain-logo-main.png";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  
  // Essential links only for mobile-first design
  const essentialLinks = [
              { name: t('about'), href: "#" },
    { name: t('contact'), href: "#" },
    { name: t('partnership'), href: "#" },
    { name: t('eudr'), href: "#" },
    { name: t('caseStudies'), href: "#" },
    { name: t('dairyChain'), href: "#" }
  ];

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Mobile Footer */}
      <div className="md:hidden py-6">
        <div className="container mx-auto px-4">
          {/* Brand Section */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={vrukshaLogo} alt="VrukshaChain Logo" className="w-8 h-8" />
            <span className="text-xl font-bold">VrukshaChain</span>
          </div>

          {/* Links - Grid on mobile */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
            {essentialLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.href} 
                className="text-primary-foreground/80 hover:text-accent transition-colors text-xs"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Newsletter - Compact */}
          <div className="text-center mb-4">
            <p className="text-primary-foreground/80 text-xs">
              {t('subscribeToVrukshaChain')}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Footer */}
      <div className="hidden md:block py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Company Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img src={vrukshaLogo} alt="VrukshaChain Logo" className="w-10 h-10" />
                <span className="text-2xl font-bold">VrukshaChain</span>
              </div>
              <p className="text-primary-foreground/80 mb-6 max-w-md">
                {t('revolutionizingSupplyChains')}
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold text-lg">{t('newsletter')}</h4>
                <p className="text-primary-foreground/80 text-sm">
                  {t('subscribeNewsletter')}
                </p>
                <div className="flex gap-2 max-w-sm">
                  <input 
                    type="email" 
                    placeholder={t('enterYourEmail')}
                    className="flex-1 px-3 py-2 rounded bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 text-sm"
                  />
                  <button className="px-4 py-2 bg-accent text-accent-foreground rounded hover:bg-accent/90 transition-colors text-sm font-medium">
                    {t('subscribe')}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">{t('quickLinksTitle')}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">{t('about')}</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">{t('featuresLink')}</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">{t('caseStudies')}</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">{t('blog')}</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">{t('contact')}</a></li>
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h4 className="font-semibold text-lg mb-4">{t('solutionsTitle')}</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">{t('dairyChain')}</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">{t('eudrCompliance')}</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">{t('partnership')}</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">{t('traceability')}</a></li>
                <li><a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">{t('qualityControl')}</a></li>
              </ul>
            </div>

            {/* Contact & Social */}
            <div>
              <h4 className="font-semibold text-lg mb-4">{t('connectTitle')}</h4>
              <div className="space-y-4">
                <div>
                  <p className="text-primary-foreground/80 text-sm mb-2">{t('emailTitle')}</p>
                  <a href="mailto:info@vrukshachain.com" className="text-accent hover:text-accent/80 transition-colors">
                    info@vrukshachain.com
                  </a>
                </div>
                <div>
                  <p className="text-primary-foreground/80 text-sm mb-2">{t('followUs')}</p>
                  <div className="flex gap-3">
                    <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                      {t('linkedin')}
                    </a>
                    <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                      {t('twitter')}
                    </a>
                    <a href="#" className="text-primary-foreground/80 hover:text-accent transition-colors">
                      {t('facebook')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
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