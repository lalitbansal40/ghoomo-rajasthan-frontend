import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runInNewContext } from 'node:vm';
import { createThemeRuntime, nextThemeCheck, parseTheme, resolveTheme, themeBootstrap, THEME_BOOTSTRAP, THEME_KEY, type ThemeSnapshot } from './theme.ts';

test('local boundaries, manual overrides and rollback have the specified priority', () => {
  for (const [time, theme] of [['05:59:59.999', 'dark'], ['06:00:00.000', 'light'], ['17:59:59.999', 'light'], ['18:00:00.000', 'dark'], ['00:00:00.000', 'dark']] as const) {
    const now = new Date(`2026-10-21T${time}`);
    assert.equal(resolveTheme('auto', now), theme);
    assert.equal(resolveTheme('light', now), 'light');
    assert.equal(resolveTheme('dark', now), 'dark');
    assert.equal(resolveTheme('dark', now, false), 'light');
    assert.ok(nextThemeCheck(now) > 0 && nextThemeCheck(now) <= 60_000);
  }
  assert.equal(nextThemeCheck(new Date('2026-10-21T17:59:59.990')), 10);
});

test('local scheduling works across India, overseas and DST calendar dates', () => {
  const previous = process.env.TZ;
  try {
    for (const zone of ['Asia/Kolkata', 'America/New_York', 'Europe/London']) {
      process.env.TZ = zone;
      for (const day of ['2026-03-08', '2026-11-01', '2026-10-21']) {
        assert.equal(resolveTheme('auto', new Date(`${day}T06:00:00`)), 'light', zone);
        assert.equal(resolveTheme('auto', new Date(`${day}T18:00:00`)), 'dark', zone);
        assert.equal(nextThemeCheck(new Date(`${day}T23:59:59`)), 60_000, zone);
      }
    }
  } finally { if (previous === undefined) delete process.env.TZ; else process.env.TZ = previous; }
});

test('pre-paint bootstrap matches policy for every hour, corrupt values and storage denial', () => {
  for (const value of ['auto', 'light', 'dark', null, '', '<script>', 'system']) {
    for (const denied of [false, true]) for (let hour = 0; hour < 24; hour++) {
      const attributes: Record<string, string> = {};
      const context = {
        document: { documentElement: { setAttribute: (k: string, v: string) => { attributes[k] = v; } }, querySelector: () => null },
        Date: class { getHours() { return hour; } },
        get localStorage() { if (denied) throw Error('SecurityError'); return { getItem: (key: string) => { assert.equal(key, THEME_KEY); return value; } }; },
      };
      runInNewContext(THEME_BOOTSTRAP, context);
      const mode = parseTheme(denied ? null : value);
      assert.equal(attributes['data-theme-mode'], mode);
      assert.equal(attributes['data-theme'], resolveTheme(mode, new Date(2026, 9, 21, hour)));
    }
  }
});

test('code rollback ignores a saved Dark choice before paint and cancels runtime scheduling', () => {
  let theme = '';
  runInNewContext(themeBootstrap(false), { Date, localStorage: { getItem: () => 'dark' },
    document: { documentElement: { setAttribute: (key: string, value: string) => { if (key === 'data-theme') theme = value; } }, querySelector: () => null } });
  assert.equal(theme, 'light');
  const runtime = createThemeRuntime({ now: () => new Date(), hidden: () => false, read: () => 'dark', write: () => {},
    apply: state => { theme = state.theme; }, schedule: () => { throw Error('Rollback must not schedule'); }, cancel: () => {} }, () => {}, false);
  runtime.start(); assert.equal(theme, 'light'); runtime.choose('auto'); assert.equal(theme, 'light'); runtime.stop();
});

function fixture() {
  let now = new Date('2026-10-21T17:59:59.990'), hidden = false, denied = false;
  let saved: unknown = 'auto', serial = 0, updates = 0;
  const pending = new Map<number, { fn: () => void; ms: number }>();
  let applied: ThemeSnapshot | undefined;
  const runtime = createThemeRuntime({
    now: () => now, hidden: () => hidden,
    read: () => { if (denied) throw Error('denied'); return saved; },
    write: mode => { if (denied) throw Error('quota'); saved = mode; },
    apply: state => { applied = state; },
    schedule: (fn, ms) => { const id = ++serial; pending.set(id, { fn, ms }); return id; },
    cancel: id => { pending.delete(id); },
  }, () => { updates++; });
  return { runtime, pending, setNow: (v: string) => { now = new Date(v); }, setHidden: (v: boolean) => { hidden = v; },
    deny: () => { denied = true; }, applied: () => applied, updates: () => updates };
}

test('boundary scheduling and resume use one timer, manual mode cancels it', () => {
  const f = fixture(); f.runtime.start();
  assert.equal(f.applied()?.theme, 'light'); assert.equal(f.pending.size, 1);
  const [id, job] = [...f.pending][0]; assert.equal(job.ms, 10);
  f.pending.delete(id); f.setNow('2026-10-21T18:00:00'); job.fn();
  assert.equal(f.applied()?.theme, 'dark'); assert.equal(f.pending.size, 1);
  f.runtime.choose('light'); assert.equal(f.pending.size, 0);
  f.setNow('2026-10-22T01:00:00'); f.runtime.refresh(); assert.equal(f.applied()?.theme, 'light');
  f.runtime.choose('auto'); assert.equal(f.applied()?.theme, 'dark'); assert.equal(f.pending.size, 1);
  f.setHidden(true); f.runtime.refresh(); assert.equal(f.pending.size, 0);
  f.setNow('2026-10-22T07:00:00'); f.setHidden(false); f.runtime.refresh();
  assert.equal(f.applied()?.theme, 'light'); assert.equal(f.pending.size, 1);
  f.runtime.stop(); assert.equal(f.pending.size, 0);
  f.runtime.start(); assert.equal(f.pending.size, 1); f.runtime.stop();
});

test('denied storage preserves current manual choice on focus/clock changes; clear returns Auto', () => {
  const f = fixture(); f.deny(); f.runtime.start();
  assert.equal(f.applied()?.theme, 'light');
  f.runtime.choose('dark'); assert.equal(f.applied()?.theme, 'dark'); assert.equal(f.pending.size, 0);
  f.runtime.refresh(); assert.equal(f.applied()?.mode, 'dark');
  f.runtime.choose(null, false); assert.equal(f.applied()?.mode, 'auto'); assert.equal(f.pending.size, 1);
  const updates = f.updates(); f.runtime.refresh(); assert.equal(f.updates(), updates);
  f.runtime.stop();
});
