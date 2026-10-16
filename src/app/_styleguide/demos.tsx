'use client';

import { useCallback, useState } from 'react';
import { Chip } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';
import { Stepper } from '@/components/ui/form/Stepper';

/** The style guide's few live parts — each only shows a component working. */

export function MotionToggle({ on, off, children }: { on: string; off: string; children: React.ReactNode }) {
  const [still, setStill] = useState(false);
  return (
    <div className={still ? 'motion-off' : ''}>
      <Button variant="ghost" size="sm" icon={null} onClick={() => setStill((s) => !s)}>
        {still ? on : off}
      </Button>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function DemoChips({ labels }: { labels: string[] }) {
  const [sel, setSel] = useState<string[]>([labels[1]]);
  return (
    <div className="flex flex-wrap gap-2">
      {labels.map((l) => (
        <Chip key={l} pressed={sel.includes(l)} onChange={(p) => setSel((s) => (p ? [...s, l] : s.filter((x) => x !== l)))}>
          {l}
        </Chip>
      ))}
    </div>
  );
}

export function DemoStepper({ label, decrease, increase }: { label: string; decrease: string; increase: string }) {
  const [n, setN] = useState(2);
  return (
    <div className="flex flex-col gap-1.5">
      <span id="sg-people-label" className="font-semibold">
        {label}
      </span>
      <Stepper id="sg-people" value={n} onChange={setN} min={1} max={12} decreaseLabel={decrease} increaseLabel={increase} />
    </div>
  );
}

export function DemoToast({ button, message, close }: { button: string; message: string; close: string }) {
  const [open, setOpen] = useState(false);
  const onClose = useCallback(() => setOpen(false), []);
  return (
    <>
      <Button variant="secondary" size="sm" icon={null} onClick={() => setOpen(true)}>
        {button}
      </Button>
      <Toast open={open} onClose={onClose} message={message} closeLabel={close} />
    </>
  );
}
