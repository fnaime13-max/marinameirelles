/* A plantinha fofa: um vasinho com carinha, no traço das ilustrações da Marina.
   As hastes se inclinam na direção do mouse (planta segue o sol), os olhinhos acompanham,
   ela pisca sozinha, fica feliz quando a mão chega perto e, ao toque, dá um pulinho e solta coraçõezinhos. */
(function () {
  var calma = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';

  // pivô de todas as hastes: o centro da terra, no topo do vaso
  var PX = 100, PY = 150;
  var HASTES = [
    { base: -24, d: 'M100 150C94 136 84 126 70 118', folha: 'M70 118C58 120 44 114 40 100 54 96 66 104 70 118Z', veia: 'M70 118 52 105' },
    { base: 22, d: 'M100 150C108 136 118 128 132 122', folha: 'M132 122C140 110 154 104 166 108 162 122 148 128 132 122Z', veia: 'M132 122 152 113' },
    { base: -6, d: 'M100 150C99 124 97 100 99 74', folha: 'M99 76C88 70 72 60 70 42 86 40 98 54 99 76Z', veia: 'M99 76 80 52', folha2: 'M99 74C108 60 124 50 138 52 134 70 116 80 99 74Z', veia2: 'M99 74 124 60' },
    { base: 8, d: 'M100 150C104 132 110 118 114 104', folha: 'M114 104C112 94 116 84 126 80 130 92 124 102 114 104Z', veia: 'M114 104 123 87' }
  ];

  function el(tag, at, pai) {
    var e = document.createElementNS(NS, tag);
    for (var k in at) e.setAttribute(k, at[k]);
    if (pai) pai.appendChild(e);
    return e;
  }

  function monta(caixa) {
    var svg = el('svg', { viewBox: '0 0 200 240', 'aria-hidden': 'true', class: 'planta__svg' }, caixa);
    var gHastes = [];
    // a ordem importa: as de trás primeiro
    [0, 1, 3, 2].forEach(function (i) {
      var h = HASTES[i], g = el('g', { class: 'planta__haste' }, svg);
      el('path', { d: h.d, class: 'planta__caule' }, g);
      el('path', { d: h.folha, class: 'planta__folha' }, g);
      el('path', { d: h.veia, class: 'planta__veia' }, g);
      if (h.folha2) { el('path', { d: h.folha2, class: 'planta__folha planta__folha--b' }, g); el('path', { d: h.veia2, class: 'planta__veia' }, g); }
      gHastes[i] = { g: g, ang: h.base, vel: 0, base: h.base, fase: Math.random() * 6 };
    });
    var vaso = el('g', { class: 'planta__vaso' }, svg);
    el('path', { d: 'M50 166L61 226Q63 234 72 234H128Q137 234 139 226L150 166Z', class: 'planta__corpo' }, vaso);
    el('rect', { x: 40, y: 146, width: 120, height: 24, rx: 9, class: 'planta__borda' }, vaso);
    var rosto = el('g', { class: 'planta__rosto' }, vaso);
    el('ellipse', { cx: 72, cy: 206, rx: 8, ry: 4.5, class: 'planta__bochecha' }, rosto);
    el('ellipse', { cx: 128, cy: 206, rx: 8, ry: 4.5, class: 'planta__bochecha' }, rosto);
    var olhos = el('g', { class: 'planta__olhos' }, rosto);
    var abertos = el('g', { class: 'planta__abertos' }, olhos);
    el('ellipse', { cx: 84, cy: 194, rx: 4.6, ry: 5.4 }, abertos);
    el('ellipse', { cx: 116, cy: 194, rx: 4.6, ry: 5.4 }, abertos);
    el('circle', { cx: 85.6, cy: 192.2, r: 1.5, class: 'planta__brilho' }, abertos);
    el('circle', { cx: 117.6, cy: 192.2, r: 1.5, class: 'planta__brilho' }, abertos);
    var felizes = el('g', { class: 'planta__felizes' }, olhos);
    el('path', { d: 'M78 196Q84 188 90 196' }, felizes);
    el('path', { d: 'M110 196Q116 188 122 196' }, felizes);
    el('path', { d: 'M93 205Q100 213 107 205', class: 'planta__boca' }, rosto);
    return { svg: svg, hastes: gHastes, olhos: olhos };
  }

  function Plantinha(caixa) {
    var p = monta(caixa), mouse = null, feliz = false, pulo = 0, ult = performance.now();

    function aplica() {
      p.hastes.forEach(function (h) { h.g.setAttribute('transform', 'rotate(' + h.ang.toFixed(2) + ' ' + PX + ' ' + PY + ')'); });
    }

    function quadro(agora) {
      var dt = Math.min(48, agora - ult) / 16; ult = agora;
      var r = caixa.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return requestAnimationFrame(quadro);
      var cx = r.left + r.width / 2, cy = r.top + r.height * .55, inclina = 0, perto = 0, ox = 0, oy = 0;
      if (mouse) {
        var dx = mouse.x - cx, dy = mouse.y - cy, d = Math.hypot(dx, dy);
        perto = Math.max(0, 1 - d / 420);
        inclina = Math.max(-1, Math.min(1, dx / 260)) * (10 + 16 * perto);
        ox = Math.max(-1, Math.min(1, dx / 200)) * 3.2; oy = Math.max(-1, Math.min(1, dy / 200)) * 2.4;
      }
      var agoraFeliz = perto > .55 || pulo > 0;
      if (agoraFeliz !== feliz) { feliz = agoraFeliz; caixa.classList.toggle('feliz', feliz); }
      p.hastes.forEach(function (h, i) {
        h.fase += .018 * dt;
        var brisa = Math.sin(h.fase + i) * 2.4 + Math.sin(h.fase * 2.3) * .8;
        var alvo = h.base * (1 - perto * .35) + inclina * (i === 2 ? .8 : 1.1) + brisa + (pulo > 0 ? Math.sin(pulo * .5) * 6 : 0);
        h.vel += (alvo - h.ang) * .045 * dt; h.vel *= Math.pow(.86, dt); h.ang += h.vel * dt;
      });
      p.olhos.setAttribute('transform', 'translate(' + ox.toFixed(2) + ' ' + oy.toFixed(2) + ')');
      if (pulo > 0) pulo = Math.max(0, pulo - dt);
      aplica();
      requestAnimationFrame(quadro);
    }

    function coracoes() {
      for (var i = 0; i < 4; i++) {
        var c = document.createElement('span');
        c.className = 'planta__coracao'; c.textContent = i % 2 ? '♥' : '❀';
        c.style.left = (32 + Math.random() * 36) + '%';
        c.style.setProperty('--dx', (Math.random() * 60 - 30) + 'px');
        c.style.animationDelay = i * .09 + 's';
        caixa.appendChild(c);
        setTimeout(c.remove.bind(c), 1600);
      }
    }

    addEventListener('pointermove', function (e) { mouse = { x: e.clientX, y: e.clientY }; }, { passive: true });
    document.addEventListener('pointerleave', function () { mouse = null; });
    caixa.addEventListener('pointerdown', function () {
      if (calma) return;
      pulo = 40; caixa.classList.remove('pula'); void caixa.offsetWidth; caixa.classList.add('pula'); coracoes();
    });

    // pisca de vez em quando
    (function pisca() {
      setTimeout(function () { caixa.classList.add('pisca'); setTimeout(function () { caixa.classList.remove('pisca'); pisca(); }, 140); }, 2200 + Math.random() * 3200);
    })();

    if (calma) aplica(); else requestAnimationFrame(quadro);
  }

  window.Plantinha = Plantinha;
})();
