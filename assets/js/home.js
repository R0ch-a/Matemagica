/* ============================================================
   home.js — hero da pagina inicial

   1. Revela a palavra "Matemática".
   2. Depois dela, formulas surgem ao redor, crescem devagar e
      somem com blur.
   3. Mexer o mouse dissolve as formulas e pausa o ciclo. Apos
      5 s sem movimento, o ciclo recomeca.
   ============================================================ */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     Formulas — ensino fundamental e medio (LaTeX)
     --------------------------------------------------------- */
  var FORMULAS = [
    // Fundamental
    '3x + 5 = 20',
    '\\frac{2}{3} + \\frac{1}{4} = \\frac{11}{12}',
    '(-3) \\cdot (-4) = +12',
    'a \\cdot (b + c) = ab + ac',
    '\\frac{a}{b} = \\frac{c}{d} \\Rightarrow a \\cdot d = b \\cdot c',
    'p\\% \\text{ de } V = \\frac{p}{100} \\cdot V',
    '\\hat{A} + \\hat{B} + \\hat{C} = 180^\\circ',
    'S_i = 180^\\circ \\,(n - 2)',
    'A = \\frac{b \\cdot h}{2}',
    'A = \\pi r^2',
    'C = 2 \\pi r',
    'a^m \\cdot a^n = a^{m+n}',
    '\\bar{x} = \\frac{x_1 + x_2 + \\dots + x_n}{n}',
    'a^2 + b^2 = c^2',
    '(a + b)^2 = a^2 + 2ab + b^2',
    '(a + b)(a - b) = a^2 - b^2',
    '\\Delta = b^2 - 4ac',
    'x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}',
    // Medio
    'f(x) = ax + b',
    'a_n = a_1 + (n - 1)\\,r',
    'a_n = a_1 \\cdot q^{\\,n-1}',
    'S_n = \\frac{(a_1 + a_n)\\,n}{2}',
    '\\sin^2\\theta + \\cos^2\\theta = 1',
    '\\tan\\theta = \\frac{\\sin\\theta}{\\cos\\theta}',
    '\\frac{a}{\\sin \\hat{A}} = \\frac{b}{\\sin \\hat{B}} = \\frac{c}{\\sin \\hat{C}}',
    '\\log_b (x \\cdot y) = \\log_b x + \\log_b y',
    '\\sqrt[n]{a^m} = a^{\\frac{m}{n}}',
    'V = \\frac{4}{3} \\pi r^3',
    'd = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}',
    '\\binom{n}{k} = \\frac{n!}{k!\\,(n - k)!}',
    'P(A) = \\frac{n(A)}{n(\\Omega)}',
    'M = C\\,(1 + i)^t'
  ];

  var IDLE_MS    = 5000;   // tempo parado ate as formulas voltarem
  var LIFE_MS    = 5500;   // ciclo de vida de uma formula (casar com o CSS)
  var SAIDA_MS   = 2000;   // blur ao dissolver pelo mouse (casar com .formula no CSS)
  var SPAWN_MS   = 300;    // intervalo medio entre formulas novas
  var ESCALA_MAX = 1.14;   // escala final do keyframe formula-life
  var FOLGA      = 14;     // distancia minima entre elementos, em px
  // Quantas formulas cabem ao mesmo tempo: uma a cada PX_POR_FORMULA px²
  // de tela, entre MIN_ATIVAS e MAX_ATIVAS. Para mais formulas, diminua
  // PX_POR_FORMULA ou aumente MAX_ATIVAS.
  var PX_POR_FORMULA = 85000;
  var MIN_ATIVAS     = 5;
  var MAX_ATIVAS     = 16;

  var hero   = document.getElementById('hero');
  var stage  = document.getElementById('formulas');
  var glyphs = document.querySelector('.title-glyphs');
  if (!hero || !stage || !glyphs) return;

  /* ---------------------------------------------------------
     Acento do "á"
     Mede o sexto caractere com um Range — sem quebrar o texto em
     spans — e grava a posicao em em. Como tudo esta' em em, o acento
     acompanha a palavra em qualquer tamanho de tela sem remedir.
     --------------------------------------------------------- */
  function posicionarAcento() {
    var texto = glyphs.firstChild;
    if (!texto || texto.nodeType !== 3 || texto.length < 6) return;

    var range = document.createRange();
    range.setStart(texto, 5);
    range.setEnd(texto, 6);
    var ra = range.getBoundingClientRect();
    var rg = glyphs.getBoundingClientRect();
    var fs = parseFloat(getComputedStyle(glyphs).fontSize);
    if (!ra.width || !fs) return;

    // A caixa do caractere comeca na linha de ascendente (0.75em acima
    // da linha de base). O "a" tem 0.5em de altura; o acento flutua
    // acima dele, deslocado para a direita por causa da inclinacao.
    var x = (ra.left - rg.left) / fs + 0.37;
    var y = (ra.top  - rg.top)  / fs + 0.75 - 0.76;
    glyphs.style.setProperty('--acute-x', x.toFixed(3) + 'em');
    glyphs.style.setProperty('--acute-y', y.toFixed(3) + 'em');
  }

  /* ---------------------------------------------------------
     1. Revelacao da palavra
     --------------------------------------------------------- */
  function revelar(depois) {
    var feito = false;

    function fim() {
      if (feito) return;
      feito = true;
      // Sem a mascara e o filtro no estado final, o texto fica nitido
      // e o navegador para de recompor a camada.
      glyphs.classList.remove('is-revealing');
      glyphs.classList.add('is-revealed');
      depois();
    }

    function comecar() {
      // Mede antes da animacao: durante ela ha' transform na palavra.
      posicionarAcento();
      glyphs.classList.add('is-revealing');
      glyphs.addEventListener('animationend', fim, { once: true });
      setTimeout(fim, 3400);   // garantia, caso animationend nao dispare
    }

    // Espera a Mattilda: revelar a fonte de fallback e trocar no meio
    // da animacao seria pior do que esperar um instante.
    if (document.fonts && document.fonts.load) {
      var limite = new Promise(function (r) { setTimeout(r, 1500); });
      Promise.race([document.fonts.load('100px Mattilda'), limite]).then(comecar, comecar);
    } else {
      comecar();
    }
  }

  /* ---------------------------------------------------------
     2. Formulas
     --------------------------------------------------------- */
  var ativas    = [];      // { el, rect }
  var sacola    = [];      // ordem embaralhada, sem repetir ate esgotar
  var liberado  = false;   // so' depois da revelacao
  var pausado   = false;
  var ultimoMov = -Infinity;
  var proximo   = 0;

  function proximaFormula() {
    if (!sacola.length) {
      sacola = FORMULAS.slice();
      for (var i = sacola.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var t = sacola[i]; sacola[i] = sacola[j]; sacola[j] = t;
      }
    }
    // Com muitas na tela, a sacola recem-embaralhada pode sortear uma que
    // ainda esta' visivel: essa volta para o fundo e sai a seguinte.
    for (var k = sacola.length - 1; k >= 0; k--) {
      var tex = sacola[k];
      if (!ativas.some(function (a) { return a.tex === tex; })) {
        sacola.splice(k, 1);
        return tex;
      }
    }
    return sacola.pop();
  }

  function relativo(el, hr) {
    var r = el.getBoundingClientRect();
    return { x: r.left - hr.left, y: r.top - hr.top, w: r.width, h: r.height };
  }

  function cruza(a, b, folga) {
    return a.x < b.x + b.w + folga && a.x + a.w + folga > b.x &&
           a.y < b.y + b.h + folga && a.y + a.h + folga > b.y;
  }

  // Areas proibidas: a palavra e todo elemento de interface.
  function obstaculos(hr) {
    var sel = ['.title-glyphs', '.hero-brand', '.hero-chapters', '.home-card'];
    var lista = [];
    sel.forEach(function (s) {
      var el = hero.querySelector(s);
      if (el) lista.push(relativo(el, hr));
    });
    return lista;
  }

  function acharLugar(w, h, hr) {
    var margem = 12;
    var maxX = hr.width  - w - margem;
    var maxY = hr.height - h - margem;
    if (maxX < margem || maxY < margem) return null;

    var bloqueios = obstaculos(hr).concat(ativas.map(function (a) { return a.rect; }));

    for (var tentativa = 0; tentativa < 60; tentativa++) {
      var cand = {
        x: margem + Math.random() * (maxX - margem),
        y: margem + Math.random() * (maxY - margem),
        w: w, h: h
      };
      var livre = true;
      for (var i = 0; i < bloqueios.length; i++) {
        if (cruza(cand, bloqueios[i], FOLGA)) { livre = false; break; }
      }
      if (livre) return cand;
    }
    return null;
  }

  function maxAtivas(hr) {
    return Math.max(MIN_ATIVAS, Math.min(MAX_ATIVAS, Math.round((hr.width * hr.height) / PX_POR_FORMULA)));
  }

  function remover(item) {
    var i = ativas.indexOf(item);
    if (i > -1) ativas.splice(i, 1);
    item.el.remove();
  }

  function criarFormula() {
    var hr  = hero.getBoundingClientRect();
    var tex = proximaFormula();

    var el = document.createElement('div');
    el.className = 'formula';
    var inner = document.createElement('span');
    inner.className = 'formula-inner';

    var base = Math.max(16, Math.min(28, hr.width * 0.016));
    inner.style.setProperty('--size', (base * (0.85 + Math.random() * 0.35)).toFixed(1) + 'px');
    inner.style.setProperty('--life', LIFE_MS + 'ms');

    if (window.katex) {
      try { inner.innerHTML = katex.renderToString(tex, { throwOnError: false }); }
      catch (err) { inner.textContent = tex; }
    } else {
      // KaTeX nao carregou (sem internet): LaTeX cru e' melhor que nada.
      inner.textContent = tex;
    }

    // Mede invisivel antes de escolher o lugar.
    el.style.visibility = 'hidden';
    el.appendChild(inner);
    stage.appendChild(el);

    var w = el.offsetWidth, h = el.offsetHeight;
    // Reserva o tamanho no pico do crescimento, nao o inicial.
    var lugar = acharLugar(w * ESCALA_MAX, h * ESCALA_MAX, hr);
    if (!lugar) { el.remove(); return; }

    // O nucleo cresce a partir do centro: centraliza no espaco reservado.
    var x = lugar.x + (lugar.w - w) / 2;
    var y = lugar.y + (lugar.h - h) / 2;
    el.style.transform = 'translate(' + x.toFixed(1) + 'px, ' + y.toFixed(1) + 'px)';
    el.style.visibility = '';

    var item = { el: el, rect: lugar, tex: tex };
    ativas.push(item);
    inner.addEventListener('animationend', function () { remover(item); }, { once: true });
  }

  function dissolverTodas() {
    ativas.slice().forEach(function (item) {
      var i = ativas.indexOf(item);
      if (i > -1) ativas.splice(i, 1);
      item.el.classList.add('is-gone');
      setTimeout(function () { item.el.remove(); }, SAIDA_MS + 100);
    });
  }

  function tick() {
    if (!liberado || document.hidden) return;
    var agora = performance.now();

    if (pausado) {
      if (agora - ultimoMov < IDLE_MS) return;
      pausado = false;
      proximo = agora;
    }
    if (agora < proximo) return;

    if (ativas.length < maxAtivas(hero.getBoundingClientRect())) criarFormula();
    proximo = agora + SPAWN_MS * (0.7 + Math.random() * 0.6);
  }

  /* ---------------------------------------------------------
     3. Pausa pelo mouse
     --------------------------------------------------------- */
  var ultX = null, ultY = null;

  document.addEventListener('mousemove', function (e) {
    // O Chrome dispara mousemove sintetico quando o layout muda sob um
    // cursor parado. Sem este filtro, a propria animacao pausaria o ciclo.
    if (e.clientX === ultX && e.clientY === ultY) return;
    if (e.movementX === 0 && e.movementY === 0) return;
    ultX = e.clientX; ultY = e.clientY;

    ultimoMov = performance.now();
    if (!pausado) {
      pausado = true;
      dissolverTodas();
    }
  });

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  revelar(function () {
    liberado = true;
    proximo = performance.now() + 250;
  });
  setInterval(tick, 120);

})();
