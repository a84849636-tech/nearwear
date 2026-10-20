"""Real-browser acceptance checks. Requires Python Playwright and Chromium.
Run against the running dev/preview server: python tests/browser_smoke.py
Original asset completeness is intentionally checked separately (npm run assets:check).
"""
import json, os
from pathlib import Path
from playwright.sync_api import sync_playwright
BASE=os.environ.get('NEARWEAR_TEST_URL','http://127.0.0.1:4173')
OUT=Path(os.environ.get('NEARWEAR_ARTIFACTS','/workspace/nearwear-artifacts'))
OUT.mkdir(parents=True,exist_ok=True)
checks=[]
def passed(name):
    checks.append(name)
    print('PASS',name,flush=True)
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
    context=browser.new_context(viewport={'width':430,'height':932},reduced_motion='reduce')
    page=context.new_page()
    errors=[]
    page.on('pageerror',lambda error: errors.append(str(error)))
    def visit(path):
        page.goto(BASE+'/#'+path)
        page.wait_for_selector('#app > main')
    page.goto(BASE+'/')
    page.wait_for_selector('.start-logo')
    passed('root URL shows START')
    visit('/start')
    page.get_by_role('button',name='NEARWEAR 시작').click()
    assert page.url.endswith('/gender')
    passed('START enters gender selection')
    for gender in ['ALL','MENS','WOMENS']:
        visit('/gender')
        page.get_by_role('button',name=gender,exact=True).click()
        assert page.locator('.taste-card').count()==12
        before=page.evaluate("JSON.parse(localStorage.getItem('nw3-data')).taste.decisions")
        stage=page.locator('.taste-stage')
        box=stage.bounding_box()
        page.mouse.move(box['x']+box['width']*.7,box['y']+box['height']*.5)
        page.mouse.down();page.mouse.move(box['x']+box['width']*.3,box['y']+box['height']*.5,steps=8);page.mouse.up()
        after=page.evaluate("JSON.parse(localStorage.getItem('nw3-data')).taste.decisions")
        assert before==after
        for index in range(12):
            page.locator('[data-action="decide"][data-choice="skip"]').click()
            page.wait_for_timeout(35)
        page.wait_for_url('**/#/result')
        assert page.locator('h1').inner_text()=='선호 선택 없음'
        assert page.evaluate("Object.keys(JSON.parse(localStorage.getItem('nw3-data')).taste.decisions).length")==12
        passed(gender+' drag has no vote; twelve distinct SKIPs give neutral result')
    # Normal-motion double-click and completion interrupted by reload.
    visit('/gender');page.get_by_role('button',name='ALL',exact=True).click()
    page.emulate_media(reduced_motion='no-preference')
    page.locator('[data-choice="like"]').click()
    page.evaluate("document.querySelector('[data-choice=like]').click()")
    assert page.evaluate("Object.keys(JSON.parse(localStorage.getItem('nw3-data')).taste.decisions).length")==1
    page.wait_for_timeout(760)
    assert page.locator('.taste-cylinder').evaluate("el=>getComputedStyle(el).transitionDuration")=='0.7s'
    page.reload();assert page.locator('.taste-status').inner_text().strip().endswith('1 / 12')
    passed('700ms rotation, duplicate input blocked and reload resumes progress')
    page.emulate_media(reduced_motion='reduce')
    for i in range(11):
        page.locator('[data-choice="like"]').click();page.wait_for_timeout(35)
    page.wait_for_url('**/#/result')
    assert page.locator('h1').inner_text()!='선호 선택 없음'
    page.get_by_role('link',name='취향에 맞는 매장 찾기').click()
    assert page.locator('.bottom-nav a').all_text_contents()==['홈','탐색','업로드','저장','마이']
    assert page.locator('.map-pin').count()==8
    page.locator('[data-action="pin"][data-id="ototo"]').click()
    assert page.locator('.preview-sheet').count()==0
    page.locator('[data-action="pin"][data-id="ototo"]').click()
    assert page.locator('.preview-sheet h1').inner_text()=='OTOTO'
    page.locator('[data-action="save"][data-id="ototo"]').click()
    page.locator('[data-action="preview-photo"][data-index="2"]').click()
    assert page.locator('.preview-hero .photo').get_attribute('data-asset')=='gallery/ototo/02'
    page.get_by_role('link',name='상세보기').click()
    assert page.locator('.feed-grid button').count()==15
    page.get_by_role('link',name='상품',exact=True).click()
    page.get_by_role('link',name='빈티지 밀리터리 하이넥 재킷',exact=True).click()
    assert page.locator('.product-price').inner_text()=='₩128,000'
    page.locator('[data-action="product-photo"][data-index="2"]').click()
    assert page.locator('.product-hero .photo').get_attribute('data-asset')=='product/ototo-01/02'
    page.locator('[data-action="save"][data-kind="products"]').click()
    page.get_by_role('link',name='방문 예약',exact=True).click()
    assert page.get_by_role('dialog').is_visible()
    page.get_by_role('button',name='로그인하고 계속하기').click()
    page.locator('[name="email"]').fill('demo@example.com')
    page.locator('[name="password"]').fill('demo-password')
    page.get_by_role('button',name='비밀번호 보기',exact=True).click()
    assert page.locator('[name="password"]').get_attribute('type')=='text'
    page.get_by_role('button',name='로그인하기',exact=True).click()
    page.wait_for_url('**/#/reserve/ototo-01')
    assert page.get_by_role('dialog').count()==0
    # Guest saved shops and products merge into this demo user.
    assert page.evaluate("(()=>{const d=JSON.parse(localStorage.getItem('nw3-data'));const a=JSON.parse(sessionStorage.getItem('nw3-auth'));return d.accounts[a.id].shops.includes('ototo')&&d.accounts[a.id].products.includes('ototo-01')})()")
    dates=page.evaluate("async()=>{const m=await import('/src/advanced-data.js');const s=m.shops.find(s=>s.id==='ototo');const now=new Date();const ds=[];for(let i=1;i<8;i++){const date=new Date(now.getTime()+i*86400000);const d=m.dateInSeoul(date);if(m.slotsForDate(s,d).length)ds.push(d)}return ds}")
    page.locator('[name="date"]').fill(dates[0]);page.locator('[name="date"]').dispatch_event('change')
    time=page.locator('[name="time"] option').nth(1).get_attribute('value') or page.locator('[name="time"] option').nth(1).inner_text()
    page.locator('[name="time"]').select_option(label=time)
    page.get_by_role('button',name='예약하기',exact=True).click()
    assert '시연 신청이 저장되었습니다' in page.locator('.request-result').inner_text()
    assert page.locator('#reserve-form button[type="submit"]').is_disabled()
    page.reload()
    page.get_by_role('button',name='예약하기',exact=True).click()
    assert '이미 예약된 상품' in page.locator('.form-error').inner_text()
    page.get_by_role('button',name='뒤로가기').click()
    visit('/my')
    assert '예약 시연 신청' in page.locator('.record-card').inner_text()
    page.get_by_role('button',name='예약 취소').click()
    assert '시연 예약 취소' in page.locator('.record-card').inner_text()
    passed('map → preview → store → product → auth → reservation, duplicate block and cancel')
    visit('/delivery/baltz-01')
    page.get_by_role('button',name='당일 배송 신청하기').click()
    assert '배송지 주소' in page.locator('.form-error').inner_text()
    secret_address='DEMO-ADDRESS-MUST-NOT-PERSIST'
    page.locator('[name="address"]').fill(secret_address)
    page.locator('[name="payment"]').select_option('demo')
    page.get_by_role('button',name='당일 배송 신청하기').click()
    assert '시연 신청이 저장되었습니다' in page.locator('.request-result').inner_text()
    assert secret_address not in page.evaluate('JSON.stringify(localStorage)')
    assert 'demo-password' not in page.evaluate('JSON.stringify(localStorage)+JSON.stringify(sessionStorage)')
    assert 'demo@example.com' not in page.evaluate('JSON.stringify(localStorage)+JSON.stringify(sessionStorage)')
    passed('delivery validation and demo storage omit address/password/email')
    for shop in ['ototo','otuvintage','baltz','pinonpippi','gowon','ttul','ryohe']:
        visit('/shop/'+shop+'/info')
        assert page.locator('.info-heading h1').inner_text()==shop.upper()
        assert page.locator('.story-circles a').count()==4
        if shop=='ttul':assert page.locator('a[href="https://www.instagram.com/_tul/"]').count()==1
        if shop=='gowon':assert '12:30 - 20:00' in page.locator('.store-info').inner_text()
        for story in ['new','today','sale','info']:
            visit('/story/'+shop+'/'+story)
            assert page.locator('.story-byline b').inner_text()==shop.upper()
            assert page.locator('.story-copy h1').inner_text()==story.upper()
    passed('seven shops × four story types preserve shop/type; final data corrections match')
    visit('/story/ototo/new')
    page.get_by_role('button',name='다음 스토리').click()
    page.get_by_role('button',name='상품 보기').click()
    assert page.url.endswith('/product/ototo-01')
    passed('verified OTOTO NEW product link opens matching product')
    visit('/saved/shops');assert page.locator('.saved-shop h2').inner_text()=='OTOTO'
    visit('/saved/products');assert page.locator('.saved-product-grid h2').count()==1
    visit('/upload');assert page.locator('.upload-shop header b').inner_text()=='OTOTO'
    page.locator('.upload-cards a').first.click()
    assert page.url.endswith('/story/ototo/today')
    passed('saved tabs and upload story identity')
    for path in ['/explore','/explore/popular','/explore/styles','/explore/new','/puzzle','/settings']:
        visit(path);assert page.locator('main').inner_text().strip()
    passed('explore derivatives, puzzle and settings render')
    visit('/settings');page.get_by_role('button',name='로그아웃').click()
    visit('/reserve/baltz-01');page.get_by_role('button',name='회원가입',exact=True).click()
    page.get_by_role('button',name='회원가입하기',exact=True).click()
    assert page.locator('.form-error').inner_text()
    for name,value in [('email','signup@example.com'),('password','signup-demo123'),('confirmation','signup-demo123'),('nickname','발표 시연')]:page.locator('[name="'+name+'"]').fill(value)
    for name in ['age','terms','privacy']:page.locator('[name="'+name+'"]').check()
    page.get_by_role('button',name='회원가입하기',exact=True).click()
    page.wait_for_url('**/#/signup-complete')
    page.get_by_role('button',name='시작하기',exact=True).click()
    page.wait_for_url('**/#/reserve/baltz-01')
    passed('signup validation, completion and original reservation return')
    visit('/map');page.locator('[data-action="panel"][data-id="style"]').click()
    for tag in ['아카이브','다크웨어','재패니즈','빈티지','아메카지','스트리트']:page.locator('[data-action="style"][data-id="'+tag+'"]').click()
    assert page.evaluate("JSON.parse(localStorage.getItem('nw3-data')).filters.styleTags.length")==5
    page.locator('[data-action="style"][data-id=""]').click()
    page.locator('[data-action="panel"][data-id="style"]').click()
    page.locator('[data-action="panel"][data-id="distance"]').click()
    assert page.locator('.distances button').count()==5
    page.locator('[data-action="distance"][data-id="500"]').click()
    assert page.locator('.map-pin').count()==0
    page.locator('[data-action="panel"][data-id="distance"]').click()
    page.locator('[data-action="distance"][data-id=""]').click()
    page.locator('[data-action="zoom"][data-step="1"]').click()
    assert '1.25' in page.locator('.map-scene').get_attribute('style')
    passed('style limit, five distances, missing-coordinate honesty and zoom')
    # Screenshots and geometry for representative supplied layouts.
    screenshots=['/gender','/result','/map','/preview/ototo','/shop/gowon/feed','/shop/ototo/info','/shop/ototo/products','/product/ototo-01','/login','/signup','/reserve/ototo-01','/delivery/baltz-01','/upload','/explore','/explore/styles','/saved/shops','/my','/puzzle','/settings']
    for width in [430,375,320,1440]:
        page.set_viewport_size({'width':width,'height':932})
        for path in screenshots:
            visit(path)
            overflow=page.evaluate('document.documentElement.scrollWidth > innerWidth')
            assert not overflow,(width,path)
            if width==430:
                page.evaluate("document.querySelector('#toast').classList.remove('visible')")
                page.screenshot(path=str(OUT/(path.strip('/').replace('/','-')+'.png')),full_page=True)
        if width==430:
            visit('/product/ototo-01')
            box=page.locator('.product-hero').bounding_box()
            assert round(box['x'])==24 and round(box['width'])==382,box
            visit('/gender')
            assert round(page.locator('#app').bounding_box()['width'])==430
    passed('430px / 24px gutters and no horizontal overflow at 320,375,430,1440')
    assert not errors,errors
    passed('no browser JavaScript exceptions')
    browser.close()
result={'passed':len(checks),'checks':checks,'page_errors':errors,'original_images_verified':False}
(OUT/'browser-results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
print(json.dumps(result,ensure_ascii=False),flush=True)
