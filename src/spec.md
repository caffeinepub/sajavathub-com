# Specification

## Summary
**Goal:** Improve the `/products/room-category` “Package Products by Room” UI so users can browse and select among multiple matching room packages, and view a clearer, more organized package detail and included-products experience.

**Planned changes:**
- Update the browsing flow to show a list/grid of all room packages matching the selected Design Style + Room Type, and allow selecting a package to update the detail/products panel.
- Restructure the selected room package detail header to consistently show name, description, style badge, room-type badge, formatted INR price, and a primary “Add Entire Package to Cart” action with responsive layout.
- Improve included products display with clearer product cards (image, name, INR price, stock status), an item count summary, and a sort control (at least by price and/or name).
- Add coherent, independent loading/empty states for the package list and for the included products panel, and ensure rapid switching between selections does not cause console errors or invalid UI states.

**User-visible outcome:** After choosing a Design Style and Room Type, users can browse multiple matching room packages, select one to see its details and included products, sort/scan products more easily, and always understand what is loading vs. unavailable.
