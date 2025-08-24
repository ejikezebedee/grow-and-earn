import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { Link } from "react-router-dom";

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for new affiliates getting started",
      features: [
        "Up to 5 campaigns",
        "Basic analytics",
        "Email support",
        "Standard commission rates",
        "Basic referral tracking"
      ],
      cta: "Get Started Free",
      popular: false
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "For growing affiliate marketers",
      features: [
        "Unlimited campaigns",
        "Advanced analytics & reporting",
        "Priority support",
        "Higher commission rates",
        "Advanced referral tracking",
        "Custom landing pages",
        "A/B testing tools"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For high-volume affiliates and agencies",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom integration support",
        "White-label solutions",
        "Advanced fraud protection",
        "Custom reporting",
        "API access"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const advertiserPlans = [
    {
      name: "Basic",
      price: "5%",
      period: " platform fee",
      description: "Great for small businesses starting out",
      features: [
        "Up to 10 campaigns",
        "Basic campaign management",
        "Standard analytics",
        "Email support",
        "Payment processing"
      ],
      cta: "Start Campaign",
      popular: false
    },
    {
      name: "Growth",
      price: "3%",
      period: " platform fee",
      description: "Perfect for scaling businesses",
      features: [
        "Unlimited campaigns",
        "Advanced targeting",
        "Detailed analytics",
        "Priority support",
        "Fraud protection",
        "Custom commission structures"
      ],
      cta: "Start Campaign",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large businesses with specific needs",
      features: [
        "Everything in Growth",
        "Dedicated account manager",
        "Custom integrations",
        "White-label options",
        "Advanced reporting",
        "SLA guarantees"
      ],
      cta: "Contact Sales",
      popular: false
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
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Choose the perfect plan for your affiliate marketing journey. 
              No hidden fees, cancel anytime.
            </p>
          </div>
        </section>

        {/* Affiliate Pricing */}
        <section className="py-20">
          <div className="container space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">For Affiliates</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Start earning with our affiliate program. Join thousands of successful marketers.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {plans.map((plan, index) => (
                <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-glow scale-105' : ''}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center space-y-4">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div>
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                    </div>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-success flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      asChild 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                    >
                      <Link to="/auth">{plan.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Advertiser Pricing */}
        <section className="py-20 bg-muted/30">
          <div className="container space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">For Advertisers</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Grow your business with performance-based marketing. Pay only for results.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {advertiserPlans.map((plan, index) => (
                <Card key={index} className={`relative ${plan.popular ? 'border-primary shadow-glow scale-105' : ''}`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      Recommended
                    </Badge>
                  )}
                  <CardHeader className="text-center space-y-4">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div>
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                    </div>
                    <p className="text-muted-foreground">{plan.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-success flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      asChild 
                      className="w-full" 
                      variant={plan.popular ? "default" : "outline"}
                    >
                      <Link to="/auth">{plan.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container max-w-3xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-8">
              {[
                {
                  q: "How do affiliate commissions work?",
                  a: "Affiliates earn commissions based on successful conversions they generate. Commission rates vary by campaign and your plan level, ranging from 5% to 50% depending on the advertiser."
                },
                {
                  q: "When do I get paid?",
                  a: "Payments are processed monthly for affiliates with a minimum payout threshold of $100. Payments are made via PayPal, bank transfer, or other supported methods."
                },
                {
                  q: "Is there a setup fee for advertisers?",
                  a: "No setup fees! Advertisers only pay our platform fee on successful conversions. You set your own commission rates and campaign budgets."
                },
                {
                  q: "Can I cancel anytime?",
                  a: "Yes, you can upgrade, downgrade, or cancel your plan at any time. There are no long-term contracts or cancellation fees."
                }
              ].map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-3">{faq.q}</h3>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;