# Functional verification — 2026-09-04

## Scope and safety

Tests use a disposable MongoDB instance created by mongodb-memory-server. The test harness overrides the production database URI before importing the application. Only synthetic records are used. The integration photo is deleted after its retrieval/persistence checks. No production patient records were submitted, edited, or deleted.

Run `pnpm test --runInBand` for unit tests and `pnpm test:integration` for API/database tests. Run `pnpm test:sandbox` to launch a disposable API at port 4012 for browser testing. Set each frontend's NEXT_PUBLIC_BACKEND_URL to http://127.0.0.1:4012/api and NEXT_PUBLIC_API_URL to http://127.0.0.1:4012 before starting it. Test credentials are deliberately local-only, in scripts/test-sandbox.js.

For simultaneous role-isolated browser sessions, use separate browser profiles or separate hostnames: cookies on localhost are shared across ports. The browser confirmation/tracking tests below used explicit in-memory tokens and public reference-based tracking; a client reload after admin login adopted the admin cookie, so this run is NOT evidence of independent browser-session isolation.

## Executed API/database checks

64 assertions passed in scripts/integration-test.js; 36 portal API/security assertions passed in scripts/portal-test.js; 12 unit tests passed across four Jest suites.

| Workflow | Evidence |
| --- | --- |
| Authentication | Admin login, patient signup, refresh cookie, anonymous denial, patient denied admin appointments, short-password validation |
| Patient profile | DOB/address save and subsequent database read; multipart photo upload, retrieval and saved path |
| Hospital | Create, required-field rejection, department/doctor linkage and populated profile |
| Doctor directory | Matching active counts for public/admin, district/specialty filtering, nonmatching name search |
| Reviews | Doctor and hospital submission, pending exclusion, admin approval, published list/average and persisted provider count |
| Appointments | Create, duplicate rejection, admin list/confirmation, patient tracking/cancellation |
| Ambulances | Create request, admin receipt/assignment, conflicting preselected assignment rejection, customer acceptance/cancellation, availability release, entity deletion |
| Blood requests | Create, admin status update, patient tracking |
| Blood donors | Register, donation history save, partial profile edit preserving DOB/address/history, future availability filter, donation sorting, pagination total, deletion |
| Contact | Inquiry creation and matching reference in admin list |
| Blogs | Admin publication, public detail, category filter and pagination |

## Executed browser checks

Client localhost:4013; admin localhost:4011; isolated API localhost:4012.

- Signup creates a test patient and opens Account; admin login opens management pages.
- Admin Appointment Management is navigable and renders records after refresh.
- Client appointment submitted (DE-MTMWRYLX-QAXVG), found in admin, confirmed in admin, then shown as confirmed in the patient reference tracker.
- Native date entry exposes only published 09:00–16:45 slots, formatted AM/PM, for a 09:00–17:00 schedule.
- Doctor search: NoSuchDoctor produces zero records; Demo restores the matching doctor.
- Admin hospital form creates Browser Test Hospital, then it appears in the client directory.
- Doctor review appears locally as pending, reaches admin, is approved, and is publicly rendered with 5 stars/count 1 after reload.
- Client donor registration displays success; admin receives inactive donor; activation makes the donor appear on the client list.
- Demo call/WhatsApp links and doctor call/share controls are rendered. No real calls or messages were sent.

## Defects found and corrected in this audit

- Active User schema lacked DOB/address: address save threw a TypeError and DOB was not persisted.
- Client login/signup retained a shortened user payload instead of loading the complete saved profile.
- Signup advertised six characters while the active model required eight; API and client now agree.
- Donor sort and future-availability controls were not connected to queries. Sorting now occurs before pagination and availability uses stored dates.
- Hospital review aggregation wrote to nonexistent root fields instead of basicInfo rating/count fields.
- A preselected ambulance could be assigned to another active request; sequential conflicts are now rejected, and availability release respects other active requests.
- Admin local API routing was missing; a development-compatible same-origin rewrite was added.
- Admin dashboard showed unrelated visa/revenue placeholders and hard-coded health. It now uses doctor/hospital counts and API health, without claiming storage is monitored.
- Booking inputs lacked associated labels; required booking fields now have linked labels/native required attributes.
- Home/blog banners had no missing/broken-image fallback. A shared fallback component now handles failed media URLs.
- Blog list retained an old error after a successful retry; successful fetches now clear it.

## Not certified / remaining work

- Legacy doctor/patient dashboard placeholders have been replaced with scoped database workflows. Admins explicitly link doctor accounts to profiles. The portal includes appointments, patient encounters, prescriptions with private attachments, messages, chamber editing, reviews, statistics, saved doctors and in-app reminders. The 36 portal checks cover cross-account denials, linking, validation, downloads, persistence and pagination.
- No financial payment processor or financial-donation workflow was found or tested; blood donation history is covered. Financial donations need a payment-provider/recipient decision and credentials, not a fake success flow. Reminders are in-app only and messages poll every 20 seconds; no SMS/email or emergency monitoring is promised.
- Mobile viewport override was retried on a newly created tab at requested 390x844; measured width still remained 1280. Mobile layout verification is incomplete, not passed.
- Concurrent two-request slot booking and ambulance assignment tests pass, with one winner and one conflict. Unique partial indexes protect active bookings. This is not load/stress or crash-recovery testing. Before deployment run `node scripts/booking-preflight.js`: it is read-only, prints counts only, and exits 2 if historical conflicts or non-normalized active dates need a controlled migration. Do not automatically discard or cancel historical bookings.
- Native phone calls, WhatsApp delivery and sharing to third-party apps were not executed.
- File-upload persistence was API-tested, not browser file-picker tested. Full browser coverage of hospital review moderation, ambulance lifecycle, blood request lifecycle and every admin edit form remains incomplete (API coverage is listed above).
- A fresh browser sandbox exercised doctor login, dashboard counts, appointment confirmation, doctor prescription entry and patient visibility after logout/login, plus patient message submission/list persistence. Patient DOB (1995-02-03), street and city were saved through the browser, then verified on fresh account navigation in a new tab.
- Historical hospital rating summaries require a controlled recalculation before existing production records can be assumed correct; this audit did not mutate production data.
- Admin production builds explicitly skip TypeScript validation; a build pass is not a type-check pass.
- These new audit fixes are local until separately pushed/deployed. Previously deployed commits are not evidence that these new fixes are live.

No blanket claim that every page is fully functional or production-certified is warranted by this report.
