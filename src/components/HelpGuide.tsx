import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Clock, Calendar, BookOpen } from 'lucide-react';
import { helpGuides, getGuideBySlug, getGuidesByCategory, type HelpGuide } from '@/data/helpContent';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const HelpGuideComponent = () => {
  const { slug } = useParams();
  const [guide, setGuide] = useState<HelpGuide | null>(null);
  const [relatedGuides, setRelatedGuides] = useState<HelpGuide[]>([]);

  useEffect(() => {
    if (slug) {
      const foundGuide = getGuideBySlug(slug);
      if (foundGuide) {
        setGuide(foundGuide);
        
        // Get related guides from the same category
        const related = getGuidesByCategory(foundGuide.category)
          .filter(g => g.id !== foundGuide.id)
          .slice(0, 3);
        setRelatedGuides(related);
      }
    }
  }, [slug]);

  if (!guide) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-20">
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-6">
              <h1 className="text-4xl font-bold">Guide Not Found</h1>
              <p className="text-xl text-muted-foreground">The help guide you're looking for doesn't exist.</p>
              <Button asChild>
                <Link to="/help">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Help Center
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <Button variant="ghost" asChild className="mb-8">
            <Link to="/help">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Help Center
            </Link>
          </Button>

          <article className="space-y-8">
            <header className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline">
                  {guide.category}
                </Badge>
                <div className="flex flex-wrap gap-2">
                  {guide.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {guide.title}
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                {guide.excerpt}
              </p>
              
              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{guide.readTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Updated {new Date(guide.lastUpdated).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
            </header>

            <div 
              className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: guide.content }}
            />
          </article>

          {relatedGuides.length > 0 && (
            <section className="mt-16 pt-16 border-t">
              <h2 className="text-2xl font-bold mb-8">Related Guides</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedGuides.map((relatedGuide) => (
                  <Card key={relatedGuide.id} className="hover:shadow-glow transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <BookOpen className="h-3 w-3" />
                          <span>{relatedGuide.category}</span>
                        </div>
                        
                        <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                          <Link to={`/help/${relatedGuide.slug}`}>
                            {relatedGuide.title}
                          </Link>
                        </h3>
                        
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {relatedGuide.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{relatedGuide.readTime}</span>
                          <Button variant="ghost" asChild className="p-0 h-auto text-sm">
                            <Link to={`/help/${relatedGuide.slug}`}>
                              Read guide →
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HelpGuideComponent;