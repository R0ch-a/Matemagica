/* ============================================================
   questao-cena.js — resolucao que avanca com a rolagem

   Cada questao e' um componente React (Board) desenhado numa tela
   fixa de 1920x1080 como funcao pura do tempo T. Aqui T nao vem
   de um relogio: vem de quanto o trilho da cena ja' rolou.

   API:
     QuestaoCena.montar(elemento, 'cap12-q10') -> { desmontar() }
   O arquivo da questao precisa estar carregado (window.Questoes).
   ============================================================ */
(function () {
  'use strict';

  if (!window.React || !window.ReactDOM) {
    console.error('[questao-cena] React nao carregou.');
    return;
  }
  var h = React.createElement;

  /* ---------------------------------------------------------
     Ajustes
     --------------------------------------------------------- */
  var VH_POR_SEGUNDO = 12;   // rolagem, em % da altura da tela, por segundo de animacao
  var T_INICIAL      = 1.2;  // no topo o enunciado da composicao ja' apareceu
  var ASSENTAR       = 1.0;  // ao pular para um passo, mostra-o ja' assentado
  var SUAVIDADE      = 0.14; // fracao da distancia percorrida por quadro

  var reduzMovimento = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Interpolacao — mesma semantica do motor original
     --------------------------------------------------------- */
  var Easing = {
    linear: function (t) { return t; },
    easeOutCubic: function (t) { return (--t) * t * t + 1; },
    easeInOutCubic: function (t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    easeOutBack: function (t) {
      var c1 = 1.70158, c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }
  };

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  // animate({from, to, start, end, ease})(t): 'from' antes de start,
  // 'to' depois de end.
  function animate(o) {
    var from = o.from == null ? 0 : o.from;
    var to = o.to == null ? 1 : o.to;
    var start = o.start == null ? 0 : o.start;
    var end = o.end == null ? 1 : o.end;
    var ease = o.ease || Easing.easeInOutCubic;
    return function (t) {
      if (t <= start) return from;
      if (t >= end) return to;
      return from + (to - from) * ease((t - start) / (end - start));
    };
  }

  var CompositionContext = React.createContext(null);
  function useComposition() {
    var ctx = React.useContext(CompositionContext);
    if (!ctx) throw new Error('useComposition() fora da cena');
    return ctx;
  }

  Object.assign(window, {
    Easing: Easing, clamp: clamp, animate: animate, useComposition: useComposition
  });

  /* ---------------------------------------------------------
     Cenas -> tabela de tempos
     --------------------------------------------------------- */
  function derivar(scenes) {
    var inicio = 0, secoes = [], cues = {};
    scenes.forEach(function (s) {
      secoes.push({ name: s.name, desc: s.desc || '', start: inicio, dur: s.dur });
      if (!(s.name in cues)) cues[s.name] = Math.round(inicio * 1000) / 1000;
      inicio += s.dur;
    });
    return { secoes: secoes, cues: cues, total: Math.round(inicio * 1000) / 1000 };
  }

  function secaoEm(d, t) {
    for (var i = 0; i < d.secoes.length; i++) {
      if (t < d.secoes[i].start + d.secoes[i].dur) return i;
    }
    return d.secoes.length - 1;
  }

  /* ---------------------------------------------------------
     Cena
     --------------------------------------------------------- */
  function Cena(props) {
    var q = props.q;
    var d = React.useMemo(function () { return derivar(q.scenes); }, [q]);
    var faixaT = d.total - T_INICIAL;

    var _t = React.useState(T_INICIAL), T = _t[0], setT = _t[1];
    var _q = React.useState({ w: 0, h: 0, s: 0 }), quadro = _q[0], setQuadro = _q[1];

    var trilho = React.useRef(null);
    var sticky = React.useRef(null);
    var tela = React.useRef(null);
    var atual = React.useRef(T_INICIAL);

    // Geometria do trilho: onde ele comeca na pagina e quanto rola.
    function geometria() {
      var el = trilho.current, st = sticky.current;
      var topoSticky = parseFloat(getComputedStyle(st).top) || 0;
      var r = el.getBoundingClientRect();
      return {
        inicio: window.scrollY + r.top - topoSticky,
        faixa: Math.max(1, el.offsetHeight - st.offsetHeight)
      };
    }

    function tAlvo() {
      var g = geometria();
      var p = clamp((window.scrollY - g.inicio) / g.faixa, 0, 1);
      return T_INICIAL + p * faixaT;
    }

    // Rolagem -> T, suavizado. O laco so' roda enquanto T ainda nao
    // alcancou o alvo; parado, nao ha' nenhum quadro sendo pedido.
    React.useEffect(function () {
      var raf = null;
      function passo() {
        var alvo = tAlvo();
        var n = reduzMovimento ? alvo : atual.current + (alvo - atual.current) * SUAVIDADE;
        if (Math.abs(alvo - n) < 0.002) n = alvo;
        atual.current = n;
        setT(n);
        raf = n === alvo ? null : requestAnimationFrame(passo);
      }
      function acordar() { if (!raf) raf = requestAnimationFrame(passo); }

      atual.current = tAlvo();
      setT(atual.current);
      window.addEventListener('scroll', acordar, { passive: true });
      window.addEventListener('resize', acordar);
      return function () {
        window.removeEventListener('scroll', acordar);
        window.removeEventListener('resize', acordar);
        if (raf) cancelAnimationFrame(raf);
      };
    }, [d]);

    // Escala da composicao para a area disponivel.
    React.useEffect(function () {
      var el = tela.current;
      function medir() {
        var s = Math.min(el.clientWidth / q.width, el.clientHeight / q.height);
        s = Math.max(0.05, s);
        setQuadro({ w: Math.floor(q.width * s), h: Math.floor(q.height * s), s: s });
      }
      medir();
      var ro = new ResizeObserver(medir);
      ro.observe(el);
      return function () { ro.disconnect(); };
    }, [q]);

    function irParaPasso(i) {
      var s = d.secoes[i];
      var t = Math.max(T_INICIAL, s.start + Math.min(ASSENTAR, s.dur * 0.5));
      var g = geometria();
      window.scrollTo({
        top: g.inicio + ((t - T_INICIAL) / faixaT) * g.faixa + 1,
        behavior: reduzMovimento ? 'auto' : 'smooth'
      });
    }

    // O rotulo troca no meio da transicao entre passos, que acontece
    // em torno do inicio de cada cena.
    var iAtual = secaoEm(d, T + 0.05);
    var secao = d.secoes[iAtual];
    var titulo = q.passos && q.passos[iAtual] ? q.passos[iAtual] : secao.name;

    var ctx = React.useMemo(function () {
      return { T: T, CUES: d.cues, time: T, duration: d.total, authoredTotal: d.total, playing: false };
    }, [T, d]);

    // Altura do trilho = tela presa + rolagem que percorre a animacao.
    var alturaTrilho = 'calc(var(--cena-h) + ' + (faixaT * VH_POR_SEGUNDO).toFixed(1) + 'vh)';

    return h('div', { className: 'cena', ref: trilho, style: { height: alturaTrilho } },
      h('div', { className: 'cena-sticky', ref: sticky },
        h('div', { className: 'cena-tela', ref: tela },
          quadro.s ? h('div', {
              className: 'cena-quadro',
              style: { width: quadro.w, height: quadro.h, background: q.bg },
              'aria-hidden': 'true'
            },
            h('div', {
                className: 'cena-canvas',
                style: { width: q.width, height: q.height, transform: 'scale(' + quadro.s + ')' }
              },
              h(CompositionContext.Provider, { value: ctx }, h(q.Board, { tw: q.tweaks }))
            )
          ) : null
        ),

        h('div', { className: 'cena-hud', style: { width: quadro.w || '100%' } },
          h('div', { className: 'cena-passo', 'aria-live': 'polite' },
            h('span', { className: 'cena-passo-n' },
              String(iAtual + 1).padStart(2, '0') + ' / ' + String(d.secoes.length).padStart(2, '0')),
            h('span', { className: 'cena-passo-t' }, titulo),
            secao.desc ? h('span', { className: 'cena-passo-d' }, secao.desc) : null
          ),
          h('div', { className: 'cena-barra' },
            d.secoes.map(function (s, i) {
              var fim = s.start + s.dur;
              var pct = clamp((T - s.start) / s.dur, 0, 1) * 100;
              var rotulo = q.passos && q.passos[i] ? q.passos[i] : s.name;
              return h('button', {
                  key: i, type: 'button', className: 'cena-seg',
                  style: { flexGrow: s.dur, flexBasis: 0 },
                  'aria-label': 'Ir para o passo ' + (i + 1) + ': ' + rotulo,
                  'aria-current': i === iAtual ? 'step' : undefined,
                  title: (i + 1) + '. ' + rotulo,
                  onClick: function () { irParaPasso(i); }
                },
                h('span', { className: 'cena-seg-fill', style: { width: (T >= fim ? 100 : pct) + '%' } })
              );
            })
          )
        )
      )
    );
  }

  /* ---------------------------------------------------------
     API
     --------------------------------------------------------- */
  window.QuestaoCena = {
    montar: function (el, id) {
      var q = window.Questoes && window.Questoes[id];
      if (!q) {
        el.textContent = 'Não foi possível carregar esta resolução.';
        return { desmontar: function () {} };
      }
      var root = ReactDOM.createRoot(el);
      root.render(h(Cena, { q: q }));
      return { desmontar: function () { root.unmount(); } };
    }
  };
})();
