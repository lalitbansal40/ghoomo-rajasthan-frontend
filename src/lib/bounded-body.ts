/** Bound bytes while reading; Content-Length alone is not trustworthy. */
export async function boundedBody(input: Request | Response, maxBytes: number): Promise<string> {
  if (Number(input.headers.get('content-length')) > maxBytes) throw Error('BODY_TOO_LARGE');
  const reader = input.body?.getReader(); if (!reader) return '';
  const decoder = new TextDecoder('utf-8', { fatal: true }); let length = 0, out = '';
  try {
    for (;;) {
      const part = await reader.read(); if (part.done) break;
      length += part.value.byteLength; if (length > maxBytes) throw Error('BODY_TOO_LARGE');
      out += decoder.decode(part.value, { stream: true });
    }
    return out + decoder.decode();
  } catch (error) { await reader.cancel().catch(() => undefined); throw error; }
  finally { reader.releaseLock(); }
}
