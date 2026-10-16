import Link from 'next/link';
import { brand } from '@/lib/site';

const LINKS = [
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/refund', label: 'Refund' },
  { href: '/photo-credits', label: 'Photo credits' },
];

/** The thin strip at the foot of every page: who we are, and the pages the law asks for. */
export function Footer() {
  return (
    <footer className="bg-sand px-4 pb-8 pt-2 text-center text-sm text-ink">
      <p>
        A {brand.parent} company · {brand.city}
      </p>
      <nav aria-label="Legal" className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1">
        {LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="underline-offset-4 hover:underline">
            {l.label}
          </Link>
        ))}
      </nav>
    </footer>
  );
}
