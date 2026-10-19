(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 모바일 메뉴
  var toggle = document.querySelector('.ggal-gnb__toggle');
  var menu = document.getElementById('ggal-menu');
  if (toggle && menu) toggle.addEventListener('click', function () {
    var open = menu.classList.toggle('ggal-is-open');
    toggle.setAttribute('aria-expanded', open);
    toggle.textContent = open ? '×' : '☰';
  });
  if (menu) menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) { menu.classList.remove('ggal-is-open'); toggle.setAttribute('aria-expanded', false); toggle.textContent = '☰'; }
  });

  // 지표 카운트업 (히어로 진입 시 1회)
  function countUp(el) {
    var end = +el.dataset.count, start = performance.now(), dur = 1400;
    function tick(t) {
      var p = Math.min((t - start) / dur, 1), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
      el.textContent = v.toLocaleString('ko-KR');
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  // 히어로 성장 그래프: 선이 그려진 뒤 끝점 숫자 카운트업
  var growth = document.querySelector('.ggal-growth');
  if (!reduce && growth) {
    growth.classList.add('ggal-is-armed');
    requestAnimationFrame(function () { requestAnimationFrame(function () { growth.classList.add('ggal-is-run'); }); });
    setTimeout(function () { countUp(growth.querySelector('[data-count]')); }, 1500);
  }
  // 지표 바 숫자는 화면에 들어올 때 카운트업
  var statEls = document.querySelectorAll('#ggal-stats [data-count]');
  if (statEls.length && !reduce && 'IntersectionObserver' in window) {
    var sio = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { statEls.forEach(countUp); sio.disconnect(); } }, { threshold: 0.4 });
    sio.observe(document.getElementById('ggal-stats'));
  }

  // AB 테스트 40칸 매트릭스 (8 소구점 × 5 변형)
  var matrix = document.getElementById('ggal-matrix');
  var wins = [2, 11, 17, 26, 35];
  for (var i = 0; matrix && i < 40; i++) {
    var c = document.createElement('span');
    c.className = 'ggal-ab__cell' + (wins.indexOf(i) > -1 ? ' ggal-ab__cell--win' : '');
    matrix.appendChild(c);
  }

  // 성공사례 막대그래프: 화면에 들어오면 자라나기
  var caseList = document.getElementById('ggal-case-list');
  if (caseList && !reduce && 'IntersectionObserver' in window) {
    caseList.classList.add('ggal-charts-armed');
    var io = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { caseList.classList.remove('ggal-charts-armed'); io.disconnect(); }
    }, { threshold: 0.3 });
    io.observe(caseList);
  }

  // 유튜브 썸네일 대체 이미지 + 모달 재생
  document.querySelectorAll('.ggal-yt__thumb img').forEach(function (img) {
    img.addEventListener('error', function () { if (img.dataset.fallback && img.src !== img.dataset.fallback) img.src = img.dataset.fallback; });
    img.addEventListener('load', function () { if (img.naturalWidth <= 120 && img.dataset.fallback) img.src = img.dataset.fallback; });
  });
  var modal = document.getElementById('ggal-modal'), frame = document.getElementById('ggal-modal-frame'), lastBtn = null;
  function closeModal() { modal.classList.remove('ggal-is-open'); frame.innerHTML = ''; if (lastBtn) lastBtn.focus(); }
  if (modal && frame) document.querySelectorAll('[data-yt]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      lastBtn = btn;
      frame.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + btn.dataset.yt + '?autoplay=1&rel=0" title="유튜브 영상" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
      modal.classList.add('ggal-is-open');
      modal.querySelector('.ggal-modal__close').focus();
    });
  });
  if (modal) {
    modal.querySelector('.ggal-modal__close').addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && modal.classList.contains('ggal-is-open')) closeModal(); });
  }

  // 인사이트 카테고리 필터
  var tabs = document.querySelectorAll('.ggal-ins-tab'), cards = document.querySelectorAll('.ggal-ins-card'), empty = document.querySelector('.ggal-ins-empty');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var f = tab.dataset.filter, shown = 0;
      tabs.forEach(function (t) { t.setAttribute('aria-pressed', t === tab); });
      cards.forEach(function (c) { var on = f === 'all' || c.dataset.cat === f; c.hidden = !on; if (on) shown++; });
      if (empty) empty.hidden = shown > 0;
    });
  });

  // 숏폼 릴: 화면에 보일 때만 재생 (모션 줄이기 설정이면 정지)
  var shorts = document.querySelector('.ggal-reel--shorts');
  if (shorts) {
    var vids = shorts.querySelectorAll('video');
    if (reduce) { vids.forEach(function (v) { v.removeAttribute('autoplay'); v.pause(); }); }
    else if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        vids.forEach(function (v) { if (es[0].isIntersecting) { var p = v.play(); if (p) p.catch(function () {}); } else v.pause(); });
      }, { threshold: 0.1 }).observe(shorts);
    }
  }

  // 첫 화면 성장 곡선: 한 번 그린 뒤 빛이 흐름 (궤도 회전은 CSS)
  var heroSec = document.querySelector('.ggal-hero');
  if (heroSec && heroSec.querySelector('.ggal-hero__chart') && !reduce) {
    heroSec.classList.add('ggal-is-armed');
    requestAnimationFrame(function () { requestAnimationFrame(function () { heroSec.classList.add('ggal-is-run'); }); });
  }
  // (이전) 박스형 모션그래픽
  var orbit = document.querySelector('.ggal-orbit');
  if (orbit && !reduce) {
    orbit.classList.add('ggal-is-armed');
    requestAnimationFrame(function () { requestAnimationFrame(function () { orbit.classList.add('ggal-is-run'); }); });
  }

  // 유튜브 팝업: 페이지에 팝업 틀이 없으면 자동으로 만든다
  if (!document.getElementById('ggal-modal') && document.querySelector('[data-yt]')) {
    var ym = document.createElement('div');
    ym.className = 'ggal-modal'; ym.id = 'ggal-modal'; ym.setAttribute('role', 'dialog'); ym.setAttribute('aria-modal', 'true'); ym.setAttribute('aria-label', '유튜브 영상');
    ym.innerHTML = '<div class="ggal-modal__box"><button class="ggal-modal__close" type="button" aria-label="영상 닫기">×</button><div class="ggal-modal__frame"></div></div>';
    (document.querySelector('.ggal-page') || document.body).appendChild(ym);
    var yframe = ym.querySelector('.ggal-modal__frame'), ylast = null;
    var yclose = function () { ym.classList.remove('ggal-is-open'); yframe.innerHTML = ''; if (ylast) ylast.focus(); };
    document.querySelectorAll('[data-yt]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        ylast = btn;
        yframe.innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + btn.dataset.yt + '?autoplay=1&rel=0" title="유튜브 영상" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>';
        ym.classList.add('ggal-is-open'); ym.querySelector('.ggal-modal__close').focus();
      });
    });
    ym.querySelector('.ggal-modal__close').addEventListener('click', yclose);
    ym.addEventListener('click', function (e) { if (e.target === ym) yclose(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ym.classList.contains('ggal-is-open')) yclose(); });
  }

  // 빠른 광고 문의 팝업 (data-ggal-diag 버튼)
  // 접수 주소: window.GGAL_FORM_ENDPOINT 에 넣으면 그 주소로 전송(JSON POST).
  // 주소가 없으면 입력값을 들고 광고 문의 페이지(아임웹 입력폼)로 이동 → 신청 누락 없음.
  var diagBtns = document.querySelectorAll('[data-ggal-diag]');
  if (diagBtns.length) {
    var dg = document.createElement('div');
    dg.className = 'ggal-diag'; dg.setAttribute('role', 'dialog'); dg.setAttribute('aria-modal', 'true'); dg.setAttribute('aria-labelledby', 'ggal-diag-title');
    dg.innerHTML = '<div class="ggal-diag__box"><button type="button" class="ggal-diag__close" aria-label="닫기">×</button>' +
      '<p class="ggal-diag__title" id="ggal-diag-title">빠른 광고 문의</p>' +
      '<p class="ggal-diag__desc">남겨주시면 담당자가 24시간 이내에 직접 연락드립니다.</p>' +
      '<form class="ggal-diag__form" novalidate>' +
      '<label>브랜드명<input name="brand" required autocomplete="organization" placeholder="회사명이 아닌 브랜드명"></label>' +
      '<div class="ggal-diag__row"><label>성함<input name="name" required autocomplete="name" placeholder="홍길동"></label>' +
      '<label>직책<input name="position" required autocomplete="organization-title" placeholder="대표, 마케팅 팀장"></label></div>' +
      '<label>사이트 URL<input name="url" type="url" required placeholder="https://"></label>' +
      '<label>연락처<input name="tel" type="tel" required placeholder="010-0000-0000" autocomplete="tel"></label>' +
      '<label>희망 서비스<select name="service"><option>그로스 파트너십</option><option>퍼포먼스 대행</option></select></label>' +
      '<label>월 광고비 규모<select name="budget"><option>300만 원 미만</option><option>300~1,000만 원</option><option>1,000~3,000만 원</option><option>3,000만 원 이상</option></select></label>' +
      '<button type="submit" class="ggal-btn ggal-btn--primary">광고 문의하기</button>' +
      '<p class="ggal-diag__msg" role="status"></p></form></div>';
    (document.querySelector('.ggal-page') || document.body).appendChild(dg);
    var dform = dg.querySelector('form'), dmsg = dg.querySelector('.ggal-diag__msg'), dlast = null;
    var dclose = function () { dg.classList.remove('ggal-is-open'); if (dlast) dlast.focus(); };
    diagBtns.forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault(); dlast = b; dmsg.textContent = '';
        if (b.dataset.ggalService) dform.service.value = b.dataset.ggalService;
        dg.classList.add('ggal-is-open'); dform.brand.focus();
      });
    });
    dg.querySelector('.ggal-diag__close').addEventListener('click', dclose);
    dg.addEventListener('click', function (e) { if (e.target === dg) dclose(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && dg.classList.contains('ggal-is-open')) dclose(); });
    dform.addEventListener('submit', function (e) {
      e.preventDefault();
      var miss = Array.prototype.find.call(dform.querySelectorAll('[required]'), function (f) { return !f.value.trim(); });
      if (miss) { dmsg.textContent = '필수 항목을 입력해 주세요: ' + miss.parentNode.firstChild.textContent; miss.focus(); return; }
      var data = {}; new FormData(dform).forEach(function (v, k) { data[k] = v; });
      if (window.GGAL_FORM_ENDPOINT) {
        fetch(window.GGAL_FORM_ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
          .then(function () { dmsg.textContent = '접수되었습니다. 24시간 이내에 연락드리겠습니다'; dform.reset(); })
          .catch(function () { dmsg.textContent = '전송에 실패했습니다. 카카오톡 상담으로 문의해 주세요'; });
      } else {
        var q = Object.keys(data).map(function (k) { return k + '=' + encodeURIComponent(data[k]); }).join('&');
        location.href = (window.GGAL_CONTACT_URL || 'contact.html') + '?' + q + '#ggal-contact';
      }
    });
  }

  // 광고 문의 페이지: 팝업에서 넘어온 값 미리 채우기 (시안 폼 기준)
  if (location.search && document.getElementById('ggal-form')) {
    var qp = new URLSearchParams(location.search), f2 = document.getElementById('ggal-form');
    if (f2.brand && qp.get('brand')) f2.brand.value = qp.get('brand');
    if (f2.url && qp.get('url')) f2.url.value = qp.get('url');
    if (f2.tel && qp.get('tel')) f2.tel.value = qp.get('tel');
    if (f2.name && qp.get('name')) f2.name.value = qp.get('name');
    if (f2.position && qp.get('position')) f2.position.value = qp.get('position');
  }

  // 다른 페이지 앵커로 들어오면 부드럽게 스크롤
  if (location.hash && document.querySelector(location.hash)) {
    var tgt = document.querySelector(location.hash);
    setTimeout(function () { tgt.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); }, 150);
  }

  // 첫 화면 성장 카운터: ₩0 → ₩1,000,000,000, 0·1천만·1억·10억 구간을 같은 시간으로 통과
  var grow = document.querySelector('.ggal-grow');
  if (grow) {
    var gnum = grow.querySelector('[data-grow]'), gfill = grow.querySelector('.ggal-grow__fill'), gsteps = grow.querySelectorAll('.ggal-grow__steps li');
    var stops = [0, 1e7, 1e8, 1e9];
    var paint = function (p) {
      var seg = Math.min(2, Math.floor(p * 3)), t = p * 3 - seg, a = stops[seg], b = stops[seg + 1];
      var v = seg === 0 ? b * t : a * Math.pow(b / a, t);
      if (p >= 1) v = 1e9;
      gnum.textContent = Math.round(v).toLocaleString('ko-KR');
      gfill.style.setProperty('--p', (p * 100) + '%');
      gsteps.forEach(function (li) { li.classList.toggle('ggal-is-on', v >= +li.dataset.at); });
    };
    if (reduce) { paint(1); }
    else {
      paint(0);
      var gstart = null, gdur = 2800;
      setTimeout(function () {
        requestAnimationFrame(function step(ts) {
          if (!gstart) gstart = ts;
          var p = Math.min((ts - gstart) / gdur, 1), e = 1 - Math.pow(1 - p, 2);
          paint(e);
          if (p < 1) requestAnimationFrame(step);
        });
      }, 400);
    }
  }

  // 성장 로드맵: 화면에 들어오면 진행선이 채워지고 단계가 차례로 켜짐
  var road = document.querySelector('.ggal-road');
  if (road && !reduce && 'IntersectionObserver' in window) {
    road.classList.add('ggal-is-armed');
    var rio = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { road.classList.remove('ggal-is-armed'); road.classList.add('ggal-is-run'); rio.disconnect(); }
    }, { threshold: 0.35 });
    rio.observe(road);
  }

  // 첫 화면 누적 실적 카드: 광고비 300억 / 매출 1,000억 숫자와 막대가 함께 올라감
  var total = document.querySelector('.ggal-total');
  if (total && !reduce) {
    total.classList.add('ggal-is-armed');
    setTimeout(function () {
      total.classList.remove('ggal-is-armed');
      total.querySelectorAll('[data-count]').forEach(function (el) {
        var end = +el.dataset.count, t0 = performance.now(), dur = 2200;
        (function tick(t) {
          var p = Math.min((t - t0) / dur, 1), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
          el.textContent = v.toLocaleString('ko-KR');
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, 350);
  }

  // 원본 이미지 크게 보기 (data-zoom)
  var zoomBtns = document.querySelectorAll('[data-zoom]');
  if (zoomBtns.length) {
    var zm = document.createElement('div');
    zm.className = 'ggal-zoom'; zm.setAttribute('role', 'dialog'); zm.setAttribute('aria-modal', 'true');
    zm.innerHTML = '<button type="button" aria-label="닫기">×</button><img alt="">';
    (document.querySelector('.ggal-page') || document.body).appendChild(zm);
    var zimg = zm.querySelector('img'), zlast = null;
    var zclose = function () { zm.classList.remove('ggal-is-open'); if (zlast) zlast.focus(); };
    zoomBtns.forEach(function (b) {
      b.addEventListener('click', function () {
        zlast = b; zimg.src = b.dataset.zoom; zimg.alt = b.dataset.zoomAlt || '';
        zm.classList.add('ggal-is-open'); zm.querySelector('button').focus();
      });
    });
    zm.querySelector('button').addEventListener('click', zclose);
    zm.addEventListener('click', function (e) { if (e.target === zm) zclose(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && zm.classList.contains('ggal-is-open')) zclose(); });
  }

  // 폼 (시안용: 실제 접수는 아임웹 입력폼 위젯으로 연결)
  var form = document.getElementById('ggal-form'), done = document.getElementById('ggal-form-done');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var missing = Array.prototype.find.call(form.querySelectorAll('[required]'), function (f) { return !f.value.trim(); });
    if (missing) {
      done.textContent = '필수 항목을 입력해 주세요: ' + missing.closest('label').querySelector('.ggal-field__label').firstChild.textContent;
      done.classList.add('ggal-is-on'); missing.focus(); return;
    }
    done.textContent = '광고 문의가 접수되었습니다. 영업일 기준 1일 안에 연락드리겠습니다';
    done.classList.add('ggal-is-on');
  });
  // 스크롤 블러 인 (Mobbin 스타일) — 섹션 제목·박스가 화면에 들어올 때 한 번
  (function () {
    var root = document.querySelector('.ggal-page');
    if (!root || !('IntersectionObserver' in window)) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var sel = '.ggal-section .ggal-head, .ggal-auth__row > div, .ggal-auth__ai, .ggal-res, .ggal-res2, .ggal-lever__list li, .ggal-case, .ggal-easy__card, .ggal-vs2__col, .ggal-ops__card, .ggal-flow__you, .ggal-cp, .ggal-ai2 > div, .ggal-svc__card, .ggal-plan, ' +
              '.ggal-basic__card, .ggal-worry__card, .ggal-switch__card, .ggal-bcard, .ggal-why, .ggal-ins-card, .ggal-landcard, .ggal-rules';
    var els = root.querySelectorAll(sel);
    if (!els.length) return;
    root.classList.add('ggal-rv-on');
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (e) { if (e.isIntersecting || e.boundingClientRect.top < 0) { e.target.classList.add('ggal-rv-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });
    els.forEach(function (el) {
      var sib = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0;
      el.classList.add('ggal-rv');
      el.style.setProperty('--rv-d', Math.min(sib, 5) * 0.07 + 's');
      io.observe(el);
    });
  })();
  // 첫 화면 제목 숫자 카운트업 (0원 → 10,000,000원)
  (function () {
    var el = document.querySelector('.ggal-cnt');
    if (!el) return;
    var v = el.querySelector('.ggal-cnt__v'), to = +el.dataset.to || 0;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var fmt = function (n) { return Math.round(n).toLocaleString('ko-KR'); };
    v.textContent = '0';
    setTimeout(function () {
      var t0 = null, dur = 1800;
      var step = function (t) {
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / dur);
        v.textContent = fmt(to * (1 - Math.pow(2, -10 * p)) / (1 - Math.pow(2, -10)));
        if (p < 1) requestAnimationFrame(step); else v.textContent = fmt(to);
      };
      requestAnimationFrame(step);
    }, 500);
  })();
  // 위닝 소재 슬라이더: 2.1초마다 한 장씩 자동, 끝나면 처음으로. 버튼·터치 직후에만 잠시 대기. 보이는 영상만 재생
  document.querySelectorAll('[data-ggal-slider]').forEach(function (sl) {
    var track = sl.querySelector('.ggal-slider__track');
    var slides = track.querySelectorAll('.ggal-slide');
    var countEl = sl.querySelector('.ggal-slider__count b');
    if (!slides.length) return;
    var step = function () { return slides.length > 1 ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth; };
    var index = function () { return Math.round(track.scrollLeft / step()); };
    var go = function (dir) {
      var max = track.scrollWidth - track.clientWidth - 2;
      if (dir > 0 && track.scrollLeft >= max) track.scrollTo({ left: 0 });
      else if (dir < 0 && track.scrollLeft <= 2) track.scrollTo({ left: track.scrollWidth });
      else track.scrollBy({ left: dir * step() });
    };
    sl.querySelectorAll('.ggal-slider__btn').forEach(function (b) {
      b.addEventListener('click', function () { go(+b.dataset.dir); hold(6000); });
    });
    var paused = false, holdUntil = 0, visible = false;
    var hold = function (ms) { holdUntil = Date.now() + ms; };
    track.addEventListener('touchstart', function () { hold(8000); }, { passive: true });
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) setInterval(function () { if (visible && !paused && Date.now() > holdUntil && !document.hidden) go(1); }, 2100);
    var vids = track.querySelectorAll('video');
    var onScroll = function () {
      var i = Math.min(slides.length, index() + 1);
      if (countEl) countEl.textContent = i;
    };
    track.addEventListener('scroll', function () { window.requestAnimationFrame(onScroll); }, { passive: true });
    if ('IntersectionObserver' in window) {
      var vio = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          var v = e.target;
          if (visible && e.isIntersecting && e.intersectionRatio > .6) { if (v.preload === 'none') v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () {}); }
          else v.pause();
        });
      }, { root: track, threshold: [0, .6, 1] });
      vids.forEach(function (v) { vio.observe(v); });
      new IntersectionObserver(function (es) { es.forEach(function (e) { visible = e.isIntersecting; if (!visible) vids.forEach(function (v) { v.pause(); }); else vids.forEach(function (v) { vio.unobserve(v); vio.observe(v); }); }); }, { threshold: .05 }).observe(sl);
      
    } else { visible = true; }
  });
  // 관리자 화면 캡처 가로 슬라이드: 3.2초마다 다음 장, 화면에 보일 때만. '원본 크게 보기'는 현재 장을 연다
  document.querySelectorAll('[data-ggal-fade]').forEach(function (box, bi) {
    var imgs = box.querySelectorAll('img');
    if (imgs.length < 2) return;
    var win = box.closest('.ggal-dash__win');
    var cnt = win && win.querySelector('.ggal-dash__count b');
    var zoom = win && win.querySelector('[data-zoom]');
    var valEl = win && win.querySelector('[data-ggal-fade-val]');
    var bars = win ? Array.prototype.slice.call(win.querySelectorAll('.ggal-dash__bars i')) : [];
    if (bars[0]) bars[0].classList.add('ggal-is-on');
    var cur = 0, seen = !('IntersectionObserver' in window);
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var show = function (n) {
      var prev = imgs[cur];
      prev.classList.remove('ggal-is-on'); prev.classList.add('ggal-is-out');
      setTimeout(function () { prev.classList.remove('ggal-is-out'); }, 800);
      cur = (n + imgs.length) % imgs.length;
      imgs[cur].classList.remove('ggal-is-out');
      void imgs[cur].offsetWidth;
      imgs[cur].classList.add('ggal-is-on');
      if (cnt) cnt.textContent = cur + 1;
      if (valEl && imgs[cur].dataset.val) valEl.textContent = imgs[cur].dataset.val;
      bars.forEach(function (b, k) { b.classList.toggle('ggal-is-on', k === cur); });
      if (zoom) zoom.dataset.zoom = imgs[cur].getAttribute('src').replace('_f.png', '.png');
    };
    if (!seen) new IntersectionObserver(function (es) { es.forEach(function (e) { seen = e.isIntersecting; }); }, { threshold: .2 }).observe(box);
    if (!reduce) setTimeout(function () { setInterval(function () { if (seen && !document.hidden) show(cur + 1); }, 3200); }, bi * 1600);
  });
  // AI 시대 순환 고리: 3.6초마다 다음 단계, 노드 클릭 시 해당 단계. 화면에 보일 때만 진행
  document.querySelectorAll('[data-ggal-loop]').forEach(function (lp) {
    var nodes = lp.querySelectorAll('.ggal-loop2__node'), panels = lp.querySelectorAll('.ggal-loop2__panel');
    var k = 0, seen = !('IntersectionObserver' in window), wait = 0;
    var auto = lp.closest('.ggal-ai2') && lp.closest('.ggal-ai2').querySelector('.ggal-ai2__auto');
    var set = function (n) {
      k = n;
      var i = ((k % 4) + 4) % 4;
      lp.style.setProperty('--k', k);
      nodes.forEach(function (b, j) { b.classList.toggle('ggal-is-on', j === i); });
      panels.forEach(function (p, j) {
        if (j === i) { p.classList.remove('ggal-is-on'); void p.offsetWidth; p.classList.add('ggal-is-on'); }
        else p.classList.remove('ggal-is-on');
      });
    };
    nodes.forEach(function (b) {
      b.addEventListener('click', function () {
        var t = +b.dataset.i, cur = ((k % 4) + 4) % 4, d = (t - cur + 4) % 4;
        set(k + d); wait = Date.now() + 7000;
      });
    });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var was = seen; seen = e.isIntersecting;
        if (auto) auto.classList.toggle('ggal-is-play', seen);
        if (seen && !was) set(k);
      });
    }, { threshold: .25 }).observe(lp);
    else if (auto) auto.classList.add('ggal-is-play');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) setInterval(function () { if (seen && !document.hidden && Date.now() > wait) set(k + 1); }, 3600);
  });
  // '맡기면 쉬워집니다' 흐름: 1.1초마다 다음 단계, 끝나면 매출 막대 → 처음부터
  document.querySelectorAll('[data-ggal-flow]').forEach(function (fl) {
    var nodes = fl.querySelectorAll('.ggal-flow__node'), n = nodes.length, k = -1, seen = !('IntersectionObserver' in window);
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var paint = function () {
      nodes.forEach(function (el, i) { el.classList.toggle('ggal-is-on', i <= k); el.classList.toggle('ggal-is-now', i === k); });
      fl.style.setProperty('--p', n > 1 ? Math.max(0, Math.min(k, n - 1)) / (n - 1) : 0);
      fl.classList.toggle('ggal-is-done', k >= n);
    };
    if (reduce) { k = n; paint(); return; }
    if (!seen) new IntersectionObserver(function (es) { es.forEach(function (e) { seen = e.isIntersecting; }); }, { threshold: .3 }).observe(fl);
    setInterval(function () { if (!seen || document.hidden) return; k = k >= n + 1 ? -1 : k + 1; paint(); }, 1100);
  });

  // 성공사례 케이스 플레이어: 6초마다 다음 사례. 곡선 그리기 + 숫자 카운트업 + 메모 2개
  document.querySelectorAll('[data-ggal-cp]').forEach(function (cp) {
    var tabs = [].slice.call(cp.querySelectorAll('.ggal-cp__tab')), cur = 0, seen = !('IntersectionObserver' in window), hold = 0, timer = null;
    var $ = function (s) { return cp.querySelector(s); };
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var W = 600, H = 240, T = 18, B = 6;
    var fmt = function (v, e) { return e < 10 ? (Math.round(v * 10) / 10).toLocaleString('ko-KR') : Math.round(v).toLocaleString('ko-KR'); };
    var curve = function (s0) {
      var pts = [];
      for (var i = 0; i <= 24; i++) {
        var t = i / 24, base = s0 + (1 - s0) * Math.pow(t, 2.1), wob = Math.sin(i * 1.7) * 0.025 * t * (1 - t) * 4;
        var v = Math.max(0, Math.min(1, base + wob)); if (i === 24) v = 1;
        pts.push([t * W, H - B - v * (H - T - B)]);
      }
      return pts;
    };
    var show = function (n) {
      cur = n; var d = tabs[n].dataset, s = d.s === '' ? null : +d.s, e = +d.e, s0 = s === null ? 0.12 : s / e;
      tabs.forEach(function (t, i) { t.classList.toggle('ggal-is-on', i === n); t.setAttribute('aria-selected', i === n ? 'true' : 'false'); });
      $('.ggal-cp__tag').textContent = d.tag; $('.ggal-cp__who').textContent = '광고주 ' + d.who;
      $('.ggal-cp__metric').textContent = d.metric; $('.ggal-cp__unit').textContent = d.unit;
      $('.ggal-cp__from').innerHTML = d.from + ' · <b class="ggal-cp__time">' + d.time + '</b> 만에';
      var bd = $('.ggal-cp__badge'); bd.textContent = d.badge; bd.hidden = !d.badge;
      $('.ggal-cp__axis-end').textContent = d.axis === '시간' ? '24시간' : d.days + '일';
      $('.ggal-cp__ch1').textContent = d.ch1; $('.ggal-cp__ch2').textContent = d.ch2;
      var p = curve(s0), line = 'M' + p.map(function (q) { return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' L');
      $('.ggal-cp__line').setAttribute('d', line);
      $('.ggal-cp__area').setAttribute('d', line + ' L' + W + ',' + H + ' L0,' + H + ' Z');
      var pc = function (q) { return [(q[0] / W * 100) + '%', (q[1] / H * 100) + '%']; };
      var h = pc(p[24]); cp.style.setProperty('--hx', h[0]); cp.style.setProperty('--hy', h[1]);
      var n1 = $('.ggal-cp__note--1'), n2 = $('.ggal-cp__note--2'), a = pc(p[11]), b = pc(p[18]);
      n1.style.setProperty('--x', a[0]); n1.style.setProperty('--y', a[1]); n1.querySelector('b').textContent = d.ch1;
      n2.style.setProperty('--x', b[0]); n2.style.setProperty('--y', b[1]); n2.querySelector('b').textContent = d.ch2;
      cp.classList.remove('ggal-is-draw'); void cp.offsetWidth; cp.classList.add('ggal-is-draw');
      var val = $('.ggal-cp__val'), from = s === null ? 0 : s;
      if (reduce) { val.textContent = fmt(e, e); return; }
      var t0 = null, step = function (ts) {
        if (!t0) t0 = ts; var k = Math.min(1, (ts - t0) / 1600), v = from + (e - from) * (1 - Math.pow(1 - k, 3));
        val.textContent = fmt(v, e); if (k < 1 && cur === n) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    var next = function () { if (!seen || document.hidden || Date.now() < hold) return; show((cur + 1) % tabs.length); };
    tabs.forEach(function (t, i) { t.addEventListener('click', function () { hold = Date.now() + 12000; cp.classList.add('ggal-is-hold'); show(i); setTimeout(function () { cp.classList.remove('ggal-is-hold'); }, 12000); }); });
    if (!seen) new IntersectionObserver(function (es) { es.forEach(function (e) { var was = seen; seen = e.isIntersecting; if (seen && !was) show(cur); }); }, { threshold: .3 }).observe(cp);
    else show(0);
    if (!reduce) setInterval(next, 6000);
  });
  // 첫 화면 일러스트: 프레임 폭에 맞춰 축소 비율 자동 계산 (잘림 방지)
  (function () {
    var fr = document.querySelector('.ggal-stage-frame'), wrap = fr && fr.querySelector('.ggal-stage-wrap');
    if (!wrap) return;
    var fit = function () {
      var cs = getComputedStyle(fr), w = fr.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      wrap.style.setProperty('--s', Math.max(.25, Math.min(1, w / 1120)).toFixed(3));
    };
    fit(); addEventListener('resize', fit);
    if (window.ResizeObserver) new ResizeObserver(fit).observe(fr);
  })();
  // 인하우스 vs 깔깔마케팅: 왼쪽은 한 칸씩 느리게(1명), 오른쪽은 동시에. 1년 인건비 카운트업
  document.querySelectorAll('[data-ggal-vs2]').forEach(function (vs) {
    var tasks = vs.querySelectorAll('.ggal-vs2__task'), k = -1, seen = false, counted = false;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var yr = vs.querySelector('[data-ggal-year]');
    var tick = function () {
      if (!seen || document.hidden) return;
      k = k >= tasks.length ? -1 : k + 1;
      tasks.forEach(function (t, i) { t.classList.toggle('ggal-is-now', i === k); t.classList.toggle('ggal-is-done', i < k); });
    };
    var count = function () {
      if (counted || !yr || reduce) return; counted = true;
      var t0 = null, step = function (ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / 1400); yr.textContent = Math.round(4392 * (1 - Math.pow(1 - p, 3))).toLocaleString('ko-KR'); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    var start = function () { seen = true; vs.classList.add('ggal-is-play'); count(); };
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) start(); else seen = false; }); }, { threshold: .25 }).observe(vs);
    else start();
    if (!reduce) setInterval(tick, 1500);
  });
  // 화면에 들어오면 모션 시작 (data-ggal-play)
  (function () {
    var els = document.querySelectorAll('[data-ggal-play]');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('ggal-is-play'); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { e.target.classList.toggle('ggal-is-play', e.isIntersecting); }); }, { threshold: .2 });
    els.forEach(function (e) { io.observe(e); });
  })();
  // AB 테스트 v2: 조합 20개 생성 → 이긴 3개 표시 → 예산 막대 → 반복
  document.querySelectorAll('[data-ggal-ab2]').forEach(function (ab) {
    var cols = ab.querySelectorAll('.ggal-ab2__col'), rs = ab.querySelectorAll('[data-r]'), ss = ab.querySelectorAll('[data-s]');
    var grid = ab.querySelector('.ggal-ab2__grid'), cells = grid.querySelectorAll('i'), cnt = ab.querySelector('.ggal-ab2__cnt');
    var NS = ss.length, WIN = [2 * NS + 2, 3 * NS + 3, 0 * NS + 1];
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var stage = function (n) { cols.forEach(function (c, i) { c.classList.toggle('ggal-is-now', i === n); c.classList.toggle('ggal-is-past', i < n); }); };
    var reset = function () {
      cells.forEach(function (c) { c.classList.remove('ggal-is-on', 'ggal-is-win'); });
      grid.classList.remove('ggal-is-judged'); ab.classList.remove('ggal-is-budget'); cnt.textContent = '0';
      rs.forEach(function (x) { x.classList.remove('ggal-is-on'); }); ss.forEach(function (x) { x.classList.remove('ggal-is-on'); });
    };
    var final = function () { cells.forEach(function (c, i) { c.classList.add('ggal-is-on'); if (WIN.indexOf(i) > -1) c.classList.add('ggal-is-win'); }); grid.classList.add('ggal-is-judged'); ab.classList.add('ggal-is-budget'); cnt.textContent = cells.length; stage(3); };
    if (reduce) { final(); return; }
    var t = 0, seen = false, playing = false;
    var run = function () {
      if (playing) return; playing = true; reset(); stage(0); var k = 0;
      var iv = setInterval(function () {
        if (k < cells.length) {
          var r = Math.floor(k / NS), s2 = k % NS;
          rs.forEach(function (x, i) { x.classList.toggle('ggal-is-on', i === r); });
          ss.forEach(function (x, i) { x.classList.toggle('ggal-is-on', i === s2); });
          cells[k].classList.add('ggal-is-on'); cnt.textContent = k + 1; if (k === 2) stage(1); k++;
        } else {
          clearInterval(iv);
          rs.forEach(function (x) { x.classList.remove('ggal-is-on'); }); ss.forEach(function (x) { x.classList.remove('ggal-is-on'); });
          setTimeout(function () { WIN.forEach(function (i) { cells[i].classList.add('ggal-is-win'); }); grid.classList.add('ggal-is-judged'); }, 300);
          setTimeout(function () { stage(2); ab.classList.add('ggal-is-budget'); }, 1000);
          setTimeout(function () { playing = false; if (seen) run(); }, 5200);
        }
      }, 180);
    };
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { seen = e.isIntersecting; if (seen) run(); }); }, { threshold: .3 }).observe(ab);
    else final();
  });
  // 비용 비교 v2: 막대 채우기 + 절감액 카운트업
  document.querySelectorAll('[data-ggal-cmp2]').forEach(function (el) {
    var b = el.querySelector('[data-ggal-save]'), done = false;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var go = function () {
      el.classList.add('ggal-is-play'); if (done || !b || reduce) return; done = true;
      var to = +b.dataset.ggalSave, t0 = null, step = function (ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / 1500); b.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString('ko-KR'); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) go(); }); }, { threshold: .3 }).observe(el); else go();
  });
  // 광고 문의 의심 카드: 일매출 숫자 반복 카운트업 (그래프 3.6초 주기에 맞춤)
  document.querySelectorAll('[data-ggal-wq-count]').forEach(function (b) {
    var to = +b.dataset.ggalWqCount, box = b.closest('[data-ggal-play]');
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    var run = function () {
      if (!box || !box.classList.contains('ggal-is-play')) return;
      var t0 = null, step = function (ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / 1600); b.textContent = Math.round(to * p * p).toLocaleString('ko-KR'); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    setTimeout(run, 300); setInterval(run, 3600);
  });
  // 성공사례 Case 카드: 큰 숫자 반복 카운트업 (막대 6초 주기)
  document.querySelectorAll('[data-ggal-cs-to]').forEach(function (b) {
    var to = +b.dataset.ggalCsTo, box = b.closest('[data-ggal-play]');
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var run = function () {
      if (!box || !box.classList.contains('ggal-is-play')) return;
      var t0 = null, step = function (ts) { if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / 1500); b.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))).toLocaleString('ko-KR'); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    setTimeout(run, 400); setInterval(run, 6000);
  });
  // AB 테스트 v3: 가설 고르기 → 소재 3개 검증 → 이긴 소재 예산 → 다음 가설 (반복, 사례 4개 중 랜덤)
  document.querySelectorAll('[data-ggal-ab3]').forEach(function (ab) {
    var cols = ab.querySelectorAll('.ggal-ab2__col'), rs = ab.querySelectorAll('[data-r]'), ss = ab.querySelectorAll('[data-s]');
    var vs = ab.querySelectorAll('.ggal-ab3__v'), pick = ab.querySelector('.ggal-ab3__pick b'), wtag = ab.querySelector('.ggal-ab3__wtag'),
        wtxt = ab.querySelector('.ggal-ab3__win p'), next = ab.querySelector('.ggal-ab3__next b');
    var RN = ['가격', '편의', '공감', '신뢰', '차별점'], SN = ['질문', '숫자', '상황', '후기'];
    var CASES = [
      { r: 2, s: 2, c: ['"매일 밤 목이 뻐근하다면"', '"베개 바꾸고 아침이 달라졌어요"', '"직장인 10명 중 7명이 겪는"'], w: [46, 92, 58], win: 1, next: '신뢰 × 후기' },
      { r: 0, s: 1, c: ['"하루 330원으로 끝내는 관리"', '"3개 사면 1개 더"', '"정가보다 41% 저렴하게"'], w: [90, 50, 63], win: 0, next: '차별점 × 질문' },
      { r: 3, s: 3, c: ['"재구매율 68%, 이유가 있습니다"', '"리뷰 1만 개가 말해줍니다"', '"엄마가 먼저 다시 주문했어요"'], w: [60, 47, 91], win: 2, next: '편의 × 상황' },
      { r: 1, s: 2, c: ['"바쁜 아침, 손이 안 가는 날에도"', '"출근 전 30초면 끝"', '"설거지 없이 한 번에"'], w: [44, 93, 57], win: 1, next: '공감 × 질문' }
    ];
    var cur = 0;
    var apply = function (k) {
      var c = CASES[k]; cur = k;
      if (pick) pick.textContent = RN[c.r] + ' × ' + SN[c.s];
      vs.forEach(function (v, i) {
        var sp = v.querySelector('span'); if (sp) sp.textContent = c.c[i];
        v.style.setProperty('--w', c.w[i] + '%'); v.classList.toggle('ggal-ab3__v--win', i === c.win);
      });
      if (wtag) wtag.textContent = 'ABC'.charAt(c.win) + ' 소재';
      if (wtxt) wtxt.textContent = c.c[c.win];
      if (next) next.textContent = c.next;
    };
    var stage = function (n) { cols.forEach(function (c, i) { c.classList.toggle('ggal-is-now', i === n); c.classList.toggle('ggal-is-past', i < n); }); };
    var cls = ['ggal-is-pick', 'ggal-is-test', 'ggal-is-judge', 'ggal-is-budget', 'ggal-is-next'];
    var lock = function () { var c = CASES[cur]; rs.forEach(function (x, i) { x.classList.toggle('ggal-is-on', i === c.r); }); ss.forEach(function (x, i) { x.classList.toggle('ggal-is-on', i === c.s); }); };
    var final = function () { apply(0); lock(); cls.forEach(function (c) { ab.classList.add(c); }); stage(3); };
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { final(); return; }
    var seen = false, playing = false, T = [], first = true;
    var at = function (ms, fn) { T.push(setTimeout(fn, ms)); };
    var run = function () {
      if (playing) return; playing = true; T.forEach(clearTimeout); T = [];
      cls.forEach(function (c) { ab.classList.remove(c); }); rs.forEach(function (x) { x.classList.remove('ggal-is-on'); }); ss.forEach(function (x) { x.classList.remove('ggal-is-on'); });
      var k = cur; if (!first) { while (k === cur) k = Math.floor(Math.random() * CASES.length); } first = false; apply(k);
      stage(0); var n = Math.floor(Math.random() * 5);
      var scan = setInterval(function () { rs.forEach(function (x, i) { x.classList.toggle('ggal-is-on', i === n % rs.length); }); ss.forEach(function (x, i) { x.classList.toggle('ggal-is-on', i === (n + 1) % ss.length); }); n++; }, 160);
      at(1300, function () { clearInterval(scan); lock(); ab.classList.add('ggal-is-pick'); });
      at(2300, function () { stage(1); ab.classList.add('ggal-is-test'); });
      at(4000, function () { ab.classList.add('ggal-is-judge'); });
      at(4900, function () { stage(2); ab.classList.add('ggal-is-budget'); });
      at(6200, function () { ab.classList.add('ggal-is-next'); });
      at(9000, function () { playing = false; if (seen) run(); });
    };
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { seen = e.isIntersecting; if (seen) run(); }); }, { threshold: .3 }).observe(ab);
    else final();
  });
  // 광고 문의 진행 순서: 한 단계씩 켜지며 레일이 내려감 (반복)
  document.querySelectorAll('[data-ggal-st2]').forEach(function (ol) {
    var li = ol.querySelectorAll('li'), n = li.length, k = -1, seen = !('IntersectionObserver' in window);
    var paint = function () { li.forEach(function (e, i) { e.classList.toggle('ggal-is-on', i <= k); e.classList.toggle('ggal-is-now', i === k); }); ol.style.setProperty('--p', n > 1 ? Math.max(0, Math.min(k, n - 1)) / (n - 1) : 0); };
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { k = n - 1; paint(); return; }
    if (!seen) new IntersectionObserver(function (es) { es.forEach(function (e) { seen = e.isIntersecting; }); }, { threshold: .3 }).observe(ol);
    setInterval(function () { if (!seen || document.hidden) return; k = k >= n + 1 ? -1 : k + 1; paint(); }, 1000);
  });
})();
