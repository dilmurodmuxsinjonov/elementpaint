export function startSuppliedLoader(root,onFinish){
  let active=true,raf=0,exitTimer=0;
  function finishExit(){if(!active)return;stop();onFinish?.();}
  function stop(){active=false;cancelAnimationFrame(raf);clearTimeout(exitTimer);root.removeEventListener('transitionend',exitTransition);}
  function exitTransition(e){if(e.target===root&&e.propertyName==='transform')finishExit();}
  var q = function (s) { return root.querySelector(s); };
  var NS = 'http://www.w3.org/2000/svg';
  var paint = q('.ep-paint'), paintGloss = q('.ep-paint-gloss'), sheen = q('.ep-sheen'),
      can = q('.ep-can'), stream = q('.ep-stream'), streamHi = q('.ep-stream-hi'), streamLo = q('.ep-stream-lo'),
      splash = q('.ep-splash'), dropsG = q('.ep-drops');

  var LOOP = false;
  var REDUCE = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---- sozlamalar (logotip birligida, logotip = 492 x 109) ---- */
  var COLS = 262, CX0 = -12, CDX = 2;                       // bo'yoq ustunlari
  var Y0 = -4, V_FLOW = 100, TAU = .12, V_SPREAD = 75, R_LAND = 6;
  var G = 560, U0 = 26, V0 = 20;                            // oqim fizikasi
  var LAND_X0 = 9, LAND_X1 = 487;                           // oqim tushadigan nuqta: chapdan o'ngga
  var HOVER_Y = -174, POUR_Y = -112, POUR_ANGLE = -72;       // quti holati
  var MIN_POUR = 1.3;                                       // saytda: eng kam quyish vaqti (s)
  // namoyish rejimidagi "yuklanish" ritmi: [vaqt s, progress]
  var SCRIPT = [[0, 0], [.3, .12], [.7, .3], [1, .36], [1.4, .6], [1.7, .7], [2.05, .9], [2.35, 1]];

  var xs = [], yF = [], yT = [], yG = [];
  var tHit = new Float64Array(COLS), drip = new Float64Array(COLS), slideDrip = new Float64Array(COLS), und = new Float64Array(COLS);
  for (var i = 0; i < COLS; i++) xs.push(CX0 + i * CDX);

  function bottomAt(x) { return x < 0 || x > 492 || (x > 91 && x < 106) ? -1e9 : x < 91 ? 108.5 : x < 317 ? 91.5 : 53.5; }
  function topAt(x) { return x < 91 ? 1 : 7.5; }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function easeInOut(k) { k = clamp(k, 0, 1); return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; }
  function easeOutBack(k) { k = clamp(k, 0, 1); return 1 + 2.5 * Math.pow(k - 1, 3) + 1.5 * Math.pow(k - 1, 2); }
  function easeIn(k) { k = clamp(k, 0, 1); return k * k * k; }

  var seed = 20241011;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  function makeDrips(arr, minLen, maxLen) {
    for (var i = 0; i < COLS; i++) arr[i] = 0;
    for (var c = CX0 + 4 + rnd() * 10; c < CX0 + COLS * CDX; c += 11 + rnd() * 19) {
      var len = minLen + rnd() * (maxLen - minLen), hw = 2.6 + rnd() * 3.2;
      for (var j = 0; j < COLS; j++) {
        var u = (xs[j] - c) / hw;
        if (u > -1 && u < 1) { var v = Math.cos(u * Math.PI / 2); arr[j] = Math.max(arr[j], len * v * v); }
      }
    }
  }
  function resetPaint() {
    var s1 = rnd() * 6, s2 = rnd() * 6;
    for (var i = 0; i < COLS; i++) {
      tHit[i] = Infinity;
      und[i] = 2.3 * Math.sin(xs[i] * .083 + s1) + 1.2 * Math.sin(xs[i] * .21 + s2);
    }
    makeDrips(drip, 4, 19);
    makeDrips(slideDrip, 3, 15);
  }

  // sachratqi tomchilari
  var drops = [], spawnAcc = 0;
  for (var k = 0; k < 36; k++) {
    var c = document.createElementNS(NS, 'circle');
    c.setAttribute('r', '0');
    dropsG.appendChild(c);
    drops.push({ el: c, on: false, x: 0, y: 0, y0: 0, vx: 0, vy: 0, r: 0 });
  }
  function spawn(x, y) {
    for (var k = 0; k < drops.length; k++) {
      var d = drops[k];
      if (d.on) continue;
      d.on = true; d.x = x + (rnd() - .5) * 5; d.y = d.y0 = y;
      d.vx = (rnd() - .5) * 95; d.vy = -(25 + rnd() * 70); d.r = .55 + rnd() * 1.05;
      return;
    }
  }

  function fallTime(h) { return (-V0 + Math.sqrt(V0 * V0 + 2 * G * Math.max(h, 1))) / G; }
  function smooth(X, Y, from, to, cmd) {
    var step = from < to ? 1 : -1, d = cmd + X[from] + ' ' + Y[from].toFixed(2);
    for (var i = from + step; i !== to; i += step) {
      var j = i + step;
      d += 'Q' + X[i] + ' ' + Y[i].toFixed(2) + ' ' + (X[i] + X[j]) / 2 + ' ' + ((Y[i] + Y[j]) / 2).toFixed(2);
    }
    return d + 'L' + X[to] + ' ' + Y[to].toFixed(2);
  }
  function poly(P) {
    var d = '';
    for (var i = 0; i < P.length; i++) d += (i ? 'L' : 'M') + P[i][0].toFixed(2) + ' ' + P[i][1].toFixed(2);
    return d;
  }

  /* ---- holat ---- */
  var t0 = performance.now(), last = t0, now = 0;
  var phase = 'enter', phaseAt = 0;
  var p = 0, target = 0, manual = 0, loaded = false;
  var lipX = LAND_X0 - 15, lipY = -330, angle = 0, canAlpha = 0, awayX = 0;
  var streamStart = -1, streamStop = -1, sheenAt = -1, slideAt = -1, paintDone = false, doneAt = 0, aria = -1;
  var sLipX = 0, sLipY = 0, sTf = 1, sLand = 0;                // quyish to'xtagan paytdagi oqim

  function go(s) { phase = s; phaseAt = now; }
  function scripted(t) {
    if (t <= 0) return 0;
    for (var i = 1; i < SCRIPT.length; i++) {
      var a = SCRIPT[i - 1], b = SCRIPT[i];
      if (t <= b[0]) return a[1] + (b[1] - a[1]) * (t - a[0]) / (b[0] - a[0]);
    }
    return 1;
  }
  function newCycle() {
    resetPaint();
    p = target = 0; manual = null; awayX = 0; angle = 0; canAlpha = 0; lipY = -330;
    streamStart = streamStop = sheenAt = slideAt = -1; paintDone = false;
    go(REDUCE ? 'pour' : 'enter');
  }
  function leave() {
    root.classList.add('is-leaving');root.dataset.phase='leaving';
    root.addEventListener('transitionend',exitTransition);
    exitTimer=setTimeout(finishExit,1300);
  }

  function frame(ts) {
    if (!active || !root.isConnected) return;
    now = (ts - t0) / 1000;
    var dt = Math.min(.05, (ts - last) / 1000);
    last = ts;
    var pt = now - phaseAt, vCan = 0, e, kk;

    /* progress: quti chapdan o'ngga yuradi */
    if (phase === 'pour') {
      if (manual !== null) target = Math.min(manual, scripted(pt));
      else if (LOOP) target = scripted(pt);
      else target = (loaded && pt > MIN_POUR) ? 1 : Math.min(.9, .9 * (1 - Math.exp(-pt / 1.4)));
      var prev = p;
      p += (target - p) * (1 - Math.exp(-dt * 5));
      if (target >= 1 && p > .997) p = 1;
      vCan = (p - prev) * (LAND_X1 - LAND_X0) / Math.max(dt, 1e-3);
    }

    /* quti xoreografiyasi */
    if (phase === 'enter') {
      kk = pt / .65;
      lipY = -330 + (HOVER_Y + 330) * easeOutBack(kk);
      angle = -7 * Math.sin(pt * 10) * (1 - clamp(kk, 0, 1));
      canAlpha = clamp(pt / .15, 0, 1);
      if (kk >= 1) go('tilt');
    } else if (phase === 'tilt') {
      kk = pt / .38; e = easeInOut(kk);
      angle = POUR_ANGLE * e;
      lipY = HOVER_Y + (POUR_Y - HOVER_Y) * e;
      if (streamStart < 0 && kk > .6) streamStart = now;
      if (kk >= 1) go('pour');
    } else if (phase === 'pour' && !REDUCE) {
      angle = POUR_ANGLE + 2.2 * Math.sin(now * 3.3) + clamp(vCan * .012, -4, 4);
      lipY = POUR_Y + 1.3 * Math.sin(now * 2.6);
      if (p >= 1) {
        streamStop = now; sLipY = lipY; sLand = LAND_X1;
        sTf = fallTime(topAt(sLand) - sLipY); sLipX = sLand - U0 * sTf;
        go('untilt');
      }
    } else if (phase === 'untilt') {
      kk = pt / .42; e = easeInOut(kk);
      angle = POUR_ANGLE * (1 - e);
      lipY = POUR_Y + (HOVER_Y - POUR_Y) * e;
      if (kk >= 1) go('away');
    } else if (phase === 'away') {
      kk = pt / .55; e = easeIn(kk);
      lipY = HOVER_Y - 260 * e; awayX = 70 * e; angle = -18 * e;
      canAlpha = 1 - clamp((kk - .55) / .45, 0, 1);
      if (kk >= 1) go('flow');
    }

    /* oqim geometriyasi */
    var landX = LAND_X0 + (LAND_X1 - LAND_X0) * p;
    var tf = fallTime(topAt(landX) - lipY);
    lipX = landX - U0 * tf + awayX;
    // to'xtagandan keyin oqim dumi qutidan ajralib, o'zi tushib ketadi
    var stopped = streamStop >= 0, oX = stopped ? sLipX : lipX, oY = stopped ? sLipY : lipY;
    if (stopped) tf = sTf;
    var streamOn = !REDUCE && streamStart >= 0 && !(stopped && now - streamStop >= tf);
    var landed = streamOn && now - streamStart >= tf;
    var xL = 0, yL = 0;
    if (streamOn) {
      var ta = stopped ? Math.min(tf, now - streamStop) : 0, tb = Math.min(tf, now - streamStart);
      var N = 18, Lft = [], Rgt = [], Hi = [], Lo = [];
      for (var s = 0; s <= N; s++) {
        var tau = ta + (tb - ta) * s / N, f = tau / tf;
        var x = oX + U0 * tau - .06 * vCan * f * f, y = oY + V0 * tau + .5 * G * tau * tau;
        var dx = U0 - .12 * vCan * tau / (tf * tf), dy = V0 + G * tau, len = Math.sqrt(dx * dx + dy * dy);
        var nx = -dy / len, ny = dx / len;
        var w = (4.2 + 6 * Math.pow(1 - clamp(f, 0, 1), 1.5)) * (1 + .07 * Math.sin(tau * 14 - now * 9)) / 2;
        Lft.push([x + nx * w, y + ny * w]); Rgt.push([x - nx * w, y - ny * w]);
        Hi.push([x + nx * w * .45, y + ny * w * .45]); Lo.push([x - nx * w * .5, y - ny * w * .5]);
        if (s === N) { xL = x; yL = y; }
      }
      var wl = Math.max(.4, Math.hypot(Lft[N][0] - Rgt[N][0], Lft[N][1] - Rgt[N][1]) / 2);
      var w0 = Math.max(.4, Math.hypot(Lft[0][0] - Rgt[0][0], Lft[0][1] - Rgt[0][1]) / 2);
      var d = poly(Lft) + 'A' + wl.toFixed(2) + ' ' + wl.toFixed(2) + ' 0 0 0 ' + Rgt[N][0].toFixed(2) + ' ' + Rgt[N][1].toFixed(2);
      for (s = N - 1; s >= 0; s--) d += 'L' + Rgt[s][0].toFixed(2) + ' ' + Rgt[s][1].toFixed(2);
      d += 'A' + w0.toFixed(2) + ' ' + w0.toFixed(2) + ' 0 0 0 ' + Lft[0][0].toFixed(2) + ' ' + Lft[0][1].toFixed(2) + 'Z';
      stream.setAttribute('d', d);
      streamHi.setAttribute('d', poly(Hi.slice(1, N)));
      streamLo.setAttribute('d', poly(Lo.slice(1, N)));
    } else if (stream.getAttribute('d') !== 'M0 0') {
      stream.setAttribute('d', 'M0 0'); streamHi.setAttribute('d', 'M0 0'); streamLo.setAttribute('d', 'M0 0');
    }

    /* tushish joyi: bo'yoq tegadi, sachraydi */
    if (landed) {
      for (i = 0; i < COLS; i++) {
        if (tHit[i] === Infinity && xs[i] <= xL + R_LAND) tHit[i] = now + Math.max(0, xL - R_LAND - xs[i]) / V_SPREAD;
      }
      splash.setAttribute('cx', xL.toFixed(2));
      splash.setAttribute('cy', (yL + .4).toFixed(2));
      splash.setAttribute('rx', (5.8 + .8 * Math.sin(now * 23)).toFixed(2));
      splash.setAttribute('ry', (2.1 + .35 * Math.sin(now * 17)).toFixed(2));
      spawnAcc += dt * 30;
      while (spawnAcc >= 1) { spawn(xL, yL); spawnAcc--; }
    } else {
      splash.setAttribute('rx', '0'); splash.setAttribute('ry', '0');
    }
    for (k = 0; k < drops.length; k++) {
      var dr = drops[k];
      if (!dr.on) continue;
      dr.vy += G * dt; dr.x += dr.vx * dt; dr.y += dr.vy * dt;
      if (dr.vy > 0 && dr.y > dr.y0 + 5) { dr.on = false; dr.el.setAttribute('r', '0'); continue; }
      dr.el.setAttribute('cx', dr.x.toFixed(2)); dr.el.setAttribute('cy', dr.y.toFixed(2)); dr.el.setAttribute('r', dr.r.toFixed(2));
    }

    /* logotip ichida tepadan pastga oqayotgan bo'yoq */
    var complete = true;
    for (i = 0; i < COLS; i++) {
      var y2;
      if (REDUCE) y2 = Y0 + 118 * p;
      else if (!(now > tHit[i])) y2 = -30;
      else {
        var a = now - tHit[i], g = clamp((a - .08) / .8, 0, 1);
        y2 = Y0 + V_FLOW * (a - TAU * (1 - Math.exp(-a / TAU))) + drip[i] * g * g + und[i] * Math.min(1, a / .35);
      }
      yF[i] = Math.min(y2, 150);
      yG[i] = yF[i] - 1.3;
      if (yF[i] < bottomAt(xs[i]) + 1) complete = false;
    }
    var top;
    if (slideAt >= 0) {
      var cleared = true;
      for (i = 0; i < COLS; i++) {
        var a2 = now - slideAt - xs[i] / 650, yc = -40;
        if (a2 > 0) yc = Y0 - 6 + V_FLOW * 1.25 * (a2 - TAU * (1 - Math.exp(-a2 / TAU))) + slideDrip[i] * clamp((a2 - .05) / .6, 0, 1);
        yT[i] = Math.min(yc, yF[i]);
        if (yT[i] < bottomAt(xs[i]) + 1) cleared = false;
      }
      top = smooth(xs, yT, 0, COLS - 1, 'M');
      if (cleared) newCycle();
    } else {
      top = 'M' + xs[0] + ' -40L' + xs[COLS - 1] + ' -40';
    }
    paint.setAttribute('d', top + smooth(xs, yF, COLS - 1, 0, 'L') + 'Z');
    paintGloss.setAttribute('d', slideAt >= 0 ? 'M0 0' : smooth(xs, yG, 0, COLS - 1, 'M'));

    /* tugash: yaltirash, keyin takrorlash yoki yopilish */
    if (complete && !paintDone && p >= 1) {
      paintDone = true; doneAt = now;
      sheenAt = REDUCE ? -1 : now + .05;
      if (REDUCE) go('flow');
    }
    if (paintDone && phase === 'flow' && slideAt < 0) {
      var since = now - Math.max(doneAt, phaseAt);
      if (!LOOP && since > (REDUCE ? .3 : .55) && !root.classList.contains('is-leaving')) leave();
      if (LOOP && since > (REDUCE ? 1.2 : 1.75)) slideAt = now;
    }
    if (sheenAt >= 0 && now >= sheenAt) {
      var sk = (now - sheenAt) / .95;
      if (sk <= 1) sheen.setAttribute('transform', 'translate(' + (-150 + 800 * easeInOut(sk)).toFixed(1) + ' 0) skewX(-20)');
      else { sheen.setAttribute('transform', 'translate(-400 0)'); sheenAt = -1; }
    }

    /* quti */
    can.setAttribute('transform', 'translate(' + lipX.toFixed(2) + ' ' + lipY.toFixed(2) + ') rotate(' + angle.toFixed(2) + ')');
    can.setAttribute('opacity', canAlpha.toFixed(3));

    root.dataset.fill=String(Math.round(p*100));
    if(!root.classList.contains('is-leaving'))root.dataset.phase=paintDone?'filled':phase;
    var pct = Math.round(p * 100);
    if (pct !== aria) { root.setAttribute('aria-valuenow', pct); aria = pct; }
    raf=requestAnimationFrame(frame);
  }

  resetPaint();
  if (REDUCE) go('pour');
  raf=requestAnimationFrame(frame);

  return {stop,progress(v){if(Number.isFinite(v))manual=Math.max(manual,clamp(v,0,1));},done(){manual=1;}};
}
