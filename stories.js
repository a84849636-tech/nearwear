/* User-supplied screen 11 exports. These identities are separate from legacy demo stores. */
(() => {
  'use strict';
  const shops = [
    ['ryohe', 'RYOHE', 4], ['ttul', 'TTUL', 4], ['ototo', 'OTOTO', 4],
    ['otuvintage', 'OTUVINTAGE', 4], ['baltz', 'BALTZ', 4],
    ['pinonpippi', 'PINONPIPPI', 3], ['gowon', 'GOWON', 4]
  ].map(([id, name, count]) => ({ id, name, images: Array.from({ length: count }, (_, i) =>
    `assets/new-stories/${id}/NEW${i ? '-' + i : ''}.png`) }));
  const viewer = document.createElement('dialog');
  viewer.className = 'new-story-viewer';
  viewer.setAttribute('aria-label', 'NEW 매장 스토리');
  viewer.innerHTML = `<div class="new-story-stage">
    <img class="new-story-image" alt="">
    <p class="story-sr-only" aria-live="polite" id="new-story-position"></p>
    <button type="button" class="new-story-hit new-story-close" aria-label="스토리 닫기"></button>
    <button type="button" class="new-story-hit new-story-prev" aria-label="이전 스토리"></button>
    <button type="button" class="new-story-hit new-story-next" aria-label="다음 스토리"></button>
    <button type="button" class="new-story-hit new-story-product" aria-label="상품 보기"></button>
    <p class="new-story-feedback" role="status" hidden></p>
  </div>`;
  document.body.append(viewer);
  const stage = viewer.querySelector('.new-story-stage');
  const photo = viewer.querySelector('img');
  const previous = viewer.querySelector('.new-story-prev');
  const next = viewer.querySelector('.new-story-next');
  const feedback = viewer.querySelector('.new-story-feedback');
  let shop, index = 0, originHash = '#screen-1', returnFocus, oldOverflow;
  function route() {
    const match = /^#story\/([a-z]+)\/([1-4])$/.exec(location.hash);
    const selected = match && shops.find(s => s.id === match[1]);
    if (!selected || Number(match[2]) > selected.images.length) {
      if (viewer.open) { viewer.close(); document.body.style.overflow = oldOverflow || ''; returnFocus?.focus(); }
      return;
    }
    shop = selected; index = Number(match[2]) - 1;
    if (!viewer.open) {
      returnFocus = document.activeElement;
      oldOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden'; viewer.showModal();
      viewer.querySelector('.new-story-close').focus();
    }
    photo.src = shop.images[index];
    photo.alt = `${shop.name} NEW 스토리 ${index + 1} / ${shop.images.length}`;
    viewer.querySelector('#new-story-position').textContent = photo.alt;
    previous.disabled = index === 0; next.disabled = index === shop.images.length - 1;
    feedback.hidden = true;
    if (shop.images[index + 1]) { const preload = new Image(); preload.src = shop.images[index + 1]; }
  }
  function open(id, position = 0) {
    const selected = shops.find(s => s.id === id);
    if (!selected || !Number.isInteger(position) || position < 0 || position >= selected.images.length) return;
    if (!viewer.open) originHash = location.hash.startsWith('#story/') ? '#screen-1' : location.hash;
    closeModal();
    location.hash = `story/${id}/${position + 1}`;
    route();
  }
  function move(delta) {
    if (!shop || index + delta < 0 || index + delta >= shop.images.length) return;
    history.replaceState(null, '', `#story/${shop.id}/${index + delta + 1}`);
    route();
  }
  function close() {
    viewer.close(); document.body.style.overflow = oldOverflow || '';
    history.replaceState(null, '', location.pathname + location.search + originHash);
    returnFocus?.focus();
  }
  viewer.querySelector('.new-story-close').addEventListener('click', close);
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  viewer.querySelector('.new-story-product').addEventListener('click', () => {
    feedback.textContent = '이 스토리에 연결된 상품 상세 화면이 아직 제공되지 않았습니다.';
    feedback.hidden = false;
  });
  photo.addEventListener('error', () => {
    feedback.textContent = '스토리 이미지를 불러오지 못했습니다. 다시 열어 주세요.';
    feedback.hidden = false;
  });
  viewer.addEventListener('cancel', event => { event.preventDefault(); close(); });
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); move(event.key === 'ArrowLeft' ? -1 : 1);
    }
  });
  let start;
  stage.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    start = { x: event.clientX, y: event.clientY };
  });
  stage.addEventListener('pointercancel', () => { start = null; });
  stage.addEventListener('pointerup', event => {
    if (!start) return;
    const dx = event.clientX - start.x, dy = event.clientY - start.y;
    start = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      move(dx < 0 ? 1 : -1);
      // Suppress the click generated after a swipe over a navigation hit area.
      stage.addEventListener('click', event => { event.preventDefault(); event.stopPropagation(); }, { once: true, capture: true });
    }
  });
  function choose() {
    openModal('<h3>NEW 스토리</h3><div class="story-shop-list">' + shops.map(s =>
      `<button type="button" data-new-story="${s.id}"><img src="${s.images[0]}" alt=""><span>${s.name}<small>NEW · ${s.images.length}개의 스토리</small></span></button>`).join('') + '</div>');
    document.querySelectorAll('[data-new-story]').forEach(button => button.addEventListener('click', () => open(button.dataset.newStory)));
  }
  const entry = document.createElement('button');
  entry.type = 'button'; entry.className = 'new-story-entry'; entry.textContent = '11 NEW 스토리';
  entry.addEventListener('click', choose);
  document.querySelector('.view-toggle').prepend(entry);
  window.addEventListener('hashchange', route);
  window.NearwearStories = Object.freeze({ open, close, shops });
  route();
})();
