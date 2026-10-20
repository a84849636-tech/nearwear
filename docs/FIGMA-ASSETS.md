# 원본 PNG 자산 연결

대화에 표시된 스크린샷은 화면 분석에 사용했으나, 현재 실행 환경에는 원본 파일이 없습니다. 파일이 확보되면 이 문서의 키를 연결하면 됩니다. `원본 이미지 준비 중` 자리는 임시 사진이 아니라 미연결 상태 표시입니다.

`public/figma/assets.json`은 다음과 같은 원본 자산 키 → 로컬 파일 경로 사전입니다. 같은 원본 사진이 여러 화면에 쓰이면 여러 키에 같은 파일을 지정할 수 있습니다. 키 수는 필요한 표시 위치 수이며 고유 사진 수가 아닙니다.

```json
{
  "gallery/ototo/01": "/public/figma/ototo-interior.png",
  "taste/all/01": "/public/figma/all-01.png",
  "product-hero/ototo-01/01": "/public/figma/ototo-jacket-hero.png",
  "product/ototo-01/01": "/public/figma/ototo-jacket-front.png",
  "story-new/ototo/02": "/public/figma/ototo-new-02.png"
}
```

원본 파일명은 임의 변경하지 않아도 되며 manifest에서 경로를 지정할 수 있습니다. 값을 `{ "src": "/public/figma/file.png", "position": "50% 40%" }`로 지정하면 잘림 위치를 조정할 수 있습니다. 임의 합성·새 이미지 생성·구버전 사진 교체는 하지 않습니다.

| 자산 그룹 | 키 형식·순서 |
| --- | --- |
| 03 온보딩 | `taste/{all,mens,womens}/01`~`12`, 각 긴 PNG에서 위→아래 순서 |
| 04 결과 | `result/{1,2,3,4,5,6,7,9,10}/01`~`04`, 2×2 좌상→우상→좌하→우하 |
| 09·10 갤러리 | `gallery/{shopId}/01`~, OTOTO·OTUVINTAGE·BALTZ·PINONPIPPI·GOWON 각5, TTUL·RYOHE 각2 |
| 매장 로고 | `logo/{shopId}/01` |
| 10 피드 | `feed/{shopId}/01`~`15`, 3열 행 우선 순서 |
| 11 NEW | `story-new/{shopId}/01`~, PINONPIPPI 3장·나머지4장 |
| 12 TODAY | `story-today/{shopId}/01` |
| 13 SALE | `story-sale/{shopId}/01`~, GOWON4장·나머지2장 |
| 14 INFO | `story-info/{shopId}/01`, TTUL은 원본에 사진 없음 |
| 16 상품 그리드 | `catalog/{shopId}/01`~`15`, 3열 행 우선 순서 |
| 17 대표 사진 | `product-hero/{shopId}-01/01` |
| 17 썸네일 | `product/{shopId}-01/01`~, 화면에 보인 순서와 개수 |
| 지도 | `map/background/01`, `map/info/01` |
| 21 배너·스타일 | `explore/hero/01`, `explore-style/{0~9}/01`, styleNames 배열의 인덱스 |
| 21 매장 | `explore-shop/{id}/01`, advanced-data.js 참조 |
| 23·24 이미지 | `my/basket/01`, `my/profile/01` |

확인 명령: `npm run assets:check`. 모든 연결 후에도 실제 430px 화면 비교가 필요합니다. manifest 파일만 채운 것으로 시각적 일치를 완료했다고 간주하지 않습니다.

받은 원본 화면에서 대조할 항목:

- 09 첫 번째 대표사진과 첫 번째 썸네일 동일.
- 10 갤러리와 09 같은 매장 사진. 매장 간 이미지 혼용 금지.
- 20 OTUVINTAGE 행거 사진은 NEW, 거울은 TODAY.
- 24 퍼즐 순서는 `puzzleOrder`이며 온보딩 순서와 다름. LIKE 기록은 카드 ID로 동일하게 반영.
- PNG 해상도 축소나 색상 변경 없이 원본을 보존.
