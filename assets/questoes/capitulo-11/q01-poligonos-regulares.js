/* ============================================================
   Capitulo 11 · Questao 1 — resolucao animada
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
    label: 'identificar os polígonos',
    note: 'ambos regulares',
    tall: true,
    toks: [rm('octógono: ', 'r'), rm('8 lados', 'm'), rm('     hexágono: ', 'r'), rm('6 lados', 'm')]
  }, {
    label: 'soma dos ângulos do octógono',
    note: 'Sᵢ = (n − 2) · 180°',
    tall: true,
    toks: [rm('(8 − 2) · 180° = ', 'r'), rm('1080°', 'm')]
  }, {
    label: 'cada ângulo do octógono',
    note: 'regular: todos iguais',
    tall: true,
    toks: [rm('1080° : 8 = ', 'r'), rm('135°', 'm')]
  }, {
    label: 'soma dos ângulos do hexágono',
    note: 'Sᵢ = (n − 2) · 180°',
    tall: true,
    toks: [rm('(6 − 2) · 180° = ', 'r'), rm('720°', 'm')]
  }, {
    label: 'cada ângulo do hexágono',
    note: '',
    tall: true,
    toks: [rm('720° : 6 = ', 'r'), rm('120°', 'm')]
  }, {
    label: 'volta completa no vértice',
    note: 'os três ângulos\nfecham 360°',
    tall: true,
    toks: [rm('135° + 120° + ', 'r'), it('x', 'm'), rm(' = 360°', 'm')]
  }, {
    label: 'isolar x',
    note: '135 + 120 = 255',
    toks: [it('x', 'r'), rm(' = 360° − ', 'r'), rm('255°', 'm')]
  }, {
    label: 'resultado',
    tall: true,
    toks: [rm('∴  ', 'o'), it('x', 'o'), rm(' = 105°', 'o')]
  }];
  const CUE_NAMES = ['Identificar', 'SomaOito', 'InternoOito', 'SomaSeis', 'InternoSeis', 'Volta', 'Isolar', 'Resultado'];
  const ACTIVE_Y = 680;
  const NAT_H = i => STEPS[i].tall ? 190 : 132;

  /* ---- figura ----------------------------------------------------------- */
  const V = [330, 330];
  const U = (c, r, a) => [c[0] + r * Math.cos(a * Math.PI / 180), c[1] - r * Math.sin(a * Math.PI / 180)];
  function polyFromVertex(v, d1, n, s) {
    const ext = 360 / n;
    const pts = [v];
    let p = v,
      h = d1;
    for (let i = 0; i < n - 1; i++) {
      p = U(p, s, h);
      pts.push(p);
      h += ext;
    }
    return pts;
  }
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
    const oct = polyFromVertex(V, 100, 8, 86);
    const hex = polyFromVertex(V, 235, 6, 86);
    const hlOct = seg(CUES.SomaOito, CUES.SomaSeis);
    const hlHex = seg(CUES.SomaSeis, CUES.Volta);
    const hlVolta = seg(CUES.Volta, CUES.Resultado);
    const fin = MOTION.glide(0, 1, CUES.Resultado - 0.3, CUES.Resultado + 0.6)(T);
    const solvedOct = MOTION.glide(0, 1, CUES.InternoOito - 0.2, CUES.InternoOito + 0.6)(T);
    const solvedHex = MOTION.glide(0, 1, CUES.InternoSeis - 0.2, CUES.InternoSeis + 0.6)(T);
    const plain = mix(GRAY, INK, 0.28);
    const cOct = mix(INK, cy, clamp(hlOct + solvedOct * 0.5, 0, 1));
    const cHex = mix(INK, cy, clamp(hlHex + solvedHex * 0.5, 0, 1));
    const cX = mix(mix(INK, cy, clamp(hlVolta, 0, 1)), or, fin);
    const lOct = U(V, 118, 167);
    const lHex = U(V, 112, 295);
    const lX = U(V, 108, 27);
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: "40 40 600 600",
      style: {
        position: 'absolute',
        right: 70,
        top: 300,
        width: 600,
        height: 600,
        overflow: 'visible'
      }
    }, /*#__PURE__*/React.createElement("polygon", {
      points: oct.map(p => p.join(',')).join(' '),
      fill: cy,
      opacity: hlOct * 0.14
    }), /*#__PURE__*/React.createElement("polygon", {
      points: hex.map(p => p.join(',')).join(' '),
      fill: cy,
      opacity: hlHex * 0.14
    }), /*#__PURE__*/React.createElement("polygon", {
      points: oct.map(p => p.join(',')).join(' '),
      fill: "none",
      stroke: mix(plain, cy, hlOct),
      strokeWidth: "2.8",
      strokeLinejoin: "round",
      strokeDasharray: "1400",
      strokeDashoffset: 1400 * (1 - drawn)
    }), /*#__PURE__*/React.createElement("polygon", {
      points: hex.map(p => p.join(',')).join(' '),
      fill: "none",
      stroke: mix(plain, cy, hlHex),
      strokeWidth: "2.8",
      strokeLinejoin: "round",
      strokeDasharray: "1400",
      strokeDashoffset: 1400 * (1 - drawn)
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(V, 62, 100, 235),
      fill: "none",
      stroke: cOct,
      strokeWidth: "2.8",
      opacity: drawn
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(V, 52, 235, 355),
      fill: "none",
      stroke: cHex,
      strokeWidth: "2.8",
      opacity: drawn
    }), /*#__PURE__*/React.createElement("path", {
      d: arcPath(V, 72, 355, 100),
      fill: "none",
      stroke: cX,
      strokeWidth: 2.8 + 1.8 * clamp(hlVolta + fin, 0, 1),
      opacity: drawn
    }), /*#__PURE__*/React.createElement("circle", {
      cx: V[0],
      cy: V[1],
      r: "6",
      fill: cX,
      opacity: drawn
    }), /*#__PURE__*/React.createElement("g", {
      fontFamily: "'STIX Two Text', Georgia, serif",
      fontSize: "30",
      textAnchor: "middle"
    }, /*#__PURE__*/React.createElement("text", {
      x: lOct[0],
      y: lOct[1] + 8,
      fill: cOct,
      opacity: drawn * solvedOct
    }, "135\xB0"), /*#__PURE__*/React.createElement("text", {
      x: lHex[0],
      y: lHex[1] + 8,
      fill: cHex,
      opacity: drawn * solvedHex
    }, "120\xB0"), /*#__PURE__*/React.createElement("text", {
      x: lX[0] + 6,
      y: lX[1] + 8,
      fill: cX,
      fontSize: 30 + 10 * clamp(fin, 0, 1),
      opacity: drawn,
      fontStyle: fin > 0.5 ? 'normal' : 'italic'
    }, fin > 0.5 ? '105°' : 'x')));
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
        width: 1120,
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
    }, "QUEST\xC3O 1"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 30,
        color: GRAY,
        marginTop: 14,
        width: 1780,
        lineHeight: 1.4
      }
    }, "Determine o valor de x, sabendo que os pol\xEDgonos representados s\xE3o regulares.")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 70,
        top: 216,
        width: 1780,
        height: 2,
        background: '#333333'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 250,
        width: 1220,
        bottom: 40,
        overflow: 'hidden'
      }
    }, STEPS.map((s, i) => /*#__PURE__*/React.createElement(Row, {
      key: i,
      step: s,
      i: i,
      k: k,
      y: ACTIVE_Y - 250 + ctr[i] - base,
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
  window.Questoes["cap11-q01"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "Identificar",
      "dur": 5.5,
      "desc": "As duas figuras se desenham: um octógono e um hexágono regulares unidos por um vértice"
    }, {
      "name": "SomaOito",
      "dur": 5,
      "desc": "A soma dos ângulos internos do octógono dá 1080 graus"
    }, {
      "name": "InternoOito",
      "dur": 5,
      "desc": "Dividindo por 8, cada ângulo do octógono mede 135 graus"
    }, {
      "name": "SomaSeis",
      "dur": 5,
      "desc": "A soma dos ângulos internos do hexágono dá 720 graus"
    }, {
      "name": "InternoSeis",
      "dur": 4.5,
      "desc": "Dividindo por 6, cada ângulo do hexágono mede 120 graus"
    }, {
      "name": "Volta",
      "dur": 5.5,
      "desc": "Os três ângulos ao redor do vértice fecham 360 graus"
    }, {
      "name": "Isolar",
      "dur": 5,
      "desc": "Isolando x: 360 menos 255"
    }, {
      "name": "Resultado",
      "dur": 5.5,
      "desc": "O valor de x, 105 graus, fecha em laranja na figura"
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
