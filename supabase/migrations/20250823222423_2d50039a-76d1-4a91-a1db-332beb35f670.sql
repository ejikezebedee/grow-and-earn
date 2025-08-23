-- Insert test campaigns for testing the affiliate system
INSERT INTO public.campaigns (
  id,
  title, 
  description, 
  tracking_url, 
  commission_type, 
  commission_value, 
  banner_url, 
  status,
  advertiser_id
) VALUES 
(
  gen_random_uuid(),
  'E-commerce Fashion Store',
  'Promote trendy fashion items with high conversion rates. Perfect for lifestyle and fashion influencers.',
  'https://example-fashion-store.com',
  'Revenue Share',
  15.0,
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop',
  'active',
  NULL
),
(
  gen_random_uuid(),
  'Digital Marketing Course',
  'Help people learn digital marketing skills. High-value course with excellent student reviews.',
  'https://example-marketing-course.com',
  'CPA',
  50.0,
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop',
  'active',
  NULL
),
(
  gen_random_uuid(),
  'Fitness App Subscription',
  'Promote a popular fitness app with workout plans and nutrition tracking.',
  'https://example-fitness-app.com',
  'CPC',
  2.5,
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',
  'active',
  NULL
),
(
  gen_random_uuid(),
  'SaaS Project Management Tool',
  'Business productivity software with recurring commissions for successful referrals.',
  'https://example-saas-tool.com',
  'Revenue Share',
  25.0,
  'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop',
  'active',
  NULL
);

-- Update blog posts with better content for testing
UPDATE public.blog_posts 
SET 
  content = '<h2>Getting Started with Affiliate Marketing</h2>
<p>Affiliate marketing is one of the most effective ways to earn passive income online. Whether you''re a blogger, social media influencer, or just someone looking to monetize your online presence, our platform makes it easy to get started.</p>

<h3>How It Works</h3>
<ol>
<li><strong>Sign Up</strong> - Create your affiliate account in under 2 minutes</li>
<li><strong>Browse Campaigns</strong> - Choose from hundreds of active campaigns</li>
<li><strong>Get Your Links</strong> - Generate unique tracking links for each campaign</li>
<li><strong>Share & Earn</strong> - Promote the products and earn commissions</li>
</ol>

<h3>Tips for Success</h3>
<p>The key to successful affiliate marketing is choosing campaigns that align with your audience. Focus on products you genuinely believe in and that provide value to your followers.</p>

<p>Track your performance regularly and optimize your strategy based on what works best for your audience.</p>'
WHERE slug = 'welcome-to-affiliatehub';

UPDATE public.blog_posts 
SET 
  content = '<h2>Maximize Your Affiliate Earnings</h2>
<p>Here are the top 5 strategies successful affiliates use to maximize their earnings on our platform:</p>

<h3>1. Choose Quality Over Quantity</h3>
<p>Focus on campaigns with products you truly believe in. Authentic recommendations convert better and build long-term trust with your audience.</p>

<h3>2. Know Your Audience</h3>
<p>Understanding your audience demographics, interests, and pain points helps you select the most relevant campaigns.</p>

<h3>3. Create Valuable Content</h3>
<p>Don''t just post affiliate links. Create helpful content like reviews, tutorials, and comparisons that provide real value.</p>

<h3>4. Track and Optimize</h3>
<p>Use our dashboard analytics to see which campaigns perform best and double down on what works.</p>

<h3>5. Be Consistent</h3>
<p>Consistency in content creation and promotion is key to building a sustainable affiliate income stream.</p>

<p>Remember, success in affiliate marketing takes time and patience, but with the right strategy, you can build a significant income stream.</p>'
WHERE slug = 'top-5-affiliate-marketing-tips';

UPDATE public.blog_posts 
SET 
  content = '<h2>Selecting High-Converting Campaigns</h2>
<p>Not all campaigns are created equal. Here''s how to identify and choose campaigns that will maximize your conversion rates and earnings:</p>

<h3>Look for These Key Indicators</h3>
<ul>
<li><strong>Commission Structure</strong> - Higher commissions aren''t always better if conversion rates are low</li>
<li><strong>Product Quality</strong> - Research the product/service thoroughly before promoting</li>
<li><strong>Brand Reputation</strong> - Established brands often have higher conversion rates</li>
<li><strong>Landing Page Quality</strong> - A well-designed, optimized landing page is crucial</li>
</ul>

<h3>Commission Types Explained</h3>
<p><strong>CPC (Cost Per Click)</strong> - You earn for each click on your referral link. Lower risk but typically lower payouts.</p>
<p><strong>CPA (Cost Per Action)</strong> - You earn when someone completes a specific action like signing up or making a purchase.</p>
<p><strong>Revenue Share</strong> - You earn a percentage of the sale amount. Highest potential but requires actual sales.</p>

<h3>Testing and Optimization</h3>
<p>Start with a few carefully selected campaigns and track their performance. Use A/B testing for different promotional approaches and scale up what works best.</p>'
WHERE slug = 'how-to-choose-right-campaigns';