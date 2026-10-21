# NEARWEAR --- MVP PRD

## 1. Product Overview

### Product Name

NEARWEAR

### Product Description

NEARWEAR는 사용자가 현재 위치 또는 원하는 지역을 기준으로 주변의
빈티지샵과 편집샵을 지도에서 발견하고, 각 매장의 프로필과 피드를 통해
매장의 취향과 분위기를 탐색한 뒤, 피드 속 상품의 현재 재고를 확인하고
예약하여 실제 오프라인 방문까지 연결할 수 있는 지도 기반 로컬 패션 탐색
서비스다.

### Core Experience

**DISCOVER → EXPLORE → FIND → CHECK → RESERVE → VISIT**

지도에서 매장 발견 → 매장 취향 탐색 → 상품 발견 → 현재 재고 확인 → 상품
예약 → 오프라인 방문

------------------------------------------------------------------------

## 2. Problem

빈티지샵과 소규모 편집샵은 매장마다 취급하는 상품과 스타일이 다르지만
사용자가 방문 전에 이를 한눈에 파악하기 어렵다.

현재 사용자는 지도 앱에서 매장의 위치와 기본 정보를 확인하고, Instagram
등 SNS에서 다시 매장을 검색해 분위기와 상품을 확인하는 경우가 많다. 또한
SNS 게시물에서 마음에 드는 상품을 발견하더라도 현재 매장에 재고가 남아
있는지 바로 확인하기 어렵다.

NEARWEAR는 **지도 탐색 → 매장 취향 확인 → 상품 발견 → 재고 확인 → 예약 →
방문** 과정을 하나의 서비스 안에서 연결한다.

------------------------------------------------------------------------

## 3. MVP Goal

1.  사용자가 지도에서 주변 빈티지샵을 쉽게 발견할 수 있는지 검증한다.
2.  매장 프로필과 피드로 방문 전 매장의 취향과 분위기를 파악할 수 있게
    한다.
3.  피드에서 발견한 옷을 실제 판매 상품과 연결한다.
4.  현재 상품 재고 확인 후 예약까지 자연스럽게 연결한다.
5.  온라인 탐색을 실제 오프라인 방문으로 연결한다.

------------------------------------------------------------------------

## 4. Target User

### Primary User

빈티지 패션과 개성 있는 오프라인 패션 매장을 좋아하는 사용자.

### Characteristics

-   빈티지샵 / 편집샵 방문을 즐긴다.
-   Instagram 등에서 패션 매장을 탐색한다.
-   특정 지역에 어떤 빈티지샵이 있는지 알고 싶어 한다.
-   방문 전에 매장 분위기와 스타일을 확인하고 싶어 한다.
-   마음에 드는 상품의 현재 매장 재고를 확인하고 싶어 한다.
-   지도와 SNS를 오가며 정보를 찾는 과정에 불편함을 느낀다.

------------------------------------------------------------------------

## 5. Core Value Proposition

NEARWEAR의 핵심은 단순한 빈티지 상품 쇼핑이 아니라 **지도 기반 매장
발견 + 소셜형 매장 탐색 + 실제 재고 확인**을 하나의 경험으로 연결하는
것이다.

-   **MAP**: 주변 빈티지샵 발견
-   **STORE PROFILE**: 매장의 취향과 분위기 탐색
-   **STORY**: 오늘 영업, 신규 입고, 세일, 공지 확인
-   **FEED**: 착용샷, 코디, 상품, 공간 콘텐츠 탐색
-   **PRODUCT CONNECTION**: 피드 사진 속 상품을 실제 판매 상품과 연결
-   **STOCK**: 현재 매장의 상품 재고 확인
-   **RESERVATION**: 상품 예약 후 실제 매장 방문 연결

------------------------------------------------------------------------

## 6. Information Architecture

### 6.1 Onboarding

-   Splash
-   Style Preference

### 6.2 Map / Discover

-   Current Location
-   Store Pins
-   Search
-   Style Filter
-   Open Now Filter
-   Distance Filter
-   Store Preview

### 6.3 Store Profile

-   Profile: Profile Image, Store Name, Style Tags, Distance, Opening
    Status, Save, Directions
-   Story: NEW, TODAY, SALE, INFO
-   FEED: Outfit, Styling, Product, Store Interior, Display, Feed Post
    Detail, Items in Photo
-   ITEMS: Available Products, Product Category, Stock Status
-   INFO: Address, Opening Hours, Store Description, Contact Information

### 6.4 Product

-   Product Image
-   Product Name
-   Price
-   Size
-   Condition
-   Description
-   Store
-   Stock Status
-   Reservation

### 6.5 Reservation

-   Product
-   Store
-   Visit Date
-   Visit Time
-   Reservation Confirmation
-   Reservation Complete
-   Directions

------------------------------------------------------------------------

## 7. Main User Flow

### Primary Flow

App Launch → Style Preference → Map → Select Store Pin → Store Preview →
Store Profile → Feed → Feed Post → Items in Photo → Product Detail →
Stock Check → Reservation → Reservation Complete → Store Visit

