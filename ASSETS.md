# NEARWEAR 이미지 출처

첨부 콜라주는 분위기와 피드 구성을 참고하는 용도로만 사용했습니다. 앱에 삽입하지 않았습니다. 아래 이미지는 독립된 데모 사진이며 실제 매장·상품 재고를 나타내지 않습니다.

## 데모 사진

Unsplash 이미지 CDN에서 내려받아 로컬에 포함했습니다. 최종 서비스에서 사용할 경우 실제 매장·상품 사진으로 교체해야 합니다. 사진의 URL은 아래와 같습니다.

| 로컬 파일 | 원본 이미지 |
|---|---|
| interior.jpg | https://images.unsplash.com/photo-1441986300917-64674bd600d8 |
| rack.jpg | https://images.unsplash.com/photo-1445205170230-053b83016050 |
| outfit.jpg | https://images.unsplash.com/photo-1483985988355-763728e1935b |
| jacket.jpg | https://images.unsplash.com/photo-1551028719-00167b16eac5 |
| denim.jpg | https://images.unsplash.com/photo-1542272604-787c3835535d |
| shirt.jpg | https://images.unsplash.com/photo-1598033129183-c4f50c736f10 |
| knit.jpg | https://images.unsplash.com/photo-1576566588028-4147f3842f27 |
| coat.jpg | https://images.unsplash.com/photo-1544022613-e87ca75a784a |
| detail.jpg | https://images.unsplash.com/photo-1521572163474-6864f9cf17ab |

상품명·가격·치수·재고 상태는 모두 허구의 데모 데이터입니다.

## 생성 이미지

내장 imagegen 도구로 생성했습니다. CLI나 별도 API 키는 사용하지 않았습니다.

### public/assets/exterior.png

최종 생성 프롬프트:

> Photorealistic editorial 35mm film photograph of the exterior of a small vintage clothing boutique in a quiet Seoul side street. Dark charcoal weathered facade, wide shop window showing racks of worn denim and leather jackets, concrete steps, simple small sign with exact text AFTERDARK. Cloudy late afternoon, muted warm gray palette, no people, no cars, no overlay text or watermarks. Wide 3:2 composition. Authentic independent vintage shop atmosphere. This is a fictional demo shop image for a fashion app.

## 기타

- DM Sans / Playfair Display: Google Fonts CSS. 외부 연결 실패 시 시스템 sans-serif / Georgia 폴백.
- 아이콘과 지도: 자체 SVG 선 도형. 지도는 실제 지도 타일이 아닌 명시적 데모 개념도입니다.
- 사진은 object-fit: cover 또는 contain으로 표시하며 가로세로 비율을 강제로 변경하지 않습니다.


## 다크 디자인 개편 추가 사진

이전 데님 워드마크는 사용자 피드백으로 폐기하고 제품에서 제거했습니다. 현재 로고는 코드로 작성한 순수 타이포그래피입니다.

아래 두 장은 내장 imagegen 도구로 생성한 허구의 편집 사진입니다. 첨부 콜라주는 사진 구성의 참고이며 실제 앱 이미지로 사용하지 않았습니다.

### public/assets/editorial.png

생성 프롬프트:
> Photorealistic independent vintage fashion editorial photo, vertical 4:5. Full-body candid photograph of an adult East Asian woman in a softly worn black leather biker jacket with silver diagonal zipper and lapels, washed charcoal straight jeans, black boots, carrying a vintage dark brown leather bag. Face turned aside, natural walking pose on a quiet Seoul street against weathered pale gray concrete. Understated archive clothing store editorial, 35mm film, subtle grain, muted natural colors, soft overcast daylight, clothes clearly lit and visible, not blacked out. No text, no watermarks, no borders, no artificial fashion campaign glamour.

### public/assets/rail.png

생성 프롬프트:
> Photorealistic close editorial photo of a tightly curated independent vintage clothing shop rail. Worn black leather jackets, olive cotton field jackets, faded indigo denim and oatmeal knitwear on mismatched wooden hangers, tightly framed with shelves of folded clothes in background. Intimate lived-in Seoul vintage boutique, dark metal shelving, warm tungsten spotlight balanced with soft window light, rich visible fabric texture, subtle film grain, restrained brown gray olive palette. Vertical 4:5, no people, no overlaid text, no logos or watermarks. Photo must be well exposed and product focused, not excessively dark.

## v2.1 추가 생성 사진

내장 imagegen으로 생성했으며 실제 판매 상품의 사진이 아닙니다.

- `public/assets/bag.png`: A single worn dark brown leather shoulder bag with a short strap and simple silver buckle, circa 1990s vintage. Photorealistic independent vintage shop inventory photography on light gray slightly textured concrete floor. Soft natural window lighting, crisp leather grain and signs of wear, restrained editorial styling. Portrait 4:5. No text, no logos, no people, no collage.
- `public/assets/shoes.png`: A pair of black vintage leather penny loafers on weathered warm gray studio floor, subtle worn creases and leather soles visible in a natural arrangement. Photorealistic vintage store inventory photography, soft daylight, documentary product image, portrait 4:5. No text, no branding, no decorative props, no people.
- `public/assets/accessory.png`: Vintage oxidized silver chain necklace, slim silver rings and black leather belt with silver buckle carefully arranged on neutral charcoal gray textile. Editorial vintage fashion accessories inventory photograph, soft side daylight, highly visible material detail, muted colors, portrait 4:5. No text, no logos, no people.
