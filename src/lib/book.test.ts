import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bookPackageLink, bookPlaceLink, bookRouteLink, bookSafariLink } from './book.ts';

test('only eligible cab-route links enter the fare and booking flow', () => {
  assert.equal(bookRouteLink('JAIPUR', 'JODHPUR', 'en', 'dzire'), '/booking?trip=one_way&pickup=JAIPUR&drop=JODHPUR&vehicle=dzire#book');
  assert.equal(bookRouteLink('JAIPUR', 'JODHPUR', 'hi'), '/hi/booking?trip=one_way&pickup=JAIPUR&drop=JODHPUR#book');
  assert.equal(bookRouteLink('AJMER', 'PUSHKAR', 'hi', 'dzire', true), '/hi/enquiry?type=cab&product=AJMER-to-PUSHKAR&name=AJMER+to+PUSHKAR');
});

test('a bookable tour opens its own booking with the car; any other tour is an enquiry', () => {
  assert.equal(bookPackageLink({ slug: 'lakes-and-forts', name: 'Lakes & Forts', days: 5, nights: 4, bookable: true }, 'Innova Crysta', 'en'), '/booking/package/lakes-and-forts?vehicle=crysta');
  assert.equal(bookPackageLink({ slug: 'lakes-and-forts', name: 'Lakes & Forts', days: 5, nights: 4, bookable: true }, 'Ertiga', 'hi'), '/hi/booking/package/lakes-and-forts?vehicle=ertiga');
  assert.match(bookPackageLink({ slug: 'pink-city', name: 'Pink City', days: 2, nights: 1 }, 'dzire', 'en'), /^\/enquiry\?type=package/);
});

test('a safari opens the safari booking with the ride chosen', () => {
  assert.equal(bookSafariLink('jaisalmer', 'jeep', 'hi'), '/hi/booking/safari/jaisalmer?offer=jeep');
  assert.match(bookPlaceLink('Pushkar', 'en'), /^\/enquiry\?type=custom/);
});
