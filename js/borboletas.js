/* Borboletas em canvas, no traço das ilustrações da Marina (contorno verde-escuro, cor chapada).
   Voam soltas, fogem do mouse, pousam no anel oval e decolam quando a mão chega perto.
   Um clique (ou toque) solta mais duas do ponto clicado. */
(function () {
  var CORES = ['#A8C5EA', '#F2B51C', '#C9D3B8', '#FFFFFF', '#A8C5EA', '#F6D27A'];
  var CONTORNO = '#183D21';
  var calma = matchMedia('(prefers-reduced-motion: reduce)').matches;

  function asaSup(c, s) {
    c.beginPath(); c.moveTo(0, -s * .12);
    c.bezierCurveTo(s * .4, -s * 1.3, s * 1.4, -s * 1.2, s * 1.05, -s * .15);
    c.quadraticCurveTo(s * .7, s * .12, 0, 0); c.closePath();
  }
  function asaInf(c, s) {
    c.beginPath(); c.moveTo(0, 0);
    c.bezierCurveTo(s * .9, s * .05, s * .95, s * .9, s * .35, s * .85);
    c.quadraticCurveTo(s * .08, s * .66, 0, s * .2); c.closePath();
  }

  function desenha(c, b) {
    var s = b.tam, abre = .16 + .84 * Math.abs(Math.cos(b.fase));
    c.save(); c.translate(b.x, b.y); c.rotate(b.rumo + Math.PI / 2);
    c.lineJoin = 'round'; c.lineWidth = 1.4; c.strokeStyle = CONTORNO; c.fillStyle = b.cor;
    for (var lado = -1; lado <= 1; lado += 2) {
      c.save(); c.scale(lado * abre, 1);
      asaInf(c, s); c.fill(); c.stroke();
      asaSup(c, s); c.fill(); c.stroke();
      c.beginPath(); c.arc(s * .62, -s * .62, s * .1, 0, 7); c.fillStyle = CONTORNO; c.fill(); c.fillStyle = b.cor;
      c.restore();
    }
    c.lineWidth = 2; c.lineCap = 'round';
    c.beginPath(); c.moveTo(0, -s * .32); c.lineTo(0, s * .72);
    c.moveTo(0, -s * .32); c.quadraticCurveTo(-s * .2, -s * .7, -s * .36, -s * .78);
    c.moveTo(0, -s * .32); c.quadraticCurveTo(s * .2, -s * .7, s * .36, -s * .78);
    c.stroke();
    c.restore();
  }

  function Enxame(canvas, opc) {
    var c = canvas.getContext('2d'), W = 0, H = 0, dpr = Math.min(devicePixelRatio || 1, 2);
    var lista = [], mouse = { x: -999, y: -999, t: 0 }, poleiros = [], zonas = [], rodando = false, visivel = true, ult = 0;
    var mobile = innerWidth < 700;
    var total = mobile ? (opc.mobile || 7) : (opc.qtd || 12), max = total + 10;

    function medir() {
      var r = canvas.getBoundingClientRect(); W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr; c.setTransform(dpr, 0, 0, dpr, 0, 0);
      poleiros = opc.poleiros ? opc.poleiros(canvas.getBoundingClientRect()) : [];
      zonas = opc.evita ? opc.evita(canvas.getBoundingClientRect()) : [];
      poleiros.forEach(function (p) { p.dono = null; });
      lista.forEach(function (b) { b.pouso = null; b.estado = 'voa'; });
      if (calma) quadro(0);
    }

    function nova(x, y, impulso) {
      var b = {
        x: x != null ? x : Math.random() * W, y: y != null ? y : Math.random() * H,
        rumo: Math.random() * 6.28, vel: 0, fase: Math.random() * 6, bate: .2 + Math.random() * .08,
        tam: (mobile ? 9 : 11) + Math.random() * 7, cor: CORES[(Math.random() * CORES.length) | 0],
        vagar: Math.random() * 6, estado: 'voa', pouso: null, ate: 0
      };
      if (impulso) { b.vel = 4; b.rumo = -Math.PI / 2 + (Math.random() - .5) * 2; }
      lista.push(b); return b;
    }

    function atualiza(b, dt, agora) {
      var dx = b.x - mouse.x, dy = b.y - mouse.y, d = Math.hypot(dx, dy), raio = opc.raio || 130;

      if (b.estado === 'pousa') {
        b.fase += dt * .0016;              // abre e fecha devagar, pousada
        if (d < raio * .9 || agora > b.ate) {
          b.estado = 'voa'; if (b.pouso) b.pouso.dono = null; b.pouso = null;
          b.rumo = d < raio ? Math.atan2(dy, dx) : -Math.PI / 2; b.vel = 4.2;
        }
        return;
      }

      // vagueia
      b.vagar += (Math.random() - .5) * .5;
      var alvo = b.rumo + Math.sin(b.vagar) * .05;

      // vai para um poleiro livre de vez em quando
      if (!b.pouso && poleiros.length && Math.random() < .0016 * (dt / 16)) {
        var livres = poleiros.filter(function (p) { return !p.dono; });
        if (livres.length) { b.pouso = livres[(Math.random() * livres.length) | 0]; b.pouso.dono = b; }
      }
      if (b.pouso) {
        var px = b.pouso.x - b.x, py = b.pouso.y - b.y, dp = Math.hypot(px, py);
        alvo = Math.atan2(py, px);
        if (dp < 5) { b.estado = 'pousa'; b.x = b.pouso.x; b.y = b.pouso.y; b.rumo = b.pouso.rumo; b.vel = 0; b.ate = agora + 3500 + Math.random() * 6000; return; }
      }

      // desvia do texto, para não atrapalhar a leitura
      for (var z = 0; z < zonas.length; z++) {
        var q = zonas[z];
        if (!b.pouso && b.x > q.x && b.x < q.x + q.w && b.y > q.y && b.y < q.y + q.h) alvo = Math.atan2(b.y - (q.y + q.h / 2), b.x - (q.x + q.w * .2));
      }

      // foge do mouse
      if (d < raio) {
        var fuga = Math.atan2(dy, dx), forca = 1 - d / raio;
        alvo = fuga; b.vel = Math.min(b.vel + forca * .9, 6);
        if (b.pouso) { b.pouso.dono = null; b.pouso = null; }
      }

      // volta para dentro da área
      var m = 30;
      if (b.x < m) alvo = 0; else if (b.x > W - m) alvo = Math.PI;
      if (b.y < m) alvo = Math.PI / 2; else if (b.y > H - m) alvo = -Math.PI / 2;

      var dif = Math.atan2(Math.sin(alvo - b.rumo), Math.cos(alvo - b.rumo));
      b.rumo += dif * Math.min(1, .06 * dt / 16);
      b.vel += ((b.pouso ? 1.6 : 1.1) - b.vel) * .03;
      b.x += Math.cos(b.rumo) * b.vel * dt / 16;
      b.y += Math.sin(b.rumo) * b.vel * dt / 16 + Math.sin(b.fase) * .35;   // sobe e desce a cada batida
      b.fase += b.bate * (1 + b.vel * .35) * dt / 16;
    }

    function quadro(agora) {
      var dt = Math.min(48, agora - ult || 16); ult = agora;
      c.clearRect(0, 0, W, H);
      for (var i = 0; i < lista.length; i++) {
        if (!calma) atualiza(lista[i], dt, agora);
        desenha(c, lista[i]);
      }
      if (lista.length > total && !calma) {   // as extras do clique vão embora pelas bordas
        var b = lista[0]; if (b.x < -40 || b.x > W + 40 || b.y < -40 || b.y > H + 40) lista.shift();
      }
      if (rodando) requestAnimationFrame(quadro);
    }

    function liga() { if (!rodando && visivel && !calma) { rodando = true; ult = performance.now(); requestAnimationFrame(quadro); } }

    medir();
    for (var i = 0; i < total; i++) nova();
    if (calma) quadro(0);

    var zona = opc.zona || canvas.parentNode;
    function pos(e) { var r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; }
    zona.addEventListener('pointermove', pos);
    zona.addEventListener('pointerdown', function (e) {
      pos(e);
      if (calma || e.target.closest('a,button,input,label')) return;
      for (var k = 0; k < 2 && lista.length < max; k++) nova(mouse.x, mouse.y, true).fase = k * 3;
    });
    zona.addEventListener('pointerleave', function () { mouse.x = mouse.y = -999; });

    new IntersectionObserver(function (es) { visivel = es[0].isIntersecting; if (visivel) liga(); else rodando = false; }).observe(canvas);
    var t; addEventListener('resize', function () { clearTimeout(t); t = setTimeout(medir, 150); });

    return { liga: liga, medir: medir };
  }

  window.Enxame = Enxame;
})();
