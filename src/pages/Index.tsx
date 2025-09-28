import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import TraceabilitySection from "@/components/TraceabilitySection";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <main className="w-full">
        <Hero />
        <StatsSection />
        <TraceabilitySection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
