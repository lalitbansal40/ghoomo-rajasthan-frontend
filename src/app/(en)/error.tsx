'use client';

import { ErrorView } from '../_home/ErrorView';

export default function Error({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <ErrorView locale="en" retry={retry} />;
}
