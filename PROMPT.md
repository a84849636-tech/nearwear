# NEARWEAR --- Implementation Prompt

## Role

You are working inside the existing NEARWEAR codebase.

Do not rebuild the project from scratch unless technically necessary.

First inspect the current project structure, routes, components, styles,
assets, and existing implementation. Reuse working components and
preserve existing functionality where it still matches the updated
requirements.

`PRD.md` is the product source of truth. This file defines
implementation priorities and constraints.

------------------------------------------------------------------------

## Objective

Update the existing NEARWEAR MVP to match the revised product direction:

**Map-based vintage store discovery + social-style store profiles +
product stock checking + reservation + offline visit**

Core journey:

**DISCOVER → EXPLORE → FIND → CHECK → RESERVE → VISIT**

Map → Store Preview → Store Profile → Feed → Items in Photo → Product
Detail / Stock → Reservation → Visit

------------------------------------------------------------------------

## Before Coding

1.  Read the full `PRD.md`.
2.  Inspect the existing codebase.
3.  Identify existing screens/components that can be reused.
4.  Keep correctly implemented functionality.
5.  Modify only what is necessary to match the new PRD.
6.  Do not add features outside the MVP scope.
7.  Use fictional/demo data where backend or live data is not required.
8.  Keep the application runnable throughout the implementation.

------------------------------------------------------------------------

# Required 12-Screen MVP

Implement or update these 12 primary screens:

1.  Splash
2.  Style Preference
3.  Map / Discover
4.  Store Preview
5.  Store Profile / Feed
6.  Store Story
7.  Feed Post Detail
8.  Items in Photo
9.  Store Items
10. Product Detail / Stock
11. Reservation
12. Reservation Complete

All important navigation paths must work.

------------------------------------------------------------------------

# Screen Requirements

## 01 --- Splash

Create a minimal NEARWEAR opening screen.

Display: - NEARWEAR - `Vintage around you.`

Keep the screen simple and brand-focused.

------------------------------------------------------------------------

## 02 --- Style Preference

Allow multiple style selections.

Demo categories: - Archive - Y2K - Minimal - Street - Workwear -
Classic - Japanese - Designer

Include a Continue button.

No production recommendation engine is required.

------------------------------------------------------------------------

## 03 --- Map / Discover

This is the primary discovery screen.

Include: - Map - Current location indicator - Store pins - Search -
STYLE filter - OPEN filter - Distance filter - Bottom navigation:
`MAP / SAVED / MY`

Selecting a store pin must open the Store Preview instead of navigating
directly to the full store page.

------------------------------------------------------------------------

## 04 --- Store Preview

IMPORTANT: preserve the existing preview-card structure where possible.

Replace clothing/product preview photography with exactly three
store-related demo images:

1.  Store interior
2.  Display rack
3.  Store exterior

### Carousel Behavior

-   Horizontal swipe
-   `1/3`, `2/3`, `3/3` position indicator
-   Only the image area moves
-   Store information below remains fixed
-   Images must never be stretched or distorted
-   Preserve original aspect ratio
-   Natural cropping inside the image container is acceptable

### Fixed Information

Show: - Store name - Style tags - Distance - Opening status - Closing
time - Save action - `VIEW SHOP →`

`VIEW SHOP →` opens the Store Profile.

The card must fit correctly on mobile without clipping, overflow, or
overlapping controls.

------------------------------------------------------------------------

## 05 --- Store Profile / Feed

This is one of the most important screens.

The experience should resemble browsing a fashion store's social profile
rather than a generic e-commerce or map listing.

### Header

Show: - Profile image - Store name - Style tags - Distance - Opening
status - Directions - Save

### Stories

Show: - NEW - TODAY - SALE - INFO

### Tabs

Use: `FEED / ITEMS / INFO`

FEED is the default.

### Feed

Use a large 2-column image grid.

Mix: - Outfit shots - Styling - Product photography - Store interior -
Display racks - Store atmosphere

Selecting a post opens Feed Post Detail.

Do not add a large hero image above the feed. The feed should appear
relatively quickly after the profile/story area.

------------------------------------------------------------------------

## 06 --- Store Story

Create a story-style full-screen viewer.

Use demo content for: - Today's opening information - New arrivals -
Sale/event - Store notices

Show: - Store name - Posted time such as `2h` - Story image - Short
message - Optional `VIEW ITEMS`

Only story viewing is required.

DO NOT build owner upload/edit functionality.

------------------------------------------------------------------------

## 07 --- Feed Post Detail

Show: - Large image - Store name - Caption - Tags - Save/Like action -
`사진 속 상품 보기`

The key CTA is `사진 속 상품 보기`.

Selecting it opens Items in Photo.

------------------------------------------------------------------------

## 08 --- Items in Photo

Connect a selected feed photo to actual demo inventory.

Each connected product shows: - Thumbnail - Product name - Price - Stock
status

Support: - `IN STOCK` - `SOLD`

Available product → Product Detail.

SOLD product → no reservation.

This interaction is a core differentiator of NEARWEAR and should be
visually clear.

------------------------------------------------------------------------

## 09 --- Store Items

This screen represents the ITEMS tab inside the Store Profile.

Show: `FEED / ITEMS / INFO`

ITEMS is active.

Include category filters: - ALL - OUTER - TOP - BOTTOM

Product cards: - Image - Product name - Price - Stock state

Clearly mark SOLD products.

Product selection → Product Detail.

------------------------------------------------------------------------

## 10 --- Product Detail / Stock

