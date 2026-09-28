# NEARWEAR PRD

Version 2.1 --- UI/UX Refinement

## 필수 제작 기준

- 제작버전: 모바일웹 430px 이하 버전
- 제작 언어: HTML, CSS, JavaScript
- 모든 세션은 구현 시작 전에 반드시 PRD 문서를 숙지할 것.

모바일 화면 너비 430px 이하를 우선 제작 기준으로 삼고, 360px / 390px / 430px에서 화면과 인터랙션을 확인한다. 더 넓은 화면의 반응형 지원은 보조 범위다.

## 1. Product Overview

NEARWEAR는 사용자의 패션 취향을 이미지 기반으로 파악하고, 현재 위치 또는
선택한 지역 주변의 빈티지 매장을 발견할 수 있도록 돕는 모바일 우선
빈티지 매장 탐색 서비스다.

핵심 경험:

Taste Discovery → Taste Profile → Nearby Store Discovery → Store Mood →
Current Inventory → Item Save → Reservation → Offline Store Visit

NEARWEAR의 목적은 온라인 구매가 아니라, 방문 전에 자신의 취향과 맞는
빈티지 매장과 현재 상품을 발견하고 원하는 상품을 예약한 뒤 실제 매장
방문으로 연결하는 것이다.

## 2. Core Problem

사용자는 방문 전에 주변 매장, 취향 적합도, 실제 매장 분위기, 현재 상품,
방문 시점의 상품 availability를 알기 어렵다.

NEARWEAR는 이미지 기반 취향 분석 + 위치 기반 매장 탐색 + 현재 상품
확인 + 방문 예약을 연결한다.

## 3. Product Principle

개인화는 필터가 아니라 탐색 우선순위다.

취향과 잘 맞는 매장은 강조하지만 비매칭 주변 매장을 숨기지 않는다.
사용자는 자신의 취향에 맞는 장소를 쉽게 발견하면서도 새로운 스타일과
매장을 계속 탐색할 수 있어야 한다.

## 4. Core User Scenario

사용자는 특정 지역 방문을 앞두고 NEARWEAR를 실행한다. START의 짧은
브랜드 splash 이후 Taste Discovery에서 이미지를 보며 자신의 취향을
설정한다. NEARWEAR는 취향과 주변 매장의 metadata를 비교해 잘 맞는 매장을
MAP에서 강조한다. 사용자는 Shop Preview와 Shop Detail에서 분위기와 현재
상품을 확인하고, 상품을 저장하거나 방문 시간을 선택해 예약한다. 예약된
상품은 선택한 방문 시간까지 매장에서 보관되며 사용자는 실제 매장을
방문한다.

## 5. Target Experience

-   Fashion Editorial
-   Vintage Select Shop
-   Photography First
-   Dark Functional UI
-   Strong Typography
-   Minimal Copy
-   Personal Discovery
-   Offline Visit

## 6. Visual Direction

### Expressive Screens

-   START
-   TASTE DISCOVERY
-   YOUR TASTE

### Functional Screens

-   MAP
-   SHOP PREVIEW
-   SHOP DETAIL
-   ITEM DETAIL
-   RESERVATION
-   RESERVATION COMPLETE
-   EXPLORE
-   SAVED
-   MY

모든 화면을 포스터처럼 만들지 않는다. Photography, typography, spacing,
image treatment, small accent를 통해 하나의 NEARWEAR 브랜드 시스템으로
연결한다.

## 7. START Visual Direction

기존 Red Editorial / LOOK THROUGH 방식은 이번 버전에서 제거한다.

START는 BLACK background 위에 중앙 NEARWEAR mark 하나만 표시하는 minimal
brand splash다.

Flow:

BLACK → centered NEARWEAR mark → 약 10초 → TASTE DISCOVERY 자동 이동

추가 설명, CTA, 화살표, photography, LOOK THROUGH, hover/click 진입
interaction은 사용하지 않는다. subtle fade 정도만 허용한다. 기존 URL
hash routing 구조를 이용해 자동 이동한다.

## 8. Navigation

START / TASTE DISCOVERY / YOUR TASTE에서는 Bottom Navigation을 표시하지
않는다.

