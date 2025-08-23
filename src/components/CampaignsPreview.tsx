import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  Target, 
  TrendingUp, 
  Clock,
  Star,
  Users
} from "lucide-react";

const mockCampaigns = [
  {
    id: 1,
    title: "Premium Software Suite",
    company: "TechCorp",
    category: "Software",
    commission: "25%",
    commissionType: "Revenue Share",
    minPayout: "$50",
    rating: 4.8,
    conversions: 1250,
    description: "Industry-leading productivity software with high conversion rates and excellent customer retention.",
    tags: ["High Converting", "Recurring", "B2B"]
  },
  {
    id: 2,
    title: "Fitness Tracking App",
    company: "HealthTech",
    category: "Health & Fitness",
    commission: "$15",
    commissionType: "CPA",
    minPayout: "$25",
    rating: 4.6,
    conversions: 890,
    description: "Popular fitness app with millions of users. Great for health and wellness audiences.",
    tags: ["Mobile App", "Health", "Popular"]
  },
  {
    id: 3,
    title: "Online Learning Platform",
    company: "EduTech",
    category: "Education",
    commission: "$45",
    commissionType: "CPA",
    minPayout: "$100",
    rating: 4.9,
    conversions: 2100,
    description: "Premium online courses with high-value customers and excellent retention rates.",
    tags: ["Education", "High Value", "Trusted"]
  }
];

const CampaignsPreview = () => {
  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">
            Featured <span className="text-primary">Campaigns</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover high-converting campaigns from top brands and start earning today.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {mockCampaigns.map((campaign) => (
            <Card key={campaign.id} className="shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-2 bg-gradient-card border-0">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {campaign.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current text-warning" />
                    <span className="text-sm font-medium">{campaign.rating}</span>
                  </div>
                </div>
                <CardTitle className="text-lg">{campaign.title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {campaign.company}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed">{campaign.description}</p>
                
                <div className="grid grid-cols-2 gap-4 py-3 border-y">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-success">
                      <DollarSign className="h-4 w-4" />
                      <span className="font-semibold">{campaign.commission}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{campaign.commissionType}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-info">
                      <Users className="h-4 w-4" />
                      <span className="font-semibold">{campaign.conversions}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">Conversions</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {campaign.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" size="sm">
                    Join Campaign
                  </Button>
                  <Button variant="outline" size="sm">
                    <Target className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg">
            View All Campaigns
            <TrendingUp className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CampaignsPreview;