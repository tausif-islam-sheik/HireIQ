"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: January 2024
          </p>
        </div>

        <Card>
          <CardContent className="p-8 space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                HireIQ (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
                This Privacy Policy explains how we collect, use, disclose, and
                safeguard your information when you use our AI-powered recruitment
                platform. Please read this policy carefully. By accessing or using
                our services, you agree to the practices described in this policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  <strong className="text-foreground">Personal Information:</strong> We collect
                  information that you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Name, email address, and contact information</li>
                  <li>Resume/CV and professional qualifications</li>
                  <li>Employment history and educational background</li>
                  <li>Profile pictures and other uploaded content</li>
                  <li>Communication preferences</li>
                </ul>
                <p className="leading-relaxed">
                  <strong className="text-foreground">Usage Information:</strong> We automatically
                  collect certain information about your device and how you interact
                  with our platform, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>IP address and device identifiers</li>
                  <li>Browser type and operating system</li>
                  <li>Pages visited and features used</li>
                  <li>Time spent on the platform</li>
                  <li>Referral sources</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
                <li>Providing and maintaining our recruitment services</li>
                <li>Matching candidates with relevant job opportunities</li>
                <li>Processing job applications and facilitating recruitment</li>
                <li>Improving our AI algorithms and matching accuracy</li>
                <li>Communicating with you about your account and opportunities</li>
                <li>Sending marketing communications (with your consent)</li>
                <li>Analyzing usage patterns and improving our platform</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. AI and Data Processing</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our platform uses artificial intelligence to analyze resumes, generate
                job descriptions, and match candidates with opportunities. This
                processing may involve:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4 text-muted-foreground">
                <li>Extracting skills and qualifications from resumes</li>
                <li>Comparing candidate profiles with job requirements</li>
                <li>Generating insights and recommendations</li>
                <li>Creating anonymized aggregate statistics</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We implement safeguards to prevent bias in our AI systems and regularly
                audit our algorithms for fairness and accuracy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. Information Sharing</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may share your information with:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
                <li>
                  <strong className="text-foreground">Employers and Recruiters:</strong> When you
                  apply for jobs, your profile and application materials are shared
                  with the respective employers.
                </li>
                <li>
                  <strong className="text-foreground">Service Providers:</strong> Third-party vendors
                  who help us operate our platform (e.g., cloud hosting, analytics).
                </li>
                <li>
                  <strong className="text-foreground">Legal Requirements:</strong> When required by
                  law, court order, or government request.
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We do not sell your personal information to third parties for marketing
                purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures to
                protect your personal information against unauthorized access,
                alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 mt-4 text-muted-foreground">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and penetration testing</li>
                <li>Access controls and authentication mechanisms</li>
                <li>Employee training on data protection</li>
                <li>Incident response procedures</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Depending on your location, you may have certain rights regarding your
                personal information:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
                <li>Access and review your personal information</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Request deletion of your personal information</li>
                <li>Object to certain processing activities</li>
                <li>Export your data in a portable format</li>
                <li>Withdraw consent where applicable</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise these rights, please contact us at privacy@hireiq.com.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">8. Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar technologies to enhance your experience,
                analyze usage, and deliver personalized content. You can control
                cookies through your browser settings. For more information, please
                review our Cookie Policy.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">9. Children&apos;s Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our services are not intended for individuals under 16 years of age.
                We do not knowingly collect personal information from children. If you
                believe we have inadvertently collected such information, please
                contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">10. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify
                you of any significant changes by posting the new policy on this page
                and updating the &quot;Last updated&quot; date. We encourage you to review this
                policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">11. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have any questions or concerns about this Privacy Policy or
                our data practices, please contact us at:
              </p>
              <div className="mt-4 text-muted-foreground">
                <p>Email: privacy@hireiq.com</p>
                <p>Address: 123 Market Street, Suite 456, San Francisco, CA 94105</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
