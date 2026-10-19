import { test } from 'node:test';
import assert from 'node:assert/strict';
import { boundedBody } from './bounded-body.ts';
test('stream limit counts UTF-8 bytes and cancels without trusting absent length', async () => {
  let cancelled = false;
  const body = new ReadableStream({ pull(controller) { controller.enqueue(new TextEncoder().encode('हिंदी')); }, cancel() { cancelled = true; } });
  await assert.rejects(() => boundedBody(new Response(body), 5), /BODY_TOO_LARGE/);
  assert.equal(cancelled, true);
  assert.equal(await boundedBody(new Response('हिंदी'), 100), 'हिंदी');
});
