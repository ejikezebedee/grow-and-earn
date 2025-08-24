export interface HelpGuide {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  lastUpdated: string;
  tags: string[];
}

export const helpGuides: HelpGuide[] = [
  // Getting Started
  {
    id: "how-to-create-first-campaign",
    title: "How to create your first campaign",
    slug: "how-to-create-first-campaign",
    excerpt: "Step-by-step guide for advertisers to create their first affiliate campaign",
    category: "Getting Started",
    readTime: "5 min read",
    lastUpdated: "2024-01-20",
    tags: ["campaigns", "advertisers", "setup"],
    content: `
      <div class="space-y-6">
        <h2 class="text-2xl font-bold text-foreground">Creating Your First Affiliate Campaign</h2>
        <p class="text-muted-foreground leading-relaxed">Setting up your first affiliate campaign is an exciting milestone for any advertiser. This guide will walk you through every step to ensure your campaign launches successfully and attracts quality affiliates.</p>
        
        <div class="bg-primary/10 p-6 rounded-lg border border-primary/20">
          <h3 class="font-semibold text-primary mb-3">Before You Start</h3>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li>• Ensure your website is optimized for conversions</li>
            <li>• Have your product images and descriptions ready</li>
            <li>• Define your target audience and ideal affiliate partners</li>
            <li>• Set aside budget for competitive commissions</li>
          </ul>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Step 1: Access Campaign Creation</h3>
        <div class="space-y-4">
          <p class="text-muted-foreground">Navigate to your advertiser dashboard and click the "Create Campaign" button in the top navigation menu.</p>
          
          <div class="bg-card p-4 rounded-lg border">
            <h4 class="font-medium text-foreground mb-2">Navigation Path:</h4>
            <div class="text-sm text-muted-foreground font-mono bg-muted/30 p-2 rounded">
              Dashboard → Campaigns → Create New Campaign
            </div>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Step 2: Campaign Basic Information</h3>
        <div class="space-y-4">
          <p class="text-muted-foreground">Fill in the essential details that will help affiliates understand and promote your campaign effectively.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-card p-6 rounded-lg border">
              <h4 class="font-semibold text-foreground mb-3">Required Fields</h4>
              <ul class="space-y-2 text-sm">
                <li><strong class="text-foreground">Campaign Name:</strong> <span class="text-muted-foreground">Clear, descriptive title</span></li>
                <li><strong class="text-foreground">Category:</strong> <span class="text-muted-foreground">Select relevant industry</span></li>
                <li><strong class="text-foreground">Description:</strong> <span class="text-muted-foreground">Compelling campaign overview</span></li>
                <li><strong class="text-foreground">Landing Page URL:</strong> <span class="text-muted-foreground">Optimized conversion page</span></li>
              </ul>
            </div>
            
            <div class="bg-card p-6 rounded-lg border">
              <h4 class="font-semibold text-foreground mb-3">Best Practices</h4>
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li>• Use specific, benefit-focused titles</li>
                <li>• Include key selling points in description</li>
                <li>• Ensure landing page loads quickly</li>
                <li>• Test conversion flow before launch</li>
              </ul>
            </div>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Step 3: Commission Structure</h3>
        <div class="space-y-4">
          <p class="text-muted-foreground">Set competitive commission rates that attract quality affiliates while maintaining profitability.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-card p-6 rounded-lg border text-center">
              <h4 class="font-semibold text-foreground mb-2">Fixed Commission</h4>
              <div class="text-3xl font-bold text-primary mb-2">$25</div>
              <p class="text-sm text-muted-foreground">Flat rate per conversion</p>
            </div>
            
            <div class="bg-card p-6 rounded-lg border text-center">
              <h4 class="font-semibold text-foreground mb-2">Percentage</h4>
              <div class="text-3xl font-bold text-accent mb-2">15%</div>
              <p class="text-sm text-muted-foreground">Of total sale value</p>
            </div>
            
            <div class="bg-card p-6 rounded-lg border text-center">
              <h4 class="font-semibold text-foreground mb-2">Tiered</h4>
              <div class="text-3xl font-bold text-success mb-2">10-25%</div>
              <p class="text-sm text-muted-foreground">Increases with volume</p>
            </div>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Step 4: Campaign Terms & Conditions</h3>
        <div class="space-y-4">
          <p class="text-muted-foreground">Define clear terms to set expectations and avoid disputes with affiliates.</p>
          
          <div class="bg-warning/10 p-6 rounded-lg border border-warning/20">
            <h4 class="font-semibold text-warning mb-3">Key Terms to Define:</h4>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li>• <strong>Cookie Duration:</strong> How long referrals are tracked (e.g., 30 days)</li>
              <li>• <strong>Prohibited Traffic:</strong> Sources not allowed (spam, adult, etc.)</li>
              <li>• <strong>Payment Schedule:</strong> When commissions are paid (weekly/monthly)</li>
              <li>• <strong>Minimum Payout:</strong> Threshold for commission payments</li>
              <li>• <strong>Geographic Restrictions:</strong> Target countries/regions</li>
            </ul>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Step 5: Marketing Materials</h3>
        <div class="space-y-4">
          <p class="text-muted-foreground">Provide high-quality creative assets to help affiliates promote your campaign effectively.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-card p-6 rounded-lg border">
              <h4 class="font-semibold text-foreground mb-3">Visual Assets</h4>
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li>• Banner ads (multiple sizes)</li>
                <li>• Product images (high resolution)</li>
                <li>• Logo files (PNG with transparency)</li>
                <li>• Video content (if available)</li>
              </ul>
            </div>
            
            <div class="bg-card p-6 rounded-lg border">
              <h4 class="font-semibold text-foreground mb-3">Content Assets</h4>
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li>• Email templates</li>
                <li>• Social media posts</li>
                <li>• Product descriptions</li>
                <li>• Key selling points</li>
              </ul>
            </div>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Step 6: Review and Launch</h3>
        <div class="space-y-4">
          <p class="text-muted-foreground">Double-check all information before submitting your campaign for approval.</p>
          
          <div class="bg-success/10 p-6 rounded-lg border border-success/20">
            <h4 class="font-semibold text-success mb-3">Pre-Launch Checklist:</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li>✓ Campaign details are accurate</li>
                <li>✓ Commission rates are competitive</li>
                <li>✓ Terms are clear and fair</li>
                <li>✓ Landing page converts well</li>
              </ul>
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li>✓ Marketing materials uploaded</li>
                <li>✓ Tracking is properly configured</li>
                <li>✓ Payment information is set up</li>
                <li>✓ Contact information is current</li>
              </ul>
            </div>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Campaign Approval Process</h3>
        <div class="space-y-4">
          <p class="text-muted-foreground">Our team reviews all campaigns to ensure quality and compliance.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-card p-4 rounded-lg border text-center">
              <div class="text-2xl font-bold text-primary mb-2">2-4hrs</div>
              <div class="text-sm text-muted-foreground">Initial Review</div>
            </div>
            <div class="bg-card p-4 rounded-lg border text-center">
              <div class="text-2xl font-bold text-accent mb-2">24hrs</div>
              <div class="text-sm text-muted-foreground">Quality Check</div>
            </div>
            <div class="bg-card p-4 rounded-lg border text-center">
              <div class="text-2xl font-bold text-success mb-2">48hrs</div>
              <div class="text-sm text-muted-foreground">Final Approval</div>
            </div>
            <div class="bg-card p-4 rounded-lg border text-center">
              <div class="text-2xl font-bold text-info mb-2">Live</div>
              <div class="text-sm text-muted-foreground">Campaign Active</div>
            </div>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Post-Launch Optimization</h3>
        <div class="bg-info/10 p-6 rounded-lg border border-info/20">
          <h4 class="font-semibold text-info mb-3">Monitor These Metrics:</h4>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="text-center">
              <div class="text-2xl font-bold text-foreground mb-1">CTR</div>
              <div class="text-xs text-muted-foreground">Click-through Rate</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-foreground mb-1">CVR</div>
              <div class="text-xs text-muted-foreground">Conversion Rate</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-foreground mb-1">EPC</div>
              <div class="text-xs text-muted-foreground">Earnings per Click</div>
            </div>
            <div class="text-center">
              <div class="text-2xl font-bold text-foreground mb-1">ROAS</div>
              <div class="text-xs text-muted-foreground">Return on Ad Spend</div>
            </div>
          </div>
        </div>
        
        <div class="bg-primary/10 p-6 rounded-lg border border-primary/20 text-center">
          <h4 class="font-semibold text-foreground mb-2">Congratulations!</h4>
          <p class="text-muted-foreground">You've successfully created your first affiliate campaign. Now watch as qualified affiliates help grow your business.</p>
        </div>
      </div>
    `
  },
  {
    id: "setting-up-affiliate-profile",
    title: "Setting up your affiliate profile",
    slug: "setting-up-affiliate-profile",
    excerpt: "Complete guide to creating an attractive affiliate profile that wins campaign approvals",
    category: "Getting Started",
    readTime: "4 min read",
    lastUpdated: "2024-01-18",
    tags: ["profile", "setup", "affiliates"],
    content: `
      <div class="space-y-6">
        <h2 class="text-2xl font-bold text-foreground">Setting Up Your Winning Affiliate Profile</h2>
        <p class="text-muted-foreground leading-relaxed">Your affiliate profile is your first impression to potential advertisers. A well-crafted profile increases your approval rates and helps you access premium campaigns with higher commissions.</p>
        
        <div class="bg-success/10 p-6 rounded-lg border border-success/20">
          <h3 class="font-semibold text-success mb-3">Why Your Profile Matters</h3>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li>• Advertisers review profiles before approving affiliates</li>
            <li>• Complete profiles get 3x more campaign approvals</li>
            <li>• Quality profiles access exclusive, high-paying campaigns</li>
            <li>• Professional profiles build trust and credibility</li>
          </ul>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Profile Completion Checklist</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div class="bg-card p-6 rounded-lg border">
            <h4 class="font-semibold text-foreground mb-4">Essential Information</h4>
            <ul class="space-y-3">
              <li class="flex items-center space-x-3">
                <div class="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <span class="text-white text-xs">✓</span>
                </div>
                <span class="text-sm text-muted-foreground">Professional profile photo</span>
              </li>
              <li class="flex items-center space-x-3">
                <div class="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <span class="text-white text-xs">✓</span>
                </div>
                <span class="text-sm text-muted-foreground">Compelling bio/description</span>
              </li>
              <li class="flex items-center space-x-3">
                <div class="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <span class="text-white text-xs">✓</span>
                </div>
                <span class="text-sm text-muted-foreground">Website/blog URLs</span>
              </li>
              <li class="flex items-center space-x-3">
                <div class="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <span class="text-white text-xs">✓</span>
                </div>
                <span class="text-sm text-muted-foreground">Social media profiles</span>
              </li>
            </ul>
          </div>
          
          <div class="bg-card p-6 rounded-lg border">
            <h4 class="font-semibold text-foreground mb-4">Marketing Details</h4>
            <ul class="space-y-3">
              <li class="flex items-center space-x-3">
                <div class="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                  <span class="text-white text-xs">✓</span>
                </div>
                <span class="text-sm text-muted-foreground">Traffic sources</span>
              </li>
              <li class="flex items-center space-x-3">
                <div class="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                  <span class="text-white text-xs">✓</span>
                </div>
                <span class="text-sm text-muted-foreground">Audience demographics</span>
              </li>
              <li class="flex items-center space-x-3">
                <div class="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                  <span class="text-white text-xs">✓</span>
                </div>
                <span class="text-sm text-muted-foreground">Niche expertise</span>
              </li>
              <li class="flex items-center space-x-3">
                <div class="w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                  <span class="text-white text-xs">✓</span>
                </div>
                <span class="text-sm text-muted-foreground">Performance metrics</span>
              </li>
            </ul>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Writing an Effective Bio</h3>
        <div class="space-y-4">
          <p class="text-muted-foreground">Your bio should tell your story, highlight your expertise, and explain your promotional strategy in 2-3 paragraphs.</p>
          
          <div class="bg-primary/10 p-6 rounded-lg border border-primary/20">
            <h4 class="font-semibold text-primary mb-3">Bio Structure Template:</h4>
            <div class="space-y-4 text-sm">
              <div>
                <h5 class="font-medium text-foreground mb-2">Paragraph 1: Introduction & Credentials</h5>
                <p class="text-muted-foreground">"I'm a digital marketing professional with 5+ years of experience in affiliate marketing, specializing in health and wellness products. My blog receives 50,000+ monthly visitors interested in fitness and nutrition."</p>
              </div>
              <div>
                <h5 class="font-medium text-foreground mb-2">Paragraph 2: Audience & Traffic Sources</h5>
                <p class="text-muted-foreground">"My audience consists primarily of health-conscious adults aged 25-45 who actively seek product recommendations. I drive traffic through SEO-optimized content, email marketing (15K subscribers), and social media engagement."</p>
              </div>
              <div>
                <h5 class="font-medium text-foreground mb-2">Paragraph 3: Value Proposition</h5>
                <p class="text-muted-foreground">"I focus on authentic product reviews and only promote products I personally use and believe in. This approach has resulted in consistently high conversion rates and long-term customer relationships."</p>
              </div>
            </div>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Showcasing Your Traffic Sources</h3>
        <div class="space-y-4">
          <p class="text-muted-foreground">Be specific about your traffic sources and include approximate volumes to help advertisers evaluate your potential.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-card p-6 rounded-lg border">
              <h4 class="font-semibold text-foreground mb-3">High-Value Traffic Sources</h4>
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li>• <strong>Organic Search:</strong> SEO-optimized blog content</li>
                <li>• <strong>Email Marketing:</strong> Engaged subscriber base</li>
                <li>• <strong>Social Media:</strong> Active, niche-focused followers</li>
                <li>• <strong>YouTube:</strong> Product review videos</li>
                <li>• <strong>Podcast:</strong> Industry-specific audience</li>
              </ul>
            </div>
            
            <div class="bg-card p-6 rounded-lg border">
              <h4 class="font-semibold text-foreground mb-3">Include Traffic Metrics</h4>
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li>• Monthly website visitors</li>
                <li>• Email list size and engagement rates</li>
                <li>• Social media follower counts</li>
                <li>• Video views or podcast downloads</li>
                <li>• Average conversion rates</li>
              </ul>
            </div>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Profile Photo Best Practices</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div class="bg-success/10 p-6 rounded-lg border border-success/20">
            <h4 class="font-semibold text-success mb-3">✓ Do This</h4>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li>• Use a professional headshot</li>
              <li>• Ensure good lighting and quality</li>
              <li>• Smile and look approachable</li>
              <li>• Use a plain or branded background</li>
              <li>• Keep it current (within 2 years)</li>
            </ul>
          </div>
          
          <div class="bg-destructive/10 p-6 rounded-lg border border-destructive/20">
            <h4 class="font-semibold text-destructive mb-3">✗ Avoid This</h4>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li>• Casual or party photos</li>
              <li>• Low-quality or blurry images</li>
              <li>• Photos with other people</li>
              <li>• Overly edited or filtered images</li>
              <li>• Generic logos or stock photos</li>
            </ul>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Highlighting Your Expertise</h3>
        <div class="space-y-4">
          <p class="text-muted-foreground">Demonstrate your knowledge and experience in specific niches to access targeted campaigns.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-card p-6 rounded-lg border text-center">
              <div class="w-12 h-12 bg-info/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-info font-bold">📚</span>
              </div>
              <h4 class="font-semibold text-foreground mb-2">Education</h4>
              <p class="text-sm text-muted-foreground">Relevant degrees, certifications, or courses</p>
            </div>
            
            <div class="bg-card p-6 rounded-lg border text-center">
              <div class="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-warning font-bold">💼</span>
              </div>
              <h4 class="font-semibold text-foreground mb-2">Experience</h4>
              <p class="text-sm text-muted-foreground">Years in affiliate marketing or related fields</p>
            </div>
            
            <div class="bg-card p-6 rounded-lg border text-center">
              <div class="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <span class="text-success font-bold">🏆</span>
              </div>
              <h4 class="font-semibold text-foreground mb-2">Achievements</h4>
              <p class="text-sm text-muted-foreground">Awards, recognition, or notable results</p>
            </div>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Common Profile Mistakes</h3>
        <div class="bg-warning/10 p-6 rounded-lg border border-warning/20">
          <h4 class="font-semibold text-warning mb-4">Avoid These Profile Killers:</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li>• Generic, copy-paste descriptions</li>
              <li>• Exaggerating traffic numbers or experience</li>
              <li>• Focusing only on making money</li>
              <li>• Poor grammar and spelling errors</li>
            </ul>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li>• Incomplete or missing information</li>
              <li>• Unprofessional email addresses</li>
              <li>• Broken or inactive website links</li>
              <li>• Controversial or offensive content</li>
            </ul>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Profile Optimization Tips</h3>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-card p-6 rounded-lg border">
              <h4 class="font-semibold text-foreground mb-3">Regular Updates</h4>
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li>• Update traffic statistics monthly</li>
                <li>• Add new achievements and certifications</li>
                <li>• Refresh your bio annually</li>
                <li>• Update social media links</li>
              </ul>
            </div>
            
            <div class="bg-card p-6 rounded-lg border">
              <h4 class="font-semibold text-foreground mb-3">A/B Test Elements</h4>
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li>• Try different bio approaches</li>
                <li>• Test various profile photos</li>
                <li>• Experiment with niche focuses</li>
                <li>• Monitor approval rates</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="bg-primary/10 p-6 rounded-lg border border-primary/20 text-center">
          <h4 class="font-semibold text-foreground mb-2">Ready to Build Your Profile?</h4>
          <p class="text-muted-foreground mb-4">A complete, professional profile is your key to accessing the best affiliate campaigns and maximizing your earnings potential.</p>
        </div>
      </div>
    `
  },
  // For Affiliates
  {
    id: "best-practices-promoting-campaigns",
    title: "Best practices for promoting campaigns",
    slug: "best-practices-promoting-campaigns", 
    excerpt: "Proven strategies to maximize your affiliate campaign performance and conversions",
    category: "For Affiliates",
    readTime: "8 min read",
    lastUpdated: "2024-01-16",
    tags: ["promotion", "campaigns", "conversions"],
    content: `
      <div class="space-y-6">
        <h2 class="text-2xl font-bold text-foreground">Proven Campaign Promotion Strategies</h2>
        <p class="text-muted-foreground leading-relaxed">Success in affiliate marketing isn't just about getting approved for campaigns—it's about promoting them effectively. This guide covers the strategies top-performing affiliates use to maximize conversions and earnings.</p>
        
        <div class="bg-primary/10 p-6 rounded-lg border border-primary/20">
          <h3 class="font-semibold text-primary mb-3">The Foundation of Success</h3>
          <p class="text-sm text-muted-foreground">Before diving into promotion tactics, remember that sustainable affiliate success is built on providing genuine value to your audience. Focus on helping people solve problems rather than just pushing products.</p>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Understanding Your Audience</h3>
        <div class="space-y-4">
          <p class="text-muted-foreground">The most successful affiliates deeply understand their audience's needs, preferences, and buying behavior.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-card p-6 rounded-lg border">
              <h4 class="font-semibold text-foreground mb-4">Audience Research Methods</h4>
              <ul class="space-y-3 text-sm text-muted-foreground">
                <li>• <strong>Surveys:</strong> Direct feedback on interests and pain points</li>
                <li>• <strong>Analytics:</strong> Study demographic and behavior data</li>
                <li>• <strong>Comments:</strong> Monitor social media and blog discussions</li>
                <li>• <strong>Competitor Analysis:</strong> See what resonates with similar audiences</li>
              </ul>
            </div>
            
            <div class="bg-card p-6 rounded-lg border">
              <h4 class="font-semibold text-foreground mb-4">Key Insights to Gather</h4>
              <ul class="space-y-3 text-sm text-muted-foreground">
                <li>• <strong>Demographics:</strong> Age, gender, location, income</li>
                <li>• <strong>Interests:</strong> Hobbies, values, lifestyle preferences</li>
                <li>• <strong>Pain Points:</strong> Problems they're seeking to solve</li>
                <li>• <strong>Buying Behavior:</strong> When and how they make purchases</li>
              </ul>
            </div>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Content-First Promotion Strategy</h3>
        <div class="space-y-4">
          <p class="text-muted-foreground">The most effective promotions don't feel like advertisements. They provide value while naturally incorporating product recommendations.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-card p-6 rounded-lg border">
              <div class="w-12 h-12 bg-info/20 rounded-full flex items-center justify-center mb-4">
                <span class="text-info font-bold">📝</span>
              </div>
              <h4 class="font-semibold text-foreground mb-3">Educational Content</h4>
              <p class="text-sm text-muted-foreground mb-3">Teach your audience something valuable</p>
              <ul class="space-y-1 text-xs text-muted-foreground">
                <li>• How-to tutorials</li>
                <li>• Step-by-step guides</li>
                <li>• Tips and tricks</li>
                <li>• Best practices</li>
              </ul>
            </div>
            
            <div class="bg-card p-6 rounded-lg border">
              <div class="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mb-4">
                <span class="text-success font-bold">🔍</span>
              </div>
              <h4 class="font-semibold text-foreground mb-3">Review Content</h4>
              <p class="text-sm text-muted-foreground mb-3">Share honest product experiences</p>
              <ul class="space-y-1 text-xs text-muted-foreground">
                <li>• In-depth product reviews</li>
                <li>• Comparison articles</li>
                <li>• Pros and cons analysis</li>
                <li>• Real-world testing</li>
              </ul>
            </div>
            
            <div class="bg-card p-6 rounded-lg border">
              <div class="w-12 h-12 bg-warning/20 rounded-full flex items-center justify-center mb-4">
                <span class="text-warning font-bold">📊</span>
              </div>
              <h4 class="font-semibold text-foreground mb-3">Problem-Solution</h4>
              <p class="text-sm text-muted-foreground mb-3">Address specific pain points</p>
              <ul class="space-y-1 text-xs text-muted-foreground">
                <li>• Problem identification</li>
                <li>• Solution exploration</li>
                <li>• Product recommendations</li>
                <li>• Success stories</li>
              </ul>
            </div>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Multi-Channel Promotion</h3>
        <div class="space-y-4">
          <p class="text-muted-foreground">Don't rely on a single traffic source. Diversify your promotion channels for maximum reach and stability.</p>
          
          <div class="space-y-6">
            <div class="bg-card p-6 rounded-lg border">
              <h4 class="font-semibold text-foreground mb-4">Owned Media Channels</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 class="font-medium text-foreground mb-3">Blog/Website</h5>
                  <ul class="space-y-2 text-sm text-muted-foreground">
                    <li>• SEO-optimized product reviews</li>
                    <li>• Comparison and buying guides</li>
                    <li>• Resource pages and tool lists</li>
                    <li>• Problem-solving tutorials</li>
                  </ul>
                </div>
                <div>
                  <h5 class="font-medium text-foreground mb-3">Email Marketing</h5>
                  <ul class="space-y-2 text-sm text-muted-foreground">
                    <li>• Product recommendation sequences</li>
                    <li>• Weekly newsletter mentions</li>
                    <li>• Exclusive subscriber offers</li>
                    <li>• Follow-up campaigns</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="bg-card p-6 rounded-lg border">
              <h4 class="font-semibold text-foreground mb-4">Social Media Promotion</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 class="font-medium text-foreground mb-3">Platform-Specific Strategies</h5>
                  <ul class="space-y-2 text-sm text-muted-foreground">
                    <li>• <strong>Instagram:</strong> Visual product showcases, Stories</li>
                    <li>• <strong>YouTube:</strong> Video reviews, tutorials</li>
                    <li>• <strong>Twitter:</strong> Quick tips, threads</li>
                    <li>• <strong>Facebook:</strong> Community groups, discussions</li>
                  </ul>
                </div>
                <div>
                  <h5 class="font-medium text-foreground mb-3">Content Ideas</h5>
                  <ul class="space-y-2 text-sm text-muted-foreground">
                    <li>• Behind-the-scenes product usage</li>
                    <li>• Before/after transformations</li>
                    <li>• Quick tip carousels</li>
                    <li>• User-generated content reshares</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Timing and Frequency Optimization</h3>
        <div class="space-y-4">
          <p class="text-muted-foreground">When and how often you promote significantly impacts your results.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-success/10 p-6 rounded-lg border border-success/20">
              <h4 class="font-semibold text-success mb-4">Optimal Timing</h4>
              <ul class="space-y-3 text-sm text-muted-foreground">
                <li>• <strong>Seasonal Relevance:</strong> Align with holidays and events</li>
                <li>• <strong>Peak Activity Hours:</strong> When your audience is most active</li>
                <li>• <strong>Product Launch Windows:</strong> Capitalize on new releases</li>
                <li>• <strong>Sales Events:</strong> Leverage Black Friday, etc.</li>
              </ul>
            </div>
            
            <div class="bg-warning/10 p-6 rounded-lg border border-warning/20">
              <h4 class="font-semibold text-warning mb-4">Frequency Guidelines</h4>
              <ul class="space-y-3 text-sm text-muted-foreground">
                <li>• <strong>80/20 Rule:</strong> 80% value content, 20% promotional</li>
                <li>• <strong>Vary Formats:</strong> Mix content types to avoid fatigue</li>
                <li>• <strong>Test Tolerance:</strong> Find your audience's promotion limit</li>
                <li>• <strong>Monitor Engagement:</strong> Watch for declining interaction</li>
              </ul>
            </div>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Building Trust and Authority</h3>
        <div class="space-y-4">
          <p class="text-muted-foreground">Trust is the foundation of high-converting affiliate promotions. Build credibility to increase conversion rates.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-card p-6 rounded-lg border">
              <h4 class="font-semibold text-foreground mb-3">Transparency</h4>
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li>• Clear affiliate disclosures</li>
                <li>• Honest product assessments</li>
                <li>• Share both pros and cons</li>
                <li>• Admit limitations</li>
              </ul>
            </div>
            
            <div class="bg-card p-6 rounded-lg border">
              <h4 class="font-semibold text-foreground mb-3">Expertise</h4>
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li>• Personal product experience</li>
                <li>• Deep niche knowledge</li>
                <li>• Industry insights</li>
                <li>• Helpful recommendations</li>
              </ul>
            </div>
            
            <div class="bg-card p-6 rounded-lg border">
              <h4 class="font-semibold text-foreground mb-3">Social Proof</h4>
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li>• User testimonials</li>
                <li>• Success stories</li>
                <li>• Community feedback</li>
                <li>• Expert endorsements</li>
              </ul>
            </div>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Conversion Optimization Techniques</h3>
        <div class="space-y-4">
          <div class="bg-info/10 p-6 rounded-lg border border-info/20">
            <h4 class="font-semibold text-info mb-4">High-Converting Elements:</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li>• <strong>Strong Headlines:</strong> Grab attention immediately</li>
                <li>• <strong>Benefit-Focused Copy:</strong> What's in it for them?</li>
                <li>• <strong>Clear CTAs:</strong> Tell them exactly what to do</li>
                <li>• <strong>Urgency/Scarcity:</strong> Create compelling reasons to act now</li>
              </ul>
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li>• <strong>Visual Proof:</strong> Screenshots, photos, videos</li>
                <li>• <strong>Risk Reversal:</strong> Guarantees, return policies</li>
                <li>• <strong>Multiple Touchpoints:</strong> Various ways to click through</li>
                <li>• <strong>Mobile Optimization:</strong> Ensure mobile-friendly experience</li>
              </ul>
            </div>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Performance Tracking</h3>
        <div class="space-y-4">
          <p class="text-muted-foreground">Monitor these key metrics to optimize your promotional efforts.</p>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div class="bg-card p-4 rounded-lg border text-center">
              <div class="text-2xl font-bold text-primary mb-2">CTR</div>
              <div class="text-sm text-muted-foreground mb-1">Click-Through Rate</div>
              <div class="text-xs text-success">Goal: >3%</div>
            </div>
            <div class="bg-card p-4 rounded-lg border text-center">
              <div class="text-2xl font-bold text-accent mb-2">CVR</div>
              <div class="text-sm text-muted-foreground mb-1">Conversion Rate</div>
              <div class="text-xs text-success">Goal: >2%</div>
            </div>
            <div class="bg-card p-4 rounded-lg border text-center">
              <div class="text-2xl font-bold text-success mb-2">EPC</div>
              <div class="text-sm text-muted-foreground mb-1">Earnings per Click</div>
              <div class="text-xs text-success">Goal: $0.50+</div>
            </div>
            <div class="bg-card p-4 rounded-lg border text-center">
              <div class="text-2xl font-bold text-info mb-2">ROI</div>
              <div class="text-sm text-muted-foreground mb-1">Return on Investment</div>
              <div class="text-xs text-success">Goal: 300%+</div>
            </div>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Common Promotion Mistakes</h3>
        <div class="bg-destructive/10 p-6 rounded-lg border border-destructive/20">
          <h4 class="font-semibold text-destructive mb-4">Avoid These Conversion Killers:</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li>• Being overly promotional</li>
              <li>• Promoting products you haven't used</li>
              <li>• Ignoring mobile optimization</li>
              <li>• Neglecting audience feedback</li>
            </ul>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li>• Using manipulative tactics</li>
              <li>• Focusing only on high commissions</li>
              <li>• Inconsistent promotional schedule</li>
              <li>• Poor tracking and analysis</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-primary/10 p-6 rounded-lg border border-primary/20 text-center">
          <h4 class="font-semibold text-foreground mb-2">Ready to Boost Your Conversions?</h4>
          <p class="text-muted-foreground mb-4">Apply these proven strategies consistently and watch your affiliate earnings grow month over month.</p>
        </div>
      </div>
    `
  },
  // Account & Security - Two-factor authentication setup
  {
    id: "two-factor-authentication-setup",
    title: "Two-factor authentication setup",
    slug: "two-factor-authentication-setup",
    excerpt: "Secure your affiliate account with two-factor authentication for enhanced protection",
    category: "Account & Security",
    readTime: "3 min read",
    lastUpdated: "2024-01-22",
    tags: ["security", "2fa", "account"],
    content: `
      <div class="space-y-6">
        <h2 class="text-2xl font-bold text-foreground">Setting Up Two-Factor Authentication (2FA)</h2>
        <p class="text-muted-foreground leading-relaxed">Two-factor authentication adds an extra layer of security to your affiliate account by requiring a second form of verification beyond your password. This guide will walk you through setting up 2FA to protect your earnings and account data.</p>
        
        <div class="bg-destructive/10 p-6 rounded-lg border border-destructive/20">
          <h3 class="font-semibold text-destructive mb-3">⚠️ Why 2FA is Critical</h3>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li>• Protects your commission earnings from unauthorized access</li>
            <li>• Prevents account takeover even if password is compromised</li>
            <li>• Required for accessing high-value campaigns</li>
            <li>• Reduces risk of fraudulent activity on your account</li>
            <li>• Maintains compliance with security best practices</li>
          </ul>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Available 2FA Methods</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div class="bg-card p-6 rounded-lg border">
            <div class="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <span class="text-primary font-bold">📱</span>
            </div>
            <h4 class="font-semibold text-foreground mb-3">Authenticator App</h4>
            <p class="text-sm text-muted-foreground mb-3">Most secure option using time-based codes</p>
            <div class="text-xs bg-success/20 text-success px-2 py-1 rounded mb-3">Recommended</div>
            <ul class="space-y-1 text-xs text-muted-foreground">
              <li>• Works offline</li>
              <li>• Time-based codes</li>
              <li>• Multiple app options</li>
              <li>• Backup codes available</li>
            </ul>
          </div>
          
          <div class="bg-card p-6 rounded-lg border">
            <div class="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mb-4">
              <span class="text-accent font-bold">📞</span>
            </div>
            <h4 class="font-semibold text-foreground mb-3">SMS Codes</h4>
            <p class="text-sm text-muted-foreground mb-3">Codes sent via text message</p>
            <div class="text-xs bg-warning/20 text-warning px-2 py-1 rounded mb-3">Less Secure</div>
            <ul class="space-y-1 text-xs text-muted-foreground">
              <li>• Easy to set up</li>
              <li>• Requires phone signal</li>
              <li>• Vulnerable to SIM swapping</li>
              <li>• Delivery delays possible</li>
            </ul>
          </div>
          
          <div class="bg-card p-6 rounded-lg border">
            <div class="w-12 h-12 bg-info/20 rounded-full flex items-center justify-center mb-4">
              <span class="text-info font-bold">🔑</span>
            </div>
            <h4 class="font-semibold text-foreground mb-3">Hardware Keys</h4>
            <p class="text-sm text-muted-foreground mb-3">Physical security keys (YubiKey, etc.)</p>
            <div class="text-xs bg-info/20 text-info px-2 py-1 rounded mb-3">Most Secure</div>
            <ul class="space-y-1 text-xs text-muted-foreground">
              <li>• Highest security level</li>
              <li>• Physical possession required</li>
              <li>• No battery needed</li>
              <li>• Additional cost</li>
            </ul>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Setting Up Authenticator App 2FA</h3>
        <div class="space-y-6">
          <p class="text-muted-foreground">We recommend using an authenticator app for the best balance of security and convenience.</p>
          
          <div class="bg-success/10 p-6 rounded-lg border border-success/20">
            <h4 class="font-semibold text-success mb-3">Recommended Authenticator Apps:</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li>• <strong>Google Authenticator:</strong> Simple, widely supported</li>
                <li>• <strong>Microsoft Authenticator:</strong> Backup and sync features</li>
                <li>• <strong>Authy:</strong> Multi-device sync, backup</li>
              </ul>
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li>• <strong>1Password:</strong> Integrated with password manager</li>
                <li>• <strong>LastPass Authenticator:</strong> Cloud backup</li>
                <li>• <strong>Duo Mobile:</strong> Push notifications</li>
              </ul>
            </div>
          </div>
          
          <div class="space-y-4">
            <div class="bg-card p-6 rounded-lg border">
              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span class="text-primary font-bold text-sm">1</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-foreground mb-2">Download Authenticator App</h4>
                  <p class="text-sm text-muted-foreground">Install your chosen authenticator app from your device's app store.</p>
                </div>
              </div>
            </div>
            
            <div class="bg-card p-6 rounded-lg border">
              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span class="text-primary font-bold text-sm">2</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-foreground mb-2">Access Security Settings</h4>
                  <p class="text-sm text-muted-foreground mb-3">Navigate to your account security settings:</p>
                  <div class="bg-muted/30 p-3 rounded text-sm text-muted-foreground font-mono">
                    Account → Settings → Security → Two-Factor Authentication
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-card p-6 rounded-lg border">
              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span class="text-primary font-bold text-sm">3</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-foreground mb-2">Scan QR Code</h4>
                  <p class="text-sm text-muted-foreground mb-3">Use your authenticator app to scan the QR code displayed on screen.</p>
                  <div class="bg-info/10 p-3 rounded border border-info/20">
                    <p class="text-xs text-muted-foreground"><strong>Alternative:</strong> If you can't scan the QR code, manually enter the provided setup key into your authenticator app.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-card p-6 rounded-lg border">
              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span class="text-primary font-bold text-sm">4</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-foreground mb-2">Verify Setup</h4>
                  <p class="text-sm text-muted-foreground mb-3">Enter the 6-digit code from your authenticator app to confirm setup.</p>
                  <div class="bg-warning/10 p-3 rounded border border-warning/20">
                    <p class="text-xs text-muted-foreground"><strong>Important:</strong> Codes change every 30 seconds. Make sure to use the current code.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-card p-6 rounded-lg border">
              <div class="flex items-start space-x-4">
                <div class="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span class="text-primary font-bold text-sm">5</span>
                </div>
                <div class="flex-1">
                  <h4 class="font-semibold text-foreground mb-2">Save Backup Codes</h4>
                  <p class="text-sm text-muted-foreground mb-3">Download and securely store your backup codes for emergency access.</p>
                  <div class="bg-destructive/10 p-3 rounded border border-destructive/20">
                    <p class="text-xs text-muted-foreground"><strong>Critical:</strong> Store backup codes in a secure location. You'll need them if you lose access to your authenticator app.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Using 2FA for Login</h3>
        <div class="space-y-4">
          <p class="text-muted-foreground">Once 2FA is enabled, you'll need to provide both your password and a verification code when logging in.</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-card p-6 rounded-lg border">
              <h4 class="font-semibold text-foreground mb-3">Login Process</h4>
              <ol class="space-y-2 text-sm text-muted-foreground">
                <li><strong>Step 1:</strong> Enter your email and password</li>
                <li><strong>Step 2:</strong> Open your authenticator app</li>
                <li><strong>Step 3:</strong> Enter the 6-digit code</li>
                <li><strong>Step 4:</strong> Click "Verify" to complete login</li>
              </ol>
            </div>
            
            <div class="bg-card p-6 rounded-lg border">
              <h4 class="font-semibold text-foreground mb-3">Code Requirements</h4>
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li>• Codes are 6 digits long</li>
                <li>• New code generated every 30 seconds</li>
                <li>• Case sensitive (numbers only)</li>
                <li>• No spaces or special characters</li>
              </ul>
            </div>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Backup and Recovery</h3>
        <div class="space-y-4">
          <div class="bg-warning/10 p-6 rounded-lg border border-warning/20">
            <h4 class="font-semibold text-warning mb-4">Emergency Access Methods:</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 class="font-medium text-foreground mb-3">Backup Codes</h5>
                <ul class="space-y-2 text-sm text-muted-foreground">
                  <li>• Use if authenticator app unavailable</li>
                  <li>• Each code works only once</li>
                  <li>• Store in secure, accessible location</li>
                  <li>• Generate new codes after use</li>
                </ul>
              </div>
              <div>
                <h5 class="font-medium text-foreground mb-3">Account Recovery</h5>
                <ul class="space-y-2 text-sm text-muted-foreground">
                  <li>• Contact support with ID verification</li>
                  <li>• Provide account details for verification</li>
                  <li>• Process may take 24-48 hours</li>
                  <li>• Required for complete app loss</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Managing 2FA Settings</h3>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-card p-6 rounded-lg border">
              <h4 class="font-semibold text-foreground mb-3">Regular Maintenance</h4>
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li>• Test backup codes quarterly</li>
                <li>• Update phone numbers if using SMS</li>
                <li>• Sync authenticator apps across devices</li>
                <li>• Review trusted devices list</li>
              </ul>
            </div>
            
            <div class="bg-card p-6 rounded-lg border">
              <h4 class="font-semibold text-foreground mb-3">When to Reset</h4>
              <ul class="space-y-2 text-sm text-muted-foreground">
                <li>• Lost or broken phone</li>
                <li>• Compromised authenticator app</li>
                <li>• Switching to new device</li>
                <li>• Suspected security breach</li>
              </ul>
            </div>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Troubleshooting Common Issues</h3>
        <div class="space-y-4">
          <div class="bg-card p-6 rounded-lg border">
            <h4 class="font-semibold text-foreground mb-3">Code Not Working</h4>
            <div class="space-y-3 text-sm text-muted-foreground">
              <p><strong>Possible causes and solutions:</strong></p>
              <ul class="space-y-2 ml-4">
                <li>• <strong>Time sync issue:</strong> Check device time settings, ensure automatic time</li>
                <li>• <strong>Wrong code:</strong> Wait for new code (30-second intervals)</li>
                <li>• <strong>App malfunction:</strong> Restart authenticator app</li>
                <li>• <strong>Network delay:</strong> Try again in a few moments</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-card p-6 rounded-lg border">
            <h4 class="font-semibold text-foreground mb-3">Lost Authenticator Access</h4>
            <div class="space-y-3 text-sm text-muted-foreground">
              <p><strong>Recovery steps:</strong></p>
              <ol class="space-y-2 ml-4">
                <li>1. Try using a backup code first</li>
                <li>2. Check if app is installed on other devices</li>
                <li>3. Contact support with account verification</li>
                <li>4. Complete identity verification process</li>
              </ol>
            </div>
          </div>
        </div>
        
        <h3 class="text-xl font-semibold text-foreground">Security Best Practices</h3>
        <div class="bg-info/10 p-6 rounded-lg border border-info/20">
          <h4 class="font-semibold text-info mb-4">Additional Security Measures:</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li>• Use unique, strong passwords</li>
              <li>• Enable login notifications</li>
              <li>• Regularly review account activity</li>
              <li>• Keep authenticator app updated</li>
            </ul>
            <ul class="space-y-2 text-sm text-muted-foreground">
              <li>• Don't share backup codes</li>
              <li>• Log out from public computers</li>
              <li>• Monitor for suspicious activity</li>
              <li>• Use trusted devices when possible</li>
            </ul>
          </div>
        </div>
        
        <div class="bg-primary/10 p-6 rounded-lg border border-primary/20 text-center">
          <h4 class="font-semibold text-foreground mb-2">Secure Your Success</h4>
          <p class="text-muted-foreground mb-4">Two-factor authentication is a small step that provides massive protection for your affiliate earnings and account security.</p>
        </div>
      </div>
    `
  }
];

// Helper functions to get content by category or slug
export const getGuidesByCategory = (category: string): HelpGuide[] => {
  return helpGuides.filter(guide => guide.category === category);
};

export const getGuideBySlug = (slug: string): HelpGuide | undefined => {
  return helpGuides.find(guide => guide.slug === slug);
};

export const getAllCategories = (): string[] => {
  return [...new Set(helpGuides.map(guide => guide.category))];
};