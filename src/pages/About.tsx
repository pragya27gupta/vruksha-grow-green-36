import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PageLayout } from "@/components/ui/page-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, Globe, Leaf } from "lucide-react";
import authenticFarmerImage from "@/assets/authentic-farmer.jpg";
import farmHeroImage from "@/assets/farm-hero.jpg";
import dashboardMockupImage from "@/assets/dashboard-mockup.png";

const About = () => {
  const { t } = useTranslation();

  const values = [
    {
      icon: <Leaf className="w-8 h-8 text-green-600" />,
      title: t('sustainability'),
      description: t('sustainabilityDesc')
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: t('transparency'),
      description: t('transparencyDesc')
    },
    {
      icon: <Award className="w-8 h-8 text-purple-600" />,
      title: t('quality'),
      description: t('qualityDesc')
    },
    {
      icon: <Globe className="w-8 h-8 text-orange-600" />,
      title: t('innovation'),
      description: t('innovationDesc')
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageLayout className="space-y-8 sm:space-y-12">
        <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-4 sm:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              {t('aboutTitle')}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
              {t('aboutDescription')}
            </p>
          </div>

          {/* Mission Section */}
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{t('ourMission')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('missionDescription')}
              </p>
            </div>
            <div className="relative order-1 lg:order-2">
              <img 
                src={authenticFarmerImage} 
                alt="Authentic farmer working in field" 
                className="rounded-lg shadow-lg w-full h-64 sm:h-80 object-cover"
              />
              <Card className="absolute -bottom-3 sm:-bottom-6 -left-3 sm:-left-6 shadow-lg bg-background/95 backdrop-blur-sm">
                <CardContent className="p-3 sm:p-6">
                  <div className="text-center space-y-1 sm:space-y-2">
                    <div className="text-2xl sm:text-3xl font-bold text-accent">100%</div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{t('traceabilityAccuracy')}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Technology Section */}
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <img 
                src={dashboardMockupImage} 
                alt="VrukshaChain dashboard interface" 
                className="rounded-lg shadow-lg w-full"
              />
            </div>
            <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{t('technologyTitle')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('technologyDescription')}
              </p>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <Card>
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-accent">99.9%</div>
                    <p className="text-xs text-muted-foreground">Uptime</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 sm:p-4 text-center">
                    <div className="text-xl sm:text-2xl font-bold text-accent">1M+</div>
                    <p className="text-xs text-muted-foreground">Tracked Items</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="space-y-6 sm:space-y-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground">{t('ourValues')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {values.map((value, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 sm:p-6 text-center space-y-3 sm:space-y-4">
                    <div className="flex justify-center">{value.icon}</div>
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground">{value.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Impact Section */}
          <div className="relative">
            <div 
              className="rounded-lg h-64 sm:h-80 lg:h-96 bg-cover bg-center relative overflow-hidden"
              style={{ backgroundImage: `url(${farmHeroImage})` }}
            >
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="relative z-10 h-full flex items-center justify-center p-4">
                <div className="text-center text-white space-y-4 sm:space-y-6 max-w-4xl">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{t('globalImpact')}</h2>
                  <p className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto">
                    {t('impactDescription')}
                  </p>
                  <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mt-6 sm:mt-8">
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold">50K+</div>
                      <p className="text-xs sm:text-sm opacity-90">Farmers Connected</p>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold">1M+</div>
                      <p className="text-xs sm:text-sm opacity-90">Products Tracked</p>
                    </div>
                    <div className="text-center">
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold">25+</div>
                      <p className="text-xs sm:text-sm opacity-90">Countries Served</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="text-center space-y-4 sm:space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">{t('meetOurTeam')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto px-4">
              {t('teamDescription')}
            </p>
          </div>
        </div>
      </PageLayout>
      <Footer />
    </div>
  );
};

export default About;