import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero text-white">
          <div className="container text-center space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Terms of Service
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              These terms govern your use of AffiliateHub's platform and services. 
              Please read them carefully.
            </p>
            <p className="text-sm opacity-75">
              Last updated: December 2024
            </p>
          </div>
        </section>

        {/* Terms Content */}
        <section className="py-20">
          <div className="container max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none space-y-12">
              <div>
                <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    By accessing or using AffiliateHub's platform and services ("Services"), 
                    you agree to be bound by these Terms of Service ("Terms"). If you disagree 
                    with any part of these terms, then you may not access the Services.
                  </p>
                  <p>
                    These Terms apply to all visitors, users, affiliates, and advertisers of 
                    the platform. We reserve the right to modify these Terms at any time, 
                    and such modifications shall be effective immediately upon posting.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">2. User Accounts and Responsibilities</h2>
                <div className="space-y-4 text-muted-foreground">
                  <h3 className="text-lg font-semibold text-foreground">Account Registration</h3>
                  <p>
                    To use our Services, you must create an account by providing accurate, 
                    complete, and up-to-date information. You are responsible for maintaining 
                    the confidentiality of your account credentials.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-foreground">User Conduct</h3>
                  <p>You agree not to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Use the platform for any unlawful purposes or fraudulent activities</li>
                    <li>Engage in spam, deceptive marketing practices, or misleading advertising</li>
                    <li>Violate any applicable laws or regulations</li>
                    <li>Interfere with or disrupt the platform's functionality</li>
                    <li>Attempt to gain unauthorized access to other user accounts</li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">3. Affiliate Program Terms</h2>
                <div className="space-y-4 text-muted-foreground">
                  <h3 className="text-lg font-semibold text-foreground">Affiliate Obligations</h3>
                  <p>As an affiliate, you agree to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Promote campaigns honestly and accurately</li>
                    <li>Comply with all campaign-specific terms and conditions</li>
                    <li>Not engage in self-referrals or fraudulent activities</li>
                    <li>Maintain appropriate disclosure of your affiliate relationship</li>
                  </ul>
                  
                  <h3 className="text-lg font-semibold text-foreground">Commission Structure</h3>
                  <p>
                    Commission rates are set by advertisers and clearly displayed for each campaign. 
                    Commissions are earned only on valid, verified conversions. We reserve the right 
                    to investigate and reverse commissions for fraudulent or invalid activities.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">4. Advertiser Terms</h2>
                <div className="space-y-4 text-muted-foreground">
                  <h3 className="text-lg font-semibold text-foreground">Campaign Management</h3>
                  <p>
                    Advertisers are responsible for providing accurate campaign information, 
                    setting appropriate commission rates, and honoring all approved affiliate 
                    commissions.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-foreground">Payment Obligations</h3>
                  <p>
                    Advertisers agree to pay all earned commissions according to the agreed-upon 
                    payment schedule. Failure to pay commissions may result in account suspension 
                    or termination.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">5. Payment Terms</h2>
                <div className="space-y-4 text-muted-foreground">
                  <h3 className="text-lg font-semibold text-foreground">Affiliate Payments</h3>
                  <p>
                    Affiliate commissions are paid according to the schedule specified in each 
                    campaign. Minimum payout thresholds may apply. We reserve the right to 
                    withhold payments for suspicious or fraudulent activity.
                  </p>
                  
                  <h3 className="text-lg font-semibold text-foreground">Platform Fees</h3>
                  <p>
                    AffiliateHub charges a service fee on successful transactions. All fees 
                    are clearly disclosed and agreed upon during the registration process.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">6. Intellectual Property</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    The AffiliateHub platform, including its design, functionality, and content, 
                    is protected by intellectual property laws. You may not copy, modify, 
                    distribute, or create derivative works without our written permission.
                  </p>
                  <p>
                    Advertisers grant affiliates limited rights to use campaign materials 
                    solely for promotional purposes within the scope of the affiliate program.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">7. Privacy and Data Protection</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Your privacy is important to us. Our use of your personal information is 
                    governed by our Privacy Policy, which is incorporated into these Terms by reference.
                  </p>
                  <p>
                    By using our Services, you consent to the collection, use, and sharing of 
                    your information as described in our Privacy Policy.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">8. Termination</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Either party may terminate their account at any time. We reserve the right 
                    to suspend or terminate accounts for violation of these Terms, fraudulent 
                    activity, or any other reason at our sole discretion.
                  </p>
                  <p>
                    Upon termination, you must cease all use of our Services and may forfeit 
                    any unpaid commissions if termination is due to a violation of these Terms.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">9. Disclaimers and Limitations</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Our Services are provided "as is" without any warranties, express or implied. 
                    We do not guarantee continuous, uninterrupted, or error-free operation of 
                    the platform.
                  </p>
                  <p>
                    To the maximum extent permitted by law, AffiliateHub shall not be liable 
                    for any indirect, incidental, special, or consequential damages arising 
                    from your use of our Services.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">10. Governing Law</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    These Terms shall be governed by and construed in accordance with the laws 
                    of the State of California, without regard to its conflict of law provisions.
                  </p>
                  <p>
                    Any disputes arising under these Terms shall be resolved through binding 
                    arbitration in San Francisco, California.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-4">11. Contact Information</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    If you have questions about these Terms of Service, please contact us at:
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p><strong>Email:</strong> legal@affiliatehub.com</p>
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

export default Terms;