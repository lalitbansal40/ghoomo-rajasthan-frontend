import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bookPackageLink, bookPlaceLink, bookRouteLink, bookSafariLink } from './book.ts';

test('only eligible cab-route links enter the fare and booking flow', () => {
  assert.equal(bookRouteLink('JAIPUR', 'JODHPUR', 'en', 'dzire'), '/booking?from=JAIPUR&to=JODHPUR&car=dzire');
  assert.equal(bookRouteLink('AJMER', 'PUSHKAR', 'hi', 'dzire', true), '/enquiry?type=cab&product=AJMER-to-PUSHKAR&name=AJMER+to+PUSHKAR');
});

test('sample tour, safari and destination CTAs are enquiry-only', () => {
  assert.match(bookPackageLink({ slug: 'pink-city', name: 'Pink City', days: 2, nights: 1 }, 'dzire', 'en'), /^\/enquiry\?type=package/);
  assert.match(bookSafariLink('Jaisalmer', 'Camel ride', 'hi'), /^\/enquiry\?type=safari/);
  assert.match(bookPlaceLink('Pushkar', 'en'), /^\/enquiry\?type=custom/);
});
