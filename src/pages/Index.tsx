import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import CampaignsPreview from "@/components/CampaignsPreview";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import BackendNotice from "@/components/BackendNotice";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <div className="container pt-8">
          <BackendNotice />
        </div>
        <HeroSection />
        <FeaturesSection />
        <CampaignsPreview />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
