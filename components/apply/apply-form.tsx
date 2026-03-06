"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ApplyFormProps {
  userEmail: string;
  initialFirstName: string;
  initialLastName: string;
}

export function ApplyForm({ userEmail, initialFirstName, initialLastName }: ApplyFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [areaCode, setAreaCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const expStr = formData.get("teaching_experience_years") as string;

    let fullPhone = null;
    if (areaCode || phoneNumber) {
      fullPhone = `+${areaCode} ${phoneNumber}`.trim();
    }
    
    const payload = {
      firstname: formData.get("firstname"),
      lastname: formData.get("lastname"),
      gender: formData.get("gender") || null,
      phone: fullPhone,
      email: formData.get("email"),
      university: formData.get("university") || null,
      degree: formData.get("degree") || null,
      major: formData.get("major") || null,
      university_grade: formData.get("university_grade") || null,
      graduation_year: formData.get("graduation_year") || null,
      teaching_experience_years: expStr ? parseInt(expStr, 10) : null,
      teaching_subject: formData.get("teaching_subject") || null,
      self_intro: formData.get("self_intro") || null,
    };

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      toast.error("You must be logged in.");
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase
      .from("tutor_applications")
      .insert({ ...payload, tutor_id: user.id });

    setIsSubmitting(false);

    if (error) {
      toast.error("Failed to submit application", { description: error.message });
    } else {
      toast.success("Application submitted successfully!");
      router.refresh(); 
    }
  }

  return (
    <Card className="border-violet-100 dark:border-violet-900/50 shadow-md">
      <CardContent className="pt-6">
        <form onSubmit={onSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="firstname">First Name <span className="text-red-500">*</span></Label>
              <Input id="firstname" name="firstname" required defaultValue={initialFirstName} placeholder="John" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname">Last Name <span className="text-red-500">*</span></Label>
              <Input id="lastname" name="lastname" required defaultValue={initialLastName} placeholder="Doe" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
              <Input id="email" name="email" type="email" required defaultValue={userEmail} />
            </div>

            <div className="space-y-2">
              <Label>WhatsApp Phone Number</Label>
              <div className="flex items-center gap-2">
                <div className="relative flex items-center w-24 shrink-0">
                  <span className="absolute left-3 text-muted-foreground text-sm font-medium">+</span>
                  <Input 
                    className="pl-7" 
                    placeholder="852" 
                    maxLength={4}
                    value={areaCode}
                    onChange={(e) => setAreaCode(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <Input 
                  className="flex-1" 
                  placeholder="12345678" 
                  maxLength={15}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <select 
                id="gender" 
                name="gender" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="graduation_year">Year of Graduation</Label>
              <Input id="graduation_year" name="graduation_year" placeholder="e.g. 2026" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="university">Most Recent University</Label>
              <Input id="university" name="university" placeholder="e.g. University of Hong Kong (HKU)" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="major">Major / Field of Study</Label>
              <Input id="major" name="major" placeholder="e.g. BSc Computer Science" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="degree">Degree</Label>
              <select 
                id="degree" 
                name="degree" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select...</option>
                <option value="Associate">Associate Degree</option>
                <option value="Bachelor's">Bachelor's Degree</option>
                <option value="Master's">Master's Degree</option>
                <option value="PhD">PhD / Doctorate</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="university_grade">GPA / Final Grade</Label>
              <Input id="university_grade" name="university_grade" placeholder="e.g. 3.8/4.0, First Class Honours" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="teaching_subject">Primary Teaching Subject</Label>
              <Input id="teaching_subject" name="teaching_subject" placeholder="e.g. Mathematics" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="teaching_experience_years">Years of Experience</Label>
              <Input id="teaching_experience_years" name="teaching_experience_years" type="number" min="0" placeholder="0" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="self_intro">Self Introduction</Label>
            <textarea 
              id="self_intro" 
              name="self_intro" 
              placeholder="Tell us a little bit about yourself and your teaching style..."
              className="flex min-h-30 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            {isSubmitting ? "Submitting Application..." : "Submit Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
