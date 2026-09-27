# NEARWEAR IMPLEMENTATION PROMPT

Version 2.1

## 필수 제작 기준

- 제작버전: 모바일웹 430px 이하 버전
- 제작 언어: HTML, CSS, JavaScript
- 모든 세션은 구현 시작 전에 반드시 PRD.md를 읽고 숙지할 것.
- 360px / 390px / 430px를 우선 확인하며, 더 넓은 화면은 보조 반응형 범위로 취급한다.

## Goal

현재 구현된 NEARWEAR 프로젝트를 최신 PRD와 MVP 12 Screens 기준으로
수정한다.

새 프로젝트를 만들지 않는다. 현재 프로젝트의 기존 구조와 정상 작동하는
기능을 최대한 유지한다.

이번 작업은 기능 전체 재구축이 아니라 UI/UX와 visual presentation을 최신
확정안으로 수정하는 작업이다.

## Source of Truth

작업 기준 우선순위:

1.  최신 PRD v2.1
2.  최신 MVP 12 Screens Revised
3.  기존 Current MVP 12 Screens
4.  첨부된 화면별 수정 캡처 / visual reference
5.  이 PROMPT

레퍼런스는 그대로 복제하지 않고 composition, typography hierarchy, image
treatment, spacing, interaction principle, editorial mood만 참고한다.

## Preserve Existing Implementation

특별한 이유가 없다면 다음을 유지한다:

-   Existing URL hash routing
-   Shop / Product data relationships
-   Browser Storage
-   Taste data / matching logic
-   Explore Preference
-   모든 주변 매장을 표시하는 MAP
-   Taste matching store emphasis
-   Search / Filter
-   SHOP PREVIEW carousel
-   SHOP DETAIL tabs / stories / product linkage
-   Store Save
-   Item Save
-   Add to Taste
-   Reservation
-   Reservation Cancel
-   Re-reservation
-   VIEW MAP
-   EXPLORE
-   SAVED
-   MY
-   Bottom Navigation
-   Back navigation
-   Scroll restoration
-   Toast / feedback

## 01 START

기존 Red Editorial / LOOK THROUGH START를 제거한다.

Required: - BLACK full screen - centered NEARWEAR mark only - 적당한
mark size - no explanatory copy - no CTA - no arrow - no photography -
no LOOK THROUGH - no hover/click requirement

Flow:

BLACK → NEARWEAR mark → 약 10초 → TASTE DISCOVERY

약 10초 후 기존 URL hash routing 방식으로 자동 이동한다.

Subtle fade는 가능하지만 별도의 onboarding interaction을 추가하지
않는다.

Bottom Navigation은 숨긴다.

## 02 TASTE DISCOVERY

기존 Taste calculation logic과 LIKE / SKIP semantics를 유지한다.

Explore Preference: - WOMENSWEAR - MENSWEAR - ALL - Default ALL

기존 Card Stack 방식은 사용하지 않는다.

Vertical image browsing + scroll snap을 구현한다.

-   previous image / current image / next image 구조가 느껴져야 한다.
-   current image는 화면 중앙에서 가장 크고 선명하다.
-   previous / next image는 일부만 노출하거나 scale / opacity 차이를
    둔다.
-   current image가 center에 도달했을 때 충분히 크게 보여야 한다.
-   일반적인 긴 이미지 목록처럼 보이지 않게 한다.

Background: BLACK

상단 copy는 TASTE DISCOVERY 정도만 최소 표시한다.

Current image 아래: SKIP LIKE

큰 button box나 heart icon은 필수가 아니다. Typography action처럼 표현할
수 있으나 mobile touch target은 충분히 확보한다.

LIKE: - current image taste weight 증가

SKIP: - strong dislike로 처리하지 않음

LIKE / SKIP 후 다음 이미지로 자연스럽게 이동한다.

Progress: 01 / 12

Visual hierarchy: 1. IMAGE 2. LIKE / SKIP 3. Progress / Title

## 03 YOUR TASTE

기존 Taste result calculation을 유지한다.

2 columns × 3 rows, 총 6개의 puzzle pieces를 사용한다.

단순 image grid가 아니라 실제 puzzle tab / slot silhouette가 있어야
한다.

Aesthetic: - BLACK background - fashion photography - editorial
collage - not colorful/playful/childish

가능한 한 실제 LIKE 이미지 6장을 사용한다. LIKE 이미지가 6개보다 적을
때만 taste metadata 기준으로 보완한다.

