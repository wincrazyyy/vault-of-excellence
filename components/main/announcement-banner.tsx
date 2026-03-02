import Link from "next/link";

export function AnnouncementBanner() {
  return (
    <div className="w-full bg-violet-600 px-6 py-2 text-center text-sm text-white">
      🚀 Looking to become a tutor? Join our upcoming webinar!{" "}
      <Link href="#" className="underline font-bold">
        Learn more
      </Link>
    </div>
  );
}