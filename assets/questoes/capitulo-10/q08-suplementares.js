/* ============================================================
   Capitulo 10 · Questao 8 — resolucao animada
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
    label: 'suplementares somam 180°',
    note: 'menor = x\nmaior = 2x',
    tall: true,
    toks: [it('x', 'm'), rm(' + ', 'm'), rm('2', 'm'), it('x', 'm'), rm(' = 180°', 'r')]
  }, {
    label: 'somar os termos',
    note: '',
    toks: [rm('3', 'm'), it('x', 'm'), rm(' = 180°', 'r')]
  }, {
    label: 'dividir por 3',
    note: '180 ÷ 3',
    toks: [it('x', 'r'), rm(' = ', 'r'), rm('60°', 'm')]
  }, {
    label: 'o par suplementar',
    note: '2 · 60',
    tall: true,
    toks: [rm('menor = ', 'r'), rm('60°', 'm'), rm('     maior = ', 'r'), rm('120°', 'm')]
  }, {
    label: 'metade do menor',
    note: '60 ÷ 2',
    toks: [rm('60° ÷ 2 = ', 'r'), rm('30°', 'm')]
  }, {
    label: 'ela é o suplemento da soma',
    note: 'y e y são opostos\npelo vértice',
    tall: true,
    toks: [it('y', 'm'), rm(' + ', 'm'), it('y', 'm'), rm(' + 30° = 180°', 'r')]
  }, {
    label: 'opostos pelo vértice são iguais',
    note: '180 − 30',
    tall: true,
    toks: [rm('2', 'r'), it('y', 'r'), rm(' = 150°', 'm')]
  }, {
    label: 'dividir por 2',
    note: '',
    toks: [it('y', 'r'), rm(' = ', 'r'), rm('75°', 'm')]
  }, {
    label: 'resultado',
    tall: true,
    toks: [rm('∴  60° e 120°   ·   opostos: 75° cada', 'o')]
  }];
  const CUE_NAMES = ['Dado', 'Somar', 'ValorX', 'DoisAngulos', 'Metade', 'Suplemento', 'Iguais', 'ValorY', 'Resultado'];
  const ACTIVE_Y = 680;
  const NAT_H = i => STEPS[i].tall ? 190 : 132;

  /* ---- figura ----------------------------------------------------------- */
  const V = [300, 150];
  const W = [300, 370];
  const RAY = [V[0] + 220 * Math.cos(60 * Math.PI / 180), V[1] - 220 * Math.sin(60 * Math.PI / 180)];
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
    const hlSup = seg(CUES.Dado, CUES.Metade);
    const hlOpv = MOTION.glide(0, 1, CUES.Suplemento - 0.5, CUES.Suplemento + 0.6)(T);
    const solvedX = MOTION.glide(0, 1, CUES.ValorX - 0.2, CUES.ValorX + 0.6)(T);
    const solvedY = MOTION.glide(0, 1, CUES.ValorY - 0.2, CUES.ValorY + 0.6)(T);
    const fin = MOTION.glide(0, 1, CUES.Resultado - 0.3, CUES.Resultado + 0.6)(T);
    const plain = mix(GRAY, INK, 0.28);
    const cX = mix(mix(INK, cy, clamp(hlSup * 0.8 + solvedX * 0.6, 0, 1)), or, fin);
    const cY = mix(mix(mix(DIM, INK, hlOpv), cy, clamp(hlOpv * 0.9 + solvedY * 0.6, 0, 1)), or, fin);
    const lineB = mix(DIM, plain, hlOpv);
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
      viewBox: "40 20 560 530",
      style: {
        position: 'absolute',
        right: 60,
        top: 400,
        width: 620,
        height: 587,
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("polygon", {
      points: `${V.join(',')} ${RAY.join(',')} ${[V[0] + 240, V[1]].join(',')}`,
      fill: cy,
      opacity: hlSup * 0.1
    }), L([70, 150], [540, 150], mix(plain, cy, hlSup * 0.5)), L(V, RAY, mix(plain, cy, hlSup * 0.5)), /*#__PURE__*/React.createElement("path", {
      d: arcPath(V, 62, 0, 60),
      fill: "none",
      stroke: cX,
      strokeWidth: 2.6 + 1.2 * fin,
      opacity: drawn
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(V, 84, 60, 180),
      fill: "none",
      stroke: cX,
      strokeWidth: 2.6 + 1.2 * fin,
      opacity: drawn
    }), L([118, 510], [482, 230], lineB), L([118, 230], [482, 510], lineB), /*#__PURE__*/React.createElement("path", {
      d: arcPath(W, 68, -37.5, 37.5),
      fill: "none",
      stroke: cY,
      strokeWidth: 2.6 + 1.2 * fin,
      opacity: drawn
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(W, 68, 142.5, 217.5),
      fill: "none",
      stroke: cY,
      strokeWidth: 2.6 + 1.2 * fin,
      opacity: drawn
    }), /*#__PURE__*/React.createElement("g", {
      fontFamily: "'STIX Two Text', Georgia, serif",
      fontSize: "27",
      textAnchor: "middle",
      opacity: drawn
    }, /*#__PURE__*/React.createElement("text", {
      x: U(V, 90, 30)[0],
      y: U(V, 90, 30)[1] + 9,
      fill: cX,
      fontStyle: solvedX > 0.5 ? 'normal' : 'italic'
    }, solvedX > 0.5 ? '60°' : 'x'), /*#__PURE__*/React.createElement("text", {
      x: U(V, 112, 120)[0],
      y: U(V, 112, 120)[1] + 9,
      fill: cX,
      fontStyle: solvedX > 0.5 ? 'normal' : 'italic'
    }, solvedX > 0.5 ? '120°' : '2x'), /*#__PURE__*/React.createElement("text", {
      x: U(W, 98, 0)[0],
      y: U(W, 98, 0)[1] + 9,
      fill: cY,
      fontStyle: solvedY > 0.5 ? 'normal' : 'italic'
    }, solvedY > 0.5 ? '75°' : 'y'), /*#__PURE__*/React.createElement("text", {
      x: U(W, 98, 180)[0],
      y: U(W, 98, 180)[1] + 9,
      fill: cY,
      fontStyle: solvedY > 0.5 ? 'normal' : 'italic'
    }, solvedY > 0.5 ? '75°' : 'y')), /*#__PURE__*/React.createElement("g", {
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: "21",
      textAnchor: "middle"
    }, /*#__PURE__*/React.createElement("text", {
      x: 300,
      y: 207,
      fill: mix(DIM, GRAY, hlSup),
      opacity: drawn
    }, "par suplementar"), /*#__PURE__*/React.createElement("text", {
      x: 300,
      y: 548,
      fill: mix(DIM, GRAY, hlOpv),
      opacity: drawn
    }, "opostos pelo v\xE9rtice")));
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
        width: 1160,
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
        lineHeight: 1.4
      }
    }, "Dois \xE2ngulos suplementares s\xE3o de tal modo que o menor \xE9 metade da medida do maior. Sabendo que a metade da medida do menor representa o suplemento da soma de dois \xE2ngulos opostos pelo v\xE9rtice, qual a medida de cada um desses \xE2ngulos?")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 70,
        top: 246,
        width: 1780,
        height: 2,
        background: '#333333'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 278,
        width: 1200,
        bottom: 90,
        overflow: 'hidden'
      }
    }, STEPS.map((s, i) => /*#__PURE__*/React.createElement(Row, {
      key: i,
      step: s,
      i: i,
      k: k,
      y: ACTIVE_Y - 278 + ctr[i] - base,
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
  window.Questoes["cap10-q08"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "Dado",
      "dur": 6,
      "desc": "As figuras se desenham e o par suplementar vira x mais 2x igual a 180"
    }, {
      "name": "Somar",
      "dur": 4,
      "desc": "Somando: 3x igual a 180 graus"
    }, {
      "name": "ValorX",
      "dur": 4.5,
      "desc": "x vale 60 graus"
    }, {
      "name": "DoisAngulos",
      "dur": 5,
      "desc": "O par suplementar e 60 e 120 graus, marcado na figura"
    }, {
      "name": "Metade",
      "dur": 4.5,
      "desc": "A metade do menor vale 30 graus"
    }, {
      "name": "Suplemento",
      "dur": 6,
      "desc": "Essa metade e o suplemento da soma dos dois angulos opostos pelo vertice"
    }, {
      "name": "Iguais",
      "dur": 5,
      "desc": "Como sao iguais: 2y igual a 150 graus"
    }, {
      "name": "ValorY",
      "dur": 4.5,
      "desc": "y vale 75 graus, marcado na figura"
    }, {
      "name": "Resultado",
      "dur": 6,
      "desc": "Resultado final: 60 e 120 graus, e 75 graus cada oposto"
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
