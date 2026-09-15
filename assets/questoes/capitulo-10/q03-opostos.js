/* ============================================================
   Capitulo 10 · Questao 3 — resolucao animada
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
    k: 't',
    s,
    c: c || 'n'
  });
  const it = (s, c) => ({
    k: 't',
    s,
    c: c || 'n',
    i: true
  });
  const STEPS = [{
    label: 'opostos pelo vértice',
    note: 'ângulos opostos\nsão iguais',
    tall: true,
    toks: [it('x', 'm'), rm(' + ', 'm'), it('x', 'm'), rm(' = 260°', 'm')]
  }, {
    label: 'somar',
    note: '',
    toks: [rm('2', 'm'), it('x', 'm'), rm(' = 260°', 'r')]
  }, {
    label: 'dividir por 2',
    note: '',
    toks: [it('x', 'r'), rm(' = ', 'r'), rm('130°', 'm')]
  }, {
    label: 'suplemento de 130°',
    note: 'suplemento:\n180° − ângulo',
    tall: true,
    toks: [rm('180° − ', 'r'), rm('130°', 'r'), rm(' = ', 'r'), rm('50°', 'm')]
  }, {
    label: 'complemento de 50°',
    note: 'complemento:\n90° − ângulo',
    tall: true,
    toks: [rm('90° − ', 'r'), rm('50°', 'r'), rm(' = ', 'r'), rm('40°', 'm')]
  }, {
    label: 'resultado',
    note: '',
    tall: true,
    short: true,
    toks: [rm('∴  complemento do suplemento = ', 'o'), rm('40°', 'o')]
  }];
  const CUE_NAMES = ['Opostos', 'Somar', 'Dividir', 'Suplemento', 'Complemento', 'Resultado'];
  const ACTIVE_Y = 700;
  const NAT_H = i => STEPS[i].tall ? 200 : 132;

  /* figura: duas retas concorrentes */
  const V = [380, 250];
  const at = (c, r, a) => [c[0] + r * Math.cos(a * Math.PI / 180), c[1] - r * Math.sin(a * Math.PI / 180)];
  function arcPath(c, r, a1, a2) {
    const [x1, y1] = at(c, r, a1),
      [x2, y2] = at(c, r, a2);
    const large = (a1 - a2 + 360) % 360 > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  }
  function Figura({
    T,
    CUES,
    cy,
    or
  }) {
    const win = (a, b) => MOTION.glide(0, 1, a - 0.4, a + 0.5)(T) * (1 - MOTION.glide(0, 1, b - 0.4, b + 0.4)(T));
    const drawn = MOTION.glide(0, 1, 0.3, 2)(T);
    const hlOpp = win(CUES.Opostos, CUES.Dividir) + win(CUES.Dividir, CUES.Suplemento) * 0.7;
    const hlSup = win(CUES.Suplemento, CUES.Complemento);
    const found = MOTION.glide(0, 1, CUES.Dividir - 0.2, CUES.Dividir + 0.7)(T);
    const compOn = MOTION.enter(0, 1, CUES.Complemento - 0.3, CUES.Complemento + 0.7)(T);
    const doneOn = MOTION.glide(0, 1, CUES.Resultado - 0.3, CUES.Resultado + 0.6)(T);
    const plain = mix(GRAY, INK, 0.25);
    const oppCol = mix(INK, cy, clamp(hlOpp, 0, 1));
    const supCol = mix(INK, cy, clamp(hlSup, 0, 1));
    const compCol = mix(mix(GRAY, INK, 0.3), or, doneOn);
    const L = (p1, p2) => /*#__PURE__*/React.createElement("line", {
      x1: p1[0],
      y1: p1[1],
      x2: p2[0],
      y2: p2[1],
      stroke: plain,
      strokeWidth: "2.6",
      strokeLinecap: "round",
      strokeDasharray: "700",
      strokeDashoffset: 700 * (1 - drawn)
    });
    const l1a = at(V, 230, 115),
      l1b = at(V, 230, 295);
    const l2a = at(V, 230, 65),
      l2b = at(V, 230, 245);
    const lblL = at(V, 104, 180),
      lblR = at(V, 104, 0),
      lblT = at(V, 96, 90);
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "20 10 720 560",
      style: {
        position: 'absolute',
        right: 70,
        top: 300,
        width: 720,
        height: 560,
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: arcPath(V, 66, 245, 115),
      fill: "none",
      stroke: oppCol,
      strokeWidth: "2.8",
      opacity: drawn
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(V, 66, 65, 295),
      fill: "none",
      stroke: oppCol,
      strokeWidth: "2.8",
      opacity: drawn
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(V, 52, 115, 65),
      fill: "none",
      stroke: supCol,
      strokeWidth: "2.8",
      opacity: drawn
    }), L(l1a, l1b), L(l2a, l2b), /*#__PURE__*/React.createElement("g", {
      fontFamily: "'STIX Two Text', Georgia, serif",
      fontSize: "30",
      textAnchor: "middle"
    }, /*#__PURE__*/React.createElement("text", {
      x: lblL[0],
      y: lblL[1] + 10,
      fill: oppCol,
      opacity: drawn
    }, found > 0.5 ? '130°' : 'x'), /*#__PURE__*/React.createElement("text", {
      x: lblR[0],
      y: lblR[1] + 10,
      fill: oppCol,
      opacity: drawn
    }, found > 0.5 ? '130°' : 'x'), /*#__PURE__*/React.createElement("text", {
      x: lblT[0],
      y: lblT[1] - 4,
      fill: supCol,
      opacity: hlSup > 0.3 || T > CUES.Suplemento ? drawn : drawn * 0.35
    }, T > CUES.Suplemento + 0.6 ? '50°' : '')), /*#__PURE__*/React.createElement("g", {
      opacity: compOn,
      transform: "translate(330, 470)"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M0,120 L0,0",
      stroke: plain,
      strokeWidth: "2.6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M0,120 L150,120",
      stroke: plain,
      strokeWidth: "2.6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M0,120 L112,40",
      stroke: compCol,
      strokeWidth: "2.6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M0,86 L34,86 L34,120",
      fill: "none",
      stroke: plain,
      strokeWidth: "2"
    }), /*#__PURE__*/React.createElement("text", {
      x: "52",
      y: "44",
      fontFamily: "'STIX Two Text', Georgia, serif",
      fontSize: "27",
      fill: mix(INK, cy, 0.9)
    }, "50\xB0"), /*#__PURE__*/React.createElement("text", {
      x: "58",
      y: "108",
      fontFamily: "'STIX Two Text', Georgia, serif",
      fontSize: "27",
      fill: compCol
    }, "40\xB0")));
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
    const size = step.short ? 44 : step.tall ? 50 : 56;
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
        width: 1100,
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
        opacity: op,
        transform: `translateY(-50%) scale(${scale})`,
        transformOrigin: '0 50%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: step.short ? 300 : 400,
        textAlign: 'right',
        paddingRight: 36,
        fontFamily: "'Caveat', cursive",
        fontSize: 68,
        color: mix('#ffffff', DIM, 1 - active),
        flexShrink: 0,
        lineHeight: 0.98
      }
    }, step.label), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: size,
        lineHeight: 1.05
      }
    }, step.toks.map((tk, j) => /*#__PURE__*/React.createElement(Tok, {
      key: j,
      tok: tk,
      col: col
    }))), step.note ? /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: 34,
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 26,
        color: GRAY,
        opacity: active,
        whiteSpace: 'pre-line',
        maxWidth: 230,
        lineHeight: 1.35,
        flexShrink: 0
      }
    }, step.note) : null);
  }
  function Tok({
    tok,
    col
  }) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        color: col(tok.c),
        whiteSpace: 'pre',
        fontStyle: tok.i ? 'italic' : 'normal',
        flexShrink: 0
      }
    }, tok.s);
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
        left: 80,
        top: 90,
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
    }, "QUEST\xC3O 3"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 30,
        color: GRAY,
        marginTop: 14,
        maxWidth: 1060,
        lineHeight: 1.35
      }
    }, "Sabendo que dois \xE2ngulos opostos pelo v\xE9rtice somam 260\xB0, determine a medida do complemento do suplemento de um desses \xE2ngulos.")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 80,
        top: 232,
        width: 1000,
        height: 2,
        background: '#333333'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 260,
        width: 1140,
        bottom: 80,
        overflow: 'hidden'
      }
    }, STEPS.map((s, i) => /*#__PURE__*/React.createElement(Row, {
      key: i,
      step: s,
      i: i,
      k: k,
      y: ACTIVE_Y - 260 + ctr[i] - base,
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
  window.Questoes["cap10-q03"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "Opostos",
      "dur": 6,
      "desc": "Duas retas se cruzam; os ângulos opostos pelo vértice são iguais e somam 260 graus"
    }, {
      "name": "Somar",
      "dur": 4.5,
      "desc": "A soma vira dois x igual a 260 graus"
    }, {
      "name": "Dividir",
      "dur": 5,
      "desc": "Dividindo por 2: cada ângulo mede 130 graus"
    }, {
      "name": "Suplemento",
      "dur": 5.5,
      "desc": "O suplemento de 130 graus é 50 graus, o ângulo adjacente na figura"
    }, {
      "name": "Complemento",
      "dur": 5.5,
      "desc": "O complemento de 50 graus é 40 graus, mostrado no ângulo reto"
    }, {
      "name": "Resultado",
      "dur": 5.5,
      "desc": "O resultado 40 graus fecha em laranja"
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
