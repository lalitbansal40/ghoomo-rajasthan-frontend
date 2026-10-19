import ts from 'typescript';
import { readFile } from 'node:fs/promises';

const compile = (source) => 'data:text/javascript;base64,' + Buffer.from(ts.transpileModule(source,
  { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText).toString('base64');
const policySource = await readFile(new URL('../../src/lib/indexing-policy.ts', import.meta.url), 'utf8');
const releaseSource = (await readFile(new URL('../../src/lib/release-contract.ts', import.meta.url), 'utf8'))
  .replace(/^import[^\n]+indexing-policy\.ts';\n/m, '');
// Compile our own trusted pure source for build tools as well as Node20; one decision implementation.
const { reviewedPair, dynamicReleasePath } = await import(compile(policySource + '\n' + releaseSource));

export async function sourceApprovals(source) {
  return (await import(compile(source))).RELEASE_APPROVALS;
}

export function launchGate({ launched, approvals, revision, now = Date.now() }) {
  if (!launched) return { mode: 'held', approvals: Array.isArray(approvals) ? approvals.length : 0 };
  if (!Array.isArray(approvals) || !reviewedPair({ approvals, path: '/', revision, now }))
    throw Error('RELEASE_NOT_REVIEWED: active launch requires current reviewed EN/HI home and exact cohort');
  for (const a of approvals) {
    const packagePage = typeof a.path === 'string' && dynamicReleasePath(a.path);
    if (!reviewedPair({ approvals, path: a.path, revision: packagePage ? a.revision : revision, now, analyticsUtility: true }))
      throw Error('INVALID_RELEASE_APPROVAL: duplicate/private/stale/invalid locale pair');
  }
  return { mode: 'reviewed launch candidate', approvals: approvals.length };
}
