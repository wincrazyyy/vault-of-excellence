import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Terms of Service | Vault of Excellence",
  description: "Terms of Service and user agreements for Vault of Excellence.",
};

export default function TermsOfServicePage() {
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
            Terms of Service
          </h1>
          <p className="text-muted-foreground">
            Last Updated: <span className="font-medium text-foreground">17/03/2026</span>
          </p>
        </div>

        <div className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <p>
              Welcome to <strong>Vault of Excellence</strong> ("we," "our," or "us"). By accessing or using our website, application, or services (collectively, the "Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              1. Description of Service
            </h2>
            <p>
              Vault of Excellence provides an online platform that connects students seeking academic tutoring with independent tutors offering such services. <strong>We act solely as a venue and intermediary.</strong> We do not directly employ tutors, nor do we guarantee the academic outcomes, quality, or safety of any tutoring sessions arranged through our Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              2. User Accounts
            </h2>
            <p className="mb-4">
              To use certain features of the Service, you must register for an account. By registering, you agree that:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>You will provide accurate, current, and complete information during registration.</li>
              <li>You are responsible for safeguarding your login credentials.</li>
              <li>You will notify us immediately of any unauthorized use of your account.</li>
              <li>If you are registering as a Tutor, you represent that you possess the qualifications, experience, and credentials listed on your profile.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              3. Booking and Scheduling
            </h2>
            <p className="mb-4">
              Our platform allows students to view tutor availability and submit lesson requests. 
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Requests:</strong> A booking request does not guarantee a lesson until explicitly accepted by the tutor.</li>
              <li><strong>Cancellations:</strong> Users must respect the cancellation policies agreed upon prior to the lesson. Repeated missed lessons or last-minute cancellations may result in account suspension.</li>
              <li><strong>Third-Party Integrations:</strong> If you connect a third-party calendar (e.g., Google Calendar), you are responsible for keeping your schedule accurate to prevent double-booking.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              4. User Conduct
            </h2>
            <p className="mb-4">
              While using the Service, you agree <strong>not</strong> to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the platform for any unlawful purpose.</li>
              <li>Harass, abuse, or harm another person, including using inappropriate language in reviews or messages.</li>
              <li>Submit false, misleading, or deceptive information in your profile, applications, or reviews.</li>
              <li>Attempt to circumvent the platform to arrange payments or lessons outside of Vault of Excellence in a way that violates our policies.</li>
              <li>Distribute viruses, malware, or any other technologies that may harm the Service.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              5. Intellectual Property
            </h2>
            <p className="mb-4">
              All original content, features, and functionality of the Service (including design, text, graphics, and logos) are the exclusive property of Vault of Excellence and its licensors. 
            </p>
            <p>
              By posting content (such as profile details or reviews) to the Service, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute that content in connection with operating the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              6. Disclaimers and Limitation of Liability
            </h2>
            <p className="mb-4">
              <strong>Disclaimer of Warranties:</strong> The Service is provided "AS IS" and "AS AVAILABLE" without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, secure, or error-free.
            </p>
            <p>
              <strong>Limitation of Liability:</strong> In no event shall Vault of Excellence, its directors, employees, or partners be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to or use of the Service, or from any interactions between students and tutors.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              7. Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate your account and access to the Service at our sole discretion, without prior notice or liability, for any reason, including if you breach these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              8. Changes to Terms
            </h2>
            <p>
              We may modify these Terms at any time. We will provide notice of any material changes by updating the "Last Updated" date at the top of this page. Your continued use of the Service after changes become effective constitutes your acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              9. Contact Us
            </h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
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
