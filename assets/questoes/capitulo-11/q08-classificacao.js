/* ============================================================
   Capitulo 11 · Questao 8 — resolucao animada
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
    label: 'soma dos ângulos internos',
    note: 'sempre 180°',
    tall: true,
    toks: [rm('5x + (2x − 3°) + (2x + 3°)', 'm'), rm(' = 180°', 'm')]
  }, {
    label: 'abrir os parênteses',
    note: '−3° + 3° = 0',
    tall: true,
    toks: [rm('5x + 2x − 3° + 2x + 3°', 'm'), rm(' = 180°', 'r')]
  }, {
    label: 'termos semelhantes',
    note: '5x + 2x + 2x',
    toks: [rm('9x', 'm'), rm(' = 180°', 'r')]
  }, {
    label: 'dividir por 9',
    note: '',
    toks: [it('x', 'r'), rm(' = ', 'r'), rm('20°', 'm')]
  }, {
    label: 'calcular cada ângulo',
    note: 'x = 20°',
    tall: true,
    toks: [rm('5x = ', 'r'), rm('100°', 'm'), rm('     2x − 3° = ', 'r'), rm('37°', 'm'), rm('     2x + 3° = ', 'r'), rm('43°', 'm')]
  }, {
    label: 'conferir a soma',
    note: '',
    toks: [rm('100° + 37° + 43° = 180°', 'r')]
  }, {
    label: 'classificar',
    note: 'um ângulo\nmaior que 90°',
    tall: true,
    toks: [rm('100°', 'm'), rm(' > 90°', 'm')]
  }, {
    label: 'resultado',
    note: '',
    tall: true,
    toks: [rm('∴  o triângulo é obtusângulo', 'o')]
  }];
  const CUE_NAMES = ['Soma', 'Parenteses', 'Semelhantes', 'Dividir', 'Angulos', 'Conferir', 'Classificar', 'Resultado'];
  const ACTIVE_Y = 690;
  const NAT_H = i => STEPS[i].tall ? 200 : 132;
  const Bv = [120, 340],
    Cv = [520, 340],
    Av = [341, 173];
  const ANG = (p, q) => Math.atan2(p[1] - q[1], q[0] - p[0]) * 180 / Math.PI;
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
    const drawn = MOTION.glide(0, 1, 0.2, 1.8)(T);
    const solved = MOTION.glide(0, 1, CUES.Angulos - 0.3, CUES.Angulos + 0.7)(T);
    const hlAll = win(CUES.Soma, CUES.Parenteses);
    const hlObt = win(CUES.Classificar, 1e6);
    const fin = MOTION.glide(0, 1, CUES.Resultado - 0.3, CUES.Resultado + 0.6)(T);
    const aBA = ANG(Bv, Av),
      aBC = 0;
    const aCA = ANG(Cv, Av),
      aCB = 180;
    const aAB = (ANG(Av, Bv) + 360) % 360,
      aAC = (ANG(Av, Cv) + 360) % 360;
    const plain = mix(GRAY, INK, 0.25);
    const cBase = mix(INK, cy, clamp(hlAll + solved * 0.5, 0, 1));
    const cObt = mix(mix(INK, cy, clamp(hlAll + solved * 0.5, 0, 1)), or, clamp(hlObt * 0.8 + fin, 0, 1));
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
    const lB = at(Bv, 78, aBA / 2);
    const lC = at(Cv, 78, (aCA + 180) / 2);
    const lA = at(Av, 92, (aAB + aAC) / 2);
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "40 80 580 340",
      style: {
        position: 'absolute',
        right: 70,
        top: 330,
        width: 700,
        height: 420,
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("polygon", {
      points: `${Av[0]},${Av[1]} ${Bv[0]},${Bv[1]} ${Cv[0]},${Cv[1]}`,
      fill: cy,
      opacity: hlAll * 0.12
    }), L(Bv, Cv, plain), L(Bv, Av, plain), L(Cv, Av, plain), /*#__PURE__*/React.createElement("path", {
      d: arcPath(Bv, 46, aBC, aBA),
      fill: "none",
      stroke: cBase,
      strokeWidth: "2.6",
      opacity: drawn
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(Cv, 46, aCA, aCB),
      fill: "none",
      stroke: cBase,
      strokeWidth: "2.6",
      opacity: drawn
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(Av, 56, aAB, aAC),
      fill: "none",
      stroke: cObt,
      strokeWidth: 2.6 + 1.6 * clamp(hlObt + fin, 0, 1),
      opacity: drawn
    }), /*#__PURE__*/React.createElement("g", {
      fontFamily: "'STIX Two Text', Georgia, serif",
      fontSize: "27",
      textAnchor: "middle"
    }, /*#__PURE__*/React.createElement("text", {
      x: lB[0] + 4,
      y: lB[1] + 4,
      fill: cBase,
      opacity: drawn,
      fontStyle: solved > 0.5 ? 'normal' : 'italic'
    }, solved > 0.5 ? '37°' : '2x − 3°'), /*#__PURE__*/React.createElement("text", {
      x: lC[0] - 4,
      y: lC[1] + 4,
      fill: cBase,
      opacity: drawn,
      fontStyle: solved > 0.5 ? 'normal' : 'italic'
    }, solved > 0.5 ? '43°' : '2x + 3°'), /*#__PURE__*/React.createElement("text", {
      x: lA[0],
      y: lA[1] - 6,
      fill: cObt,
      fontSize: 27 + 8 * clamp(hlObt + fin, 0, 1),
      opacity: drawn,
      fontStyle: solved > 0.5 ? 'normal' : 'italic'
    }, solved > 0.5 ? '100°' : '5x')));
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
    const size = step.tall ? 46 : 54;
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
        width: 1130,
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
        fontSize: 25,
        color: GRAY,
        opacity: active,
        whiteSpace: 'pre-line',
        maxWidth: 230,
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
    }, "QUEST\xC3O 8"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 30,
        color: GRAY,
        marginTop: 14,
        maxWidth: 1080,
        lineHeight: 1.35
      }
    }, "As medidas dos \xE2ngulos internos de um tri\xE2ngulo podem ser representadas por 5x, 2x \u2212 3\xB0 e 2x + 3\xB0. Esse tri\xE2ngulo \xE9 ret\xE2ngulo, obtus\xE2ngulo ou acut\xE2ngulo?")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 70,
        top: 224,
        width: 1060,
        height: 2,
        background: '#333333'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 254,
        width: 1220,
        bottom: 50,
        overflow: 'hidden'
      }
    }, STEPS.map((s, i) => /*#__PURE__*/React.createElement(Row, {
      key: i,
      step: s,
      i: i,
      k: k,
      y: ACTIVE_Y - 254 + ctr[i] - base,
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
  window.Questoes["cap11-q08"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "Soma",
      "dur": 6,
      "desc": "O triângulo se desenha com os ângulos em função de x e a soma 180 graus é montada"
    }, {
      "name": "Parenteses",
      "dur": 5,
      "desc": "Os parênteses são abertos e o menos 3 cancela o mais 3"
    }, {
      "name": "Semelhantes",
      "dur": 4.5,
      "desc": "Termos semelhantes: 9x igual a 180 graus"
    }, {
      "name": "Dividir",
      "dur": 4.5,
      "desc": "Dividindo por 9: x igual a 20 graus"
    }, {
      "name": "Angulos",
      "dur": 6,
      "desc": "Cada ângulo é calculado: 100, 37 e 43 graus, também na figura"
    }, {
      "name": "Conferir",
      "dur": 4.5,
      "desc": "A soma dos três confirma 180 graus"
    }, {
      "name": "Classificar",
      "dur": 5,
      "desc": "O ângulo de 100 graus é maior que 90 graus"
    }, {
      "name": "Resultado",
      "dur": 5.5,
      "desc": "Conclusão em laranja: o triângulo é obtusângulo"
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
