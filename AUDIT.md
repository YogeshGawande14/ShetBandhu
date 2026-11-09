# Existing AgroConnect audit

Audited the current Java 21 / Spring Boot, MySQL/Flyway, and static HTML/CSS/JS project before edits. There is no `package.json` or client-side routing framework.

| Change | Status | Existing vs. missing |
|---|---|---|
| 1 Accounts and roles | Partial | Unique phone and a single role exist; multiple roles, active-role JWT validation, role switching, seller application, and self-purchase prevention are missing. |
| 2 Owner verification | Partial | Pending/verified boolean and admin approval endpoint exist; rejected state and licence/photo/city application fields and pending-owner screen are missing. |
| 3 Owner panel | Partial | Product CRUD, stock, and basic order status exist; isolated dashboard, full timeline, requests inbox, sales summaries, and requested status steps are missing. |
| 4 Farmer portal | Partial | Product catalogue, rates/profit API, PIN/area centre search, and checkout exist; rates are local records, while schemes, realtime groups, product requests, and customer-facing order timeline are missing. |
| 5 Location database | Missing | No state/district/taluka location table or location seed exists. |
| 6 Contact privacy | Missing | Centre phone is exposed and frontend constructs `wa.me` URLs; no masked relay or backend notification integration exists. |
| 7 UI redesign | Partial | Customer marketplace and mobile navigation exist; distinct owner/admin panels and requested merchandising/skeleton details are missing. |
| 8 Logout/session revocation | Missing | JWT login exists; logout, refresh/revocation, all-device logout, and expiry handling are missing. |
