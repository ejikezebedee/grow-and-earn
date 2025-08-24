import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  BookOpen, 
  MessageCircle, 
  Mail, 
  Phone,
  Users,
  TrendingUp,
  Shield,
  CreditCard,
  Settings,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";

const Help = () => {
  const categories = [
    {
      title: "Getting Started",
      icon: BookOpen,
      description: "Learn the basics of affiliate marketing",
      articles: [
        "How to create your first campaign",
        "Setting up your affiliate profile",
        "Understanding commission structures",
        "Tracking your first referrals"
      ]
    },
    {
      title: "For Affiliates",
      icon: Users,
      description: "Maximize your earning potential",
      articles: [
        "Best practices for promoting campaigns",
        "Optimizing conversion rates",
        "Using analytics to improve performance",
        "Payment methods and schedules"
      ]
    },
    {
      title: "For Advertisers", 
      icon: TrendingUp,
      description: "Grow your business effectively",
      articles: [
        "Creating high-converting campaigns",
        "Setting competitive commission rates",
        "Managing affiliate relationships",
        "Campaign performance optimization"
      ]
    },
    {
      title: "Analytics & Reporting",
      icon: BarChart3,
      description: "Understand your data",
      articles: [
        "Reading your dashboard metrics",
        "Custom report generation",
        "ROI calculation methods",
        "Performance benchmarking"
      ]
    },
    {
      title: "Payments & Billing",
      icon: CreditCard,
      description: "Manage your finances",
      articles: [
        "Payment methods and processing times",
        "Tax documentation and reporting",
        "Dispute resolution process",
        "Minimum payout thresholds"
      ]
    },
    {
      title: "Account & Security",
      icon: Shield,
      description: "Keep your account secure",
      articles: [
        "Two-factor authentication setup",
        "Password security best practices",
        "Account verification process",
        "Privacy settings management"
      ]
    }
  ];

  const popularArticles = [
    { title: "How to get started as an affiliate", slug: "how-to-get-started-as-affiliate" },
    { title: "Creating your first campaign", slug: "creating-your-first-campaign" },
    { title: "Understanding commission payments", slug: "understanding-commission-payments" },
    { title: "Troubleshooting tracking issues", slug: "troubleshooting-tracking-issues" },
    { title: "Best practices for campaign promotion", slug: "best-practices-campaign-promotion" },
    { title: "Account verification process", slug: "account-verification-process" }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero text-white">
          <div className="container text-center space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              How Can We Help?
            </h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Find answers, get support, and learn how to maximize your success on our platform.
            </p>
            
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search for help articles..."
                className="pl-12 h-14 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-12 border-b">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="hover:shadow-glow transition-shadow">
                <CardContent className="p-6 text-center space-y-4">
                  <MessageCircle className="h-8 w-8 text-primary mx-auto" />
                  <div>
                    <h3 className="font-semibold">Live Chat</h3>
                    <p className="text-sm text-muted-foreground">Get instant help from our support team</p>
                  </div>
                  <Button className="w-full">Start Chat</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-glow transition-shadow">
                <CardContent className="p-6 text-center space-y-4">
                  <Mail className="h-8 w-8 text-primary mx-auto" />
                  <div>
                    <h3 className="font-semibold">Email Support</h3>
                    <p className="text-sm text-muted-foreground">Send us a detailed message</p>
                  </div>
                  <Button variant="outline" className="w-full">Send Email</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-glow transition-shadow">
                <CardContent className="p-6 text-center space-y-4">
                  <Phone className="h-8 w-8 text-primary mx-auto" />
                  <div>
                    <h3 className="font-semibold">Phone Support</h3>
                    <p className="text-sm text-muted-foreground">Talk to our experts directly</p>
                  </div>
                  <Button variant="outline" className="w-full">Call Now</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Popular Articles */}
        <section className="py-16">
          <div className="container space-y-8">
            <h2 className="text-3xl font-bold text-center">Popular Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {popularArticles.map((article, index) => (
                <Link
                  key={index}
                  to={`/blog/${article.slug}`}
                  className="p-4 rounded-lg border hover:border-primary hover:shadow-md transition-all group"
                >
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">
                    {article.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Help Categories */}
        <section className="py-20 bg-muted/30">
          <div className="container space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Browse by Category</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Find detailed guides and tutorials organized by topic
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category, index) => {
                const Icon = category.icon;
                return (
                  <Card key={index} className="hover:shadow-glow transition-shadow group">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl mb-2">{category.title}</CardTitle>
                          <p className="text-muted-foreground text-sm">{category.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <ul className="space-y-2">
                        {category.articles.map((article, idx) => {
                          // Map articles to help guide slugs
                          const articleSlugMap: Record<string, string> = {
                            "How to create your first campaign": "how-to-create-first-campaign",
                            "Setting up your affiliate profile": "setting-up-affiliate-profile", 
                            "Best practices for promoting campaigns": "best-practices-promoting-campaigns",
                            "Two-factor authentication setup": "two-factor-authentication-setup"
                          };
                          
                          const slug = articleSlugMap[article];
                          const linkTo = slug ? `/help/${slug}` : "/help";
                          
                          return (
                            <li key={idx}>
                              <Link 
                                to={linkTo}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors story-link"
                              >
                                {article}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Status & Updates */}
        <section className="py-16">
          <div className="container max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">System Status</h2>
              <p className="text-muted-foreground">
                Current status of our platform and services
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">All Systems Operational</h3>
                    <p className="text-sm text-muted-foreground">
                      All services are running smoothly
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    Operational
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <Button variant="outline" asChild>
                <Link to="/help">View Status Page</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-20 bg-gradient-hero text-white">
          <div className="container text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Still Need Help?
            </h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Our support team is here to help you succeed. Get in touch and we'll respond within 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="secondary" 
                size="xl"
                className="bg-white text-primary hover:bg-white/90"
              >
                Contact Support
              </Button>
              <Button 
                variant="outline" 
                size="xl"
                className="border-white/30 text-white hover:bg-white/10"
                asChild
              >
                <Link to="/auth">Join Community</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Help;