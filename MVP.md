# NEARWEAR 통합 MVP 12화면

기준: 학원 Current MVP 12 Screens + PRD v2.1 + PROMPT v2.1 + Revised MVP + 최신 사용자 수정 요청. 학원 문서는 화면 구조의 기준이며 이후 요청에서 바뀐 디자인·동작은 최신안을 적용한다. 기존 로컬 사진만 사용한다.

| 번호 / 화면 | 학원 문서에서 계승 | 최신 구현 및 수용 기준 | 경로 |
|---|---|---|---|
| 01 START | 브랜드 진입 | BLACK / 마크 하나 / 10초 자동 전환 / 메뉴 없음 | #/start |
| 02 TASTE DISCOVERY | 이미지 LIKE·SKIP | 12장 세로 snap, 현재 사진 강조, ALL 기본, LIKE 가중치·SKIP 무감점 | #/taste |
| 03 YOUR TASTE | 스타일 결과·FIND YOUR PLACES | LIKE 사진 우선 2×3 tab/slot 퍼즐, 순차 조립·탭 확대·결과 | #/your-taste |
| 04 MAP | 모든 주변 매장, 추천 강조, 검색·필터 | 올리브 다크 지도 유지, 추천은 강조만, 하단 목록 제거 | #/map |
| 05 SHOP PREVIEW | 사진·매장명·스타일·거리·영업·저장·VIEW SHOP | 3장 carousel, 비율 유지, 사진만 이동, 하단 정보 고정 | #/preview/:store |
| 06 SHOP DETAIL | 프로필·스토리·탭·사진 속 상품 | 넓은 hero, 모바일 3열·desktop 4열, 확대 화면에서 Add to Taste | #/shop/:store/feed |
| 07 ITEM DETAIL | 사진·가격·재고·저장·예약 | 다중 이미지, SIZE/MEASUREMENTS/CONDITION/FLAWS, AVAILABLE만 예약 | #/product/:store/:item |
| 08 RESERVATION | 상품·매장·방문 날짜·시간 | 날짜/시간 검증, 짧은 보관 안내, 개발 설명 제거 | #/reserve/:store/:item |
| 09 COMPLETE | 예약 내역·지도·취소 | VIEW MAP 매장 선택, 취소 후 AVAILABLE, 재예약 | #/complete/:reservation |
| 10 EXPLORE | 취향/근처/신규/다른 취향 섹션 | 모바일 큰 사진 한 열, 4개 매장 재사용, 추천과 다른 매장 포함 | #/explore |
| 11 SAVED | SHOPS / ITEMS / TASTE | 독립 저장 상태, 큰 매장 사진, 새로고침 유지 | #/saved/shops |
| 12 MY | 취향·선호·재설정·퍼즐·예약·위치·알림 | 같은 퍼즐 재보기, SAVED 중복 없음 | #/my |

## 연결 흐름

START → TASTE → YOUR TASTE → MAP → PREVIEW → SHOP → 피드 확대 → 사진 속 상품 → ITEM → RESERVATION → COMPLETE.

MAP / EXPLORE / SAVED / MY 메뉴를 연결한다. 기존 #/splash, #/preferences 별칭과 스토리·길찾기 경로를 유지한다. 뒤로 가기, 스크롤 복원, toast, Browser Storage를 보존한다.

## 상태 구분

Store Save → SHOPS, Item Save → ITEMS, Add to Taste → TASTE. LIKE 및 Add to Taste만 취향 가중치를 증가시킨다. 지도 강조 모드와 사용자가 직접 지정하는 검색 필터는 별개다. 예약 상태는 AVAILABLE → RESERVED → 취소 → AVAILABLE이며 SOLD는 예약할 수 없다.

## 로컬 MVP 경계

실제 지도/GPS/POS/매장 서버/푸시/계정 동기화는 연결하지 않는다. 4개 mock 매장은 일부 사진·상품을 공유한다. 상품 두 번째 사진 일부는 확대 디테일이다. 학원 문서에 포함된 사진을 원본 상품 자산으로 추출하거나 새 이미지를 생성하지 않았다. 기존 확보된 사진을 사용했다.

## 검증

360px / 390px / Desktop, START 10초, 취향 선택·퍼즐, 지도 전체 핀, 검색·필터, 캐러셀, 스토리·탭·상품 연결, 3종 저장, 예약·취소·재예약, 메뉴·뒤로 가기·저장 유지를 확인한다. 결과는 VERIFICATION.md 및 verification-results.json에 기록한다.
