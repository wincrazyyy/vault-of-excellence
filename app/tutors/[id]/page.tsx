// app/tutors/[id]/page.tsx
import { ProfileHeader } from "../../../components/tutors/profile-header";
import { About } from "../../../components/tutors/about";
import { AcademicBackground } from "../../../components/tutors/academic-background";
import { Teaching } from "../../../components/tutors/teaching";
import { Stats } from "../../../components/tutors/stats";
import { Reviews } from "../../../components/tutors/reviews";
import { BookingCard } from "../../../components/tutors/booking-card";
import { Tips } from "../../../components/tutors/tips";

export type Tutor = {
  verified: boolean;
  imageSrc?: string;
  name: string;
  title: string;
  subtitle: string;
  rating: string;
  hours: string;
  returnRate: number;
  about: {
    title: string;
    description: string;
    subjects: string[];
    syllabuses: string[];
  };
  academic: {
    title: string;
    education: {
      school: string;
      degree: string;
      graduation: string;
    }[];
  };
  teaching: {
    title: string;
    teachingStyle: string;
    lessonFormat: string;
    teachingLanguage: string;
  };
  stats: {
    title: string;
    description: string;
    data: { k: string; v: string }[];
  };
  reviews: {
    title: string;
    description: string;
  };
  booking: {
    price: number;
    availability: string[];
  };
};

export type Review = { name: string; text: string };

export default function TutorProfilePage() {
  const tutor: Tutor = {
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
        }
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
      teachingLanguage: "English, 中文 (Cantonese/Mandarin)."
    },
    stats: {
      title: "Tutor Stats",
      description: "Quick signals of experience and reliability.",
      data: [
        { k: "Students taught", v: "250+" },
        { k: "Total hours", v: "18000+" },
        { k: "Response time", v: "< 2 hours" },
      ]
    },
    reviews: {
      title: "Student Reviews",
      description: "Hear from students who have benefited from my tutoring."
    },
    booking: {
      price: 1500,
      availability: [
        "Weekdays (Evening)",
        "Sat (Morning)"
      ],
    },
  };

  const reviews: Review[] = [
    { name: "John Smith", text: "Explains concepts clearly and gives great practice questions." },
    { name: "Jane Doe", text: "Very patient and organised. Helped me improve my confidence." },
    { name: "Bob Builder", text: "Super nice and friendly, and guided me through my exams flawlessly."},
  ];

  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto w-full max-w-5xl px-6 py-10">
        <ProfileHeader tutor={tutor} />

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <About tutor={tutor} />
            <AcademicBackground tutor={tutor} />
            <Teaching tutor={tutor} />
            <Stats tutor={tutor} />
            <Reviews tutor={tutor} reviews={reviews} />
          </div>

          <aside className="space-y-6">
            <BookingCard tutor={tutor} />
            <Tips />
          </aside>
        </div>
      </section>
    </main>
  );
}
