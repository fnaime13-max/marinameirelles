(function () {
  var calma = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* os símbolos entram inline (e não via <use>) para o CSS conseguir mexer nas folhas */
  $$('use[href="#broto"], use[href="#folhinha"]').forEach(function (u) {
    var molde = $(u.getAttribute('href')), g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    Array.prototype.forEach.call(molde.children, function (f) { g.appendChild(f.cloneNode(true)); });
    u.replaceWith(g);
  });

  /* ---------- dados do CONFIG ---------- */
  $$('[data-wa]').forEach(function (a) {
    a.href = linkWA(a.dataset.msg); a.target = '_blank'; a.rel = 'noopener';
  });
  $$('[data-crn]').forEach(function (el) {
    if (CONFIG.crn) el.textContent = CONFIG.crn;
    else { el.textContent = 'CRN a preencher'; el.classList.add('pendente'); }
  });

  /* ---------- loader: 0 → 100%, o ciclo se rompe e nasce um broto ---------- */
  var loader = $('#loader'), num = $('#loaderNum'), ciclo = $('#cicloPath'), txt = $('#loaderTxt');
  var progs = $$('.anel-prog', loader);
  var carregou = false, DUR = calma ? 400 : 2700, t0 = performance.now(), mostrado = 0;
  document.body.classList.add('carregando');
  addEventListener('load', function () { carregou = true; });
  setTimeout(function () { carregou = true; }, 6000);

  var frases = [[0, 'Rompendo o ciclo…'], [45, 'Sem dieta restritiva.'], [72, 'Sem culpa.'], [92, 'Com muito acolhimento.']];
  function passoLoader(agora) {
    var t = Math.min(1, (agora - t0) / DUR);
    var alvo = (1 - Math.pow(1 - t, 2.2)) * 100;
    if (!carregou) alvo = Math.min(alvo, 92);
    mostrado += (alvo - mostrado) * .18;
    if (alvo >= 100 && mostrado > 99.4) mostrado = 100;
    var p = Math.floor(mostrado);
    num.textContent = p;
    // cada metade do anel enche na sua vez
    progs[0].style.strokeDashoffset = 100 - Math.min(100, mostrado * 2);
    progs[1].style.strokeDashoffset = 100 - Math.max(0, mostrado * 2 - 100);
    ciclo.setAttribute('startOffset', (-(agora - t0) * .045 % 420).toFixed(1));
    for (var i = frases.length - 1; i >= 0; i--) if (p >= frases[i][0]) { if (txt.textContent !== frases[i][1]) txt.textContent = frases[i][1]; break; }
    if (p < 100) return requestAnimationFrame(passoLoader);
    loader.classList.add('rompeu');
    setTimeout(function () {
      loader.classList.add('saiu'); document.body.classList.remove('carregando');
      document.dispatchEvent(new Event('site:pronto'));
    }, calma ? 100 : 1700);
    setTimeout(function () { loader.remove(); }, 2900);
  }
  requestAnimationFrame(passoLoader);

  /* ---------- nav ---------- */
  var nav = $('#nav'), menu = $('#menuBtn');
  function rolou() { nav.classList.toggle('rolou', scrollY > 20); }
  addEventListener('scroll', rolou, { passive: true }); rolou();
  function fechaMenu() { nav.classList.remove('aberto'); menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Abrir menu'); }
  menu.addEventListener('click', function () {
    var abre = !nav.classList.contains('aberto');
    nav.classList.toggle('aberto', abre); menu.setAttribute('aria-expanded', abre); menu.setAttribute('aria-label', abre ? 'Fechar menu' : 'Abrir menu');
  });
  $$('#navLinks a').forEach(function (a) { a.addEventListener('click', fechaMenu); });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && nav.classList.contains('aberto')) { fechaMenu(); menu.focus(); } });

  // seção atual no menu
  var links = $$('.nav__links a[href^="#"]');
  var obsSecao = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      links.forEach(function (a) {
        if (a.getAttribute('href') === '#' + e.target.id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(function (s) { obsSecao.observe(s); });

  /* ---------- plantinhas ---------- */
  new Plantinha($('#plantaHero'));
  new Plantinha($('#plantaFinal'));

  /* ---------- o ciclo ---------- */
  var DADOS = {
    ciclo: {
      nome: 'O ciclo',
      pos: [[50, 16], [84, 50], [50, 84], [16, 50]],
      itens: [
        ['Dieta restritiva', 'Cortar tudo de uma vez, contar cada caloria, proibir o que você gosta.'],
        ['Fome e privação', 'O corpo e a cabeça pedem o que foi tirado. A vontade só aumenta.'],
        ['Descontrole', 'Uma hora vem o “chutar o balde”, e você come muito além do que queria.'],
        ['Culpa', 'A sensação de fracasso… e a promessa de uma dieta ainda mais rígida. E tudo recomeça.']
      ]
    },
    livre: {
      nome: 'O caminho',
      pos: [[12, 64], [37, 46], [63, 58], [88, 34]],
      itens: [
        ['Acolhimento', 'Eu não vou julgar o seu prato. A gente começa entendendo, não cortando.'],
        ['Sua história', 'Rotina, emoções, hábitos e objetivos: tudo entra na conversa.'],
        ['Estratégias possíveis', 'Orientações que cabem na sua vida real, para comer com qualidade e sem passar fome.'],
        ['Leveza e constância', 'Comer com consciência e prazer, sem precisar recomeçar toda segunda.']
      ]
    }
  };
  var corpo = $('#cicloCorpo'), nos = $$('.no', corpo), romper = $('#romper'), ativo = 0, tocou = false;
  function lado(x) { return x < 25 ? 'e' : x > 75 ? 'd' : 'c'; }
  function pinta() {
    var d = DADOS[corpo.dataset.estado];
    nos.forEach(function (n, i) {
      n.style.setProperty('--x', d.pos[i][0] + '%'); n.style.setProperty('--y', d.pos[i][1] + '%');
      n.dataset.lado = lado(d.pos[i][0]);
      $('.no__txt', n).textContent = d.itens[i][0];
      n.classList.toggle('ativo', i === ativo);
      n.setAttribute('aria-pressed', i === ativo);
    });
    $('#cicloEtapa').textContent = d.nome + ' · ' + (ativo + 1) + ' de 4';
    $('#cicloNome').textContent = d.itens[ativo][0];
    $('#cicloDesc').textContent = d.itens[ativo][1];
  }
  nos.forEach(function (n, i) {
    function vai() { tocou = true; ativo = i; pinta(); }
    n.addEventListener('click', vai); n.addEventListener('mouseenter', vai); n.addEventListener('focus', vai);
  });
  romper.addEventListener('click', function () {
    var livre = corpo.dataset.estado !== 'livre';
    corpo.dataset.estado = livre ? 'livre' : 'ciclo';
    romper.setAttribute('aria-pressed', livre);
    $('span', romper).textContent = livre ? 'Ver o ciclo de novo' : 'Romper o ciclo';
    ativo = 0; tocou = true; pinta();
  });
  pinta();
  // enquanto ninguém mexe, o ciclo vai girando sozinho pelas etapas
  var cicloVisivel = false;
  new IntersectionObserver(function (es) { cicloVisivel = es[0].isIntersecting; }, { threshold: .4 }).observe(corpo);
  if (!calma) setInterval(function () { if (cicloVisivel && !tocou) { ativo = (ativo + 1) % 4; pinta(); } }, 2600);

  /* ---------- checklist → WhatsApp ---------- */
  var form = $('#voceForm'), conta = $('#voceConta');
  function marcados() { return $$('input:checked', form).map(function (i) { return i.value; }); }
  form.addEventListener('change', function () {
    var n = marcados().length;
    conta.textContent = n === 0 ? 'Nenhum item marcado ainda.' : n === 1 ? '1 item marcado. Já é um começo.' : n + ' itens marcados. Você não está sozinha nisso.';
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var m = marcados();
    var msg = m.length
      ? 'Olá, Marina! Vi seu site e me identifiquei com:\n' + m.map(function (x) { return '• ' + x; }).join('\n') + '\n\nQuero conhecer o seu acompanhamento.'
      : CONFIG.mensagem;
    window.open(linkWA(msg), '_blank', 'noopener');
  });

  /* ---------- trilha do acompanhamento: a folhinha é levada pelo vento conforme a rolagem ---------- */
  var trilha = $('#trilha'), svg = $('#trilhaSvg'), base = $('.trilha__base', svg), voo = $('.trilha__voo', svg), folha = $('#trilhaFolha');
  var marcas = $$('.passo__n', trilha), passos = $$('.passo', trilha), comp = 0;
  function montaTrilha() {
    var r = trilha.getBoundingClientRect(), w = r.width, h = r.height;
    svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
    var pts = marcas.map(function (m) { var b = m.getBoundingClientRect(); return [b.left + b.width / 2 - r.left, b.top + b.height / 2 - r.top]; });
    var horizontal = pts[1][1] - pts[0][1] < 10, d = 'M' + pts[0][0] + ' ' + pts[0][1];
    for (var i = 1; i < pts.length; i++) {
      var a = pts[i - 1], b = pts[i], s = i % 2 ? 1 : -1;
      if (horizontal) { var dx = b[0] - a[0]; d += 'C' + (a[0] + dx * .45) + ' ' + (a[1] - 46 * s) + ' ' + (b[0] - dx * .45) + ' ' + (b[1] - 46 * s) + ' ' + b[0] + ' ' + b[1]; }
      else { var dy = b[1] - a[1]; d += 'C' + (a[0] + 34 * s) + ' ' + (a[1] + dy * .4) + ' ' + (b[0] + 34 * s) + ' ' + (b[1] - dy * .4) + ' ' + b[0] + ' ' + b[1]; }
    }
    base.setAttribute('d', d); voo.setAttribute('d', d);
    comp = voo.getTotalLength(); voo.style.strokeDasharray = comp;
    voaTrilha();
  }
  function voaTrilha() {
    if (!comp) return;
    var r = trilha.getBoundingClientRect();
    var p = calma ? 1 : Math.max(0, Math.min(1, (innerHeight * .72 - r.top) / (r.height * .9)));
    var L = comp * p, a = voo.getPointAtLength(L), b = voo.getPointAtLength(Math.min(comp, L + 2));
    var ang = p >= 1 ? 0 : Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI + 90;
    voo.style.strokeDashoffset = comp - L;
    folha.style.transform = 'translate(' + a.x + 'px,' + a.y + 'px) rotate(' + (ang + Math.sin(L / 18) * 25) + 'deg)';
    var trecho = comp / (marcas.length - 1);
    passos.forEach(function (ps, i) { ps.classList.toggle('chegou', L >= trecho * i - 4); });
  }
  addEventListener('scroll', function () { requestAnimationFrame(voaTrilha); }, { passive: true });
  var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(montaTrilha, 150); });
  document.fonts && document.fonts.ready.then(montaTrilha);
  montaTrilha();

  /* ---------- revelação suave + WhatsApp flutuante ---------- */
  if (!calma && 'IntersectionObserver' in window) {
    var alvos = $$('.ciclo__intro, .ciclo__corpo, .voce__cab, .voce fieldset, .caminho__cab, .passo, .sobre__foto, .sobre__texto, .citacao, .duvidas__cab, .duvidas__lista, .final__caixa');
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    alvos.forEach(function (el, i) { el.classList.add('revela'); if (el.classList.contains('passo')) el.style.transitionDelay = (i % 4) * .1 + 's'; io.observe(el); });
  }
  var wa = $('.wa-flutua'), topo = $('#topo'), fim = $('#contato');
  var vendoTopo = true, vendoFim = false;
  function waVer() { wa.classList.toggle('ver', !vendoTopo && !vendoFim); }
  new IntersectionObserver(function (es) { vendoTopo = es[0].isIntersecting; waVer(); }, { threshold: .15 }).observe(topo);
  new IntersectionObserver(function (es) { vendoFim = es[0].isIntersecting; waVer(); }).observe(fim);
})();
