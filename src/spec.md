# Specification

## Summary
**Goal:** Add vendor registration with mandatory GST and an in-app mobile OTP verification flow, plus a Vendors UI for listing and registration.

**Planned changes:**
- Add backend Vendor data model persisted in canister state (business/vendor name, mobile, GST, createdAt, registration/verification status) and APIs to register and list vendors.
- Implement backend OTP challenge flow for vendor mobile verification: request OTP, verify OTP, expiration handling, and enforcement that registration cannot complete without verified OTP.
- Create a new frontend Vendors page/route linked from site navigation, showing a vendor list with an empty state (English UI text).
- Build a two-step vendor registration UI: enter vendor details (GST required) + request OTP, then verify OTP, then submit registration only after verification.
- Add React Query hooks and backend bindings for vendor listing, OTP request/verify, and vendor registration, including query invalidation after successful registration.

**User-visible outcome:** Users can open a new Vendors section, view registered vendors, and complete a vendor registration that requires a GST number and successful mobile OTP verification before submission.
