# Specification

## Summary
**Goal:** Align the vendor registration flow and vendor listing UI with the attached vendor registration specification document.

**Planned changes:**
- Update the vendor registration UI flow to match the document’s required steps, fields, labels, required/optional rules, validations, and success/error states (English-only user-facing text).
- Update backend vendor data model and registration APIs to persist all document-required vendor attributes and enforce document-defined constraints/uniqueness rules with clear errors.
- Update the Vendors page/vendor list to display the document-required vendor fields/statuses/formatting and refresh automatically after a successful registration.
- If vendor state schema changes are required, add a conditional Motoko state migration to preserve existing vendor and OTP-related state across upgrades.

**User-visible outcome:** Vendors can register using the document-defined multi-step flow with clear validation and feedback, and the Vendors page shows the correct vendor details/statuses and updates immediately after registration.
