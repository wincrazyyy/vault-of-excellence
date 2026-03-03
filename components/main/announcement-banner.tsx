import Link from "next/link";

export function AnnouncementBanner() {
  return (
    <div className="w-full bg-violet-600 px-6 py-2 text-center text-sm text-white">
      🚀 Looking to become a tutor? Join our upcoming event!{" "}
      <Link href="https://www.instagram.com/p/DVXzpLlE0C0/?igsh=MWwxZGRiZDh3NGk3Mw%3D%3D" className="underline font-bold">
        Learn more
      </Link>
    </div>
  );
}