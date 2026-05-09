"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: January 2024
          </p>
        </div>

        <Card>
          <CardContent className="p-8 space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing or using HireIQ (&quot;the Platform&quot;), you agree to be bound by these 
                Terms of Service. If you do not agree to these terms, please do not use the Platform. 
                These terms apply to all visitors, users, and others who access or use the Platform.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                HireIQ is an AI-powered recruitment platform that connects job seekers with employers. 
                Our services include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
                <li>Job posting and application management</li>
                <li>AI-powered resume analysis and matching</li>
                <li>Candidate ranking and recommendations</li>
                <li>Interview preparation tools</li>
                <li>Professional networking features</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-4">3. User Accounts</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  <strong className="text-foreground">3.1 Registration:</strong> To access certain 
                  features, you must create an account. You agree to provide accurate, current, and 
                  complete information during registration.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-foreground">3.2 Account Security:</strong> You are responsible 
                  for maintaining the confidentiality of your account credentials and for all activities 
                  that occur under your account.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-foreground">3.3 Account Termination:</strong> We reserve the 
                  right to suspend or terminate your account at any time for violations of these terms 
                  or for any other reason at our discretion.
                </p>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-4">4. User Conduct</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You agree not to use the Platform to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
                <li>Post false, misleading, or fraudulent content</li>
                <li>Harass, abuse, or discriminate against other users</li>
                <li>Upload viruses, malware, or harmful code</li>
                <li>Scrape, crawl, or data-mine the Platform without authorization</li>
                <li>Impersonate any person or entity</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-4">5. Content and Intellectual Property</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  <strong className="text-foreground">5.1 Your Content:</strong> You retain ownership 
                  of content you submit to the Platform. By submitting content, you grant us a 
                  non-exclusive, worldwide, royalty-free license to use, reproduce, and display your 
                  content in connection with our services.
                </p>
                <p className="leading-relaxed">
                  <strong className="text-foreground">5.2 Platform Content:</strong> All content 
                  provided by HireIQ, including text, graphics, logos, and software, is our property 
                  and protected by copyright and other intellectual property laws.
                </p>
              </div>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-4">6. AI Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our AI-powered features, including resume analysis and job matching, are provided 
                to assist users but do not guarantee employment or hiring outcomes. AI-generated 
                content should be reviewed by users before use. We are not responsible for decisions 
                made based on AI recommendations.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Your use of the Platform is also governed by our{" "}
                <Link href="/privacy" className="text-indigo-600 hover:underline">
                  Privacy Policy
                </Link>
                . Please review our Privacy Policy to understand how we collect, use, and protect 
                your personal information.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                To the maximum extent permitted by law, HireIQ shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, or any loss of profits or 
                revenues, whether incurred directly or indirectly, arising from your use of the Platform.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-4">9. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Platform is provided &quot;as is&quot; without warranties of any kind, either express or 
                implied. We do not warrant that the Platform will be uninterrupted, secure, or error-free.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-4">10. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to modify these Terms of Service at any time. We will notify 
                users of significant changes via email or through the Platform. Continued use of the 
                Platform after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-4">11. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the 
                State of California, without regard to its conflict of law provisions.
              </p>
            </section>

            <Separator />

            <section>
              <h2 className="text-xl font-semibold mb-4">12. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="mt-4 text-muted-foreground">
                <p>Email: legal@hireiq.com</p>
                <p>Address: 123 Market Street, Suite 456, San Francisco, CA 94105</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
