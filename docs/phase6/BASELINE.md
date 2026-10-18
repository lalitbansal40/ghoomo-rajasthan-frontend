# Phase6 baseline and scope

Implementation date18 October2026, Asia/Kolkata. Exact starting commits/owner changes and frozen
plan hash are in `evidence/source-baseline.json`. B was clean at0c961a5, G clean atc224686;
A b3cd1fd already had the owner's pubspec1.0.0+261/iOS SwiftPM changes, W5ab2af9 had its owner
handover file. No reset/staging/commit/push/deploy was performed by Phase6.

G uses installed Next16.3.4/React19.2.8. Current shell Node24.19.0; cached runtimes were explicitly
checked:20.20.2 and22.23.3. Version-specific installed Next guidance and G/W AGENTS instructions
were read. No new skill/plugin or dependency upgrade was needed. W remained untouched.

Existing source:30 destinations,128 routes (118 authored candidates/10 held), six bilingual sample
packages, sample safari, real CMS/preview/media boundaries from Phase5. Current actual launch flag
is false; real site/index/account/content approvals are not inferred from the local state. Full
inventory has357 concrete locale rows plus three private URL templates. A memory CMS fixture adds
one synthetic approved-on-request package for tests; it is not real owner-approved inventory.

Prior Phase5 evidence is historical: its L2 actual isolated target and L3 owner/content/rights/
release gates remain open. Phase4 G1–G7 and Phase5 P1–P8 are preserved independently. The owner's
shared live URLs and unknown content-approval location are not sufficient to close them. This
implementation did not re-run authenticated production verification or modify its settings/data.

Baseline G28 unit tests/typecheck/lint and selected B review/customer-message tests/typecheck
passed. An initial nonexistent jobs.test selector was corrected. Final commands, runtime-specific
failures and successful regression are in VERIFICATION.md and evidence/check-results.json. Scoped
B/A static checks are distinguished from known global baseline lint/analyzer debt.

Current local build is labelled non-deployable: CMS source, loopback API4211, canonical production
origin and trusted stage local. Isolated copied launch-policy servers only test policy contracts;
actual source/env flags were not opened. Real accounts, target runtime/CDN/DB/IAM/device evidence,
approved content/rights/support/privacy/sending/release decisions remain owner prerequisites.
