import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, MessageCircle } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-hero text-white">
          <div className="container text-center space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Get In Touch
            </h1>
            <p className="text-xl opacity-90 max-w-3xl mx-auto">
              Have questions about our platform? Want to become a partner? We'd love to hear from you. 
              Our team is here to help you succeed.
            </p>
          </div>
        </section>

        {/* Contact Options */}
        <section className="py-20">
          <div className="container space-y-16">
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="hover:shadow-glow transition-shadow text-center">
                <CardContent className="p-8 space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <MessageCircle className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl">Live Chat</h3>
                  <p className="text-muted-foreground">
                    Get instant answers to your questions
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Available 24/7
                  </p>
                  <Button className="w-full">Start Chat</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-glow transition-shadow text-center">
                <CardContent className="p-8 space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Mail className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl">Email Support</h3>
                  <p className="text-muted-foreground">
                    Send us a detailed message
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Response within 24 hours
                  </p>
                  <Button variant="outline" className="w-full">support@affiliatehub.com</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-glow transition-shadow text-center">
                <CardContent className="p-8 space-y-4">
                  <div className="flex justify-center">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Phone className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-xl">Phone Support</h3>
                  <p className="text-muted-foreground">
                    Speak with our team directly
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Mon-Fri, 9AM-6PM EST
                  </p>
                  <Button variant="outline" className="w-full">+1 (555) 123-4567</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20 bg-muted/30">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-16">
              {/* Contact Form */}
              <Card className="hover:shadow-glow transition-shadow">
                <CardHeader>
                  <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="support">Technical Support</SelectItem>
                        <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                        <SelectItem value="billing">Billing Question</SelectItem>
                        <SelectItem value="feedback">Feedback</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us how we can help you..."
                      className="min-h-32"
                    />
                  </div>
                  
                  <Button size="lg" className="w-full">Send Message</Button>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                  <p className="text-muted-foreground text-lg">
                    We're here to help you succeed. Reach out through any of these channels 
                    and we'll get back to you as quickly as possible.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-muted-foreground">support@affiliatehub.com</p>
                      <p className="text-muted-foreground">partnerships@affiliatehub.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p className="text-muted-foreground">+1 (555) 123-4567</p>
                      <p className="text-muted-foreground text-sm">Monday - Friday, 9AM - 6PM EST</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Office</h3>
                      <p className="text-muted-foreground">
                        123 Innovation Drive<br />
                        San Francisco, CA 94107<br />
                        United States
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Business Hours</h3>
                      <p className="text-muted-foreground">
                        Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                        Saturday - Sunday: Closed
                      </p>
                    </div>
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

export default Contact;