### Alternative Flow A

Map → Store Preview → Store Profile → ITEMS → Product Detail →
Reservation

### Alternative Flow B

Map → Store Profile → STORY → Check Today's Store Information → ITEMS or
Store Visit

------------------------------------------------------------------------

# 8. MVP --- 12 Primary Screens

## Screen 01 --- Splash

**Purpose:** NEARWEAR 브랜드를 소개한다.

**Components** - NEARWEAR Logo - Brand tagline: `Vintage around you.`

------------------------------------------------------------------------

## Screen 02 --- Style Preference

**Purpose:** 사용자의 선호 빈티지 스타일을 선택한다.

**Example Categories** - Archive - Y2K - Minimal - Street - Workwear -
Classic - Japanese - Designer

**Requirements** - Multiple selection - Continue button - MVP에서는
완전한 추천 알고리즘을 구현할 필요 없음

------------------------------------------------------------------------

## Screen 03 --- Map / Discover

**Purpose:** 주변 빈티지샵을 지도에서 발견한다.

**Components** - Map - Current location - Store pins - Search - Style
filter - Open filter - Distance filter - Bottom navigation:
`MAP / SAVED / MY`

**Interaction** - 매장 핀 선택 → Screen 04 Store Preview

------------------------------------------------------------------------

## Screen 04 --- Store Preview

**Purpose:** 전체 매장 프로필에 들어가기 전에 실제 매장이 어떤 공간인지
빠르게 확인한다.

기존 지도 미리보기 카드 구조는 유지한다.

### Image Carousel

의류/상품 사진 대신 정확히 다음 **매장 관련 사진 3장**을 사용한다.

1.  Store Interior --- 매장 내부
2.  Display Rack --- 진열대
3.  Store Exterior --- 외관

**Requirements** - 좌우 swipe로 사진 이동 - 현재 위치를 `1/3`, `2/3`,
`3/3`으로 표시 - 이미지 강제 stretch 금지 - 원본 aspect ratio 유지 -
필요 시 이미지 영역 안에서 자연스럽게 crop - 사진만 움직이고 하단 정보
영역은 고정

### Fixed Store Information

-   Store name
-   Style tags
-   Distance
-   Opening status
-   Closing time
-   Save button
-   `VIEW SHOP` button

**Example** `AFTERDARK`\
`Archive · Street`\
`1.2km · OPEN · 22:00`\
`♡  VIEW SHOP →`

**Interaction** - VIEW SHOP → Screen 05 Store Profile

**Mobile** - 카드가 viewport 밖으로 잘리지 않아야 함 - 텍스트/버튼
overlap 금지 - carousel swipe가 모바일에서 자연스럽게 동작해야 함

------------------------------------------------------------------------

## Screen 05 --- Store Profile / Feed

**Purpose:** 매장의 정체성, 취향, 분위기를 소셜 프로필처럼 탐색한다.

전통적인 지도 앱 상세 페이지보다 **Instagram의 매장 프로필을 탐색하는
느낌**에 가깝게 구성한다.

### Profile Header

-   Profile image
-   Store name
-   Style tags
-   Distance
-   Opening status
-   Directions
-   Save

### Story

-   NEW
-   TODAY
-   SALE
-   INFO

### Tabs

`FEED / ITEMS / INFO`

FEED가 default tab이다.

### Feed

큰 **2-column image grid**를 사용한다.

콘텐츠 예: - Outfit photos - Styling photos - Product photos - Store
interior - Display racks - Store atmosphere

**Interaction** - Feed image 선택 → Screen 07 Feed Post Detail

------------------------------------------------------------------------

## Screen 06 --- Store Story

**Purpose:** 매장의 최근/일시적인 정보를 빠르게 확인한다.

**Examples** - Today's opening hours - New arrivals - Sale - Event -
Store notice - Current store update

**Requirements** - Full-screen story presentation - Store name - Posted
time (예: `2h`) - Story image - Short text - Optional `VIEW ITEMS`
action

**MVP Scope** - 사용자 story 조회만 구현 - 매장 운영자 story upload
기능은 구현하지 않음

------------------------------------------------------------------------

## Screen 07 --- Feed Post Detail

**Purpose:** 매장 콘텐츠를 크게 보고 사진 속 상품을 발견한다.

**Components** - Large feed image - Store name - Caption - Tags - Save /
Like - `사진 속 상품 보기` button

**Interaction** - `사진 속 상품 보기` → Screen 08 Items in Photo

------------------------------------------------------------------------

## Screen 08 --- Items in Photo

**Purpose:** 소셜형 피드 콘텐츠와 실제 매장 상품/재고를 연결한다.

**Each Item** - Product thumbnail - Product name - Price - Stock status
(`IN STOCK` / `SOLD`)

**Interaction** - Available product 선택 → Screen 10 Product Detail -
SOLD product는 예약 불가

------------------------------------------------------------------------

## Screen 09 --- Store Items

**Purpose:** 피드를 거치지 않고 현재 매장 상품을 바로 탐색한다.

