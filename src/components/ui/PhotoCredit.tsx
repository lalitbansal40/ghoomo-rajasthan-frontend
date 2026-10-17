import Link from 'next/link';

/**
 * The small line a free-licence photo asks for, in its corner: "Photo: {author} · {licence}",
 * linking to /photo-credits where the source and the changes are named.
 */
export function PhotoCredit({ photo, label, href = '/photo-credits' }: { photo: { credit: string; licence: string }; label: string; href?: string }) {
  return (
    <Link
      href={href}
      className="absolute bottom-1.5 right-1.5 rounded-full bg-black/55 px-2 py-0.5 text-[0.6875rem] leading-5 text-white/95 hover:bg-black/70"
    >
      {label}: {photo.credit} · {photo.licence}
    </Link>
  );
}
