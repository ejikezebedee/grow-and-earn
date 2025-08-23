import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-hero text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <div className="container relative">
        <div className="text-center space-y-8 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
            Ready to Start Your Affiliate Journey?
          </h2>
          <p className="text-xl opacity-90 leading-relaxed">
            Join thousands of successful affiliates and advertisers who are already earning with our platform. 
            No setup fees, no hidden costs - just results.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              variant="secondary" 
              size="xl" 
              className="bg-white text-primary hover:bg-white/90 shadow-glow group"
            >
              Join as Affiliate
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              className="border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              Start Advertising
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 space-y-4">
            <p className="text-sm opacity-75">Trusted by industry leaders</p>
            <div className="flex justify-center items-center gap-8 opacity-60">
              <div className="text-lg font-semibold">Company A</div>
              <div className="text-lg font-semibold">Company B</div>
              <div className="text-lg font-semibold">Company C</div>
              <div className="text-lg font-semibold">Company D</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;