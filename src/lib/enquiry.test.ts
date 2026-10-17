import { test } from 'node:test';
import assert from 'node:assert/strict';
import { indianMobile, safeProductSlug, validEnquiryDate } from './enquiry.ts';

test('enquiry product context accepts slugs and falls back for unsafe values', () => {
  assert.equal(safeProductSlug('jaipur-heritage-tour'), 'jaipur-heritage-tour');
  assert.equal(safeProductSlug('https://example.test/?phone=123'), 'custom-trip');
  assert.equal(safeProductSlug(undefined), 'custom-trip');
});

test('Indian phone normalization accepts only a ten digit mobile', () => {
  assert.equal(indianMobile('+91 98765 43210'), '9876543210');
  assert.equal(indianMobile('1234567890'), null);
  assert.equal(indianMobile('987654321'), null);
});

test('enquiry dates use an explicit India date boundary', () => {
  assert.equal(validEnquiryDate('2026-10-17', '2026-10-17'), true);
  assert.equal(validEnquiryDate('2026-10-16', '2026-10-17'), false);
  assert.equal(validEnquiryDate('17/10/2026', '2026-10-17'), false);
});
