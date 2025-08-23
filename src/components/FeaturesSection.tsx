import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart3, 
  Link2, 
  Shield, 
  Wallet, 
  Users, 
  Settings,
  Eye,
  Zap,
  Globe
} from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "Smart Link Generation",
    description: "Create unique, trackable affiliate links with advanced UTM parameters and custom domains.",
    color: "text-primary"
  },
  {
    icon: BarChart3,
    title: "Real-Time Analytics",
    description: "Track clicks, conversions, and earnings with detailed analytics and performance insights.",
    color: "text-success"
  },
  {
    icon: Shield,
    title: "Fraud Protection",
    description: "Advanced fraud detection algorithms protect against click fraud and fake conversions.",
    color: "text-warning"
  },
  {
    icon: Wallet,
    title: "Instant Payouts",
    description: "Get paid faster with multiple payout options including PayPal, bank transfer, and crypto.",
    color: "text-accent"
  },
  {
    icon: Users,
    title: "Team Management",
    description: "Collaborate with your team, assign roles, and manage multiple affiliate accounts.",
    color: "text-info"
  },
  {
    icon: Settings,
    title: "Campaign Automation",
    description: "Set up automated campaigns with smart bidding and performance optimization.",
    color: "text-destructive"
  },
  {
    icon: Eye,
    title: "Conversion Tracking",
    description: "Track every step of the customer journey with pixel-perfect conversion tracking.",
    color: "text-primary"
  },
  {
    icon: Zap,
    title: "API Integration",
    description: "Integrate with your favorite tools using our comprehensive REST API and webhooks.",
    color: "text-success"
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Access campaigns from advertisers worldwide with multi-currency support.",
    color: "text-accent"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Everything You Need to <span className="text-primary">Succeed</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our platform provides all the tools and features you need to build a successful affiliate marketing business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 bg-gradient-card border-0">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-background shadow-sm">
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;