import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Loader2 } from "lucide-react";

type Props = {
  searchParams: Promise<{ email?: string; error?: string; message?: string }>;
};

export default function VerifyPage(props: Props) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/40 px-4">
      <Suspense fallback={<VerifySkeleton />}>
        <VerifyContent searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}

async function VerifyContent({ searchParams }: Props) {
  const { email, error, message } = await searchParams;

  async function verify(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const token = formData.get("code") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "signup",
    });

    if (error) {
      return redirect(`/auth/verify?email=${email}&error=${error.message}`);
    }

    return redirect("/dashboard");
  }

  async function resend(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const supabase = await createClient();

    if (!email) return;

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
    });

    if (error) {
      return redirect(`/auth/verify?email=${email}&error=${error.message}`);
    }

    return redirect(
      `/auth/verify?email=${email}&message=New code sent! Check your inbox.`
    );
  }

  return (
    <Card className="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Verify Account</CardTitle>
        <CardDescription>
          Enter the 6-digit code sent to{" "}
          <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={verify} className="grid gap-4">
          <input type="hidden" name="email" value={email || ""} />

          <div className="flex justify-center py-4">
            <InputOTP maxLength={6} name="code" required>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center font-medium bg-red-50 dark:bg-red-900/10 p-2 rounded">
              {error}
            </p>
          )}

          {message && (
            <p className="text-sm text-green-600 text-center font-medium bg-green-50 dark:bg-green-900/10 p-2 rounded">
              {message}
            </p>
          )}

          <Button type="submit" className="w-full">
            Verify
          </Button>
        </form>

        <form action={resend} className="mt-4 text-center">
          <input type="hidden" name="email" value={email || ""} />
          <p className="text-sm text-muted-foreground">
            Didn't receive a code?{" "}
            <button
              type="submit"
              className="underline underline-offset-4 hover:text-primary font-medium"
            >
              Resend
            </button>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

function VerifySkeleton() {
  return (
    <Card className="mx-auto max-w-sm w-full opacity-80">
      <CardHeader>
        <CardTitle className="text-2xl">Verify Account</CardTitle>
        <CardDescription>Please wait...</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </CardContent>
    </Card>
  );
}
