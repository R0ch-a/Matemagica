/* ============================================================
   Capitulo 10 · Questao 7 — resolucao animada
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
  const rm = (s, c) => ({
    s,
    c: c || 'n'
  });
  const it = (s, c) => ({
    s,
    c: c || 'n',
    i: true
  });
  const STEPS = [{
    label: 'item a · o dobro do suplemento',
    note: 'suplemento de x\né 180° − x',
    tall: true,
    toks: [rm('2 · (180° − ', 'm'), it('x', 'm'), rm(')', 'm'), rm(' = 240°', 'r')]
  }, {
    label: 'dividir por 2',
    note: '240 ÷ 2',
    tall: true,
    toks: [rm('180° − ', 'r'), it('x', 'r'), rm(' = ', 'r'), rm('120°', 'm')]
  }, {
    label: 'isolar x',
    note: '180 − 120',
    toks: [it('x', 'r'), rm(' = ', 'r'), rm('60°', 'm')]
  }, {
    label: 'item b · a quinta parte do complemento',
    note: 'complemento de x\né 90° − x',
    tall: true,
    toks: [rm('(90° − ', 'm'), it('x', 'm'), rm(') ÷ 5', 'm'), rm(' = 13°', 'r')]
  }, {
    label: 'multiplicar por 5',
    note: '13 · 5',
    tall: true,
    toks: [rm('90° − ', 'r'), it('x', 'r'), rm(' = ', 'r'), rm('65°', 'm')]
  }, {
    label: 'isolar x',
    note: '90 − 65',
    toks: [it('x', 'r'), rm(' = ', 'r'), rm('25°', 'm')]
  }, {
    label: 'resultado',
    tall: true,
    toks: [rm('∴  a) 60°     b) 25°', 'o')]
  }];
  const CUE_NAMES = ['ItemA', 'Dividir', 'ValorA', 'ItemB', 'Multiplicar', 'ValorB', 'Resultado'];
  const ACTIVE_Y = 690;
  const NAT_H = i => STEPS[i].tall ? 190 : 132;

  /* ---- figura ----------------------------------------------------------- */
  const V = [300, 160];
  const W = [210, 480];
  const U = (c, r, a) => [c[0] + r * Math.cos(a * Math.PI / 180), c[1] - r * Math.sin(a * Math.PI / 180)];
  const RAY_A = U(V, 220, 60);
  const RAY_B = U(W, 260, 25);
  function arcPath(c, r, a1, a2) {
    const [x1, y1] = U(c, r, a1),
      [x2, y2] = U(c, r, a2);
    const large = (a2 - a1 + 360) % 360 > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 0 ${x2} ${y2}`;
  }
  function Figura({
    T,
    CUES,
    cy,
    or
  }) {
    const drawn = MOTION.glide(0, 1, 0.2, 1.8)(T);
    const upA = MOTION.glide(0, 1, 0.6, 1.8)(T);
    const upB = MOTION.glide(0, 1, CUES.ItemB - 0.5, CUES.ItemB + 0.6)(T);
    const hlA = upA * (1 - 0.65 * upB);
    const solvedA = MOTION.glide(0, 1, CUES.ValorA - 0.2, CUES.ValorA + 0.6)(T);
    const solvedB = MOTION.glide(0, 1, CUES.ValorB - 0.2, CUES.ValorB + 0.6)(T);
    const fin = MOTION.glide(0, 1, CUES.Resultado - 0.3, CUES.Resultado + 0.6)(T);
    const plain = mix(GRAY, INK, 0.28);
    const cA = mix(mix(mix(DIM, INK, hlA), cy, clamp(hlA * 0.85 + solvedA * 0.6, 0, 1)), or, fin);
    const cB = mix(mix(mix(DIM, INK, upB), cy, clamp(upB * 0.85 + solvedB * 0.6, 0, 1)), or, fin);
    const lineA = mix(DIM, plain, clamp(0.35 + hlA * 0.65, 0, 1));
    const lineB = mix(DIM, plain, clamp(0.35 + upB * 0.65, 0, 1));
    const L = (p1, p2, col) => /*#__PURE__*/React.createElement("line", {
      x1: p1[0],
      y1: p1[1],
      x2: p2[0],
      y2: p2[1],
      stroke: col,
      strokeWidth: "2.6",
      strokeLinecap: "round",
      strokeDasharray: "1400",
      strokeDashoffset: 1400 * (1 - drawn)
    });
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "50 100 540 450",
      style: {
        position: 'absolute',
        right: 60,
        top: 470,
        width: 660,
        height: 550,
        overflow: 'visible'
      }
    }, L([80, 160], [540, 160], lineA), L(V, RAY_A, lineA), /*#__PURE__*/React.createElement("path", {
      d: arcPath(V, 60, 0, 60),
      fill: "none",
      stroke: cA,
      strokeWidth: 2.6 + 1.2 * fin,
      opacity: drawn
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(V, 84, 60, 180),
      fill: "none",
      stroke: cA,
      strokeWidth: "2.6",
      opacity: drawn * 0.85
    }), L(W, U(W, 300, 0), lineB), L(W, U(W, 196, 90), lineB), L(W, RAY_B, lineB), /*#__PURE__*/React.createElement("path", {
      d: `M ${W[0] + 26} ${W[1]} L ${W[0] + 26} ${W[1] - 26} L ${W[0]} ${W[1] - 26}`,
      fill: "none",
      stroke: lineB,
      strokeWidth: "2",
      opacity: drawn
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(W, 72, 0, 25),
      fill: "none",
      stroke: cB,
      strokeWidth: 2.6 + 1.2 * fin,
      opacity: drawn
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(W, 98, 25, 90),
      fill: "none",
      stroke: cB,
      strokeWidth: "2.6",
      opacity: drawn * 0.85
    }), /*#__PURE__*/React.createElement("g", {
      fontFamily: "'STIX Two Text', Georgia, serif",
      fontSize: "27",
      textAnchor: "middle",
      opacity: drawn
    }, /*#__PURE__*/React.createElement("text", {
      x: U(V, 86, 28)[0],
      y: U(V, 86, 28)[1] + 9,
      fill: cA,
      fontStyle: solvedA > 0.5 ? 'normal' : 'italic'
    }, solvedA > 0.5 ? '60°' : 'x'), /*#__PURE__*/React.createElement("text", {
      x: U(V, 124, 118)[0],
      y: U(V, 124, 118)[1] + 9,
      fill: cA,
      fontSize: "24"
    }, solvedA > 0.5 ? '120°' : '180° − x'), /*#__PURE__*/React.createElement("text", {
      x: U(W, 98, 11)[0],
      y: U(W, 98, 11)[1] + 9,
      fill: cB,
      fontStyle: solvedB > 0.5 ? 'normal' : 'italic'
    }, solvedB > 0.5 ? '25°' : 'x'), /*#__PURE__*/React.createElement("text", {
      x: U(W, 142, 58)[0],
      y: U(W, 142, 58)[1] + 9,
      fill: cB,
      fontSize: "24"
    }, solvedB > 0.5 ? '65°' : '90° − x')), /*#__PURE__*/React.createElement("g", {
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: "21"
    }, /*#__PURE__*/React.createElement("text", {
      x: 80,
      y: 252,
      fill: mix(DIM, GRAY, hlA),
      opacity: drawn
    }, "a) suplementares"), /*#__PURE__*/React.createElement("text", {
      x: 80,
      y: 534,
      fill: mix(DIM, GRAY, upB),
      opacity: drawn
    }, "b) complementares")));
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
    const op = d < 0 ? clamp(1 + d * 1.7, 0, 1) : clamp((3.4 - d) / 0.8, 0, 1) * (1 - 0.2 * clamp(d, 0, 1));
    const scale = 1 - 0.44 * clamp(d, 0, 1);
    const size = step.tall ? 46 : 52;
    const active = clamp(1 - Math.abs(d) * 1.4, 0, 1);
    const col = role => {
      if (role === 'o') return or;
      if (role === 'r') return GRAY;
      return mix(role === 'm' ? cy : INK, GRAY, age);
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 70,
        top: y,
        width: 1100,
        opacity: op,
        transform: `translateY(-50%) scale(${scale})`,
        transformOrigin: '0 50%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Caveat', cursive",
        fontSize: 58,
        color: mix('#ffffff', DIM, 1 - active),
        lineHeight: 1
      }
    }, step.label), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
        marginTop: 14,
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: size,
        lineHeight: 1.05
      }
    }, step.toks.map((tk, j) => /*#__PURE__*/React.createElement("span", {
      key: j,
      style: {
        color: col(tk.c),
        whiteSpace: 'pre',
        fontStyle: tk.i ? 'italic' : 'normal',
        flexShrink: 0
      }
    }, tk.s)), step.note ? /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 34,
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 24,
        color: GRAY,
        opacity: active,
        whiteSpace: 'pre-line',
        maxWidth: 240,
        lineHeight: 1.35,
        flexShrink: 0
      }
    }, step.note) : null));
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
    const sh = j => NAT_H(j) * (1 - 0.44 * clamp(k - j, 0, 1));
    const ctr = [0];
    for (let i = 1; i < STEPS.length; i++) ctr[i] = ctr[i - 1] + (sh(i - 1) + sh(i)) / 2;
    const kf = clamp(Math.floor(k), 0, STEPS.length - 1);
    const frac = clamp(k - kf, 0, 1);
    const base = ctr[kf] + frac * ((ctr[Math.min(kf + 1, STEPS.length - 1)] || 0) - ctr[kf]);
    const camera = 1 + 0.018 * clamp(T / Math.max(authoredTotal, 1), 0, 1);
    const headOp = MOTION.enter(0, 1, 0.15, 1.2)(T);
    const opB = MOTION.enter(0, 1, CUES.ItemB - 0.6, CUES.ItemB + 0.5)(T);
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
        left: 70,
        top: 84,
        width: 1180,
        opacity: headOp
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 20,
        color: cy,
        letterSpacing: '0.14em'
      }
    }, "QUEST\xC3O 7"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 28,
        color: GRAY,
        marginTop: 14,
        lineHeight: 1.45
      }
    }, "Leia atentamente os enunciados a seguir. Depois, responda ao que se pede."), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 28,
        color: mix(GRAY, INK, 0.25),
        marginTop: 10,
        lineHeight: 1.45
      }
    }, "a) O dobro da medida do suplemento de um \xE2ngulo vale 240\xB0. Quanto mede esse \xE2ngulo?"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 28,
        marginTop: 6,
        lineHeight: 1.45,
        color: mix(GRAY, INK, 0.25),
        opacity: 0.4 + 0.6 * opB
      }
    }, "b) A quinta parte da medida do complemento de um \xE2ngulo vale 13\xB0. Quanto mede esse \xE2ngulo?")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 70,
        top: 300,
        width: 1780,
        height: 2,
        background: '#333333'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 330,
        width: 1200,
        bottom: 70,
        overflow: 'hidden'
      }
    }, STEPS.map((s, i) => /*#__PURE__*/React.createElement(Row, {
      key: i,
      step: s,
      i: i,
      k: k,
      y: ACTIVE_Y - 330 + ctr[i] - base,
      cy: cy,
      or: or
    }))), /*#__PURE__*/React.createElement(Figura, {
      T: T,
      CUES: CUES,
      cy: cy,
      or: or
    })));
  }
  window.Questoes = window.Questoes || {};
  window.Questoes["cap10-q07"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "ItemA",
      "dur": 6,
      "desc": "Item a: o dobro do suplemento de x vale 240 graus"
    }, {
      "name": "Dividir",
      "dur": 5,
      "desc": "Dividindo por 2: 180 menos x igual a 120 graus"
    }, {
      "name": "ValorA",
      "dur": 4.5,
      "desc": "x vale 60 graus, marcado na figura de suplementares"
    }, {
      "name": "ItemB",
      "dur": 6,
      "desc": "Item b: a quinta parte do complemento de x vale 13 graus"
    }, {
      "name": "Multiplicar",
      "dur": 5,
      "desc": "Multiplicando por 5: 90 menos x igual a 65 graus"
    }, {
      "name": "ValorB",
      "dur": 4.5,
      "desc": "x vale 25 graus, marcado na figura de complementares"
    }, {
      "name": "Resultado",
      "dur": 6,
      "desc": "Resultado final: 60 graus no item a e 25 graus no item b"
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
