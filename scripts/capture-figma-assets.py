"""Capture only verified photo rectangles from original exported PNG screens.

Usage:
 python scripts/capture-figma-assets.py --input-dir /path/to/pngs --plan /path/to/plan.json
Requires the environment's Python Playwright and Chromium. Does not generate,
retouch, upscale, reconstruct covered pixels, or change the source files.
Plan coordinates are CSS pixels at referenceWidth (usually 430); a 2x export
is captured at its original 2x pixel resolution, with device scale factor 1.
"""
import argparse, base64, json, math, os, re, tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright

def intersects(a,b):
    return a[0]<b[0]+b[2] and a[0]+a[2]>b[0] and a[1]<b[1]+b[3] and a[1]+a[3]>b[1]

def validate_rect(rect):
    if len(rect)!=4 or not all(isinstance(v,(int,float)) and math.isfinite(v) for v in rect) or min(rect)<0 or rect[2]<=0 or rect[3]<=0:
        raise ValueError('Invalid capture rectangle')

def capture(input_dir,plan_path,output_dir,manifest_path):
    input_dir=Path(input_dir).resolve()
    plan=json.loads(Path(plan_path).read_text())
    output_dir=Path(output_dir).resolve()
    manifest_path=Path(manifest_path).resolve()
    # Output must be app-served original asset storage, never an arbitrary remote destination.
    repository=Path(__file__).resolve().parents[1]
    public=(repository/'public/figma').resolve()
    if not output_dir.is_relative_to(public) or not manifest_path.is_relative_to(public):
        raise ValueError('Output and manifest must remain inside public/figma')
    existing=json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
    jobs=[]
    seen=set()
    for frame in plan['frames']:
        source=(input_dir/frame['source']).resolve()
        if not source.is_relative_to(input_dir) or not source.is_file() or source.suffix.lower()!='.png':
            raise ValueError('Source must be an existing PNG inside input-dir: '+frame['source'])
        if source.read_bytes()[:8]!=b'\x89PNG\r\n\x1a\n':raise ValueError('Source is not a PNG')
        for item in frame['captures']:
            key=item['key']
            if not re.fullmatch(r'[a-z0-9-]+/[a-z0-9-]+/\d{2}',key) or key in seen:
                raise ValueError('Invalid or duplicated asset key: '+key)
            seen.add(key);rect=item['rect'];validate_rect(rect)
            for exclusion in frame.get('excludeUI',[]):
                validate_rect(exclusion)
                if intersects(rect,exclusion):raise ValueError('Crop includes excluded UI: '+key)
        jobs.append((frame,source))
    output_dir.mkdir(parents=True,exist_ok=True)
    captured=[]
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
        context=browser.new_context(device_scale_factor=1)
        page=context.new_page()
        try:
            for frame,source in jobs:
                encoded=base64.b64encode(source.read_bytes()).decode('ascii')
                page.set_content('<style>html,body{margin:0;padding:0}img{display:block;max-width:none}</style><img id="source" src="data:image/png;base64,'+encoded+'">')
                page.wait_for_function('document.querySelector("img").complete && document.querySelector("img").naturalWidth>0')
                dims=page.locator('#source').evaluate('(img)=>({width:img.naturalWidth,height:img.naturalHeight})')
                scale=dims['width']/frame.get('referenceWidth',430)
                if scale<1:raise ValueError('Source smaller than reference; high-quality capture would require upscaling: '+source.name)
                if dims['width']>16000 or dims['height']>16000:raise ValueError('Source exceeds supported browser viewport')
                page.set_viewport_size(dims)
                for item in frame['captures']:
                    x,y,w,h=[round(n*scale) for n in item['rect']]
                    if x+w>dims['width'] or y+h>dims['height']:raise ValueError('Capture extends outside source: '+item['key'])
                    target=output_dir/(item['key'].replace('/','-')+'.png')
                    if target.resolve()==source:raise ValueError('Source and output must be distinct')
                    page.screenshot(path=str(target),clip={'x':x,'y':y,'width':w,'height':h},animations='disabled')
                    relative='/'+target.relative_to(repository).as_posix()
                    existing[item['key']]=relative
                    captured.append({'key':item['key'],'source':source.name,'output':relative,'pixels':[w,h],'sourceScale':scale})
        finally:
            browser.close()
    manifest_path.parent.mkdir(parents=True,exist_ok=True)
    # Persist only after all captures have passed validation. Existing unrelated bindings remain.
    handle,temp=tempfile.mkstemp(dir=manifest_path.parent,suffix='.json.tmp')
    with os.fdopen(handle,'w') as output:json.dump(existing,output,ensure_ascii=False,indent=2);output.write('\n')
    os.replace(temp,manifest_path)
    return captured

if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input-dir',required=True)
    parser.add_argument('--plan',required=True)
    parser.add_argument('--output-dir',default=str(Path(__file__).resolve().parents[1]/'public/figma/captured'))
    parser.add_argument('--manifest',default=str(Path(__file__).resolve().parents[1]/'public/figma/assets.json'))
    args=parser.parse_args()
    result=capture(args.input_dir,args.plan,args.output_dir,args.manifest)
    print(json.dumps({'captured':len(result),'assets':result},ensure_ascii=False,indent=2))
