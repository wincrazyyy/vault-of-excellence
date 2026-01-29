// app/tutors/[id]/edit/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

import type { Tutor } from "@/components/tutors/types";

const defaultTutor: Tutor = {
  verified: true,
  imageSrc: "/tutors/1.png",
  name: "Winson Siu",
  title: "International Mathematics Exam Strategist",
  subtitle: "國際數學科考試軍師",
  rating: "5.0 ★",
  hours: "18000+ hours taught",
  returnRate: 1,
  about: {
    title: "About Me",
    description: `
    I help students build strong fundamentals, then move into exam-style questions with a clear method.

    **IBDP & A-Level Specialist**
    - 10+ years of experience tutoring IBDP & A-Level Math.
    - Extensive knowledge of exam formats, common pitfalls, and effective strategies. 
    - Clear explanations and step-by-step structure

    **Lifelong Tutoring Commitment**
    - Dedicated to helping students achieve their academic goals.
    - Patient, encouraging, and adaptable teaching style.
    - Focus on building confidence and problem-solving skills.
    `,
    subjects: ["Math"],
    syllabuses: ["IBDP", "A-Level", "IGCSE"],
  },
  academic: {
    title: "Academic background",
    education: [
      {
        school: "CityUHK",
        degree: "BBA QFRM (Math Minor)",
        graduation: "First Class Honours",
      },
      {
        school: "High School Education",
        degree: "HK A-Level Examination Pure Mathematics",
        graduation: "A (Top 4.8%)",
      },
    ],
  },
  teaching: {
    title: "How I teach",
    teachingStyle: `
      - Conceptual and structured explanations tailored to student needs.
      - Emphasis on problem-solving techniques and exam strategies.
      - Patient and encouraging approach to build student confidence.
      `,
    lessonFormat: "Online (Zoom/Meet) with shared whiteboard and notes",
    teachingLanguage: "English, 中文 (Cantonese/Mandarin).",
  },
  stats: {
    title: "Tutor Stats",
    description: "Quick signals of experience and reliability.",
    data: [
      { k: "Students taught", v: "250+" },
      { k: "Total hours", v: "18000+" },
      { k: "Response time", v: "< 2 hours" },
    ],
  },
  reviews: {
    title: "Student Reviews",
    description: "Hear from students who have benefited from my tutoring.",
  },
  booking: {
    price: 1500,
    availability: ["Weekdays (Evening)", "Sat (Morning)"],
  },
};

