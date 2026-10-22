import { Camel } from '@/components/motifs';

/** Waiting: the camel walks, and the words say what for. role="status" — a screen reader hears it. */
export function Loader({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div role="status" className={`flex flex-col items-center gap-3 py-8 text-center ${className}`}>
      <Camel walking size={88} />
      <p className="font-semibold text-heading">{label}</p>
    </div>
  );
}