**Tabs** `FEED / ITEMS / INFO` 중 ITEMS 선택 상태.

**Components** - Product grid - Category filters:
`ALL / OUTER / TOP / BOTTOM` - Image - Product name - Price - Stock
status

SOLD 상품은 명확하게 표시한다.

**Interaction** - Product 선택 → Screen 10 Product Detail

------------------------------------------------------------------------

## Screen 10 --- Product Detail / Stock

**Purpose:** 상품 상세와 현재 오프라인 매장 재고를 확인한다.

**Components** - Product images - Product name - Price - Size -
Condition - Description - Store - Current stock - RESERVE button

**Rules** - `IN STOCK` → RESERVE 활성화 - `SOLD` → 예약 불가

------------------------------------------------------------------------

## Screen 11 --- Reservation

**Purpose:** 상품과 방문 예정 정보를 확인하고 예약한다.

**Components** - Product - Price - Store - Visit date - Visit time -
Reservation notice - RESERVE button

**Interaction** - RESERVE → Screen 12 Reservation Complete

------------------------------------------------------------------------

## Screen 12 --- Reservation Complete

**Purpose:** 예약 완료를 확인하고 실제 매장 방문으로 연결한다.

**Components** - Reservation status - Product - Store - Visit
date/time - Directions button - Reservation history link

**Interaction** - 길찾기 → 실제 매장 방문 행동으로 연결

------------------------------------------------------------------------

## 9. Required MVP Functions

반드시 보여줘야 하는 기능:

-   Map-based store discovery
-   Store pins
-   Store Preview
-   3-image Store Preview carousel
-   Store Profile
-   Story viewing
-   2-column Store Feed
-   Feed Post Detail
-   Feed-to-product connection
-   Items in Photo
-   Store Product List
-   Product Detail
-   Stock Status
-   Reservation Flow
-   Reservation Complete

------------------------------------------------------------------------

## 10. Demo Data

실제 서비스 데이터 대신 fictional demo data를 사용한다.

### Main Demo Store

**AFTERDARK**

Style: `Archive / Street / Vintage`

Preview Images: 1. Interior 2. Display rack 3. Exterior

Feed: - 최소 6개의 sample posts

Stories: - NEW - TODAY - SALE - INFO

Products: - 최소 6개 - `IN STOCK`과 `SOLD` 상태 모두 포함

------------------------------------------------------------------------

## 11. Out of Scope

이번 MVP에서 구현하지 않는다.

-   Store owner/admin dashboard
-   Store owner account
-   Feed upload
-   Story upload
-   Real inventory management
-   POS integration
-   Payment
-   Delivery
-   Chat / DM
-   Reviews
-   Follow system
-   Comments
-   Full recommendation algorithm
-   Complex backend authentication
-   Production-level reservation management

------------------------------------------------------------------------

## 12. UX / UI Direction

### Direction

-   Editorial
-   Fashion-focused
-   Minimal
-   Contemporary
-   Toned-down
-   Slightly dark
-   Image-first

매장 사진, 착용샷, 상품 사진이 UI보다 먼저 보이도록 한다.

### Avoid

-   Bright neon-heavy UI
-   Excessive lime accents
-   Generic e-commerce appearance
-   Overly rounded/playful components
-   Photography와 경쟁하는 큰 UI 요소

------------------------------------------------------------------------

## 13. Responsive Requirements

Primary target: **Mobile**

-   Horizontal page overflow 금지
-   Small screen에서도 버튼 사용 가능
-   Text/control overlap 금지
-   Store Preview card는 viewport 안에 유지
-   Store Preview carousel은 horizontal swipe 지원
-   Images stretch 금지
-   Feed는 clean 2-column layout 유지
-   Bottom navigation은 모바일에서 항상 사용 가능해야 함

------------------------------------------------------------------------

## 14. Prototype Interaction Requirements

프로토타입에서 다음 흐름이 실제로 동작해야 한다.

1.  Launch app
2.  Select style preferences
3.  Enter map
4.  Select store pin
5.  Swipe Store Preview images
6.  Open Store Profile
7.  Open Story
8.  Browse Feed
9.  Select Feed Post
10. View Items in Photo
11. Select Product
12. Check Stock
13. Reserve Product
14. Complete Reservation

추가 경로:

Store Profile → ITEMS → Product Detail → Reservation

------------------------------------------------------------------------

## 15. MVP Success Criteria

사용자가 별도 설명 없이 다음 흐름을 이해하고 완료할 수 있어야 한다.

**"주변에 어떤 빈티지샵이 있지?"**\
→ 지도에서 매장 발견

**"여기는 어떤 공간이지?"**\
→ 내부 / 진열대 / 외관 미리보기

**"내 취향이랑 맞나?"**\
→ 매장 프로필 / 피드 탐색

**"이 사진에 나온 옷 예쁜데?"**\
→ 사진 속 상품 확인

**"아직 매장에 있나?"**\
→ 현재 재고 확인

**"그럼 직접 가서 봐야겠다."**\
→ 예약 → 실제 매장 방문
