/* ============================================================
   Capitulo 11 · Questao 3 — resolucao animada
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
    label: 'ângulos no ponto B',
    note: 'C, B e A\nestão alinhados',
    tall: true,
    toks: [rm('80° + 36° + ', 'r'), rm('B̂', 'm'), rm(' = 180°', 'm')]
  }, {
    label: 'ângulo EBA',
    note: '180 − 116',
    toks: [rm('B̂', 'r'), rm(' = ', 'r'), rm('64°', 'm')]
  }, {
    label: 'triângulo ABE',
    note: 'soma 180°',
    tall: true,
    toks: [it('x', 'm'), rm(' + ', 'm'), it('x', 'm'), rm(' + 64° = 180°', 'r')]
  }, {
    label: 'isolar x',
    note: '180 − 64 = 116',
    toks: [rm('2', 'r'), it('x', 'r'), rm(' = 116°', 'm')]
  }, {
    label: 'dividir por 2',
    note: '',
    toks: [it('x', 'r'), rm(' = ', 'r'), rm('58°', 'm')]
  }, {
    label: 'ângulo externo em E',
    note: 'no triângulo DBE\nx é externo',
    tall: true,
    toks: [it('x', 'r'), rm(' = ', 'r'), it('y', 'm'), rm(' + 36°', 'm')]
  }, {
    label: 'valor de y',
    note: '58 − 36',
    toks: [it('y', 'r'), rm(' = ', 'r'), rm('22°', 'm')]
  }, {
    label: 'calcular 3y − x',
    note: '3 · 22 = 66',
    tall: true,
    toks: [rm('3 · ', 'r'), rm('22°', 'm'), rm(' − ', 'r'), rm('58°', 'm')]
  }, {
    label: 'resultado',
    tall: true,
    toks: [rm('∴  3', 'o'), it('y', 'o'), rm(' − ', 'o'), it('x', 'o'), rm(' = 8°', 'o')]
  }];
  const CUE_NAMES = ['PontoB', 'AnguloEBA', 'Triangulo', 'IsolarX', 'ValorX', 'Externo', 'ValorY', 'Calcular', 'Resultado'];
  const ACTIVE_Y = 680;
  const NAT_H = i => STEPS[i].tall ? 190 : 132;

  /* ---- figura ----------------------------------------------------------- */
  const D = [59, 390],
    E = [370, 390],
    A = [580, 390],
    B = [475, 222],
    C = [422, 138];
  const U = (c, r, a) => [c[0] + r * Math.cos(a * Math.PI / 180), c[1] - r * Math.sin(a * Math.PI / 180)];
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
    const seg = (a, b) => MOTION.glide(0, 1, a - 0.4, a + 0.5)(T) * (1 - MOTION.glide(0, 1, b - 0.4, b + 0.4)(T));
    const drawn = MOTION.glide(0, 1, 0.2, 1.8)(T);
    const hlB = seg(CUES.PontoB, CUES.Triangulo);
    const hlTri = seg(CUES.Triangulo, CUES.Externo);
    const hlDBE = seg(CUES.Externo, CUES.Calcular);
    const solvedX = MOTION.glide(0, 1, CUES.ValorX - 0.2, CUES.ValorX + 0.6)(T);
    const solvedY = MOTION.glide(0, 1, CUES.ValorY - 0.2, CUES.ValorY + 0.6)(T);
    const fin = MOTION.glide(0, 1, CUES.Resultado - 0.3, CUES.Resultado + 0.6)(T);
    const plain = mix(GRAY, INK, 0.28);
    const cFix = mix(INK, cy, hlB);
    const cEBA = mix(INK, cy, clamp(hlB * 0.6 + hlTri, 0, 1));
    const cX = mix(mix(INK, cy, clamp(hlTri + solvedX * 0.6, 0, 1)), or, fin);
    const cY = mix(mix(INK, cy, clamp(hlDBE + solvedY * 0.6, 0, 1)), or, fin);
    const L = (p1, p2, col, w) => /*#__PURE__*/React.createElement("line", {
      x1: p1[0],
      y1: p1[1],
      x2: p2[0],
      y2: p2[1],
      stroke: col,
      strokeWidth: w || 2.6,
      strokeLinecap: "round",
      strokeDasharray: "1400",
      strokeDashoffset: 1400 * (1 - drawn)
    });
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "10 100 620 340",
      style: {
        position: 'absolute',
        right: 60,
        top: 350,
        width: 700,
        height: 420,
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("polygon", {
      points: `${B.join(',')} ${E.join(',')} ${A.join(',')}`,
      fill: cy,
      opacity: hlTri * 0.14
    }), /*#__PURE__*/React.createElement("polygon", {
      points: `${B.join(',')} ${D.join(',')} ${E.join(',')}`,
      fill: cy,
      opacity: hlDBE * 0.14
    }), L(C, A, mix(plain, cy, hlB * 0.8)), L(D, A, plain), L(D, B, plain), L(E, B, plain), /*#__PURE__*/React.createElement("path", {
      d: arcPath(B, 86, 122, 202),
      fill: "none",
      stroke: cFix,
      strokeWidth: "2.6",
      opacity: drawn
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(B, 66, 202, 238),
      fill: "none",
      stroke: cFix,
      strokeWidth: "2.6",
      opacity: drawn
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(B, 48, 238, 302),
      fill: "none",
      stroke: cEBA,
      strokeWidth: "2.6",
      opacity: drawn
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(E, 52, 0, 58),
      fill: "none",
      stroke: cX,
      strokeWidth: 2.6 + 1.2 * fin,
      opacity: drawn
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(A, 56, 122, 180),
      fill: "none",
      stroke: cX,
      strokeWidth: 2.6 + 1.2 * fin,
      opacity: drawn
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(D, 66, 0, 22),
      fill: "none",
      stroke: cY,
      strokeWidth: 2.6 + 1.2 * fin,
      opacity: drawn
    }), /*#__PURE__*/React.createElement("g", {
      fontFamily: "'STIX Two Text', Georgia, serif",
      fontSize: "26",
      textAnchor: "middle",
      opacity: drawn
    }, /*#__PURE__*/React.createElement("text", {
      x: U(B, 112, 162)[0],
      y: U(B, 112, 162)[1] + 8,
      fill: cFix
    }, "80\xB0"), /*#__PURE__*/React.createElement("text", {
      x: U(B, 92, 220)[0],
      y: U(B, 92, 220)[1] + 8,
      fill: cFix
    }, "36\xB0"), /*#__PURE__*/React.createElement("text", {
      x: U(B, 74, 270)[0],
      y: U(B, 74, 270)[1] + 8,
      fill: cEBA,
      opacity: MOTION.glide(0, 1, CUES.AnguloEBA - 0.2, CUES.AnguloEBA + 0.6)(T)
    }, "64\xB0"), /*#__PURE__*/React.createElement("text", {
      x: U(E, 76, 29)[0],
      y: U(E, 76, 29)[1] + 8,
      fill: cX,
      fontStyle: solvedX > 0.5 ? 'normal' : 'italic'
    }, solvedX > 0.5 ? '58°' : 'x'), /*#__PURE__*/React.createElement("text", {
      x: U(A, 80, 151)[0],
      y: U(A, 80, 151)[1] + 8,
      fill: cX,
      fontStyle: solvedX > 0.5 ? 'normal' : 'italic'
    }, solvedX > 0.5 ? '58°' : 'x'), /*#__PURE__*/React.createElement("text", {
      x: U(D, 88, 11)[0],
      y: U(D, 88, 11)[1] + 8,
      fill: cY,
      fontStyle: solvedY > 0.5 ? 'normal' : 'italic'
    }, solvedY > 0.5 ? '22°' : 'y')), /*#__PURE__*/React.createElement("g", {
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: "24",
      fill: plain,
      opacity: drawn
    }, /*#__PURE__*/React.createElement("text", {
      x: C[0] - 26,
      y: C[1] - 6
    }, "C"), /*#__PURE__*/React.createElement("text", {
      x: B[0] + 16,
      y: B[1] - 4
    }, "B"), /*#__PURE__*/React.createElement("text", {
      x: A[0] + 14,
      y: A[1] + 26
    }, "A"), /*#__PURE__*/React.createElement("text", {
      x: E[0] - 8,
      y: E[1] + 32
    }, "E"), /*#__PURE__*/React.createElement("text", {
      x: D[0] - 26,
      y: D[1] + 10
    }, "D")));
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
        width: 1080,
        opacity: op,
        transform: `translateY(-50%) scale(${scale})`,
        transformOrigin: '0 50%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Caveat', cursive",
        fontSize: 60,
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
    const pickOp = MOTION.pop(0, 1, CUES.Resultado - 0.2, CUES.Resultado + 0.9)(T);
    const opts = [['a', '8°'], ['b', '10°'], ['c', '12°'], ['d', '16°']];
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
        width: 1780,
        opacity: headOp
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 20,
        color: cy,
        letterSpacing: '0.14em'
      }
    }, "QUEST\xC3O 3"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 30,
        color: GRAY,
        marginTop: 14,
        width: 1780,
        lineHeight: 1.4
      }
    }, "Na figura, o valor de 3y \u2212 x, em graus, \xE9")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 70,
        top: 214,
        width: 1780,
        height: 2,
        background: '#333333'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 246,
        width: 1180,
        bottom: 120,
        overflow: 'hidden'
      }
    }, STEPS.map((s, i) => /*#__PURE__*/React.createElement(Row, {
      key: i,
      step: s,
      i: i,
      k: k,
      y: ACTIVE_Y - 246 + ctr[i] - base,
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
        left: 70,
        bottom: 58,
        display: 'flex',
        gap: 46,
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
  window.Questoes["cap11-q03"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "PontoB",
      "dur": 6,
      "desc": "A figura se desenha e os três ângulos em B somam 180 graus na reta CA"
    }, {
      "name": "AnguloEBA",
      "dur": 4.5,
      "desc": "O ângulo EBA vale 64 graus"
    }, {
      "name": "Triangulo",
      "dur": 5.5,
      "desc": "No triângulo ABE os dois ângulos x e o 64 somam 180"
    }, {
      "name": "IsolarX",
      "dur": 4.5,
      "desc": "Isolando: 2x igual a 116 graus"
    }, {
      "name": "ValorX",
      "dur": 4.5,
      "desc": "x vale 58 graus, marcado na figura"
    }, {
      "name": "Externo",
      "dur": 5.5,
      "desc": "No triângulo DBE, x é ângulo externo: x igual a y mais 36"
    }, {
      "name": "ValorY",
      "dur": 4.5,
      "desc": "y vale 22 graus"
    }, {
      "name": "Calcular",
      "dur": 5,
      "desc": "Calculando 3y menos x"
    }, {
      "name": "Resultado",
      "dur": 5.5,
      "desc": "O resultado 8 graus destaca a alternativa a"
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
