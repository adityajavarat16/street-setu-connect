import Header from '@/components/Header';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. What Are Cookies</h2>
              <p className="mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
                They are widely used to make websites work more efficiently and provide information to website owners.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Cookies</h2>
              <p className="mb-4">
                SupplySetu uses cookies to enhance your browsing experience and provide personalized services. 
                We use cookies for the following purposes:
              </p>
              
              <h3 className="text-xl font-medium mb-2">2.1 Essential Cookies</h3>
              <p className="mb-4">
                These cookies are necessary for the website to function properly. They enable basic features like 
                page navigation, authentication, and access to secure areas of the website.
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>User authentication and session management</li>
                <li>Security and fraud prevention</li>
                <li>Website functionality and navigation</li>
                <li>Form submission and data processing</li>
              </ul>

              <h3 className="text-xl font-medium mb-2">2.2 Performance Cookies</h3>
              <p className="mb-4">
                These cookies collect information about how visitors use our website, helping us improve its performance.
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Page load times and website performance</li>
                <li>Error tracking and debugging</li>
                <li>Usage statistics and analytics</li>
                <li>Feature usage and user behavior patterns</li>
              </ul>

              <h3 className="text-xl font-medium mb-2">2.3 Functional Cookies</h3>
              <p className="mb-4">
                These cookies enable enhanced functionality and personalization.
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Language preferences</li>
                <li>Location-based services</li>
                <li>Personalized content and recommendations</li>
                <li>User interface preferences</li>
              </ul>

              <h3 className="text-xl font-medium mb-2">2.4 Targeting/Advertising Cookies</h3>
              <p className="mb-4">
                These cookies are used to deliver relevant advertisements and track advertising effectiveness.
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>Targeted advertisements</li>
                <li>Social media integration</li>
                <li>Third-party advertising partners</li>
                <li>Marketing campaign tracking</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Types of Cookies We Use</h2>
              
              <div className="bg-card p-6 rounded-lg border mb-6">
                <h4 className="font-semibold mb-2">Session Cookies</h4>
                <p className="text-sm text-muted-foreground">
                  Temporary cookies that are deleted when you close your browser. Used for authentication and navigation.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border mb-6">
                <h4 className="font-semibold mb-2">Persistent Cookies</h4>
                <p className="text-sm text-muted-foreground">
                  Cookies that remain on your device for a set period. Used for preferences and analytics.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border mb-6">
                <h4 className="font-semibold mb-2">First-Party Cookies</h4>
                <p className="text-sm text-muted-foreground">
                  Cookies set directly by SupplySetu for website functionality and user experience.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg border">
                <h4 className="font-semibold mb-2">Third-Party Cookies</h4>
                <p className="text-sm text-muted-foreground">
                  Cookies set by external services like analytics providers and payment processors.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Third-Party Services</h2>
              <p className="mb-4">
                We work with trusted third-party services that may place cookies on your device:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
                <li><strong>Payment Processors:</strong> For secure payment processing</li>
                <li><strong>Authentication Services:</strong> For secure user login and account management</li>
                <li><strong>Cloud Services:</strong> For data storage and application hosting</li>
                <li><strong>Communication Tools:</strong> For chat and messaging functionality</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Managing Your Cookie Preferences</h2>
              
              <h3 className="text-xl font-medium mb-2">5.1 Browser Settings</h3>
              <p className="mb-4">
                Most web browsers allow you to control cookies through their settings. You can:
              </p>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>View and delete existing cookies</li>
                <li>Block cookies from specific websites</li>
                <li>Block third-party cookies</li>
                <li>Clear all cookies when you close your browser</li>
                <li>Set up notifications when cookies are being used</li>
              </ul>

              <h3 className="text-xl font-medium mb-2">5.2 Cookie Consent</h3>
              <p className="mb-4">
                When you first visit our website, you'll see a cookie consent banner. You can choose to accept 
                all cookies or customize your preferences.
              </p>

              <h3 className="text-xl font-medium mb-2">5.3 Opt-Out Links</h3>
              <div className="bg-card p-6 rounded-lg border">
                <p className="mb-2"><strong>Google Analytics:</strong> <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary hover:underline">Opt-out here</a></p>
                <p><strong>Advertising Cookies:</strong> Visit <a href="https://www.youronlinechoices.com/" className="text-primary hover:underline">Your Online Choices</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Impact of Disabling Cookies</h2>
              <p className="mb-4">
                Disabling cookies may affect your experience on SupplySetu:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You may need to log in repeatedly</li>
                <li>Some features may not work properly</li>
                <li>Personalized content may not be available</li>
                <li>Website performance may be reduced</li>
                <li>Some security features may be disabled</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Data Retention</h2>
              <p className="mb-4">
                Different cookies have different retention periods:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Session cookies:</strong> Deleted when you close your browser</li>
                <li><strong>Authentication cookies:</strong> 30 days or until logout</li>
                <li><strong>Preference cookies:</strong> 1 year</li>
                <li><strong>Analytics cookies:</strong> 2 years</li>
                <li><strong>Marketing cookies:</strong> Varies by provider (typically 30-90 days)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Updates to This Policy</h2>
              <p className="mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices or applicable laws. 
                We will notify you of any significant changes by posting the updated policy on our website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Contact Us</h2>
              <p className="mb-4">
                If you have any questions about our use of cookies, please contact us at:
              </p>
              <div className="bg-card p-6 rounded-lg border">
                <p><strong>Email:</strong> privacy@supplysetu.in</p>
                <p><strong>Phone:</strong> +91 9876543210</p>
                <p><strong>Address:</strong> Bengaluru, Karnataka, India</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CookiePolicy;