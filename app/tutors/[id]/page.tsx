import { Suspense } from "react";
import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { getTutorProfile } from "@/lib/tutors/getTutor";
import { TutorProfileContent } from "@/components/tutors/tutor-profile-content";
import { ProfileNotVerified, ProfileNotPublic } from "@/components/tutors/profile-alerts";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const tutor = await getTutorProfile(id);

  if (!tutor || !tutor.header.is_verified || !tutor.is_public) {
    return {
      title: "Profile Unavailable | Vault of Excellence",
      description: "This tutor profile is currently unavailable or private.",
    };
  }

  const fullName = `${tutor.header.firstname} ${tutor.header.lastname}`.trim();
  const subtitle = tutor.header.subtitle || "Expert Tutor";
  const description = tutor.header.title || `Book a lesson with ${fullName}, an expert tutor on Vault of Excellence.`;
  const imageUrl = tutor.header.image_url || "https://voetutor.com/logo-rectangle-light.png";

  return {
    title: `${fullName} - ${subtitle} | Vault of Excellence`,
    description: description,
    openGraph: {
      title: `${fullName} - ${subtitle} | Vault of Excellence`,
      description: description,
      url: `https://voetutor.com/tutors/${id}`,
      siteName: "Vault of Excellence",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: `Profile picture of ${fullName}`,
        },
      ],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${fullName} - ${subtitle}`,
      description: description,
      images: [imageUrl],
    },
  };
}

export default async function TutorProfilePage({ params }: PageProps) {
  return (
    <Suspense 
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground animate-pulse">
          Loading Tutor Profile...
        </div>
      }
    >
      <TutorDataLoader params={params} />
    </Suspense>
  );
}

async function TutorDataLoader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tutor = await getTutorProfile(id);

  if (!tutor) {
    notFound();
  }

  if (!tutor.header.is_verified) {
    return <ProfileNotVerified />;
  }

  if (!tutor.is_public) { 
    return <ProfileNotPublic />;
  }

  const fullName = `${tutor.header.firstname} ${tutor.header.lastname}`.trim();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://voetutor.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "All Tutors",
        "item": "https://voetutor.com/tutors"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": fullName,
        "item": `https://voetutor.com/tutors/${id}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <TutorProfileContent tutor={tutor} />
    </>
  );
}