MAP 이후: - MAP - EXPLORE - SAVED - MY

MAP이 기본 Home 역할을 한다.

## 9. MVP Screens

### 01 START

목적: 짧고 명확한 NEARWEAR brand entry.

-   BLACK
-   centered NEARWEAR mark
-   약 10초 후 TASTE DISCOVERY 자동 이동
-   no explanatory copy / CTA / LOOK THROUGH

### 02 TASTE DISCOVERY

목적: 이미지 선택을 통해 초기 사용자 취향을 파악한다.

Explore Preference: - WOMENSWEAR - MENSWEAR - ALL - Default: ALL

약 12개의 Taste Image를 사용한다.

기존 Card Stack 대신 vertical image browsing + scroll snap을 사용한다.
현재 이미지는 중앙에서 가장 크게 보이고 previous/next image는 일부
노출하거나 scale/opacity 차이를 둔다.

Controls: - SKIP - LIKE - 01 / 12

LIKE는 해당 이미지의 taste metadata weight를 증가시킨다. SKIP은 strong
dislike로 처리하지 않는다. LIKE/SKIP 후 다음 이미지로 자연스럽게
이동한다.

Visual hierarchy: 1. IMAGE 2. LIKE / SKIP 3. Progress / Title

### 03 YOUR TASTE

기존 Taste result 계산 기능을 유지한다.

최초 진입: 1. BLACK 2. Putting your taste together... 3. 6개의 puzzle
piece 등장 4. 서로 다른 위치에서 이동 5. 2 columns × 3 rows puzzle
assembly 6. final piece lock 7. completed puzzle 감상 8. puzzle shrink /
fade 9. Taste Result

가능한 한 실제 LIKE 이미지 6개를 사용한다. 6개 미만일 때만 taste
metadata로 보완한다.

Puzzle은 실제 tab/slot silhouette를 사용하되 childish하지 않은 fashion
editorial collage로 표현한다.

Piece tap: - selected piece 1.15--1.25 scale - other pieces dim -
outside tap restores

VIEW MY PUZZLE에서도 동일한 completed puzzle을 다시 볼 수 있다.

### 04 MAP / HOME

Dark Map 구조 유지.

-   Current Area
-   Search
-   Filter
-   Current Location
-   FOR YOUR TASTE
-   ALL SHOPS
-   SAVED
-   Pins
-   Bottom Navigation

Taste matching은 강조 기능이다. 비매칭 주변 매장을 제거하지 않는다.

기존 MAP 하단 NEAR YOU list는 제거한다.

MAP = location discovery\
EXPLORE = photo/content discovery

### 05 SHOP PREVIEW

기존 구조 유지: - 3 image carousel - counter - Shop Name - Distance -
Open Status - Style Tags - Taste Match - Store Save - VIEW SHOP

Photography 좌우 empty margin을 줄이고 preview card width를 적극
사용한다. 이미지 비율을 유지하고 왜곡을 방지한다. Mobile에서는 MAP을
지나치게 가리지 않는다.

### 06 SHOP DETAIL / PROFILE

기존 Hero carousel, Store Profile, Taste Match, stories,
FEED/ITEMS/INFO, product linkage, Add to Taste 유지.

Hero image의 불필요한 horizontal margin을 줄인다.

FEED: - Mobile: 3 columns - Wider screen: up to 4 columns - small grid
gap - items / outfits / accessories / shoes / bags / styling / store
details

작은 grid 위에는 과도한 action UI를 올리지 않는다. 필요한 action은
expanded/detail state에서 제공할 수 있다.

### 07 ITEM DETAIL

-   Multiple Images
-   Price
-   SIZE
-   MEASUREMENTS
-   CONDITION
-   FLAWS
-   Availability
-   SAVE ITEM
-   RESERVE

Availability: - AVAILABLE - RESERVED - SOLD

RESERVE는 AVAILABLE일 때만 활성화한다.

### 08 RESERVATION

기존 date/time validation 유지.

User-facing: - Selected Item - Store - Price - SELECT A DATE - SELECT A
TIME - 예약 상품은 선택한 방문 시간까지 매장에서 보관됩니다. - RESERVE
ITEM →

