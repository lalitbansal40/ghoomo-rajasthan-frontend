'use client';

import { ErrorView } from '../_home/ErrorView';

export default function HindiError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <ErrorView locale="hi" retry={retry} />;
}
