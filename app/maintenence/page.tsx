import { Badge } from "@/components/ui/badge";

export default function MaintenancePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center">
      <Badge variant="secondary" className="mb-6">
        Scheduled Maintenance
      </Badge>

      <div className="text-2xl font-semibold tracking-tight text-foreground">
        Vault of Excellence
      </div>

      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        We are upgrading your{" "}
        <span className="underline decoration-violet-200 decoration-4 underline-offset-4 dark:decoration-violet-500/40">
          experience
        </span>
        .
      </h1>

      <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-muted-foreground">
        We are currently performing scheduled maintenance to ensure our platform continues 
        to deliver the premium standards you expect. We will be back online shortly.
      </p>

      <div className="mt-8 flex justify-center gap-2">
        <Badge variant="secondary">Premium standards</Badge>
        <Badge variant="secondary">Back shortly</Badge>
      </div>
    </main>
  );
}