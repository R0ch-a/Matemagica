/* ============================================================
   Capitulo 10 · Questao 14 — resolucao animada
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
  function Hat({
    ch,
    dy
  }) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'relative',
        display: 'inline-block',
        lineHeight: 1,
        verticalAlign: 'baseline'
      }
    }, ch, /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: dy || '0.4em',
        textAlign: 'center',
        fontStyle: 'normal'
      }
    }, '\u02C6'));
  }
  function hatify(str, dy) {
    const parts = String(str).split('B\u0302');
    const out = [];
    parts.forEach((p, i) => {
      if (p) out.push(p);
      if (i < parts.length - 1) out.push(/*#__PURE__*/React.createElement(Hat, {
        key: 'h' + i,
        ch: "B",
        dy: dy
      }));
    });
    return out;
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
    label: 'o dado',
    note: 'B̂ é o triplo\nde Â',
    tall: true,
    toks: [rm('B̂', 'r'), rm(' = ', 'r'), rm('3 Â', 'm')]
  }, {
    label: 'colaterais internos',
    note: 'Â se repete em r\n(oposto pelo vértice)',
    tall: true,
    toks: [rm('Â', 'm'), rm(' + ', 'm'), rm('B̂', 'm'), rm(' = 180°', 'r')]
  }, {
    label: 'substituir B̂',
    note: '',
    toks: [rm('Â', 'r'), rm(' + ', 'r'), rm('3 Â', 'm'), rm(' = 180°', 'r')]
  }, {
    label: 'somar os termos',
    note: '',
    toks: [rm('4 Â', 'm'), rm(' = 180°', 'r')]
  }, {
    label: 'dividir por 4',
    note: '180 ÷ 4',
    toks: [rm('Â', 'r'), rm(' = ', 'r'), rm('45°', 'm')]
  }, {
    label: 'voltar ao dado',
    note: '3 · 45',
    toks: [rm('B̂', 'r'), rm(' = 3 · 45° = ', 'r'), rm('135°', 'm')]
  }, {
    label: 'a diferença',
    note: '135 − 45',
    tall: true,
    toks: [rm('B̂ − Â', 'r'), rm(' = ', 'r'), rm('135°', 'm'), rm(' − ', 'r'), rm('45°', 'm')]
  }, {
    label: 'resultado',
    tall: true,
    toks: [rm('∴  B̂ − Â = 90°', 'o')]
  }];
  const CUE_NAMES = ['Dado', 'Suplementares', 'Substituir', 'Somar', 'ValorA', 'ValorB', 'Diferenca', 'Resultado'];
  const ACTIVE_Y = 680;
  const NAT_H = i => STEPS[i].tall ? 190 : 132;

  /* ---- figura ----------------------------------------------------------- */
  const Pr = [420, 180],
    Ps = [300, 360];
  const TT = [456, 126],
    TB = [258, 423];
  const ANG = 56.31;
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
    const hlDado = seg(CUES.Dado, CUES.Suplementares);
    const hlSup = seg(CUES.Suplementares, CUES.Substituir);
    const solvedA = MOTION.glide(0, 1, CUES.ValorA - 0.2, CUES.ValorA + 0.6)(T);
    const solvedB = MOTION.glide(0, 1, CUES.ValorB - 0.2, CUES.ValorB + 0.6)(T);
    const fin = MOTION.glide(0, 1, CUES.Resultado - 0.3, CUES.Resultado + 0.6)(T);
    const plain = mix(GRAY, INK, 0.28);
    const cA = mix(mix(INK, cy, clamp(hlDado * 0.7 + hlSup + solvedA * 0.6, 0, 1)), or, fin);
    const cB = mix(mix(INK, cy, clamp(hlDado + hlSup + solvedB * 0.6, 0, 1)), or, fin);
    const cOp = mix(DIM, cy, hlSup);
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
      viewBox: "30 85 570 390",
      style: {
        position: 'absolute',
        right: 50,
        top: 340,
        width: 740,
        height: 506,
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("polygon", {
      points: `${Pr.join(',')} ${Ps.join(',')} ${[Ps[0] - 250, Ps[1]].join(',')} ${[Pr[0] - 250, Pr[1]].join(',')}`,
      fill: cy,
      opacity: hlSup * 0.12
    }), L([70, 180], [560, 180], plain), L([40, 360], [530, 360], plain), L(TB, TT, mix(plain, cy, clamp(hlSup * 0.6, 0, 1))), /*#__PURE__*/React.createElement("path", {
      d: arcPath(Pr, 44, 180, 180 + ANG),
      fill: "none",
      stroke: cOp,
      strokeWidth: "2.6",
      strokeDasharray: "6 7",
      opacity: drawn * clamp(hlSup * 1.6, 0, 1)
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(Pr, 46, 0, ANG),
      fill: "none",
      stroke: cA,
      strokeWidth: 2.6 + 1.2 * fin,
      opacity: drawn
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(Ps, 52, ANG, 180),
      fill: "none",
      stroke: cB,
      strokeWidth: 2.6 + 1.2 * fin,
      opacity: drawn
    }), /*#__PURE__*/React.createElement("g", {
      fontFamily: "'STIX Two Text', Georgia, serif",
      fontSize: "27",
      textAnchor: "middle",
      opacity: drawn
    }, /*#__PURE__*/React.createElement("text", {
      x: U(Pr, 72, 26)[0],
      y: U(Pr, 72, 26)[1] + 9,
      fill: cA
    }, solvedA > 0.5 ? '45°' : 'Â'), solvedB > 0.5 ? /*#__PURE__*/React.createElement("text", {
      x: U(Ps, 80, 116)[0],
      y: U(Ps, 80, 116)[1] + 9,
      fill: cB
    }, "135\xB0") : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("text", {
      x: U(Ps, 80, 116)[0],
      y: U(Ps, 80, 116)[1] + 9,
      fill: cB
    }, "B"), /*#__PURE__*/React.createElement("text", {
      x: U(Ps, 80, 116)[0],
      y: U(Ps, 80, 116)[1] + 3,
      fill: cB,
      fontSize: "26"
    }, '\u02C6')), /*#__PURE__*/React.createElement("text", {
      x: U(Pr, 74, 206)[0],
      y: U(Pr, 74, 206)[1] + 9,
      fill: cOp,
      fontSize: "23",
      opacity: clamp(hlSup * 1.6, 0, 1)
    }, solvedA > 0.5 ? '45°' : 'Â')), /*#__PURE__*/React.createElement("g", {
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: "25",
      fill: plain,
      opacity: drawn
    }, /*#__PURE__*/React.createElement("text", {
      x: 574,
      y: 188
    }, "r"), /*#__PURE__*/React.createElement("text", {
      x: 544,
      y: 368
    }, "s"), /*#__PURE__*/React.createElement("text", {
      x: TT[0] + 14,
      y: TT[1] - 6
    }, "t")));
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
    }, hatify(step.label)), /*#__PURE__*/React.createElement("div", {
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
    }, hatify(tk.s))), step.note ? /*#__PURE__*/React.createElement("span", {
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
    }, hatify(step.note)) : null));
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
    const opts = [['a', '90°'], ['b', '85°'], ['c', '80°'], ['d', '75°'], ['e', '60°']];
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
    }, "QUEST\xC3O 14"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 30,
        color: GRAY,
        marginTop: 14,
        lineHeight: 1.4
      }
    }, hatify('As retas r e s são paralelas, cortadas pela transversal t. Se a medida do ângulo B̂ é o triplo da medida do ângulo Â, então med(B̂) − med(Â) vale', '0.2em'))), /*#__PURE__*/React.createElement("div", {
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
        width: 1120,
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
  window.Questoes["cap10-q14"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "Dado",
      "dur": 6,
      "desc": "A figura se desenha: r e s paralelas cortadas por t, e o dado B igual a 3A"
    }, {
      "name": "Suplementares",
      "dur": 6,
      "desc": "A repetido em r por oposto pelo vertice: A mais B igual a 180 graus"
    }, {
      "name": "Substituir",
      "dur": 4.5,
      "desc": "Substituindo B por 3A"
    }, {
      "name": "Somar",
      "dur": 4,
      "desc": "Somando: 4A igual a 180 graus"
    }, {
      "name": "ValorA",
      "dur": 4.5,
      "desc": "A vale 45 graus, marcado na figura"
    }, {
      "name": "ValorB",
      "dur": 4.5,
      "desc": "B vale 135 graus"
    }, {
      "name": "Diferenca",
      "dur": 5,
      "desc": "Calculando a diferenca 135 menos 45"
    }, {
      "name": "Resultado",
      "dur": 5.5,
      "desc": "O resultado 90 graus destaca a alternativa a"
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
