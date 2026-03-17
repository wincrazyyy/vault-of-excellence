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
            Last Updated: <span className="font-medium text-foreground">17/03/2026</span>
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
            </ul>
          </section>

          <section className="bg-muted/50 p-6 rounded-xl border border-border">
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              2. Google API Services & User Data Policy
            </h2>
            <p className="mb-4">
              If you choose to connect your Google Calendar to Vault of Excellence, our application accesses and processes your Google user data. We comply strictly with the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline dark:text-violet-400">Google API Services User Data Policy</a>, including the Limited Use requirements.
            </p>
            <div className="space-y-4 mt-4">
              <div>
                <strong className="text-foreground block">Data Accessed:</strong>
                We request access to your Google Calendar. Specifically, we only access your calendar's free/busy availability blocks and the start/end times of your events. We do not access or read your private event titles, descriptions, attendees, or locations.
              </div>
              
              <div>
                <strong className="text-foreground block">Data Usage:</strong>
                We use the accessed Google Calendar data solely to display your busy times on your public tutoring schedule. This prevents students from double-booking you. We do not use this data to build user profiles or for any advertising purposes.
              </div>

              <div>
                <strong className="text-foreground block">Data Sharing:</strong>
                We do not share, sell, lease, or transfer your Google user data to any third-party ad networks, data brokers, or outside entities. Your Google OAuth tokens are only shared securely with our immediate cloud infrastructure providers (e.g., our secure database) strictly for the purpose of operating the scheduling service.
              </div>

              <div>
                <strong className="text-foreground block">Data Storage & Protection:</strong>
                Your Google OAuth tokens and availability data are encrypted at rest and in transit using industry-standard protocols (HTTPS/TLS). Access to this data is strictly limited to authorized automated systems necessary to run the Service.
              </div>

              <div>
                <strong className="text-foreground block">Data Retention & Deletion:</strong>
                We retain your Google Calendar connection data only for as long as your account is active and the calendar remains linked. You can request the immediate deletion of this data by disconnecting your Google Calendar within our app, by revoking our app's access in your Google Account Security settings, or by emailing us directly at winsonsiugithub@gmail.com. Upon request or disconnection, all associated Google authentication tokens are permanently deleted from our database.
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              3. Sharing Your Information (Non-Google Data)
            </h2>
            <p className="mb-4">
              Regarding non-Google personal data, we do not sell your personal information. We may share your general information with:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Service Providers:</strong> Third-party vendors who provide cloud hosting, database management, and email delivery services. These providers are bound by strict confidentiality agreements.</li>
              <li><strong>Legal Obligations:</strong> When required by law, subpoena, or other legal processes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              4. Contact Us
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
