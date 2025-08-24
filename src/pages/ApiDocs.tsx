import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Key, Globe, Zap, Shield } from "lucide-react";

const ApiDocs = () => {
  const endpoints = [
    {
      method: "GET",
      endpoint: "/api/campaigns",
      description: "Retrieve all available campaigns for affiliates",
      auth: "Bearer Token"
    },
    {
      method: "POST",
      endpoint: "/api/campaigns",
      description: "Create a new campaign (advertisers only)",
      auth: "Bearer Token"
    },
    {
      method: "GET",
      endpoint: "/api/stats/{campaignId}",
      description: "Get performance statistics for a specific campaign",
      auth: "Bearer Token"
    },
    {
      method: "POST",
      endpoint: "/api/clicks/track",
      description: "Track affiliate click events",
      auth: "API Key"
    },
    {
      method: "POST",
      endpoint: "/api/conversions/track",
      description: "Track conversion events",
      auth: "API Key"
    },
    {
      method: "GET",
      endpoint: "/api/payouts",
      description: "Retrieve payout history and status",
      auth: "Bearer Token"
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
              API Documentation
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Integrate AffiliateHub into your applications with our comprehensive RESTful API. 
              Track clicks, manage campaigns, and access real-time analytics programmatically.
            </p>
            <Button size="xl" variant="secondary" className="bg-white text-primary hover:bg-white/90">
              Get API Key
            </Button>
          </div>
        </section>

        {/* Quick Start */}
        <section className="py-20">
          <div className="container space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Getting Started</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Follow these steps to start integrating with our API
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="hover:shadow-glow transition-shadow">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Key className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl">1. Get API Key</h3>
                  <p className="text-muted-foreground">
                    Generate your API key from your dashboard settings to authenticate requests.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-glow transition-shadow">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Code className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl">2. Make Requests</h3>
                  <p className="text-muted-foreground">
                    Use your API key to make authenticated requests to our endpoints.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-glow transition-shadow">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Zap className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl">3. Go Live</h3>
                  <p className="text-muted-foreground">
                    Start tracking clicks and conversions in real-time with our API.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* API Reference */}
        <section className="py-20 bg-muted/30">
          <div className="container space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">API Reference</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Comprehensive documentation for all available endpoints
              </p>
            </div>

            <Tabs defaultValue="endpoints" className="max-w-6xl mx-auto">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
                <TabsTrigger value="authentication">Authentication</TabsTrigger>
                <TabsTrigger value="examples">Examples</TabsTrigger>
                <TabsTrigger value="sdks">SDKs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="endpoints" className="space-y-6">
                <div className="space-y-4">
                  {endpoints.map((endpoint, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant={endpoint.method === 'GET' ? 'secondary' : 'default'}
                                className="font-mono"
                              >
                                {endpoint.method}
                              </Badge>
                              <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                                {endpoint.endpoint}
                              </code>
                            </div>
                            <p className="text-muted-foreground">{endpoint.description}</p>
                            <p className="text-xs text-muted-foreground">
                              Auth: {endpoint.auth}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="authentication" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Authentication Methods
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Bearer Token Authentication</h3>
                      <p className="text-muted-foreground mb-4">
                        Use your API key as a Bearer token in the Authorization header for most endpoints.
                      </p>
                      <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                        Authorization: Bearer YOUR_API_KEY
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">API Key Authentication</h3>
                      <p className="text-muted-foreground mb-4">
                        For tracking endpoints, include your API key as a query parameter.
                      </p>
                      <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                        ?api_key=YOUR_API_KEY
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="examples" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Code Examples</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Track a Click (JavaScript)</h3>
                      <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                        <pre>{`fetch('https://api.affiliatehub.com/api/clicks/track', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    campaign_id: 'camp_123',
    affiliate_id: 'aff_456',
    click_id: 'click_789',
    user_ip: '192.168.1.1',
    user_agent: 'Mozilla/5.0...'
  })
});`}</pre>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Get Campaign Stats (Python)</h3>
                      <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                        <pre>{`import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://api.affiliatehub.com/api/stats/camp_123',
    headers=headers
)

data = response.json()
print(f"Campaign impressions: {data['impressions']}")
print(f"Campaign clicks: {data['clicks']}")`}</pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="sdks" className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Official SDKs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="font-medium">JavaScript/Node.js</span>
                        <Button variant="outline" size="sm">Download</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="font-medium">Python</span>
                        <Button variant="outline" size="sm">Download</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="font-medium">PHP</span>
                        <Button variant="outline" size="sm">Download</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Community SDKs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="font-medium">Ruby</span>
                        <Button variant="outline" size="sm">GitHub</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="font-medium">Go</span>
                        <Button variant="outline" size="sm">GitHub</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="font-medium">C#</span>
                        <Button variant="outline" size="sm">GitHub</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Support */}
        <section className="py-20">
          <div className="container text-center space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Need Help?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our developer support team is here to help you integrate successfully.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl">
                Contact Developer Support
              </Button>
              <Button size="xl" variant="outline">
                Join Developer Discord
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ApiDocs;