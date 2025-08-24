import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowLeft, Clock, User } from 'lucide-react';
import { blogArticles, type BlogArticle } from '@/data/blogContent';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const BlogPost = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<BlogArticle[]>([]);

  useEffect(() => {
    if (slug) {
      const foundArticle = blogArticles.find(post => post.slug === slug);
      if (foundArticle) {
        setArticle(foundArticle);
        
        // Get related articles (same tags, excluding current article)
        const related = blogArticles
          .filter(post => 
            post.id !== foundArticle.id && 
            post.tags.some(tag => foundArticle.tags.includes(tag))
          )
          .slice(0, 3);
        setRelatedArticles(related);
      }
    }
  }, [slug]);

  if (!article) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-20">
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-6">
              <h1 className="text-4xl font-bold">Article Not Found</h1>
              <p className="text-xl text-muted-foreground">The article you're looking for doesn't exist.</p>
              <Button asChild>
                <Link to="/blog">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Blog
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
            <Link to="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>

          <article className="space-y-8">
            <header className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {article.title}
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                {article.excerpt}
              </p>
              
              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(article.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{article.readTime}</span>
                </div>
              </div>
            </header>

            {article.featuredImage && (
              <div className="rounded-xl overflow-hidden shadow-elegant">
                <img
                  src={article.featuredImage}
                  alt={article.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>
            )}

            <div 
              className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-li:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>

          {relatedArticles.length > 0 && (
            <section className="mt-16 pt-16 border-t">
              <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
              <div className="grid gap-6 md:grid-cols-3">
                {relatedArticles.map((relatedArticle) => (
                  <Card key={relatedArticle.id} className="hover:shadow-glow transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(relatedArticle.date).toLocaleDateString()}</span>
                        </div>
                        
                        <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                          <Link to={`/blog/${relatedArticle.slug}`}>
                            {relatedArticle.title}
                          </Link>
                        </h3>
                        
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {relatedArticle.excerpt}
                        </p>
                        
                        <Button variant="ghost" asChild className="p-0 h-auto">
                          <Link to={`/blog/${relatedArticle.slug}`}>
                            Read more →
                          </Link>
                        </Button>
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

export default BlogPost;