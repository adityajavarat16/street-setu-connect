import Header from '@/components/Header';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
          
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using SupplySetu ("the Platform"), you accept and agree to be bound by the terms and 
                provisions of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p className="mb-4">
                SupplySetu is a digital platform that connects street food vendors with raw material suppliers across India. 
                We provide tools for product discovery, price comparison, ordering, and communication between vendors and suppliers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. User Registration and Accounts</h2>
              <h3 className="text-xl font-medium mb-2">3.1 Eligibility</h3>
              <p className="mb-4">
                To use SupplySetu, you must be at least 18 years old and have the legal capacity to enter into contracts. 
                You must be a legitimate business operator (vendor or supplier) in India.
              </p>
              
              <h3 className="text-xl font-medium mb-2">3.2 Account Responsibility</h3>
              <ul className="list-disc pl-6 space-y-2 mb-4">
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You must provide accurate and complete information during registration</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
                <li>You are responsible for all activities that occur under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. User Conduct</h2>
              <p className="mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Use the platform for any illegal or unauthorized purpose</li>
                <li>Interfere with or disrupt the platform or servers</li>
                <li>Post false, misleading, or deceptive content</li>
                <li>Engage in fraudulent activities or transactions</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Upload malicious code or attempt to hack the platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Transactions and Payments</h2>
              <h3 className="text-xl font-medium mb-2">5.1 Platform Role</h3>
              <p className="mb-4">
                SupplySetu facilitates connections between vendors and suppliers but is not a party to the actual transactions. 
                All transactions are directly between users.
              </p>
              
              <h3 className="text-xl font-medium mb-2">5.2 Transaction Terms</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Users are responsible for fulfilling their contractual obligations</li>
                <li>Payment terms are agreed upon between transacting parties</li>
                <li>Quality disputes should be resolved directly between parties</li>
                <li>We may assist in dispute resolution but are not obligated to do so</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Content and Intellectual Property</h2>
              <h3 className="text-xl font-medium mb-2">6.1 User Content</h3>
              <p className="mb-4">
                You retain ownership of content you post but grant us a license to use, modify, and display it on the platform.
              </p>
              
              <h3 className="text-xl font-medium mb-2">6.2 Platform Content</h3>
              <p className="mb-4">
                All platform features, functionality, and design are owned by SupplySetu and protected by intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Privacy and Data Protection</h2>
              <p className="mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the platform, 
                to understand our practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Disclaimers and Limitations</h2>
              <h3 className="text-xl font-medium mb-2">8.1 Service Availability</h3>
              <p className="mb-4">
                We strive to maintain platform availability but do not guarantee uninterrupted service. Maintenance, 
                updates, or technical issues may cause temporary disruptions.
              </p>
              
              <h3 className="text-xl font-medium mb-2">8.2 User Verification</h3>
              <p className="mb-4">
                While we implement verification processes, we cannot guarantee the accuracy of all user information or 
                the quality of products and services offered.
              </p>
              
              <h3 className="text-xl font-medium mb-2">8.3 Limitation of Liability</h3>
              <p className="mb-4">
                SupplySetu shall not be liable for any indirect, incidental, special, or consequential damages arising 
                from your use of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Termination</h2>
              <p className="mb-4">
                We reserve the right to terminate or suspend accounts at our discretion, particularly for violations of 
                these terms. Users may also terminate their accounts at any time.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Governing Law</h2>
              <p className="mb-4">
                These terms shall be governed by and construed in accordance with the laws of India. Any disputes shall 
                be subject to the jurisdiction of courts in Bengaluru, Karnataka.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right to modify these terms at any time. Users will be notified of significant changes, 
                and continued use constitutes acceptance of modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
              <p className="mb-4">
                For questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-card p-6 rounded-lg border">
                <p><strong>Email:</strong> legal@supplysetu.in</p>
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

export default TermsOfService;