First-entry sequence:

BLACK → Putting your taste together... → 6 puzzle pieces appear around
screen → pieces move from different positions → pieces lock one by one →
final piece locks → completed 2×3 puzzle → short viewing moment → puzzle
shrink / fade → YOUR TASTE RESULT

Completed puzzle interaction:

Tap piece: - selected piece scale 1.15--1.25 - other pieces dim

Outside tap: - original state

VIEW MY PUZZLE에서도 동일한 completed puzzle을 다시 볼 수 있게 한다.

## 04 MAP / HOME

현재 Dark Map 구조를 크게 수정하지 않는다.

Keep: - Current Area - Search - Filter - Current Location - FOR YOUR
TASTE - ALL SHOPS - SAVED - Pins - Bottom Navigation

Taste matching은 filtering이 아니라 recommendation emphasis다.

Non-matching shops를 숨기지 않는다.

기존 MAP 하단 NEAR YOU list는 제거한다.

MAP = location discovery EXPLORE = photo/content discovery

## 05 SHOP PREVIEW

현재 구현은 최대한 유지한다.

Keep: - 3 image carousel - counter - Shop Name - Distance - Open
Status - Style Tags - Taste Match - Store Save - VIEW SHOP

Modify: - unnecessary left/right image margin 최소화 - image width를
preview card에 자연스럽게 맞춤 - aspect ratio 유지 - object-fit / crop
조정 - photography를 충분히 크게 표시 - Mobile preview가 MAP을 과도하게
가리지 않게

## 06 SHOP DETAIL / PROFILE

Preserve: - Hero carousel - Store Profile - Taste Match - NEW / TODAY /
SALE / INFO - FEED / ITEMS / INFO - Feed interaction - Product linkage -
Add to Taste

Hero/store image의 불필요한 horizontal margin을 제거하고 image width를
적극 사용한다.

FEED: - Instagram / vintage shop inventory feed feeling - Mobile: 3
columns - Wider screen: up to 4 columns - very small grid gap

Photography mix: - vintage items - outfits - accessories - shoes -
bags - styling - store details / interior

작은 grid 위에 과도한 heart/button/text를 올리지 않는다. 필요한 action은
tap 후 expanded/detail state에서 보여줄 수 있다.

## 07 ITEM DETAIL

Keep: - Multiple Images - Price - Availability - SAVE ITEM - RESERVE

Required info: - SIZE - MEASUREMENTS - CONDITION - FLAWS

Availability: - AVAILABLE - RESERVED - SOLD

RESERVE는 AVAILABLE일 때만 활성화한다.

## 08 RESERVATION

기존 reservation validation / date / time logic을 유지한다.

User-facing: - Selected Item - Store - Price - SELECT A DATE - SELECT A
TIME - 예약 상품은 선택한 방문 시간까지 매장에서 보관됩니다. - RESERVE
ITEM →

Remove: - frontend demo - browser storage explanation - fake inventory -
prototype explanation

## 09 RESERVATION COMPLETE

Keep: - RESERVED - Item - Store - Date - Time - Location - VIEW MAP -
VIEW RESERVATION - CANCEL RESERVATION

VIEW MAP: - reserved shop selected

Cancel: - item returns to AVAILABLE when appropriate - Re-reservation
must continue to work

Remove development/demo copy.

## 10 EXPLORE

Keep: - FOR YOUR TASTE - NEAR YOU - NEW IN - TRY SOMETHING DIFFERENT

동일 매장/이미지 반복을 줄인다.

여러 mock vintage shop과 서로 다른 photography를 사용한다.

TRY SOMETHING DIFFERENT는 current Taste Profile과 조금 다른 매장을
보여준다.

Personalization 때문에 discovery를 제한하지 않는다.

## 11 SAVED

Keep: - SHOPS - ITEMS - TASTE

State mapping: - Store Save → SHOPS - Item Save → ITEMS - Add to Taste →
TASTE

세 state는 독립적으로 관리한다.

## 12 MY / MY TASTE

Keep: - Taste Profile - YOU SEEM TO LIKE - Explore Preference - REFINE
MY TASTE - VIEW MY PUZZLE - Reservations - Location - Notifications

REFINE MY TASTE: - go to Taste Discovery

VIEW MY PUZZLE: - show completed 6-piece puzzle

