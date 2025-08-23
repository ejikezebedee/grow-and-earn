import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Users, DollarSign, TrendingUp, Shield } from "lucide-react";
import heroImage from "@/assets/hero-affiliate-marketing.jpg";

const HeroSection = () => {
  return (
    <section className="py-20 lg:py-32 overflow-hidden">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Scale Your 
                <span className="bg-gradient-hero bg-clip-text text-transparent"> Affiliate Business</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Join thousands of affiliates and advertisers who trust our platform to grow their revenue. 
                Track, optimize, and get paid with the most advanced affiliate marketing tools.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" className="group">
                Start as Affiliate
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl">
                I'm an Advertiser
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
              <Card className="p-4 text-center shadow-card bg-gradient-card border-0">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-sm text-muted-foreground">Active Affiliates</div>
              </Card>
              <Card className="p-4 text-center shadow-card bg-gradient-card border-0">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-accent" />
                <div className="text-2xl font-bold">$2M+</div>
                <div className="text-sm text-muted-foreground">Paid Out</div>
              </Card>
              <Card className="p-4 text-center shadow-card bg-gradient-card border-0">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-success" />
                <div className="text-2xl font-bold">95%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </Card>
              <Card className="p-4 text-center shadow-card bg-gradient-card border-0">
                <Shield className="h-8 w-8 mx-auto mb-2 text-info" />
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </Card>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-hero rounded-3xl blur-3xl opacity-20 scale-105"></div>
            <img 
              src={heroImage} 
              alt="Affiliate Marketing Dashboard" 
              className="relative rounded-3xl shadow-glow w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;