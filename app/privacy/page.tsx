import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Privacy Policy | Vault of Excellence",
  description: "Privacy Policy and Google API usage details for Vault of Excellence.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background pb-16 pt-8">
      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="-ml-4 text-muted-foreground hover:text-foreground">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">
            Last Updated: <span className="font-medium text-foreground">14/03/2026</span>
          </p>
        </div>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <p>
              Welcome to <strong>Vault of Excellence</strong> ("we," "our," or "us"). We are committed to protecting your privacy and ensuring you have a positive experience on our platform. 
            </p>
            <p className="mt-4">
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, application, and services (collectively, the "Service"), with a specific focus on how we handle data accessed through your Google Account.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              1. Information We Collect
            </h2>
            <p className="mb-4">
              When you register for an account or use our Service as a tutor or student, we may collect the following information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Personal Information:</strong> Your name, email address, phone number, and educational background.</li>
              <li><strong>Account Data:</strong> Profile pictures, teaching subjects, self-introductions, and scheduling preferences.</li>
              <li><strong>Google Account Data (If Connected):</strong> If you choose to connect your Google Calendar to our Service, we will request access to your Google Account via OAuth.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              2. How We Use Your Google Calendar Data
            </h2>
            <p className="mb-4">
              If you authorize Vault of Excellence to access your Google Calendar, we strictly limit our access and use of your data to the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Reading Free/Busy Times:</strong> We read the start and end times of the events on your connected calendar. We use this data strictly to visually block off unavailable times on your public tutoring schedule, preventing students from double-booking you.</li>
              <li><strong>Data Minimization:</strong> We <strong>do not</strong> read, store, or display your private event titles, descriptions, attendees, or locations to students.</li>
              <li><strong>Authentication Tokens:</strong> We securely store the OAuth access and refresh tokens provided by Google to maintain the sync connection between your calendar and our platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              3. Google API Services User Data Policy Compliance
            </h2>
            <p className="mb-4">
              Vault of Excellence's use and transfer to any other app of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline dark:text-violet-400">Google API Services User Data Policy</a>, including the <strong>Limited Use</strong> requirements. 
            </p>
            <p className="mb-4">Specifically:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>We do not use Google user data to build user profiles for advertising purposes.</li>
              <li>We will not sell, lease, or rent your Google data to third parties.</li>
              <li>We only transfer Google data to third parties if necessary to provide or improve our scheduling features, to comply with applicable laws, or as part of a merger/acquisition.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              4. How We Protect Your Information
            </h2>
            <p>
              We use industry-standard administrative, technical, and physical security measures to protect your personal information and Google API tokens. Access to your data is restricted to authorized personnel who need it to operate the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              5. Data Retention and Deletion
            </h2>
            <p className="mb-4">
              We retain your personal information and calendar connection data only for as long as your account is active or as needed to provide you with the Service.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Disconnecting Google Calendar:</strong> You may revoke our access to your Google Calendar at any time directly from your account settings or via your Google Account Security settings. Once revoked, we will delete your authentication tokens and stop fetching your calendar data.</li>
              <li><strong>Account Deletion:</strong> You can request the complete deletion of your account and all associated data by contacting us directly.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              6. Sharing Your Information
            </h2>
            <p className="mb-4">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Providers:</strong> Third-party vendors who provide cloud hosting, database management, and email delivery services. These providers are bound by strict confidentiality agreements.</li>
              <li><strong>Legal Obligations:</strong> When required by law, subpoena, or other legal processes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              7. Contact Us
            </h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or how we handle your Google data, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-muted rounded-lg border border-border inline-block">
              <p className="text-foreground font-medium">Email: winsonsiugithub@gmail.com</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