Show: - Product images - Product name - Price - Size - Condition -
Description - Store - Current stock state - RESERVE CTA

Rules: - IN STOCK → reservation enabled - SOLD → reservation disabled

The stock state must be easy to understand.

------------------------------------------------------------------------

## 11 --- Reservation

Show: - Selected product - Price - Store - Visit date - Visit time -
Reservation notice - RESERVE button

For this MVP, a demo/local reservation flow is sufficient.

No payment flow.

RESERVE → Reservation Complete.

------------------------------------------------------------------------

## 12 --- Reservation Complete

Show: - RESERVED state - Product - Store - Visit date/time -
Directions - Reservation history link/action

This screen should clearly communicate that the digital journey now
continues as a physical store visit.

------------------------------------------------------------------------

# Demo Content

Use fictional/demo content.

Primary demo store:

**AFTERDARK**

Style: `Archive / Street / Vintage`

Provide: - 3 Store Preview images: interior / display rack / exterior -
Minimum 6 Feed posts - NEW / TODAY / SALE / INFO story examples -
Minimum 6 products - Mix of IN STOCK and SOLD products

Do not depend on production APIs for the prototype unless an existing
working integration is already required by the project.

------------------------------------------------------------------------

# Visual Direction

The UI should feel like a curated vintage/fashion editorial product.

Use: - Editorial composition - Minimal interface - Contemporary
typography - Toned-down palette - Slightly dark atmosphere - Image-first
hierarchy - Generous spacing where appropriate

Photography should be the strongest visual element.

Avoid: - Neon-heavy styling - Excessive lime green - Generic
marketplace/e-commerce appearance - Excessively rounded playful cards -
Oversized UI elements that compete with photos - Unnecessary
gradients/effects - Adding visual elements solely to fill empty space

Do not blindly copy Instagram. Use its profile/feed browsing behavior as
a structural reference while keeping NEARWEAR visually distinct.

------------------------------------------------------------------------

# Mobile / Responsive Requirements

Mobile is the primary target.

Ensure: - No horizontal page overflow - No clipped preview cards - No
overlapping text/buttons - Touch-friendly controls - Horizontal swipe
for Store Preview - Images preserve aspect ratio - Clean two-column
Feed - Bottom navigation remains usable - Screens remain visually
coherent at common mobile widths

------------------------------------------------------------------------

# Required Navigation

The following path must work:

Splash → Style Preference → Map → Store Pin → Store Preview → VIEW SHOP
→ Store Profile → Feed Post → Items in Photo → Product Detail →
Reservation → Reservation Complete

Also support:

Store Profile → Story

and:

Store Profile → ITEMS → Product Detail → Reservation

------------------------------------------------------------------------

# MVP Scope Restrictions

Do NOT implement:

-   Store owner/admin dashboard
-   Store owner accounts
-   Feed upload
-   Story upload
-   Real inventory management
-   POS integration
-   Payment
-   Delivery
-   Chat/DM
-   Comments
-   Reviews
-   Social following
-   Full recommendation algorithm
-   Complex production authentication
-   Production reservation management

Do not expand the project beyond the PRD.

------------------------------------------------------------------------

# Implementation Principles

-   Reuse existing code where appropriate.
-   Prefer reusable components over duplicated markup.
-   Keep demo data structured and easy to replace later.
-   Maintain clear separation between data, UI components, and
    navigation.
-   Avoid unnecessary dependencies.
-   Do not break existing project setup or deployment configuration.
-   Do not replace working architecture solely for stylistic reasons.
-   Preserve accessibility basics such as meaningful buttons, labels,
    and usable touch targets.

------------------------------------------------------------------------

# Reference Images

If reference screenshots/images are provided with this task:

-   Use them only as visual/layout references.
-   Do not reproduce them pixel-for-pixel.
-   Do not place the reference screenshots themselves inside the app.
-   Use separate demo imagery appropriate for a vintage/fashion store.
-   Reference images 1--3 primarily inform Store Profile / Feed behavior
    and mood.
-   Reference images 4--5 primarily inform Story presentation.

------------------------------------------------------------------------

# Completion Checklist

Before finishing, verify:

-   [ ] All 12 MVP screens exist or are represented by the required
    states/views.
-   [ ] Store pins open Store Preview.
-   [ ] Store Preview has interior/display/exterior carousel.
-   [ ] Carousel indicator updates from 1/3 to 3/3.
-   [ ] Preview images are not distorted.
-   [ ] Store Preview information stays fixed while images change.
-   [ ] VIEW SHOP opens Store Profile.
-   [ ] Store Profile defaults to FEED.
-   [ ] Store Profile has Story, FEED, ITEMS, INFO structure.
-   [ ] Feed uses a 2-column grid.
-   [ ] Feed post opens detail view.
-   [ ] `사진 속 상품 보기` works.
-   [ ] Items in Photo show stock states.
-   [ ] ITEMS tab works.
-   [ ] Product Detail shows current stock.
-   [ ] SOLD products cannot be reserved.
-   [ ] Reservation flow reaches completion.
-   [ ] Mobile layout has no obvious clipping/overflow.
-   [ ] No out-of-scope social/admin/payment features were added.

------------------------------------------------------------------------

# Final Response After Implementation

After completing the work:

1.  Summarize what was changed.
2.  List important files created or modified.
3.  Mention any assumptions or demo-only behavior.
4.  Report any remaining issue that prevents the required flow from
    working.
5.  Do not claim a feature works unless it was actually implemented or
    verified.
