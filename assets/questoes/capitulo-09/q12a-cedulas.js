/* ============================================================
   Capitulo 9 · Questao 12 · a — resolucao animada
   Convertida da composicao original (JSX -> JS). Desenha a tela
   1920x1080 como funcao do tempo T; quem controla T e' a rolagem,
   em assets/js/questao-cena.js.
   Usa icones Lottie: o componente pega a URL em window.__resources,
   preenchido logo abaixo a partir da pasta deste arquivo.
   ============================================================ */
(function () {
  // Icones Lottie desta questao. BASE aponta para a pasta deste
  // arquivo, entao os caminhos valem de qualquer pagina.
  var BASE = ((document.currentScript && document.currentScript.src) || '').replace(/[^/]+$/, '');
  window.__resources = Object.assign({}, window.__resources, {
    iconeCedulas: BASE + 'icones/cedulas.json',
    iconeSacola:  BASE + 'icones/sacola.json'
  });
  /* global React, useComposition, animate, Easing, clamp */

  const BG = '#1f1f1f';
  const INK = '#eef1f6';
  const GRAY = '#79828f';
  const DIM = '#464e59';
  const MOTION = {
    enter: (from, to, start, end) => animate({
      from,
      to,
      start,
      end,
      ease: Easing.easeOutCubic
    }),
    glide: (from, to, start, end) => animate({
      from,
      to,
      start,
      end,
      ease: Easing.easeInOutCubic
    }),
    pop: (from, to, start, end) => animate({
      from,
      to,
      start,
      end,
      ease: Easing.easeOutBack
    })
  };
  const hex2rgb = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const toHex = v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0');
  function mix(a, b, t) {
    const A = hex2rgb(a),
      B = hex2rgb(b);
    return '#' + A.map((v, i) => toHex(v + (B[i] - v) * t)).join('');
  }

  /* tokens */
  const rm = (s, c) => ({
    k: 't',
    s,
    c: c || 'n'
  });
  const st = (s, c) => ({
    k: 't',
    s,
    c: c || 'n',
    x: true
  });
  const fr = (n, d, c) => ({
    k: 'f',
    n,
    d,
    c: c || 'n'
  });
  const bx = (s, c) => ({
    k: 'b',
    s,
    c: c || 'm'
  });
  const sys = (lines, opt) => Object.assign({
    k: 's',
    lines
  }, opt || {});
  const STEPS = [{
    label: 'montar o sistema',
    h: 320,
    toks: [sys([{
      toks: [rm('d + c = 74', 'm')]
    }, {
      toks: [rm('2d + 5c = 277', 'm')]
    }], {
      ann: ['cédulas', 'reais']
    })]
  }, {
    label: 'multiplicar a 1ª linha por (−2)',
    note: 'para cancelar\nos termos em d',
    h: 300,
    toks: [sys([{
      toks: [rm('d + c = 74', 'm')]
    }, {
      toks: [rm('2d + 5c = 277', 'r')]
    }], {
      ann: ['× (−2)', '']
    })]
  }, {
    label: 'linha reescrita',
    note: '74 · (−2) = −148',
    h: 300,
    toks: [sys([{
      toks: [rm('−2d − 2c = −148', 'm')]
    }, {
      toks: [rm(' 2d + 5c = 277', 'r')]
    }])]
  }, {
    label: 'somar membro a membro',
    note: '−2c + 5c = 3c',
    h: 420,
    toks: [sys([{
      toks: [st('−2d', 'm'), rm(' − 2c = −148', 'r')]
    }, {
      toks: [st(' 2d', 'm'), rm(' + 5c = 277', 'r')]
    }], {
      plus: true,
      sum: [rm('3c = 129', 'm')]
    })]
  }, {
    label: 'dividir os dois membros por 3',
    h: 280,
    toks: [fr('3c', '3', 'r'), rm(' = ', 'r'), fr('129', '3', 'r'), rm('    →    ', 'r'), bx('c = 43', 'm')]
  }, {
    label: 'voltar na contagem de cédulas',
    h: 150,
    toks: [rm('d + ', 'r'), rm('43', 'm'), rm(' = 74', 'r')]
  }, {
    label: 'isolar d',
    note: '74 − 43',
    h: 220,
    toks: [bx('d = 31', 'm')]
  }, {
    label: 'conferindo o valor total',
    note: '62 + 215',
    h: 150,
    toks: [rm('2 · 31 + 5 · 43 = 277', 'r')]
  }, {
    label: 'resposta',
    h: 210,
    toks: [rm('∴  31 de R$ 2,00  e  43 de R$ 5,00', 'o')]
  }];
  const CUE_NAMES = ['Sistema', 'Multiplicar', 'Reescrever', 'Somar', 'DividirC', 'Voltar', 'ValorD', 'Conferir', 'Resposta'];
  const ACTIVE_Y = 660;
  const NAT_H = i => STEPS[i].h || 150;
  function Tok({
    tok,
    col
  }) {
    const c = col(tok.c);
    if (tok.k === 't') {
      if (tok.x) {
        return /*#__PURE__*/React.createElement("span", {
          style: {
            position: 'relative',
            color: c,
            whiteSpace: 'pre',
            flexShrink: 0
          }
        }, tok.s, /*#__PURE__*/React.createElement("span", {
          style: {
            position: 'absolute',
            left: '-8%',
            right: '-8%',
            top: '52%',
            height: 4,
            background: c,
            borderRadius: 2,
            transform: 'rotate(-13deg)'
          }
        }));
      }
      return /*#__PURE__*/React.createElement("span", {
        style: {
          color: c,
          whiteSpace: 'pre',
          fontStyle: tok.i ? 'italic' : 'normal',
          flexShrink: 0
        }
      }, tok.s);
    }
    if (tok.k === 'f') {
      return /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '0 10px',
          flexShrink: 0,
          color: c
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          padding: '0 8px',
          lineHeight: 1.12,
          whiteSpace: 'nowrap'
        }
      }, tok.n), /*#__PURE__*/React.createElement("span", {
        style: {
          height: 3,
          background: c,
          alignSelf: 'stretch',
          margin: '8px 0',
          borderRadius: 2
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          padding: '0 8px',
          lineHeight: 1.12,
          whiteSpace: 'nowrap'
        }
      }, tok.d));
    }
    if (tok.k === 'b') {
      return /*#__PURE__*/React.createElement("span", {
        style: {
          color: c,
          border: `2px solid ${c}`,
          background: mix(BG, c, 0.16),
          borderRadius: 8,
          padding: '10px 26px',
          whiteSpace: 'pre',
          flexShrink: 0,
          lineHeight: 1.1
        }
      }, tok.s);
    }
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        flexDirection: 'column',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 52,
        color: col('m'),
        opacity: tok.plus ? 1 : 0,
        flexShrink: 0
      }
    }, "+"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '1.1em',
        lineHeight: 0.9,
        transform: 'scaleY(2.7)',
        transformOrigin: '50% 50%',
        marginRight: 24,
        color: col('r'),
        flexShrink: 0
      }
    }, '{'), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        flexDirection: 'column',
        gap: 18
      }
    }, tok.lines.map((ln, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        whiteSpace: 'nowrap'
      }
    }, ln.toks.map((t2, j) => /*#__PURE__*/React.createElement(Tok, {
      key: j,
      tok: t2,
      col: col
    })), tok.ann && tok.ann[i] ? /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 44,
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: '0.62em',
        color: col('m'),
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 70,
        height: 3,
        background: col('m'),
        borderRadius: 2,
        display: 'block'
      }
    }), tok.ann[i]) : null)))), tok.sum ? /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        flexDirection: 'column',
        marginTop: 20
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        height: 3,
        background: col('r'),
        borderRadius: 2,
        width: 560
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        marginTop: 20,
        marginLeft: 128,
        whiteSpace: 'nowrap'
      }
    }, tok.sum.map((t2, j) => /*#__PURE__*/React.createElement(Tok, {
      key: j,
      tok: t2,
      col: col
    })))) : null);
  }
  function Row({
    step,
    i,
    k,
    y,
    cy,
    or
  }) {
    const d = k - i;
    const age = clamp(d, 0, 1);
    const op = d < 0 ? clamp(1 + d * 1.7, 0, 1) : clamp((3.2 - d) / 0.8, 0, 1) * (1 - 0.2 * clamp(d, 0, 1));
    const scale = 1 - 0.46 * clamp(d, 0, 1);
    const active = clamp(1 - Math.abs(d) * 1.4, 0, 1);
    const col = role => {
      if (role === 'o') return or;
      if (role === 'r') return GRAY;
      return mix(role === 'm' ? cy : INK, GRAY, age);
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 56,
        top: y,
        width: 1840,
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
        opacity: op,
        transform: `translateY(-50%) scale(${scale})`,
        transformOrigin: '0 50%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 470,
        textAlign: 'right',
        paddingRight: 44,
        fontFamily: "'Caveat', cursive",
        fontSize: 66,
        color: mix('#ffffff', DIM, 1 - active),
        flexShrink: 0,
        lineHeight: 1
      }
    }, step.label), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 54,
        lineHeight: 1.05
      }
    }, step.toks.map((tk, j) => /*#__PURE__*/React.createElement(Tok, {
      key: j,
      tok: tk,
      col: col
    }))), step.note ? /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: 48,
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 26,
        color: GRAY,
        opacity: active,
        whiteSpace: 'pre-line',
        maxWidth: 260,
        lineHeight: 1.4,
        flexShrink: 0
      }
    }, step.note) : null);
  }
  function LottieIcon({
    resKey,
    path,
    size,
    t
  }) {
    const box = React.useRef(null);
    const anim = React.useRef(null);
    React.useEffect(() => {
      let alive = true;
      const url = window.__resources && window.__resources[resKey] || path;
      fetch(url).then(r => r.json()).then(data => {
        if (!alive || !box.current || !window.lottie) return;
        anim.current = window.lottie.loadAnimation({
          container: box.current,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          animationData: data
        });
      }).catch(() => {});
      return () => {
        alive = false;
        if (anim.current) anim.current.destroy();
      };
    }, []);
    React.useEffect(() => {
      const a = anim.current;
      if (!a || !a.totalFrames) return;
      a.goToAndStop(t * 24 % a.totalFrames, true);
    });
    return /*#__PURE__*/React.createElement("div", {
      ref: box,
      style: {
        width: size,
        height: size,
        flexShrink: 0
      }
    });
  }
  function Painel({
    T,
    CUES,
    cy,
    or
  }) {
    const inP = MOTION.enter(0, 1, 0.4, 1.6)(T);
    const solvedC = MOTION.glide(0, 1, CUES.DividirC - 0.2, CUES.DividirC + 0.7)(T);
    const solvedD = MOTION.glide(0, 1, CUES.ValorD - 0.2, CUES.ValorD + 0.7)(T);
    const fin = MOTION.glide(0, 1, CUES.Resposta - 0.3, CUES.Resposta + 0.6)(T);
    const cD = mix(mix(INK, cy, solvedD * 0.9), or, fin);
    const cC = mix(mix(INK, cy, solvedC * 0.9), or, fin);
    const linha = (resKey, path, nome, sub, valor, cor) => /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 24
      }
    }, /*#__PURE__*/React.createElement(LottieIcon, {
      resKey: resKey,
      path: path,
      size: 140,
      t: T
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 23,
        color: GRAY,
        letterSpacing: '0.06em'
      }
    }, nome), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 56,
        color: cor,
        lineHeight: 1
      }
    }, valor), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 22,
        color: mix(DIM, GRAY, 0.8)
      }
    }, sub)));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 90,
        top: 300,
        width: 440,
        opacity: inP,
        transform: `translateY(${20 * (1 - inP)}px)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 32
      }
    }, linha('iconeCedulas', './icone-cedulas.json', 'CÉDULAS DE R$ 2,00', 'd', solvedD > 0.5 ? '31' : 'd', cD), linha('iconeSacola', './icone-sacola.json', 'CÉDULAS DE R$ 5,00', 'c', solvedC > 0.5 ? '43' : 'c', cC), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        background: '#333333'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 26,
        color: GRAY,
        lineHeight: 1.5
      }
    }, "74 c\xE9dulas", /*#__PURE__*/React.createElement("br", null), "R$ 277,00"));
  }
  function Board({
    tw
  }) {
    const {
      T,
      CUES,
      authoredTotal
    } = useComposition();
    const cy = tw.corModificado,
      or = tw.corResultado;
    let k = 0;
    for (let i = 1; i < CUE_NAMES.length; i++) {
      const c = CUES[CUE_NAMES[i]];
      k += MOTION.glide(0, 1, c - 0.55, c + 0.45)(T);
    }
    const sh = j => NAT_H(j) * (1 - 0.46 * clamp(k - j, 0, 1));
    const ctr = [0];
    for (let i = 1; i < STEPS.length; i++) ctr[i] = ctr[i - 1] + (sh(i - 1) + sh(i)) / 2;
    const kf = clamp(Math.floor(k), 0, STEPS.length - 1);
    const frac = clamp(k - kf, 0, 1);
    const base = ctr[kf] + frac * ((ctr[Math.min(kf + 1, STEPS.length - 1)] || 0) - ctr[kf]);
    const camera = 1 + 0.02 * clamp(T / Math.max(authoredTotal, 1), 0, 1);
    const headOp = MOTION.enter(0, 1, 0.15, 1.2)(T);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: BG,
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        transform: `scale(${camera})`,
        transformOrigin: '50% 62%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 96,
        top: 92,
        width: 1400,
        opacity: headOp
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 20,
        color: cy,
        letterSpacing: '0.14em'
      }
    }, "QUEST\xC3O 12 \xB7 a"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 31,
        color: GRAY,
        marginTop: 14,
        lineHeight: 1.35
      }
    }, "J\xFAlio tem R$ 277,00 em 74 c\xE9dulas de R$ 2,00 e de R$ 5,00. Quantas c\xE9dulas de cada tipo ele tem?")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 96,
        top: 214,
        width: 1728,
        height: 2,
        background: '#333333'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 244,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
      }
    }, STEPS.map((s, i) => /*#__PURE__*/React.createElement(Row, {
      key: i,
      step: s,
      i: i,
      k: k,
      y: ACTIVE_Y - 244 + ctr[i] - base,
      cy: cy,
      or: or
    }))), /*#__PURE__*/React.createElement(Painel, {
      T: T,
      CUES: CUES,
      cy: cy,
      or: or
    })));
  }
  window.Questoes = window.Questoes || {};
  window.Questoes["cap09-q12a"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "Sistema",
      "dur": 6.5,
      "desc": "O sistema aparece: d mais c igual 74 cedulas e 2d mais 5c igual 277 reais"
    }, {
      "name": "Multiplicar",
      "dur": 6,
      "desc": "A primeira linha inteira e multiplicada por menos 2"
    }, {
      "name": "Reescrever",
      "dur": 5,
      "desc": "A linha reescrita: menos 2d menos 2c igual menos 148"
    }, {
      "name": "Somar",
      "dur": 7,
      "desc": "Somando membro a membro, os termos em d se cancelam e sobra 3c igual 129"
    }, {
      "name": "DividirC",
      "dur": 5.5,
      "desc": "Dividindo por 3: c igual a 43 cedulas de 5 reais"
    }, {
      "name": "Voltar",
      "dur": 5,
      "desc": "Voltando na contagem de cedulas: d mais 43 igual 74"
    }, {
      "name": "ValorD",
      "dur": 5,
      "desc": "d igual a 31 cedulas de 2 reais"
    }, {
      "name": "Conferir",
      "dur": 5,
      "desc": "Conferindo o valor total: 62 mais 215 igual 277 reais"
    }, {
      "name": "Resposta",
      "dur": 6,
      "desc": "Resposta final: 31 cedulas de 2 reais e 43 de 5 reais"
    }],
    playback: {
      "mode": "loop"
    },
    tweaks: {
      "corModificado": "#2dd4bf",
      "corResultado": "#f9a03c"
    }
  };
})();
