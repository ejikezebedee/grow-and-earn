import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero text-white">
          <div className="container text-center space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Privacy Policy
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, 
              use, and protect your personal information.
            </p>
            <p className="text-sm opacity-75">
              Last updated: December 2024
            </p>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-20">
          <div className="container max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none space-y-12">
              <div>
                <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                <div className="space-y-4 text-muted-foreground">
                  <h3 className="text-lg font-semibold text-foreground">Personal Information</h3>
                  <p>
                    When you register for AffiliateHub, we collect information such as your name, 
                    email address, company name, and payment information. This information is 
                    necessary to provide our services and process payments.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-foreground">Usage Data</h3>
                  <p>
                    We collect information about how you use our platform, including pages visited, 
                    campaigns viewed, clicks generated, and performance metrics. This helps us 
                    improve our services and provide better analytics.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-foreground">Technical Information</h3>
                  <p>
                    We automatically collect certain technical information, including IP addresses, 
                    browser type, device information, and cookies. This information helps us 
                    ensure platform security and optimize performance.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>We use your information to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Provide and maintain our affiliate marketing platform</li>
                    <li>Process payments and manage your account</li>
                    <li>Send you important updates and notifications</li>
                    <li>Improve our services and develop new features</li>
                    <li>Prevent fraud and ensure platform security</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We do not sell, trade, or otherwise transfer your personal information to 
                    third parties without your consent, except in the following circumstances:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>With your explicit consent</li>
                    <li>To service providers who help us operate our platform</li>
                    <li>When required by law or to protect our rights</li>
                    <li>In connection with a merger, acquisition, or sale of assets</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We implement industry-standard security measures to protect your personal 
                    information, including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Encryption of data in transit and at rest</li>
                    <li>Regular security audits and penetration testing</li>
                    <li>Access controls and authentication mechanisms</li>
                    <li>Employee training on data protection practices</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">5. Cookies and Tracking</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We use cookies and similar tracking technologies to enhance your experience 
                    on our platform. These help us:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Remember your preferences and settings</li>
                    <li>Analyze platform usage and performance</li>
                    <li>Track affiliate link clicks and conversions</li>
                    <li>Provide personalized content and recommendations</li>
                  </ul>
                  <p>
                    You can control cookie settings through your browser, though some features 
                    may not work properly if cookies are disabled.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>You have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access and review your personal information</li>
                    <li>Correct inaccurate or incomplete data</li>
                    <li>Delete your account and personal information</li>
                    <li>Object to certain data processing activities</li>
                    <li>Data portability in machine-readable format</li>
                  </ul>
                  <p>
                    To exercise these rights, please contact us at privacy@affiliatehub.com.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">7. International Transfers</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Your information may be transferred to and processed in countries other than 
                    your country of residence. We ensure appropriate safeguards are in place to 
                    protect your data in accordance with this privacy policy.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">8. Changes to This Policy</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    We may update this privacy policy from time to time. We will notify you of 
                    any material changes by posting the new policy on this page and updating 
                    the "Last updated" date.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    If you have questions about this privacy policy or our data practices, 
                    please contact us at:
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p><strong>Email:</strong> privacy@affiliatehub.com</p>
                    <p><strong>Address:</strong> 123 Innovation Drive, San Francisco, CA 94107</p>
                    <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;