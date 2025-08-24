import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Users, TrendingUp, DollarSign, Target, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const GettingStarted = () => {
  const affiliateSteps = [
    {
      step: 1,
      title: "Create Your Account",
      description: "Sign up for free and complete your profile verification",
      action: "Takes 2-3 minutes"
    },
    {
      step: 2,
      title: "Browse Campaigns",
      description: "Explore available campaigns and find ones that match your audience",
      action: "1000+ campaigns available"
    },
    {
      step: 3,
      title: "Get Your Links",
      description: "Generate unique tracking links for the campaigns you want to promote",
      action: "Instant link generation"
    },
    {
      step: 4,
      title: "Start Promoting",
      description: "Share your links on social media, websites, or email campaigns",
      action: "Multiple promotion methods"
    },
    {
      step: 5,
      title: "Earn Commissions",
      description: "Get paid for every successful referral you generate",
      action: "Weekly payouts"
    }
  ];

  const advertiserSteps = [
    {
      step: 1,
      title: "Create Your Account",
      description: "Sign up and provide your business information for verification",
      action: "Business verification required"
    },
    {
      step: 2,
      title: "Create Your Campaign",
      description: "Set up your campaign with attractive commission rates and clear terms",
      action: "Campaign review process"
    },
    {
      step: 3,
      title: "Attract Affiliates",
      description: "Affiliates discover and join your campaign based on your offering",
      action: "Automatic affiliate matching"
    },
    {
      step: 4,
      title: "Track Performance",
      description: "Monitor clicks, conversions, and affiliate performance in real-time",
      action: "Advanced analytics dashboard"
    },
    {
      step: 5,
      title: "Scale Your Business",
      description: "Optimize campaigns and grow your affiliate network for maximum ROI",
      action: "Unlimited scaling potential"
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero text-white">
          <div className="container text-center space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Getting Started Guide
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Whether you're an affiliate looking to earn or an advertiser wanting to grow, 
              we'll guide you through every step of your journey with AffiliateHub.
            </p>
          </div>
        </section>

        {/* Choose Your Path */}
        <section className="py-20">
          <div className="container space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Choose Your Path</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Select the path that best describes your goals
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Affiliate Path */}
              <Card className="hover:shadow-glow transition-shadow">
                <CardHeader className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <Users className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">I Want to Earn as an Affiliate</CardTitle>
                  <p className="text-muted-foreground">
                    Promote products and services you love and earn commissions for every successful referral.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {affiliateSteps.map((step, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {step.step}
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                          <Badge variant="secondary" className="text-xs">{step.action}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full" size="lg" asChild>
                    <Link to="/auth?type=affiliate">Start as Affiliate</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Advertiser Path */}
              <Card className="hover:shadow-glow transition-shadow">
                <CardHeader className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-4 bg-primary/10 rounded-lg">
                      <TrendingUp className="h-12 w-12 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">I Want to Grow My Business</CardTitle>
                  <p className="text-muted-foreground">
                    Scale your business by leveraging a network of motivated affiliates to drive sales.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {advertiserSteps.map((step, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {step.step}
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-semibold">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                          <Badge variant="secondary" className="text-xs">{step.action}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full" size="lg" asChild>
                    <Link to="/auth?type=advertiser">Start as Advertiser</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-20 bg-muted/30">
          <div className="container space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Why Choose AffiliateHub?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The features that make us the preferred choice for affiliate marketing
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="hover:shadow-glow transition-shadow">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <BarChart3 className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg">Real-Time Analytics</h3>
                  <p className="text-muted-foreground text-sm">
                    Track your performance with detailed analytics and insights in real-time.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-glow transition-shadow">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <DollarSign className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg">Competitive Rates</h3>
                  <p className="text-muted-foreground text-sm">
                    Earn up to 50% commission on sales with our competitive payout structure.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-glow transition-shadow">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Target className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg">Advanced Targeting</h3>
                  <p className="text-muted-foreground text-sm">
                    Smart campaign matching based on audience demographics and interests.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-glow transition-shadow">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <CheckCircle className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg">Fraud Protection</h3>
                  <p className="text-muted-foreground text-sm">
                    Advanced fraud detection and prevention to protect all parties.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-glow transition-shadow">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg">24/7 Support</h3>
                  <p className="text-muted-foreground text-sm">
                    Get help when you need it with our dedicated support team.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-glow transition-shadow">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg">Scaling Tools</h3>
                  <p className="text-muted-foreground text-sm">
                    Built-in tools and resources to help you scale your affiliate business.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Started?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of successful affiliates and advertisers already growing their 
                business with AffiliateHub.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" asChild>
                <Link to="/auth">Get Started Free</Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link to="/help">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default GettingStarted;