function csvToList(s: string) {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function listToCsv(a: string[]) {
  return a.join(", ");
}

export default function EditTutorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const tutorId = params?.id ?? "1";

  const [tutor, setTutor] = React.useState<Tutor>(defaultTutor);

  const [subjects, setSubjects] = React.useState(listToCsv(defaultTutor.about.subjects));
  const [syllabuses, setSyllabuses] = React.useState(listToCsv(defaultTutor.about.syllabuses));
  const [availability, setAvailability] = React.useState(
    listToCsv(defaultTutor.booking.availability),
  );

  const [educationRows, setEducationRows] = React.useState(defaultTutor.academic.education);
  const [statRows, setStatRows] = React.useState(defaultTutor.stats.data);

  function update<K extends keyof Tutor>(key: K, value: Tutor[K]) {
    setTutor((prev) => ({ ...prev, [key]: value }));
  }

  function updateAbout<K extends keyof Tutor["about"]>(key: K, value: Tutor["about"][K]) {
    setTutor((p) => ({ ...p, about: { ...p.about, [key]: value } }));
  }

  function updateAcademicTitle(value: string) {
    setTutor((p) => ({ ...p, academic: { ...p.academic, title: value } }));
  }

  function updateTeaching<K extends keyof Tutor["teaching"]>(key: K, value: Tutor["teaching"][K]) {
    setTutor((p) => ({ ...p, teaching: { ...p.teaching, [key]: value } }));
  }

  function updateStats<K extends keyof Tutor["stats"]>(key: K, value: Tutor["stats"][K]) {
    setTutor((p) => ({ ...p, stats: { ...p.stats, [key]: value } }));
  }

  function updateReviews<K extends keyof Tutor["reviews"]>(key: K, value: Tutor["reviews"][K]) {
    setTutor((p) => ({ ...p, reviews: { ...p.reviews, [key]: value } }));
  }

  function preview() {
    const payload: Tutor = {
      ...tutor,
      about: {
        ...tutor.about,
        subjects: csvToList(subjects),
        syllabuses: csvToList(syllabuses),
      },
      booking: {
        ...tutor.booking,
        availability: csvToList(availability),
      },
      academic: { ...tutor.academic, education: educationRows },
      stats: { ...tutor.stats, data: statRows },
    };

    const encoded = encodeURIComponent(JSON.stringify(payload));
    router.push(`/tutors/${tutorId}?preview=1&tutor=${encoded}`);
  }

  function save() {
    // Template: replace with Supabase update later
    preview();
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Edit tutor profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Template editor. Wire this to Supabase later.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/tutors/${tutorId}`}>Back to profile</Link>
          </Button>
          <Button variant="outline" onClick={preview}>
            Preview
          </Button>
          <Button onClick={save}>Save</Button>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={tutor.name} onChange={(e) => update("name", e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input
                    value={tutor.imageSrc ?? ""}
                    onChange={(e) => update("imageSrc", e.target.value)}
                    placeholder="/tutors/1.png"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={tutor.title} onChange={(e) => update("title", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input
                  value={tutor.subtitle}
                  onChange={(e) => update("subtitle", e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Hours text</Label>
                  <Input value={tutor.hours} onChange={(e) => update("hours", e.target.value)} />
                </div>

                <div className="space-y-2">
                  <Label>Rating text</Label>
                  <Input
                    value={tutor.rating}
                    onChange={(e) => update("rating", e.target.value)}
                    placeholder="4.9 ★"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Return rate (0–1)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={tutor.returnRate}
                    onChange={(e) => update("returnRate", Number(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Section title</Label>
                <Input value={tutor.about.title} onChange={(e) => updateAbout("title", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Description (markdown/plain)</Label>
                <Textarea
                  value={tutor.about.description}
                  onChange={(e) => updateAbout("description", e.target.value)}
                  rows={10}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Subjects (comma separated)</Label>
                  <Input value={subjects} onChange={(e) => setSubjects(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Syllabuses (comma separated)</Label>
                  <Input value={syllabuses} onChange={(e) => setSyllabuses(e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Academic background</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Section title</Label>
                <Input value={tutor.academic.title} onChange={(e) => updateAcademicTitle(e.target.value)} />
              </div>

              <div className="space-y-3">
                {educationRows.map((row, idx) => (
                  <div key={idx} className="grid gap-3 sm:grid-cols-3">
                    <Input
                      placeholder="School"
                      value={row.school}
                      onChange={(e) => {
                        const next = [...educationRows];
                        next[idx] = { ...next[idx], school: e.target.value };
                        setEducationRows(next);
                      }}
                    />
                    <Input
                      placeholder="Degree"
                      value={row.degree}
                      onChange={(e) => {
                        const next = [...educationRows];
                        next[idx] = { ...next[idx], degree: e.target.value };
                        setEducationRows(next);
                      }}
                    />
                    <div className="flex gap-2">
                      <Input
                        placeholder="Graduation"
                        value={row.graduation}
                        onChange={(e) => {
                          const next = [...educationRows];
                          next[idx] = { ...next[idx], graduation: e.target.value };
                          setEducationRows(next);
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setEducationRows((p) => p.filter((_, i) => i !== idx))}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setEducationRows((p) => [...p, { school: "", degree: "", graduation: "" }])
                  }
                >
                  Add education
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Teaching</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Section title</Label>
                <Input value={tutor.teaching.title} onChange={(e) => updateTeaching("title", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Teaching style</Label>
                <Textarea
                  value={tutor.teaching.teachingStyle}
                  onChange={(e) => updateTeaching("teachingStyle", e.target.value)}
                  rows={8}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Lesson format</Label>
                  <Input
                    value={tutor.teaching.lessonFormat}
                    onChange={(e) => updateTeaching("lessonFormat", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Teaching language</Label>
                  <Input
                    value={tutor.teaching.teachingLanguage}
                    onChange={(e) => updateTeaching("teachingLanguage", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Section title</Label>
                <Input value={tutor.stats.title} onChange={(e) => updateStats("title", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={tutor.stats.description}
                  onChange={(e) => updateStats("description", e.target.value)}
                />
              </div>

              <div className="space-y-3">
                {statRows.map((row, idx) => (
                  <div key={idx} className="grid gap-3 sm:grid-cols-3">
                    <Input
                      placeholder="Key"
                      value={row.k}
                      onChange={(e) => {
                        const next = [...statRows];
                        next[idx] = { ...next[idx], k: e.target.value };
                        setStatRows(next);
                      }}
                    />
                    <div className="flex gap-2 sm:col-span-2">
                      <Input
                        placeholder="Value"
                        value={row.v}
                        onChange={(e) => {
                          const next = [...statRows];
                          next[idx] = { ...next[idx], v: e.target.value };
                          setStatRows(next);
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStatRows((p) => p.filter((_, i) => i !== idx))}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={() => setStatRows((p) => [...p, { k: "", v: "" }])}>
                  Add stat
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reviews section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={tutor.reviews.title} onChange={(e) => updateReviews("title", e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={tutor.reviews.description}
                  onChange={(e) => updateReviews("description", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Price (HKD/hour)</Label>
                <Input
                  type="number"
                  value={tutor.booking.price}
                  onChange={(e) =>
                    setTutor((p) => ({
                      ...p,
                      booking: { ...p.booking, price: Number(e.target.value) },
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Availability (comma separated)</Label>
                <Input value={availability} onChange={(e) => setAvailability(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Developer notes</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <p>
                This editor is a template. “Save” currently just opens a preview of the profile by
                passing JSON via querystring.
              </p>
              <p className="mt-3">
                Next step: load/save tutor data from Supabase (table: tutors, tutor_about,
                tutor_education, tutor_stats, etc.).
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </main>
  );
}