개발용 설명은 제거한다.

### 09 RESERVATION COMPLETE

-   RESERVED
-   Item
-   Store
-   Date
-   Time
-   Location
-   VIEW MAP
-   VIEW RESERVATION
-   CANCEL RESERVATION

VIEW MAP은 예약 매장이 선택된 MAP을 연다. Cancel 후 조건에 따라
AVAILABLE로 복귀하며 Re-reservation이 작동해야 한다.

### 10 EXPLORE

-   FOR YOUR TASTE
-   NEAR YOU
-   NEW IN
-   TRY SOMETHING DIFFERENT

동일 매장/이미지 반복을 줄인다. TRY SOMETHING DIFFERENT는 현재 취향과
조금 다른 매장을 보여주며 personalization이 discovery를 제한하지 않게
한다.

### 11 SAVED

Tabs: - SHOPS - ITEMS - TASTE

Store Save → SHOPS\
Item Save → ITEMS\
Add to Taste → TASTE

세 state는 독립적으로 관리한다.

### 12 MY / MY TASTE

-   Taste Profile
-   YOU SEEM TO LIKE
-   Explore Preference
-   REFINE MY TASTE
-   VIEW MY PUZZLE
-   Reservations
-   Location
-   Notifications

REFINE MY TASTE → Taste Discovery\
VIEW MY PUZZLE → completed 6-piece puzzle

SAVED 콘텐츠를 MY에 중복 표시하지 않는다.

## 10. Action Semantics

STORE SAVE, ITEM SAVE, ADD TO TASTE는 서로 다른 action으로 유지한다.

LIKE: taste metadata weight 증가\
SKIP: strong dislike 아님\
ADD TO TASTE: 관련 taste weight 증가

Store metadata와 User Taste Profile을 비교해 matching store를 강조하지만
non-matching store도 계속 표시한다. 내부 matching score는 사용자에게
직접 노출하지 않는다.

## 11. Data / Prototype

MVP에서는 mock data 및 Browser Storage를 사용할 수 있다.

Browser Storage: - Taste Profile - Explore Preference - Liked Taste
Images - Saved Shops - Saved Items - Taste Images - Reservation - Item
Availability - Map Filters

기술 구현 설명은 사용자 UI에 노출하지 않는다.

## 12. Copy Principles

Remove: - DEMO labels - Frontend explanations - Browser Storage
explanations - Prototype disclaimers - Fake inventory / fake location
explanations - repetitive instructions - excessive AI-style editorial
filler

Copy는 짧고 명확하며 photography를 방해하지 않게 한다.

## 13. Technical / Preservation Requirements

새 프로젝트를 만들지 않는다.

특별한 기술적 이유가 없다면 기존 framework, URL hash routing, data
relationships, Browser Storage, reservation lifecycle, navigation, back
navigation, scroll restoration, toast/feedback을 유지한다.

Backend는 MVP에 필수가 아니다. Shipping / checkout / payment flow는
추가하지 않는다.

Core outcome: Online Discovery → Reservation → Offline Visit

## 14. MVP Success Criteria

Core flow:

START → TASTE DISCOVERY → YOUR TASTE → MAP → SHOP PREVIEW → SHOP DETAIL
→ ITEM DETAIL → RESERVATION → RESERVATION COMPLETE → OFFLINE VISIT

또한 다음이 가능해야 한다: - 모든 주변 매장 탐색 - Taste Matching Store
강조 - Store Save - Item Save - Add to Taste - Reservation - Reservation
Cancel - Re-reservation - Taste Refinement - VIEW MAP - 360px / 390px /
Desktop 사용

## 통합 구현 기준 (2026-09-27)

학원 `NEARWEAR_Current_MVP_12_Screens(2).docx`의 12화면 구성과 탐색·저장·예약 흐름을 기반으로 한다. 최신 사용자 요청 및 PRD v2.1 / Revised MVP에서 변경한 START, 세로 취향 탐색, 퍼즐, 3열 피드가 과거 화면보다 우선한다. 화면별 경로와 수용 기준은 [MVP.md](MVP.md)에서 관리한다.

