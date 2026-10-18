/** Synthetic, bundled only by phase6-analytics-browser.mjs; never a public app route. */
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ManualTracker } from '../../src/components/AnalyticsClient';
import { EnquiryForm } from '../../src/components/EnquiryForm';

const allowed = ['/', '/hi', '/enquiry', '/hi/enquiry', '/packages/approved-tour'];
function Fixture() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const pop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', pop);
    return () => window.removeEventListener('popstate', pop);
  }, []);
  const go = (p: string) => { window.history.pushState({}, '', p); window.dispatchEvent(new PopStateEvent('popstate')); };
  return <>
    <ManualTracker pathname={path} allowedPaths={allowed} />
    <button id="private" onClick={() => go('/booking/private-fixture?token=must-not-leak')}>Private</button>
    <button id="public" onClick={() => go('/enquiry?phone=9790000011&token=must-not-leak')}>Enquiry</button>
    <a id="call" href="tel:+919790000011" onClick={(e) => e.preventDefault()}>Call</a>
    <a id="whatsapp" href="https://wa.me/919790000011?text=private-fixture" onClick={(e) => e.preventDefault()}>WhatsApp</a>
    <EnquiryForm locale="en" />
  </>;
}
createRoot(document.getElementById('root')!).render(<StrictMode><Fixture /></StrictMode>);
