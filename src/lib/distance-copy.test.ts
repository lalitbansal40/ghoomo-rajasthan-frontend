import { test } from 'node:test';
import assert from 'node:assert/strict';
import { distanceCopy } from './distance-copy.ts';

test('only explicit measured evidence removes the estimate qualifier, without changing kilometres', () => {
  assert.equal(distanceCopy(306.5, 'en'), 'About 306.5 km by road');
  assert.equal(distanceCopy(306.5, 'hi'), 'लगभग 306.5 किमी');
  assert.equal(distanceCopy(306.5, 'en', true), '306.5 km by road');
  assert.equal(distanceCopy(306.5, 'hi', true), '306.5 किमी');
});
