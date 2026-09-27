# NEARWEAR v2.1

기존 vanilla JavaScript 프로젝트를 유지하며 12개 MVP 화면을 수정했습니다. 최신 기준은 PRD.md / PROMPT.md입니다. Vercel 배포는 하지 않았습니다.

## 실행 / 빌드

Node.js 20 이상에서 이 폴더를 열고 실행합니다. 패키지 설치나 API 키는 필요하지 않습니다.

```sh
node scripts/serve.mjs
```

http://localhost:4173/#/start 에서 시작합니다. START는 10초 후 자동 전환됩니다.

```sh
node scripts/build.mjs
# 기존 서버 종료 후 빌드 결과 실행
node scripts/serve.mjs dist
```

## 12개 화면과 경로

| 화면 | 경로 | 주요 동작 |
|---|---|---|
| 01 START | #/start | 검은 화면, 중앙 마크, 10초 자동 전환 |
| 02 TASTE DISCOVERY | #/taste | 12장 세로 snap, LIKE / SKIP, 성별 선호 |
| 03 YOUR TASTE | #/your-taste | 6조각 퍼즐 조립 → 취향 결과 |
| 04 MAP | #/map | 주변 매장 전체 + 취향 강조, 검색 / 필터 |
| 05 SHOP PREVIEW | #/preview/afterdark | 사진 3장, 저장, VIEW SHOP |
| 06 SHOP DETAIL | #/shop/afterdark/feed | hero, stories, FEED / ITEMS / INFO |
| 07 ITEM DETAIL | #/product/afterdark/leather | 이미지, 실측·상태, SAVE ITEM, RESERVE |
| 08 RESERVATION | #/reserve/afterdark/leather | 날짜 / 시간 검증 |
| 09 COMPLETE | #/complete/{예약 ID} | 예약 상세, VIEW MAP, 취소 / 재예약 |
| 10 EXPLORE | #/explore | 네 가지 사진 탐색 섹션 |
| 11 SAVED | #/saved/shops | SHOPS / ITEMS / TASTE 별도 관리 |
| 12 MY | #/my | 취향, 선호, 퍼즐 재보기, 예약, 설정 |

피드 확대·사진 속 상품·스토리·길찾기·퍼즐 재보기는 보조 경로입니다. 기존 #/splash, #/preferences 경로도 유지합니다.

## 핵심 파일

- src/app.js: 기존 해시 라우터, 지도 SVG, 저장·예약 및 화면 흐름 확장.
- src/data.js: 기존 매장 4개와 상품 ID 유지, 상품 3개 및 피드 확장.
- src/taste.js: LIKE 가중치, 추천 점수, 퍼즐 사진 선택.
- src/puzzle.js: tab / slot SVG 6조각 퍼즐.
- src/v21.css: 세로 이미지 탐색, 퍼즐 애니메이션, 반응형 피드.
- src/style.css / src/dark.css: 기존 기반 레이아웃과 다크 테마 유지.
- public/assets/: 기존 사진 + 가방 / 신발 / 액세서리 사진.

## 데이터와 동작

- 기존 nw-saved, nw-preferences, nw-reservations, nw-likes 키를 지우지 않습니다. 신규 상태는 별도 키로 추가합니다.
- LIKE는 가중치를 더하며 SKIP은 부정 점수를 부여하지 않습니다. REFINE에서 재응답하면 해당 사진의 선택을 갱신합니다.
- ALL이 기본값입니다. 성별 선호는 이미지 순서와 추천 점수에 반영하며 지도 매장을 숨기지 않습니다.
- 지도 추천 / 전체 / 저장 모드는 강조만 변경합니다. 직접 지정한 검색 / 스타일 / 거리 / 영업 필터만 결과를 좁힙니다.
- 퍼즐은 LIKE한 서로 다른 사진을 우선 선택하고 부족한 수만 메타데이터로 보완합니다. 완성된 6개 ID를 저장합니다.
- 예약은 내일부터 7일 이내와 영업시간으로 검증합니다. AVAILABLE만 예약 가능하며 취소 후 다시 AVAILABLE, 방문 시간 경과 후 EXPIRED입니다.

## mock 범위

- 매장 4곳, 상품 9개, 가격·실측·상태·영업정보·스토리 시각은 mock입니다. 매장별 사진 순서는 다르지만 일부 사진과 카탈로그를 공유합니다.
- 지도는 기존 SVG 개념도입니다. GPS, 지도 API, 실시간 거리는 연결하지 않았습니다. 위치 설정은 지역 표시만 변경합니다.
- 대부분 상품의 두 번째 이미지는 첫 사진의 확대 디테일입니다. 실제 다른 각도 사진은 후속 교체가 필요합니다.
- 취향 매칭은 로컬 메타데이터 점수이며 AI 분석 서버는 사용하지 않습니다.
- 저장·취향·예약·알림 설정은 localStorage에 저장합니다. 기기 간 동기화와 실제 푸시는 없습니다.
- 예약은 실제 매장에 전달되거나 재고를 확보하지 않습니다. 탭 간 갱신은 반영하지만 서버 기반 동시 예약 잠금은 없습니다.
- 결제 / 배송 / DM / 댓글 / 팔로우 / 리뷰 / POS / 운영자 업로드는 제외했습니다.

사진 출처는 ASSETS.md, 검증 결과는 VERIFICATION.md를 참고하세요.

## 학원 문서와의 통합

학원 Current MVP의 화면 구성을 바탕으로 최신 PRD·PROMPT를 적용한 화면별 기준은 [MVP.md](MVP.md)에 정리했습니다. 이번 추가 수정은 기존 사진을 재사용해 올리브 블랙 톤, 모바일 EXPLORE·SAVED의 큰 매장 사진, 취향 선택 피드백과 지도 저장 강조 갱신을 보완했습니다.

2026-09-28: 지도용 가상 매장 12곳을 추가해 총 16곳으로 확장했습니다. 기존 매장 4곳과 저장 ID는 유지하며 기존 사진을 재사용합니다. 추가 핀은 기본 화면과 지도 외곽에 분산하고, 축소/이동하면 주변 매장도 볼 수 있습니다. 새 매장 모두 미리보기·프로필·상품 연결을 지원합니다.
