/* ============================================================
   Capitulo 11 · Questao 7 — resolucao animada
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
    label: 'ângulos suplementares',
    note: '137° e x estão\nna mesma reta',
    tall: true,
    toks: [rm('137° + ', 'r'), it('x', 'm'), rm(' = 180°', 'm')]
  }, {
    label: 'valor de x',
    note: '',
    toks: [it('x', 'r'), rm(' = 180° − 137° = ', 'r'), rm('43°', 'm')]
  }, {
    label: 'soma dos ângulos internos',
    note: 'no triângulo',
    tall: true,
    toks: [rm('28° + ', 'r'), rm('43°', 'm'), rm(' + ', 'r'), it('y', 'm'), rm(' = 180°', 'r')]
  }, {
    label: 'somar os conhecidos',
    note: '28 + 43 = 71',
    toks: [rm('71°', 'm'), rm(' + ', 'r'), it('y', 'r'), rm(' = 180°', 'r')]
  }, {
    label: 'subtrair 71° nos dois lados',
    note: '',
    tall: true,
    toks: [it('y', 'r'), rm(' = 180° − 71° = ', 'r'), rm('109°', 'm')]
  }, {
    label: 'resultado',
    note: '',
    tall: true,
    toks: [rm('∴  ', 'o'), it('x', 'o'), rm(' = 43°     ', 'o'), it('y', 'o'), rm(' = 109°', 'o')]
  }];
  const CUE_NAMES = ['Suplementares', 'ValorX', 'Soma', 'Somar', 'ValorY', 'Resultado'];
  const ACTIVE_Y = 690;
  const NAT_H = i => STEPS[i].tall ? 200 : 132;

  /* ---- figura ----------------------------------------------------------- */
  const Bv = [200, 360],
    Cv = [340, 360],
    Av = [406, 168];
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
    const aBA = ANG(Bv, Av);
    const aCA = ANG(Cv, Av);
    const aAB = (ANG(Av, Bv) + 360) % 360;
    const aAC = (ANG(Av, Cv) + 360) % 360;
    const hl137 = win(CUES.Suplementares, CUES.ValorX);
    const xDone = MOTION.glide(0, 1, CUES.ValorX - 0.3, CUES.ValorX + 0.6)(T);
    const hlX = win(CUES.Suplementares, CUES.Soma);
    const triOp = win(CUES.Soma, CUES.ValorY) * 0.9;
    const hlY = win(CUES.Soma, CUES.Resultado);
    const yDone = MOTION.glide(0, 1, CUES.ValorY - 0.3, CUES.ValorY + 0.6)(T);
    const fin = MOTION.glide(0, 1, CUES.Resultado - 0.3, CUES.Resultado + 0.6)(T);
    const plain = mix(GRAY, INK, 0.25);
    const c137 = mix(INK, cy, clamp(hl137, 0, 1));
    const cX = mix(mix(INK, cy, clamp(hlX + xDone * 0.6, 0, 1)), or, fin);
    const cY = mix(mix(INK, cy, clamp(hlY + yDone * 0.6, 0, 1)), or, fin);
    const c28 = mix(INK, cy, clamp(triOp, 0, 1));
    const L = (p1, p2, col, w) => /*#__PURE__*/React.createElement("line", {
      x1: p1[0],
      y1: p1[1],
      x2: p2[0],
      y2: p2[1],
      stroke: col,
      strokeWidth: w || 2.6,
      strokeLinecap: "round",
      strokeDasharray: "1200",
      strokeDashoffset: 1200 * (1 - drawn)
    });
    const l137 = at(Bv, 96, (180 + aBA) / 2);
    const lX = at(Bv, 74, aBA / 2);
    const lY = at(Cv, 80, (180 + aCA) / 2);
    const l28 = at(Av, 92, (aAB + aAC) / 2);
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "20 20 620 420",
      style: {
        position: 'absolute',
        right: 90,
        top: 300,
        width: 660,
        height: 450,
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("polygon", {
      points: `${Av[0]},${Av[1]} ${Bv[0]},${Bv[1]} ${Cv[0]},${Cv[1]}`,
      fill: cy,
      opacity: triOp * 0.14
    }), L([60, 360], [520, 360], plain), L(Bv, Av, plain), L(Cv, Av, plain), /*#__PURE__*/React.createElement("path", {
      d: arcPath(Bv, 56, aBA, 180),
      fill: "none",
      stroke: c137,
      strokeWidth: "2.6",
      opacity: drawn
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(Bv, 40, 0, aBA),
      fill: "none",
      stroke: cX,
      strokeWidth: 2.6 + 1.4 * fin,
      opacity: drawn
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(Cv, 44, aCA, 180),
      fill: "none",
      stroke: cY,
      strokeWidth: 2.6 + 1.4 * fin,
      opacity: drawn
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(Av, 56, aAB, aAC),
      fill: "none",
      stroke: c28,
      strokeWidth: "2.6",
      opacity: drawn
    }), /*#__PURE__*/React.createElement("g", {
      fontFamily: "'STIX Two Text', Georgia, serif",
      fontSize: "27",
      textAnchor: "middle"
    }, /*#__PURE__*/React.createElement("text", {
      x: l137[0],
      y: l137[1],
      fill: c137,
      opacity: drawn
    }, "137\xB0"), /*#__PURE__*/React.createElement("text", {
      x: lX[0] + 6,
      y: lX[1] + 4,
      fill: cX,
      fontSize: 27 + 8 * fin,
      opacity: drawn,
      fontStyle: xDone > 0.5 ? 'normal' : 'italic'
    }, xDone > 0.5 ? '43°' : 'x'), /*#__PURE__*/React.createElement("text", {
      x: lY[0],
      y: lY[1],
      fill: cY,
      fontSize: 27 + 8 * fin,
      opacity: drawn,
      fontStyle: yDone > 0.5 ? 'normal' : 'italic'
    }, yDone > 0.5 ? '109°' : 'y'), /*#__PURE__*/React.createElement("text", {
      x: l28[0],
      y: l28[1],
      fill: c28,
      opacity: drawn
    }, "28\xB0")));
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
    const size = step.tall ? 48 : 54;
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
        width: 1120,
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
        marginLeft: 36,
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 26,
        color: GRAY,
        opacity: active,
        whiteSpace: 'pre-line',
        maxWidth: 260,
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
    }, "QUEST\xC3O 7"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 30,
        color: GRAY,
        marginTop: 14,
        maxWidth: 1060,
        lineHeight: 1.35
      }
    }, "Determine as medidas x e y dos \xE2ngulos assinalados na figura a seguir.")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 70,
        top: 200,
        width: 1040,
        height: 2,
        background: '#333333'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 230,
        width: 1200,
        bottom: 60,
        overflow: 'hidden'
      }
    }, STEPS.map((s, i) => /*#__PURE__*/React.createElement(Row, {
      key: i,
      step: s,
      i: i,
      k: k,
      y: ACTIVE_Y - 230 + ctr[i] - base,
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
  window.Questoes["cap11-q07"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "Suplementares",
      "dur": 6,
      "desc": "A figura se desenha e 137 graus com x acendem como ângulos de uma mesma reta"
    }, {
      "name": "ValorX",
      "dur": 5,
      "desc": "x vale 43 graus"
    }, {
      "name": "Soma",
      "dur": 5.5,
      "desc": "O triângulo é destacado e a soma dos ângulos internos é montada"
    }, {
      "name": "Somar",
      "dur": 4.5,
      "desc": "28 mais 43 dá 71 graus"
    }, {
      "name": "ValorY",
      "dur": 5,
      "desc": "Subtraindo 71 graus dos dois lados, y vale 109 graus"
    }, {
      "name": "Resultado",
      "dur": 5.5,
      "desc": "Os dois ângulos fecham em laranja na figura"
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
