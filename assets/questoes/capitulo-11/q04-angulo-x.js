/* ============================================================
   Capitulo 11 · Questao 4 — resolucao animada
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
    label: 'o lado é o mesmo nas duas figuras',
    note: 'quadrado e triângulo\nsão regulares',
    tall: true,
    part: 'a',
    toks: [rm('AD = AB = ', 'r'), rm('AE', 'm')]
  }, {
    label: 'o ângulo entre AD e AE',
    note: 'do reto tira-se\no ângulo de 60°',
    tall: true,
    part: 'a',
    toks: [rm('90° − 60° = ', 'r'), rm('30°', 'm')]
  }, {
    label: 'o triângulo ADE é isósceles',
    note: 'ângulos da base\niguais a x',
    tall: true,
    part: 'a',
    toks: [rm('30° + ', 'r'), it('x', 'm'), rm(' + ', 'r'), it('x', 'm'), rm(' = 180°', 'r')]
  }, {
    label: 'juntar os termos em x',
    note: '180 − 30',
    tall: true,
    part: 'a',
    toks: [rm('2', 'm'), it('x', 'm'), rm(' = 150°', 'm')]
  }, {
    label: 'dividir os dois membros por 2',
    tall: true,
    part: 'a',
    toks: [rm('∴  ', 'o'), it('x', 'o'), rm(' = 75°', 'o')]
  }, {
    label: 'agora o pentágono regular',
    note: 'Sᵢ = (5 − 2) · 180°\n= 540°',
    tall: true,
    part: 'b',
    toks: [rm('540° : 5 = ', 'r'), rm('108°', 'm')]
  }, {
    label: 'o triângulo DEC é isósceles',
    note: 'DE = DC',
    tall: true,
    part: 'b',
    toks: [rm('(180° − 108°) : 2 = ', 'r'), rm('36°', 'm')]
  }, {
    label: 'o triângulo AEB é igual a ele',
    note: 'AE = AB',
    tall: true,
    part: 'b',
    toks: [rm('mesma medida:  ', 'r'), rm('36°', 'm')]
  }, {
    label: 'os três ângulos formam o interno',
    tall: true,
    part: 'b',
    toks: [rm('36° + ', 'r'), it('x', 'm'), rm(' + 36° = 108°', 'r')]
  }, {
    label: 'isolar x',
    note: '36 + 36 = 72',
    tall: true,
    part: 'b',
    toks: [it('x', 'r'), rm(' = 108° − 72° = ', 'r'), rm('36°', 'm')]
  }, {
    label: 'resultado do item b',
    tall: true,
    part: 'b',
    toks: [rm('∴  ', 'o'), it('x', 'o'), rm(' = 36°', 'o')]
  }];
  const CUE_NAMES = ['Lados', 'AnguloA', 'Isosceles', 'Juntar', 'ResultadoA', 'Interno', 'TriDEC', 'TriAEB', 'Tres', 'Isolar', 'ResultadoB'];
  const ACTIVE_Y = 660;
  const NAT_H = i => STEPS[i].tall ? 190 : 132;

  /* ---- geometria -------------------------------------------------------- */
  const U = (c, r, a) => [c[0] + r * Math.cos(a * Math.PI / 180), c[1] - r * Math.sin(a * Math.PI / 180)];
  function arcPath(c, r, a1, a2) {
    const [x1, y1] = U(c, r, a1),
      [x2, y2] = U(c, r, a2);
    const large = (a2 - a1 + 360) % 360 > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 0 ${x2} ${y2}`;
  }
  const SQ = {
    A: [80, 420],
    B: [380, 420],
    C: [380, 120],
    D: [80, 120],
    E: [230, 160.2]
  };
  const PC = [280, 300];
  const PG = {
    D: U(PC, 220, 90),
    C: U(PC, 220, 18),
    B: U(PC, 220, -54),
    A: U(PC, 220, 234),
    E: U(PC, 220, 162)
  };
  function FigA({
    T,
    CUES,
    cy,
    or
  }) {
    const drawn = MOTION.glide(0, 1, 0.2, 1.7)(T);
    const hlLados = MOTION.glide(0, 1, CUES.Lados - 0.4, CUES.Lados + 0.5)(T) * (1 - MOTION.glide(0, 1, CUES.AnguloA - 0.4, CUES.AnguloA + 0.4)(T));
    const solvA = MOTION.glide(0, 1, CUES.AnguloA - 0.2, CUES.AnguloA + 0.6)(T);
    const hlTri = MOTION.glide(0, 1, CUES.Isosceles - 0.4, CUES.Isosceles + 0.5)(T);
    const fin = MOTION.glide(0, 1, CUES.ResultadoA - 0.3, CUES.ResultadoA + 0.6)(T);
    const plain = mix(GRAY, INK, 0.28);
    const cLado = mix(INK, cy, clamp(hlLados, 0, 1));
    const cA = mix(INK, cy, clamp(solvA, 0, 1) * 0.9);
    const cX = mix(mix(INK, cy, clamp(hlTri, 0, 1)), or, fin);
    const lblA = U(SQ.A, 98, 75);
    const lblX = U(SQ.E, 92, 202.5);
    const sq = [SQ.A, SQ.B, SQ.C, SQ.D];
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("polygon", {
      points: [SQ.A, SQ.B, SQ.E].map(p => p.join(',')).join(' '),
      fill: cy,
      opacity: clamp(hlTri, 0, 1) * 0.1
    }), /*#__PURE__*/React.createElement("polygon", {
      points: [SQ.A, SQ.D, SQ.E].map(p => p.join(',')).join(' '),
      fill: cy,
      opacity: clamp(hlTri, 0, 1) * 0.16
    }), /*#__PURE__*/React.createElement("polygon", {
      points: sq.map(p => p.join(',')).join(' '),
      fill: "none",
      stroke: plain,
      strokeWidth: "2.6",
      strokeLinejoin: "round",
      strokeDasharray: "1200",
      strokeDashoffset: 1200 * (1 - drawn)
    }), /*#__PURE__*/React.createElement("line", {
      x1: SQ.A[0],
      y1: SQ.A[1],
      x2: SQ.E[0],
      y2: SQ.E[1],
      stroke: cLado,
      strokeWidth: 2.6 + 1.4 * hlLados,
      opacity: drawn
    }), /*#__PURE__*/React.createElement("line", {
      x1: SQ.B[0],
      y1: SQ.B[1],
      x2: SQ.E[0],
      y2: SQ.E[1],
      stroke: plain,
      strokeWidth: "2.6",
      opacity: drawn
    }), /*#__PURE__*/React.createElement("line", {
      x1: SQ.D[0],
      y1: SQ.D[1],
      x2: SQ.E[0],
      y2: SQ.E[1],
      stroke: mix(plain, cy, clamp(hlTri, 0, 1)),
      strokeWidth: "2.6",
      opacity: drawn
    }), /*#__PURE__*/React.createElement("line", {
      x1: SQ.A[0],
      y1: SQ.A[1],
      x2: SQ.D[0],
      y2: SQ.D[1],
      stroke: cLado,
      strokeWidth: 2.6 + 1.4 * hlLados,
      opacity: drawn
    }), /*#__PURE__*/React.createElement("line", {
      x1: SQ.A[0],
      y1: SQ.A[1],
      x2: SQ.B[0],
      y2: SQ.B[1],
      stroke: cLado,
      strokeWidth: 2.6 + 1.4 * hlLados,
      opacity: drawn
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(SQ.A, 66, 60, 90),
      fill: "none",
      stroke: cA,
      strokeWidth: "2.6",
      opacity: drawn * solvA
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(SQ.E, 56, 165, 240),
      fill: "none",
      stroke: cX,
      strokeWidth: 2.6 + 1.6 * clamp(hlTri + fin, 0, 1),
      opacity: drawn
    }), /*#__PURE__*/React.createElement("g", {
      fontFamily: "'STIX Two Text', Georgia, serif",
      fontSize: "28",
      textAnchor: "middle"
    }, /*#__PURE__*/React.createElement("text", {
      x: lblA[0],
      y: lblA[1] + 9,
      fill: cA,
      opacity: drawn * solvA
    }, "30\xB0"), /*#__PURE__*/React.createElement("text", {
      x: lblX[0],
      y: lblX[1] + 9,
      fill: cX,
      fontSize: 28 + 10 * fin,
      fontStyle: fin > 0.5 ? 'normal' : 'italic',
      opacity: drawn
    }, fin > 0.5 ? '75°' : 'x')), /*#__PURE__*/React.createElement("g", {
      fontFamily: "'STIX Two Text', Georgia, serif",
      fontSize: "30",
      fill: GRAY,
      opacity: drawn
    }, /*#__PURE__*/React.createElement("text", {
      x: SQ.A[0] - 34,
      y: SQ.A[1] + 34
    }, "A"), /*#__PURE__*/React.createElement("text", {
      x: SQ.B[0] + 14,
      y: SQ.B[1] + 34
    }, "B"), /*#__PURE__*/React.createElement("text", {
      x: SQ.C[0] + 14,
      y: SQ.C[1] - 12
    }, "C"), /*#__PURE__*/React.createElement("text", {
      x: SQ.D[0] - 34,
      y: SQ.D[1] - 12
    }, "D"), /*#__PURE__*/React.createElement("text", {
      x: SQ.E[0] + 16,
      y: SQ.E[1] - 6,
      fill: mix(GRAY, cy, clamp(hlLados, 0, 1))
    }, "E")));
  }
  function FigB({
    T,
    CUES,
    cy,
    or
  }) {
    const drawn = MOTION.glide(0, 1, CUES.Interno - 0.3, CUES.Interno + 1.1)(T);
    const solvInt = MOTION.glide(0, 1, CUES.Interno + 0.1, CUES.Interno + 0.9)(T);
    const hlDEC = MOTION.glide(0, 1, CUES.TriDEC - 0.4, CUES.TriDEC + 0.5)(T) * (1 - MOTION.glide(0, 1, CUES.TriAEB - 0.4, CUES.TriAEB + 0.4)(T));
    const solvDEC = MOTION.glide(0, 1, CUES.TriDEC - 0.1, CUES.TriDEC + 0.7)(T);
    const hlAEB = MOTION.glide(0, 1, CUES.TriAEB - 0.4, CUES.TriAEB + 0.5)(T) * (1 - MOTION.glide(0, 1, CUES.Tres - 0.4, CUES.Tres + 0.4)(T));
    const solvAEB = MOTION.glide(0, 1, CUES.TriAEB - 0.1, CUES.TriAEB + 0.7)(T);
    const hlX = MOTION.glide(0, 1, CUES.Tres - 0.4, CUES.Tres + 0.5)(T);
    const fin = MOTION.glide(0, 1, CUES.ResultadoB - 0.3, CUES.ResultadoB + 0.6)(T);
    const plain = mix(GRAY, INK, 0.28);
    const cDEC = mix(INK, cy, clamp(hlDEC + solvDEC * 0.5, 0, 1));
    const cAEB = mix(INK, cy, clamp(hlAEB + solvAEB * 0.5, 0, 1));
    const cX = mix(mix(INK, cy, clamp(hlX, 0, 1)), or, fin);
    const cInt = mix(INK, cy, clamp(solvInt, 0, 1) * 0.85);
    const pts = [PG.A, PG.B, PG.C, PG.D, PG.E];
    const lDEC = U(PG.E, 94, 18);
    const lAEB = U(PG.E, 94, -54);
    const lX = U(PG.E, 132, -18);
    const lInt = U(PG.D, 86, -90);
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("polygon", {
      points: [PG.D, PG.E, PG.C].map(p => p.join(',')).join(' '),
      fill: cy,
      opacity: clamp(hlDEC, 0, 1) * 0.14
    }), /*#__PURE__*/React.createElement("polygon", {
      points: [PG.A, PG.E, PG.B].map(p => p.join(',')).join(' '),
      fill: cy,
      opacity: clamp(hlAEB, 0, 1) * 0.14
    }), /*#__PURE__*/React.createElement("polygon", {
      points: [PG.E, PG.C, PG.B].map(p => p.join(',')).join(' '),
      fill: cy,
      opacity: clamp(hlX, 0, 1) * 0.12
    }), /*#__PURE__*/React.createElement("polygon", {
      points: pts.map(p => p.join(',')).join(' '),
      fill: "none",
      stroke: plain,
      strokeWidth: "2.6",
      strokeLinejoin: "round",
      strokeDasharray: "1600",
      strokeDashoffset: 1600 * (1 - drawn)
    }), /*#__PURE__*/React.createElement("line", {
      x1: PG.E[0],
      y1: PG.E[1],
      x2: PG.C[0],
      y2: PG.C[1],
      stroke: mix(plain, cy, clamp(hlDEC + hlX, 0, 1)),
      strokeWidth: "2.6",
      opacity: drawn
    }), /*#__PURE__*/React.createElement("line", {
      x1: PG.E[0],
      y1: PG.E[1],
      x2: PG.B[0],
      y2: PG.B[1],
      stroke: mix(plain, cy, clamp(hlAEB + hlX, 0, 1)),
      strokeWidth: "2.6",
      opacity: drawn
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(PG.D, 58, -126, -54),
      fill: "none",
      stroke: cInt,
      strokeWidth: "2.6",
      opacity: drawn * solvInt
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(PG.E, 64, 0, 36),
      fill: "none",
      stroke: cDEC,
      strokeWidth: "2.6",
      opacity: drawn * solvDEC
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(PG.E, 64, -72, -36),
      fill: "none",
      stroke: cAEB,
      strokeWidth: "2.6",
      opacity: drawn * solvAEB
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(PG.E, 104, -36, 0),
      fill: "none",
      stroke: cX,
      strokeWidth: 2.6 + 1.6 * clamp(hlX + fin, 0, 1),
      opacity: drawn
    }), /*#__PURE__*/React.createElement("g", {
      fontFamily: "'STIX Two Text', Georgia, serif",
      fontSize: "28",
      textAnchor: "middle"
    }, /*#__PURE__*/React.createElement("text", {
      x: lInt[0],
      y: lInt[1] + 9,
      fill: cInt,
      opacity: drawn * solvInt
    }, "108\xB0"), /*#__PURE__*/React.createElement("text", {
      x: lDEC[0],
      y: lDEC[1] + 9,
      fill: cDEC,
      opacity: drawn * solvDEC
    }, "36\xB0"), /*#__PURE__*/React.createElement("text", {
      x: lAEB[0],
      y: lAEB[1] + 9,
      fill: cAEB,
      opacity: drawn * solvAEB
    }, "36\xB0"), /*#__PURE__*/React.createElement("text", {
      x: lX[0],
      y: lX[1] + 9,
      fill: cX,
      fontSize: 28 + 10 * fin,
      fontStyle: fin > 0.5 ? 'normal' : 'italic',
      opacity: drawn
    }, fin > 0.5 ? '36°' : 'x')), /*#__PURE__*/React.createElement("g", {
      fontFamily: "'STIX Two Text', Georgia, serif",
      fontSize: "30",
      fill: GRAY,
      opacity: drawn
    }, /*#__PURE__*/React.createElement("text", {
      x: PG.A[0] - 14,
      y: PG.A[1] + 40
    }, "A"), /*#__PURE__*/React.createElement("text", {
      x: PG.B[0] - 6,
      y: PG.B[1] + 40
    }, "B"), /*#__PURE__*/React.createElement("text", {
      x: PG.C[0] + 18,
      y: PG.C[1] + 8
    }, "C"), /*#__PURE__*/React.createElement("text", {
      x: PG.D[0] - 10,
      y: PG.D[1] - 18
    }, "D"), /*#__PURE__*/React.createElement("text", {
      x: PG.E[0] - 40,
      y: PG.E[1] + 8
    }, "E")));
  }
  function Figuras({
    T,
    CUES,
    cy,
    or
  }) {
    const swap = MOTION.glide(0, 1, CUES.Interno - 0.6, CUES.Interno + 0.2)(T);
    const legenda = (txt, op) => /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 560,
        opacity: op,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 21,
        color: GRAY,
        letterSpacing: '0.1em'
      }
    }, txt);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 96,
        top: 320,
        width: 560,
        height: 620
      }
    }, legenda('ITEM A  ·  ABCD E ABE REGULARES', (1 - swap) * MOTION.enter(0, 1, 0.4, 1.6)(T)), legenda('ITEM B  ·  ABCDE REGULAR', swap), /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 560 560",
      style: {
        position: 'absolute',
        left: 0,
        top: 54,
        width: 560,
        height: 560,
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("g", {
      opacity: 1 - swap
    }, /*#__PURE__*/React.createElement(FigA, {
      T: T,
      CUES: CUES,
      cy: cy,
      or: or
    })), /*#__PURE__*/React.createElement("g", {
      opacity: swap
    }, /*#__PURE__*/React.createElement(FigB, {
      T: T,
      CUES: CUES,
      cy: cy,
      or: or
    }))));
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
    const active = clamp(1 - Math.abs(d) * 1.4, 0, 1);
    const col = role => {
      if (role === 'o') return or;
      if (role === 'r') return GRAY;
      return mix(role === 'm' ? cy : INK, GRAY, age);
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 96,
        top: y,
        width: 1060,
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
        fontSize: 26,
        color: mix(DIM, cy, active * 0.8)
      }
    }, step.part, ")"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "'Caveat', cursive",
        fontSize: 58,
        color: mix('#ffffff', DIM, 1 - active),
        lineHeight: 1
      }
    }, step.label)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
        marginTop: 12,
        marginLeft: 44,
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 48,
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
        marginLeft: 32,
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 23,
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
        left: 96,
        top: 92,
        width: 1728,
        opacity: headOp
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 20,
        color: cy,
        letterSpacing: '0.14em'
      }
    }, "QUEST\xC3O 4"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 30,
        color: GRAY,
        marginTop: 14,
        width: 1728,
        lineHeight: 1.4
      }
    }, "Determine a medida do \xE2ngulo x em cada uma das figuras seguintes, sabendo que: a) ABCD e ABE s\xE3o regulares; b) ABCDE \xE9 regular.")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 96,
        top: 226,
        width: 1728,
        height: 2,
        background: '#333333'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 268,
        width: 1180,
        bottom: 40,
        overflow: 'hidden'
      }
    }, STEPS.map((s, i) => /*#__PURE__*/React.createElement(Row, {
      key: i,
      step: s,
      i: i,
      k: k,
      y: ACTIVE_Y - 268 + ctr[i] - base,
      cy: cy,
      or: or
    }))), /*#__PURE__*/React.createElement(Figuras, {
      T: T,
      CUES: CUES,
      cy: cy,
      or: or
    })));
  }
  window.Questoes = window.Questoes || {};
  window.Questoes["cap11-q04"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "Lados",
      "dur": 6,
      "desc": "Item a: o lado do triangulo equilatero e igual ao lado do quadrado"
    }, {
      "name": "AnguloA",
      "dur": 5.5,
      "desc": "O angulo entre AD e AE: 90 graus menos 60 graus da 30 graus"
    }, {
      "name": "Isosceles",
      "dur": 6,
      "desc": "O triangulo ADE e isosceles: 30 mais x mais x igual 180"
    }, {
      "name": "Juntar",
      "dur": 5,
      "desc": "Juntando os termos em x: 2x igual 150 graus"
    }, {
      "name": "ResultadoA",
      "dur": 6,
      "desc": "Dividindo por 2: x igual 75 graus no item a"
    }, {
      "name": "Interno",
      "dur": 6.5,
      "desc": "Item b: o angulo interno do pentagono regular e 108 graus"
    }, {
      "name": "TriDEC",
      "dur": 6,
      "desc": "O triangulo DEC e isosceles, o angulo em E mede 36 graus"
    }, {
      "name": "TriAEB",
      "dur": 5.5,
      "desc": "O triangulo AEB e igual a ele, tambem 36 graus"
    }, {
      "name": "Tres",
      "dur": 6,
      "desc": "Os tres angulos em E formam o angulo interno de 108 graus"
    }, {
      "name": "Isolar",
      "dur": 5.5,
      "desc": "Isolando x: 108 menos 72 igual 36 graus"
    }, {
      "name": "ResultadoB",
      "dur": 6,
      "desc": "Resultado do item b: x igual 36 graus"
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
