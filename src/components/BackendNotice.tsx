import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Info, Database, Shield, Zap } from "lucide-react";

const BackendNotice = () => {
  return (
    <Card className="border-primary/20 bg-primary/5 shadow-elegant mb-8">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Info className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">Backend Integration Required</h3>
              <p className="text-muted-foreground">
                This is a beautiful frontend demonstration of your affiliate marketing platform. To enable the full functionality including authentication, database operations, payment processing, and admin features, you'll need to connect to Supabase.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 py-4">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-success" />
                <span>User Authentication</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Database className="h-4 w-4 text-info" />
                <span>Campaign & Analytics Data</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Zap className="h-4 w-4 text-warning" />
                <span>Payment Processing</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="hero" size="sm">
                Connect Supabase
              </Button>
              <Button variant="outline" size="sm">
                View Documentation
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BackendNotice;