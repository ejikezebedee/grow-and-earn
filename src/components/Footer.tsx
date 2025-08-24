import { Link } from "react-router-dom";
import { TrendingUp, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t">
      <div className="container py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">AffiliateHub</span>
            </Link>
            <p className="text-muted-foreground">
              The most trusted affiliate marketing platform for growing your business and maximizing revenue.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com/affiliatehub" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/affiliatehub" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://linkedin.com/company/affiliatehub" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/affiliatehub" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h3 className="font-semibold">Platform</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/campaigns" className="text-muted-foreground hover:text-foreground transition-colors">
                Browse Campaigns
              </Link>
              <Link to="/dashboard/affiliate" className="text-muted-foreground hover:text-foreground transition-colors">
                Affiliate Dashboard
              </Link>
              <Link to="/dashboard/advertiser" className="text-muted-foreground hover:text-foreground transition-colors">
                Advertiser Portal
              </Link>
              <Link to="/dashboard/analytics" className="text-muted-foreground hover:text-foreground transition-colors">
                Analytics
              </Link>
            </nav>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold">Resources</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
              <Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                Help Center
              </Link>
              <Link to="/api-docs" className="text-muted-foreground hover:text-foreground transition-colors">
                API Documentation
              </Link>
              <Link to="/getting-started" className="text-muted-foreground hover:text-foreground transition-colors">
                Getting Started
              </Link>
            </nav>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold">Company</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                About Us
              </Link>
              <Link to="/careers" className="text-muted-foreground hover:text-foreground transition-colors">
                Careers
              </Link>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </nav>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © 2024 AffiliateHub. All rights reserved.
          </p>
            <div className="flex gap-6 text-sm">
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;