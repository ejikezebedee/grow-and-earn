import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Shield, Zap } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero text-white">
          <div className="container text-center space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              About AffiliateHub
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              We're revolutionizing affiliate marketing by connecting ambitious affiliates with innovative brands, 
              creating a ecosystem where everyone succeeds together.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              At AffiliateHub, we believe that successful partnerships drive business growth. Our mission is to 
              create the most trusted and transparent affiliate marketing platform where brands can scale their 
              reach and affiliates can maximize their earning potential through genuine, value-driven relationships.
            </p>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-muted/30">
          <div className="container space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Our Values</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                These core principles guide everything we do
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="hover:shadow-glow transition-shadow text-center">
                <CardContent className="p-8 space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Shield className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl">Transparency</h3>
                  <p className="text-muted-foreground">
                    Clear tracking, honest reporting, and open communication in all our partnerships.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-glow transition-shadow text-center">
                <CardContent className="p-8 space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl">Growth</h3>
                  <p className="text-muted-foreground">
                    Empowering both affiliates and brands to achieve sustainable, scalable growth.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-glow transition-shadow text-center">
                <CardContent className="p-8 space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl">Community</h3>
                  <p className="text-muted-foreground">
                    Building lasting relationships and fostering a supportive ecosystem for success.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-glow transition-shadow text-center">
                <CardContent className="p-8 space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Zap className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl">Innovation</h3>
                  <p className="text-muted-foreground">
                    Continuously improving our platform with cutting-edge technology and features.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="container max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Our Story</h2>
            </div>
            
            <div className="prose prose-lg max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Founded in 2024, AffiliateHub was born from the frustration of dealing with complex, 
                unreliable affiliate networks. Our founders, experienced marketers and tech entrepreneurs, 
                saw the need for a platform that puts transparency and user experience first.
              </p>
              
              <p className="text-muted-foreground leading-relaxed">
                Today, we serve thousands of affiliates and hundreds of brands worldwide, processing 
                millions in commissions monthly. Our platform has become synonymous with trust, 
                reliability, and results in the affiliate marketing space.
              </p>
              
              <p className="text-muted-foreground leading-relaxed">
                We're just getting started. Our vision is to become the global standard for affiliate 
                marketing, empowering creators and businesses to build meaningful, profitable partnerships 
                that drive real results.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;