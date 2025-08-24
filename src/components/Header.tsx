import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, TrendingUp } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">AffiliateHub</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/pricing" className="text-foreground/70 hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link to="/blog" className="text-foreground/70 hover:text-foreground transition-colors">
            Blog
          </Link>
          <Link to="/help" className="text-foreground/70 hover:text-foreground transition-colors">
            Help
          </Link>
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/auth">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/auth">Get Started</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 flex flex-col gap-4">
            <Link 
              to="/pricing" 
              className="text-foreground/70 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/blog" 
              className="text-foreground/70 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link 
              to="/help" 
              className="text-foreground/70 hover:text-foreground transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Help
            </Link>
            <div className="flex flex-col gap-2 pt-4 border-t">
              <Button variant="ghost" asChild>
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Login</Link>
              </Button>
              <Button asChild>
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;