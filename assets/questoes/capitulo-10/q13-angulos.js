/* ============================================================
   Capitulo 10 · Questao 13 — resolucao animada
   Convertida da composicao original (JSX -> JS). Desenha a tela
   1920x1080 como funcao do tempo T; quem controla T e' a rolagem,
   em assets/js/questao-cena.js.
   ============================================================ */
(function () {
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
  const it = (s, c) => ({
    s,
    c: c || 'n',
    i: true
  });
  const rm = (s, c) => ({
    s,
    c: c || 'n'
  });
  const STEPS = [{
    label: 'enunciado',
    tall: true,
    toks: [it('r'), rm(' \u2225 '), it('s'), rm('     ', 'r'), it('u', 'r'), rm(' e ', 'r'), it('t', 'r'), rm(' transversais', 'r')]
  }, {
    label: 'retas paralelas',
    toks: [it('r', 'm'), rm(' \u2225 ', 'm'), it('s', 'm')]
  }, {
    label: 'r, u e t formam um tri\u00e2ngulo',
    toks: [rm('20\u00b0,  120\u00b0,  ', 'r'), it('a', 'm')]
  }, {
    label: 'soma dos \u00e2ngulos internos',
    toks: [rm('20\u00b0 + 120\u00b0 + ', 'r'), it('a', 'm'), rm(' = 180\u00b0', 'r')]
  }, {
    label: 'valor de a',
    toks: [it('a', 'r'), rm(' = ', 'r'), rm('40\u00b0', 'm')]
  }, {
    label: '\u00e2ngulos correspondentes',
    toks: [it('r', 'r'), rm(' \u2225 ', 'r'), it('s', 'r'), rm('  \u21d2  ', 'r'), it('y', 'm'), rm(' = 40\u00b0', 'm')]
  }, {
    label: '\u00e2ngulos suplementares',
    toks: [it('x', 'r'), rm(' + ', 'r'), it('y', 'm'), rm(' = 180\u00b0', 'r')]
  }, {
    label: 'resultado',
    toks: [it('x', 'r'), rm(' = 180\u00b0 \u2212 40\u00b0 = ', 'r'), rm('140\u00b0', 'o')]
  }, {
    label: 'alternativa',
    tall: true,
    toks: [rm('\u2234  ', 'o'), it('x', 'o'), rm(' = 140\u00b0', 'o')]
  }];
  const CUE_NAMES = ['Enunciado', 'Paralelas', 'Triangulo', 'Soma', 'ValorA', 'Correspondentes', 'Suplementares', 'Resultado', 'Alternativa'];
  const ACTIVE_Y = 700;
  const NAT_H = i => STEPS[i].tall ? 190 : 168;

  /* ---- figura ----------------------------------------------------------- */
  const A = [527, 120],
    B = [245, 120],
    V = [387, 240],
    C = [530, 360];
  const U_UP = 40.7,
    U_DN = 220.7,
    T_UP = 139.9,
    T_DN = 319.9;
  function arcPath(c, r, a1, a2) {
    const p = a => [c[0] + r * Math.cos(a * Math.PI / 180), c[1] - r * Math.sin(a * Math.PI / 180)];
    const [x1, y1] = p(a1),
      [x2, y2] = p(a2);
    const large = (a2 - a1 + 360) % 360 > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 0 ${x2} ${y2}`;
  }
  const at = (c, r, a) => [c[0] + r * Math.cos(a * Math.PI / 180), c[1] - r * Math.sin(a * Math.PI / 180)];
  function Figura({
    T,
    CUES,
    cy,
    or
  }) {
    const win = (a, b) => MOTION.glide(0, 1, a - 0.4, a + 0.5)(T) * (1 - MOTION.glide(0, 1, b - 0.4, b + 0.4)(T));
    const appear = a => MOTION.enter(0, 1, a - 0.3, a + 0.7)(T);
    const drawn = MOTION.glide(0, 1, 0.3, 2.2)(T);
    const hlPar = win(CUES.Paralelas, CUES.Triangulo);
    const triOp = win(CUES.Triangulo, CUES.Correspondentes) * 0.9;
    const hlSoma = win(CUES.Soma, CUES.ValorA);
    const aOn = appear(CUES.Triangulo);
    const hlA = win(CUES.ValorA, CUES.Correspondentes);
    const yOn = appear(CUES.Correspondentes);
    const hlY = win(CUES.Correspondentes, CUES.Suplementares) + win(CUES.Suplementares, CUES.Resultado) * 0.6;
    const hlX = win(CUES.Suplementares, CUES.Resultado);
    const xFinal = MOTION.glide(0, 1, CUES.Resultado - 0.3, CUES.Resultado + 0.6)(T);
    const lineCol = mix(mix(GRAY, INK, 0.25), cy, hlPar);
    const plain = mix(GRAY, INK, 0.25);
    const arcBase = INK;
    const xCol = mix(mix(arcBase, cy, clamp(hlX, 0, 1)), or, xFinal);
    const yCol = mix(arcBase, cy, clamp(hlY, 0, 1));
    const aCol = mix(arcBase, cy, clamp(hlA, 0, 1));
    const angCol = mix(arcBase, cy, clamp(hlSoma, 0, 1));
    const L = (p1, p2, col, w) => /*#__PURE__*/React.createElement("line", {
      x1: p1[0],
      y1: p1[1],
      x2: p2[0],
      y2: p2[1],
      stroke: col,
      strokeWidth: w || 2.4,
      strokeLinecap: "round",
      strokeDasharray: "1200",
      strokeDashoffset: 1200 * (1 - drawn)
    });
    const aLbl = at(B, 88, 340),
      yLbl = at(C, 78, 160),
      xLbl = at(C, 96, 70);
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "10 10 740 500",
      style: {
        position: 'absolute',
        right: 60,
        top: 250,
        width: 760,
        height: 520,
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("polygon", {
      points: `${A[0]},${A[1]} ${B[0]},${B[1]} ${V[0]},${V[1]}`,
      fill: cy,
      opacity: triOp * 0.14
    }), L([40, 120], [700, 120], lineCol), L([40, 360], [700, 360], lineCol), L([120, 470], [620, 40], plain), L([150, 40], [660, 470], plain), /*#__PURE__*/React.createElement("path", {
      d: arcPath(A, 52, 0, U_UP),
      fill: "none",
      stroke: angCol,
      strokeWidth: "2.6",
      opacity: drawn
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(V, 48, U_DN, T_DN),
      fill: "none",
      stroke: angCol,
      strokeWidth: "2.6",
      opacity: drawn
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(B, 54, T_DN, 360),
      fill: "none",
      stroke: aCol,
      strokeWidth: "2.6",
      opacity: aOn
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(C, 46, T_UP, 180),
      fill: "none",
      stroke: yCol,
      strokeWidth: "2.6",
      opacity: yOn
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(C, 66, 0, T_UP),
      fill: "none",
      stroke: xCol,
      strokeWidth: 2.6 + 1.6 * xFinal,
      opacity: drawn
    }), /*#__PURE__*/React.createElement("g", {
      fontFamily: "'STIX Two Text', Georgia, serif",
      fontSize: "27"
    }, /*#__PURE__*/React.createElement("text", {
      x: at(A, 82, 20)[0],
      y: at(A, 82, 20)[1],
      fill: angCol,
      textAnchor: "middle",
      opacity: drawn
    }, "20\xB0"), /*#__PURE__*/React.createElement("text", {
      x: at(V, 82, 272)[0],
      y: at(V, 82, 272)[1],
      fill: angCol,
      textAnchor: "middle",
      opacity: drawn
    }, "120\xB0"), /*#__PURE__*/React.createElement("text", {
      x: aLbl[0],
      y: aLbl[1],
      fill: aCol,
      textAnchor: "middle",
      opacity: aOn
    }, hlA > 0.5 || T > CUES.ValorA ? '40°' : 'a'), /*#__PURE__*/React.createElement("text", {
      x: yLbl[0],
      y: yLbl[1],
      fill: yCol,
      textAnchor: "middle",
      opacity: yOn
    }, "y"), /*#__PURE__*/React.createElement("text", {
      x: xLbl[0],
      y: xLbl[1],
      fill: xCol,
      textAnchor: "middle",
      fontSize: 27 + 9 * xFinal,
      opacity: drawn
    }, xFinal > 0.5 ? '140°' : 'x')), /*#__PURE__*/React.createElement("g", {
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: "24",
      fill: plain,
      opacity: drawn
    }, /*#__PURE__*/React.createElement("text", {
      x: "712",
      y: "112"
    }, "r"), /*#__PURE__*/React.createElement("text", {
      x: "712",
      y: "352"
    }, "s"), /*#__PURE__*/React.createElement("text", {
      x: "628",
      y: "32"
    }, "u"), /*#__PURE__*/React.createElement("text", {
      x: "668",
      y: "486"
    }, "t")));
  }

  /* ---- escada de etapas -------------------------------------------------- */
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
    const op = d < 0 ? clamp(1 + d * 1.7, 0, 1) : clamp((3.4 - d) / 0.8, 0, 1) * (1 - 0.2 * clamp(d, 0, 1));
    const scale = 1 - 0.42 * clamp(d, 0, 1);
    const active = clamp(1 - Math.abs(d) * 1.4, 0, 1);
    const col = role => {
      if (role === 'o') return or;
      if (role === 'r') return GRAY;
      return mix(role === 'm' ? cy : INK, GRAY, age);
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 80,
        top: y,
        width: 1020,
        opacity: op,
        transform: `translateY(-50%) scale(${scale})`,
        transformOrigin: '0 50%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Caveat', cursive",
        fontSize: 62,
        color: mix('#ffffff', DIM, 1 - active),
        lineHeight: 1
      }
    }, step.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 56,
        marginTop: 16,
        display: 'flex',
        alignItems: 'baseline',
        flexWrap: 'nowrap'
      }
    }, step.toks.map((tk, j) => /*#__PURE__*/React.createElement("span", {
      key: j,
      style: {
        color: col(tk.c),
        fontStyle: tk.i ? 'italic' : 'normal',
        whiteSpace: 'pre'
      }
    }, tk.s))));
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
    const sh = j => NAT_H(j) * (1 - 0.42 * clamp(k - j, 0, 1));
    const ctr = [0];
    for (let i = 1; i < STEPS.length; i++) ctr[i] = ctr[i - 1] + (sh(i - 1) + sh(i)) / 2;
    const kf = clamp(Math.floor(k), 0, STEPS.length - 1);
    const frac = clamp(k - kf, 0, 1);
    const base = ctr[kf] + frac * ((ctr[Math.min(kf + 1, STEPS.length - 1)] || 0) - ctr[kf]);
    const camera = 1 + 0.018 * clamp(T / Math.max(authoredTotal, 1), 0, 1);
    const headOp = MOTION.enter(0, 1, 0.15, 1.2)(T);
    const pickOp = MOTION.pop(0, 1, CUES.Alternativa - 0.2, CUES.Alternativa + 0.9)(T);
    const opts = [['a', '140°'], ['b', '145°'], ['c', '150°'], ['d', '155°'], ['e', '160°']];
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
        transformOrigin: '50% 60%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 80,
        top: 88,
        width: 1700,
        opacity: headOp
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 20,
        color: cy,
        letterSpacing: '0.14em'
      }
    }, "QUEST\xC3O 13 \xB7 IFPE (ADAPTADA)"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 30,
        color: GRAY,
        marginTop: 14,
        maxWidth: 1080,
        lineHeight: 1.35
      }
    }, "As retas r e s s\xE3o paralelas; as retas u e t, duas transversais. Encontre o valor do \xE2ngulo x na figura.")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 80,
        top: 208,
        width: 1000,
        height: 2,
        background: '#333333'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 236,
        width: 1120,
        bottom: 150,
        overflow: 'hidden'
      }
    }, STEPS.map((s, i) => /*#__PURE__*/React.createElement(Row, {
      key: i,
      step: s,
      i: i,
      k: k,
      y: ACTIVE_Y - 236 + ctr[i] - base,
      cy: cy,
      or: or
    }))), /*#__PURE__*/React.createElement(Figura, {
      T: T,
      CUES: CUES,
      cy: cy,
      or: or
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 80,
        bottom: 60,
        display: 'flex',
        gap: 44,
        alignItems: 'baseline',
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 34
      }
    }, opts.map(([l, v], i) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        display: 'flex',
        gap: 12,
        alignItems: 'baseline',
        color: i === 0 ? mix(GRAY, or, pickOp) : GRAY,
        transform: `scale(${1 + (i === 0 ? 0.18 * pickOp : 0)})`,
        transformOrigin: '0 50%'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 24
      }
    }, l, ")"), /*#__PURE__*/React.createElement("span", null, v)))));
  }
  window.Questoes = window.Questoes || {};
  window.Questoes["cap10-q13"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "Enunciado",
      "dur": 5.5,
      "desc": "A figura se desenha: duas paralelas cortadas por duas transversais, com 20 e 120 graus marcados"
    }, {
      "name": "Paralelas",
      "dur": 4.5,
      "desc": "As retas r e s acendem em ciano como paralelas"
    }, {
      "name": "Triangulo",
      "dur": 5,
      "desc": "O triângulo formado por r, u e t é destacado e o ângulo a aparece"
    }, {
      "name": "Soma",
      "dur": 5,
      "desc": "A soma dos ângulos internos do triângulo é montada"
    }, {
      "name": "ValorA",
      "dur": 4.5,
      "desc": "O ângulo a vale 40 graus"
    }, {
      "name": "Correspondentes",
      "dur": 5.5,
      "desc": "Pelo paralelismo, y também vale 40 graus"
    }, {
      "name": "Suplementares",
      "dur": 5,
      "desc": "x e y são suplementares na reta s"
    }, {
      "name": "Resultado",
      "dur": 5,
      "desc": "x vale 140 graus, em laranja na figura"
    }, {
      "name": "Alternativa",
      "dur": 5.5,
      "desc": "A alternativa a é destacada como resposta"
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
