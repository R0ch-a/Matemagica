/* ============================================================
   Capitulo 11 · Questao 2 — resolucao animada
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
    label: 'traçar as diagonais de um vértice',
    note: 'só um vértice\npor vez',
    tall: true,
    tag: 'a',
    toks: [rm('de cada vértice partem ', 'r'), it('n', 'm'), rm(' − 3', 'm'), rm(' diagonais', 'r')]
  }, {
    label: 'quadrilátero',
    note: '4 vértices\n1 diagonal',
    tag: 'a',
    toks: [rm('4 vértices  →  ', 'r'), rm('2 triângulos', 'm')]
  }, {
    label: 'pentágono',
    note: '5 vértices\n2 diagonais',
    tag: 'a',
    toks: [rm('5 vértices  →  ', 'r'), rm('3 triângulos', 'm')]
  }, {
    label: 'hexágono',
    note: '6 vértices\n3 diagonais',
    tag: 'a',
    toks: [rm('6 vértices  →  ', 'r'), rm('4 triângulos', 'm')]
  }, {
    label: 'o padrão',
    note: '2, 3, 4 …',
    tall: true,
    tag: 'a',
    toks: [rm('triângulos = ', 'r'), it('n', 'm'), rm(' − 2', 'm')]
  }, {
    label: 'conclusão da letra a',
    tall: true,
    tag: 'a',
    toks: [rm('∴  um polígono de ', 'o'), it('n', 'o'), rm(' vértices forma ', 'o'), it('n', 'o'), rm(' − 2 triângulos', 'o')]
  }, {
    label: 'cada triângulo tem 180°',
    note: 'soma dos\nângulos internos',
    tall: true,
    tag: 'b',
    toks: [rm('1 triângulo  →  ', 'r'), rm('180°', 'm')]
  }, {
    label: 'somar todos os triângulos',
    note: '',
    tall: true,
    tag: 'b',
    toks: [it('S', 'm'), rm('ᵢ', 'm'), rm(' = ', 'm'), rm('(n − 2)', 'r'), rm(' · ', 'm'), rm('180°', 'm')]
  }, {
    label: 'testar no hexágono',
    note: 'n = 6',
    tall: true,
    tag: 'b',
    toks: [rm('(6 − 2) · 180° = ', 'r'), rm('720°', 'm')]
  }, {
    label: 'fórmula',
    tall: true,
    tag: 'b',
    toks: [rm('∴  ', 'o'), it('S', 'o'), rm('ᵢ', 'o'), rm(' = (', 'o'), it('n', 'o'), rm(' − 2) · 180°', 'o')]
  }];
  const CUE_NAMES = ['Diagonais', 'Quadrilatero', 'Pentagono', 'Hexagono', 'Padrao', 'ConclusaoA', 'Grau180', 'Formula', 'Testar', 'Resultado'];
  const ACTIVE_Y = 690;
  const NAT_H = i => STEPS[i].tall ? 190 : 132;

  /* ---- figura: polígono com diagonais de um vértice ---------------------- */
  const CX = 300,
    CY = 250,
    R = 150;
  function poly(n) {
    const a0 = -Math.PI / 2 - Math.PI / n;
    return Array.from({
      length: n
    }, (_, i) => {
      const a = a0 + 2 * Math.PI * i / n;
      return [CX + R * Math.cos(a), CY + R * Math.sin(a)];
    });
  }
  function Poligono({
    n,
    vis,
    prog,
    cy,
    or,
    fin
  }) {
    if (vis <= 0.001) return null;
    const P = poly(n);
    const pts = P.map(p => p.join(',')).join(' ');
    const tris = [];
    for (let i = 1; i < n - 1; i++) {
      const t = clamp(prog * (n - 2) - (i - 1), 0, 1);
      tris.push(/*#__PURE__*/React.createElement("polygon", {
        key: i,
        points: `${P[0].join(',')} ${P[i].join(',')} ${P[i + 1].join(',')}`,
        fill: mix(cy, or, fin),
        opacity: t * (i % 2 ? 0.2 : 0.11)
      }));
    }
    const diags = [];
    for (let i = 2; i < n - 1; i++) {
      const t = clamp(prog * (n - 2) - (i - 2), 0, 1);
      diags.push(/*#__PURE__*/React.createElement("line", {
        key: i,
        x1: P[0][0],
        y1: P[0][1],
        x2: P[i][0],
        y2: P[i][1],
        stroke: mix(cy, or, fin),
        strokeWidth: "2.6",
        opacity: t
      }));
    }
    return /*#__PURE__*/React.createElement("g", {
      opacity: vis
    }, tris, /*#__PURE__*/React.createElement("polygon", {
      points: pts,
      fill: "none",
      stroke: mix(GRAY, INK, 0.3),
      strokeWidth: "2.6",
      strokeLinejoin: "round"
    }), diags, P.map((p, i) => /*#__PURE__*/React.createElement("circle", {
      key: i,
      cx: p[0],
      cy: p[1],
      r: i === 0 ? 7 : 5,
      fill: i === 0 ? mix(cy, or, fin) : mix(GRAY, INK, 0.3)
    })), /*#__PURE__*/React.createElement("text", {
      x: CX,
      y: CY + R + 62,
      textAnchor: "middle",
      fontFamily: "'STIX Two Text', Georgia, serif",
      fontSize: "30",
      fill: GRAY
    }, n, " v\xE9rtices \xB7 ", n - 2, " tri\xE2ngulos"));
  }
  function Figura({
    T,
    CUES,
    cy,
    or
  }) {
    const seg = (a, b) => MOTION.glide(0, 1, a - 0.4, a + 0.5)(T) * (1 - MOTION.glide(0, 1, b - 0.4, b + 0.4)(T));
    const fin = MOTION.glide(0, 1, CUES.Resultado - 0.3, CUES.Resultado + 0.6)(T);
    const shapes = [{
      n: 4,
      vis: seg(CUES.Quadrilatero, CUES.Pentagono),
      start: CUES.Quadrilatero
    }, {
      n: 5,
      vis: seg(CUES.Pentagono, CUES.Hexagono),
      start: CUES.Pentagono
    }, {
      n: 6,
      vis: MOTION.glide(0, 1, CUES.Hexagono - 0.4, CUES.Hexagono + 0.5)(T),
      start: CUES.Hexagono
    }];
    const intro = seg(0, CUES.Quadrilatero);
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "60 40 480 480",
      style: {
        position: 'absolute',
        right: 80,
        top: 330,
        width: 580,
        height: 580,
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("g", {
      opacity: intro
    }, /*#__PURE__*/React.createElement(Poligono, {
      n: 5,
      vis: 1,
      prog: MOTION.glide(0, 1, 0.6, 2.6)(T),
      cy: cy,
      or: or,
      fin: 0
    })), shapes.map(s => /*#__PURE__*/React.createElement(Poligono, {
      key: s.n,
      n: s.n,
      vis: s.vis,
      prog: MOTION.glide(0, 1, s.start, s.start + 2.4)(T),
      cy: cy,
      or: or,
      fin: fin
    })));
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
    const size = step.tall ? 44 : 50;
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
        width: 1090,
        opacity: op,
        transform: `translateY(-50%) scale(${scale})`,
        transformOrigin: '0 50%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 24,
        color: mix(GRAY, DIM, 1 - active)
      }
    }, step.tag, ")"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "'Caveat', cursive",
        fontSize: 60,
        color: mix('#ffffff', DIM, 1 - active),
        lineHeight: 1
      }
    }, step.label)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
        marginTop: 14,
        marginLeft: 40,
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
        maxWidth: 220,
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
    }, "QUEST\xC3O 2"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 29,
        color: GRAY,
        marginTop: 14,
        width: 1780,
        maxWidth: 1780,
        lineHeight: 1.4
      }
    }, "Compare o n\xFAmero de v\xE9rtices de cada pol\xEDgono com o n\xFAmero de diagonais que partem de um v\xE9rtice. a) O que se pode concluir sobre o n\xFAmero de tri\xE2ngulos formados nessa situa\xE7\xE3o? b) Escreva uma f\xF3rmula para obter a soma das medidas dos \xE2ngulos internos (S", /*#__PURE__*/React.createElement("sub", {
      style: {
        fontSize: '0.7em'
      }
    }, "i"), ") de um pol\xEDgono regular com n v\xE9rtices.")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 70,
        top: 272,
        width: 1780,
        height: 2,
        background: '#333333'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 300,
        width: 1180,
        bottom: 40,
        overflow: 'hidden'
      }
    }, STEPS.map((s, i) => /*#__PURE__*/React.createElement(Row, {
      key: i,
      step: s,
      i: i,
      k: k,
      y: ACTIVE_Y - 300 + ctr[i] - base,
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
  window.Questoes["cap11-q02"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "Diagonais",
      "dur": 6,
      "desc": "De um vértice partem n menos 3 diagonais, mostradas no polígono"
    }, {
      "name": "Quadrilatero",
      "dur": 5,
      "desc": "O quadrilátero se divide em 2 triângulos"
    }, {
      "name": "Pentagono",
      "dur": 5,
      "desc": "O pentágono se divide em 3 triângulos"
    }, {
      "name": "Hexagono",
      "dur": 5,
      "desc": "O hexágono se divide em 4 triângulos"
    }, {
      "name": "Padrao",
      "dur": 5,
      "desc": "O padrão aparece: o número de triângulos é n menos 2"
    }, {
      "name": "ConclusaoA",
      "dur": 5.5,
      "desc": "Conclusão da letra a em laranja"
    }, {
      "name": "Grau180",
      "dur": 5,
      "desc": "Cada triângulo contribui com 180 graus"
    }, {
      "name": "Formula",
      "dur": 5.5,
      "desc": "A soma dos ângulos internos é n menos 2 vezes 180 graus"
    }, {
      "name": "Testar",
      "dur": 5,
      "desc": "Teste no hexágono: 720 graus"
    }, {
      "name": "Resultado",
      "dur": 6,
      "desc": "A fórmula final fecha em laranja"
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
