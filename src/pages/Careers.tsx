import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, DollarSign, Users, Heart, Zap } from "lucide-react";

const Careers = () => {
  const positions = [
    {
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      salary: "$120k - $180k",
      description: "Join our engineering team to build scalable affiliate marketing solutions using React, Node.js, and modern cloud technologies."
    },
    {
      title: "Product Marketing Manager",
      department: "Marketing", 
      location: "Remote / New York",
      type: "Full-time",
      salary: "$90k - $130k",
      description: "Drive product adoption and growth strategies for our affiliate marketing platform, working closely with product and sales teams."
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time", 
      salary: "$70k - $100k",
      description: "Help our affiliate partners and advertisers maximize their success on our platform through strategic guidance and support."
    },
    {
      title: "Data Analyst",
      department: "Analytics",
      location: "Remote / Austin",
      type: "Full-time",
      salary: "$80k - $120k", 
      description: "Analyze platform performance data to drive insights and improve our affiliate marketing algorithms and reporting."
    }
  ];

  const benefits = [
    {
      icon: Heart,
      title: "Health & Wellness",
      description: "Comprehensive health, dental, and vision insurance plus wellness stipend"
    },
    {
      icon: Zap,
      title: "Growth & Learning",
      description: "$2000 annual learning budget and conference attendance support"
    },
    {
      icon: Users,
      title: "Work-Life Balance",
      description: "Flexible hours, unlimited PTO, and remote-first culture"
    },
    {
      icon: DollarSign,
      title: "Equity & Compensation",
      description: "Competitive salary, equity package, and performance bonuses"
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
              Join Our Team
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Help us build the future of affiliate marketing. We're looking for passionate, 
              talented individuals who want to make a real impact in a fast-growing company.
            </p>
            <Button size="xl" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              View Open Positions
            </Button>
          </div>
        </section>

        {/* Why Join Us */}
        <section className="py-20">
          <div className="container space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Why AffiliateHub?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We're building something special, and we want you to be part of it
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <Card key={index} className="hover:shadow-glow transition-shadow">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="flex justify-center">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg">{benefit.title}</h3>
                      <p className="text-muted-foreground text-sm">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="py-20 bg-muted/30">
          <div className="container space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Open Positions</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Find your next opportunity with us
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {positions.map((position, index) => (
                <Card key={index} className="hover:shadow-glow transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl">{position.title}</CardTitle>
                        <div className="flex flex-wrap gap-3 mt-2">
                          <Badge variant="secondary">{position.department}</Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {position.location}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {position.type}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            {position.salary}
                          </div>
                        </div>
                      </div>
                      <Button>Apply Now</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{position.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Don't See Your Role?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We're always looking for exceptional talent. Send us your resume and tell us 
                how you'd like to contribute to AffiliateHub's mission.
              </p>
            </div>
            <Button size="xl" variant="outline">
              Send Us Your Resume
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Careers;