Do not duplicate SAVED content inside MY.

## Global Visual Direction

START: Minimal / Brand Splash

TASTE DISCOVERY: Image-focused / Immersive

YOUR TASTE: Interactive / Editorial Puzzle

MAP onward: Functional / Dark / Photography-led

SHOP DETAIL: Vintage Shop / Instagram-like visual feed

Do not repeat the same box/card UI across every screen.

Use photography, typography, spacing and restrained accents to connect
the visual system.

## Copy Cleanup

Remove from user-facing UI: - DEMO labels - Prototype explanation -
Browser Storage explanation - Frontend explanation - Fake inventory /
fake location explanation - repetitive instructions - excessive
editorial filler - unnatural AI-style copy

Keep copy short, clear and visually unobtrusive.

## Mobile Priority

Check first at: - 360px - 390px

Especially verify: - TASTE vertical browsing / scroll snap - YOUR TASTE
puzzle - SHOP PREVIEW image width - SHOP DETAIL hero - SHOP DETAIL
3-column feed - Bottom Navigation - Tap targets

Also verify Desktop.

## State Requirements

Maintain: - Explore Preference - Liked Taste Images - Taste Metadata -
Selected Store - Saved Stores - Selected Item - Saved Items - Taste Feed
Images - Map Filters - Reservation - Item Availability

Reservation lifecycle:

AVAILABLE → RESERVED → CANCEL → AVAILABLE

Re-reservation must work.

## Technical Constraints

-   Do not create a new project.
-   Do not change framework unnecessarily.
-   Keep hash routing unless a clear technical reason requires
    otherwise.
-   Backend is not required for MVP.
-   Mock data and Browser Storage are acceptable.
-   Do not expose internal taste matching scores.
-   Do not add shipping / checkout / payment flows.
-   Core outcome remains: Online Discovery → Reservation → Offline
    Visit.

## Final Validation

Test:

1.  START → mark only → 약 10초 → TASTE DISCOVERY automatic navigation
2.  TASTE vertical scroll/snap
3.  LIKE
4.  SKIP
5.  Taste result
6.  Puzzle assembly
7.  Puzzle tap interaction
8.  모든 주변 매장 유지
9.  Search / Filter
10. Store Save
11. Item Save
12. Add to Taste
13. Taste Profile update
14. SHOP PREVIEW carousel
15. SHOP DETAIL tabs / stories / product linkage
16. Reservation
17. Cancel
18. Re-reservation
19. VIEW MAP selection
20. MAP / EXPLORE / SAVED / MY
21. Back navigation
22. Scroll restoration
23. Browser Storage persistence
24. 360px
25. 390px
26. Desktop

## Completion Report

완료 후 다음 순서로 보고한다:

1.  수정한 파일
2.  화면별 수정 내용
3.  기존에서 유지한 기능
4.  삭제한 UI / copy
5.  새로 구현한 interaction
6.  TASTE vertical browsing 작동 방식
7.  Puzzle assembly 작동 방식
8.  SHOP DETAIL feed responsive columns
9.  모바일 검증 결과
10. 테스트 결과
11. 아직 placeholder / mock인 부분
12. 남은 문제

아직 Vercel에는 배포하지 않는다.

먼저 기존 프로젝트의 로컬 구현과 테스트까지만 완료하고, 수정된 화면 확인
후 배포한다.

## 통합 구현 기준 (2026-09-27)

학원 `NEARWEAR_Current_MVP_12_Screens(2).docx`의 12화면 구성과 탐색·저장·예약 흐름을 기반으로 한다. 최신 사용자 요청 및 PRD v2.1 / Revised MVP에서 변경한 START, 세로 취향 탐색, 퍼즐, 3열 피드가 과거 화면보다 우선한다. 화면별 경로와 수용 기준은 [MVP.md](MVP.md)에서 관리한다.

- 기존 프로젝트와 저장 데이터, ID, hash 경로를 유지한다.
- 이번 수정에서는 이미지를 생성하거나 새 사진을 다운로드하지 않는다. 현재 로컬 자산만 재사용한다.
- 기능 화면은 학원 자료의 올리브 블랙 톤과 큰 매장 사진을 반영한다.
- 학원 화면의 DEMO 설명, 예전 START CTA, Card Stack, MAP 하단 목록은 최신 요청에 따라 복구하지 않는다.
- 로컬 테스트까지만 진행하며 배포하지 않는다.