- 기존 프로젝트와 저장 데이터, ID, hash 경로를 유지한다.
- 이번 수정에서는 이미지를 생성하거나 새 사진을 다운로드하지 않는다. 현재 로컬 자산만 재사용한다.
- 기능 화면은 학원 자료의 올리브 블랙 톤과 큰 매장 사진을 반영한다.
- 학원 화면의 DEMO 설명, 예전 START CTA, Card Stack, MAP 하단 목록은 최신 요청에 따라 복구하지 않는다.
- 로컬 테스트까지만 진행하며 배포하지 않는다.

## 2026-09-28 화면 피드백

- TASTE DISCOVERY의 사진별 제목 제거, MY PUZZLE 안내는 영어로 표시.
- 합정·상수 표시를 HAPJEONG · SANGSU로 변경하되 기존 저장 값은 보존.
- 지도 검색·필터 유지, 강조 모드는 지도 하단에 배치. 두 손가락 확대·축소와 드래그 지원.
- 취향 강조는 기존 연두색, 저장 강조는 로즈 브라운.
- 사진 카운터·닫기 UI를 축소하고 스토리는 같은 간격으로 전체 너비에 배치.
- NAVER MAP 영문 표시, EXPLORE 하트는 매장명 중앙에 정렬.
- MY의 예약 알림 보조 문구 제거, NOTIFICATIONS와 스위치 중앙 정렬.

## 추가 조정: EXPLORE 간격 / 지도 조작

- EXPLORE 모든 매장 카드의 세로 간격과 섹션 아래 여백은 64px.
- 지도 기본 배율 1 기준 1.5배씩 확대/축소 각각 3단계: 최소 약 0.296배, 최대 3.375배. +/− 버튼, 핀치, 휠 지원.
- 모든 배율에서 상하좌우 드래그 허용. 기존 지도 개념도 범위 밖은 반복 블록 배경으로 표시하며 실제 지도 API는 연결하지 않는다.


## 2026-09-28 추가 UI/UX 수정 — 최신 요청 우선

아래 기준은 위의 START 10초, 영어 안내, 스토리 전체 너비 배치 기준을 대체한다.

- 기존 모바일 스타일을 모든 뷰포트에서 재사용하며 앱 최대 너비는 430px이다. 360/390/430px 및 넓은 뷰포트에서 확인한다.
- 전체 Pretendard를 로컬 번들로 사용한다. 크기·굵기 위계는 유지하며 START NEARWEAR 로고만 모바일 기준 10px 확대한다.
- START 로고의 0.2초 페이드가 끝난 뒤 약 1초 후 기존 /taste 경로로 이동한다.
- 퍼즐 6조각 animationend를 모두 확인한 후 1.5초 동안 완성 상태를 표시한다. 조각 선택/해제 인터랙션은 유지한다.
- 고유명사와 핵심 큰 타이틀을 제외한 기능 문구·메뉴·버튼·상태·안내는 자연스러운 한글로 표시한다. 저장 값과 데이터 enum은 바꾸지 않는다.
- 예약 날짜·시간 입력은 기존 50px 높이와 네이티브 입력을 유지한다. 날짜 아이콘은 오른쪽 시간 화살표와 정렬한다. 시간 옵션은 동일 폰트/왼쪽 정렬/간격을 적용하며 OS 네이티브 팝업의 행 높이는 플랫폼이 최종 결정한다.
- 매장 스토리의 원형 이미지와 기능을 유지하고 간격을 절반 수준으로 축소한다. 하트 중심은 매장명 행에 맞춘다.
- 상품 상세에는 한글 상품명만 한 번 표시한다.
- 예약 확인/취소 버튼은 2열로 배치하고 같은 높이로 맞춘다.
- 지도 하단 강조 모드는 하단 정보 바 위 5px, 줌 컨트롤은 기존보다 12px 위에 배치한다. 현재 위치 버튼은 유지한다.
- hash routing, Browser Storage 키·구조, 취향 점수/매칭, 예약·취소·재예약, 저장, 검색·필터 및 지도 연결을 유지한다. 배포하지 않고 로컬에서 검증한다.
