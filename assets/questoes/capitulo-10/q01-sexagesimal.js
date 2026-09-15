/* ============================================================
   Capitulo 10 · Questao 1 — resolucao animada
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
  const STEPS = [{
    label: 'multiplicar por 5',
    note: 'cada parte × 5',
    tall: true,
    tag: 'A',
    toks: [rm('(14° 15\' 32") · 5 = ', 'r'), rm('70° 75\' 160"', 'm')]
  }, {
    label: 'converter segundos',
    note: '160" = 2\' 40"',
    tag: 'A',
    toks: [rm('70° ', 'r'), rm('77\' 40"', 'm')]
  }, {
    label: 'converter minutos',
    note: "77' = 1° 17'",
    tag: 'A',
    toks: [rm('71° 17\' 40"', 'm')]
  }, {
    label: 'somar 4° 29"',
    note: '29" + 40" = 1\' 9"',
    tall: true,
    tag: 'A',
    toks: [rm('4° 00\' 29" + 71° 17\' 40" = ', 'r'), rm('75° 18\' 9"', 'm')]
  }, {
    label: 'dividir por 3',
    note: '32 ÷ 3 = 10, resto 2°\n2° = 120\'',
    tall: true,
    tag: 'B',
    toks: [rm('(32° 17\' 33") : 3 = ', 'r'), rm('10° 45\' 51"', 'm')]
  }, {
    label: 'subtrair 7° 52"',
    note: '51" < 52": pega 1\'\n1\' = 60"',
    tall: true,
    tag: 'B',
    toks: [rm('10° 44\' 111" − 7° 00\' 52" = ', 'r'), rm('3° 44\' 59"', 'm')]
  }, {
    label: 'montar A − B',
    tall: true,
    tag: 'A − B',
    toks: [rm('75° 18\' 9" − 3° 44\' 59"', 'm')]
  }, {
    label: 'emprestar 1\' e 1°',
    note: '9" → 69"\n17\' → 77\'',
    tall: true,
    tag: 'A − B',
    toks: [rm('74° 77\' 69" − 3° 44\' 59"', 'm')]
  }, {
    label: 'subtrair cada parte',
    note: '',
    tag: 'A − B',
    toks: [rm('71° 33\' 10"', 'm')]
  }, {
    label: 'resultado',
    tall: true,
    tag: 'A − B',
    toks: [rm('∴  A − B = 71° 33\' 10"', 'o')]
  }];
  const CUE_NAMES = ['Multiplicar', 'Segundos', 'Minutos', 'SomarA', 'DividirB', 'SubtrairB', 'Montar', 'Emprestar', 'Subtrair', 'Resultado'];
  const ACTIVE_Y = 700;
  const NAT_H = i => STEPS[i].tall ? 200 : 132;
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
    const op = d < 0 ? clamp(1 + d * 1.7, 0, 1) : clamp((3.6 - d) / 0.8, 0, 1) * (1 - 0.2 * clamp(d, 0, 1));
    const scale = 1 - 0.44 * clamp(d, 0, 1);
    const size = step.tall ? 50 : 56;
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
        width: 1790,
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
        opacity: op,
        transform: `translateY(-50%) scale(${scale})`,
        transformOrigin: '0 50%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 110,
        textAlign: 'right',
        paddingRight: 26,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 26,
        color: mix(GRAY, DIM, 1 - active),
        flexShrink: 0
      }
    }, step.tag), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 380,
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
    }, step.toks.map((tk, j) => /*#__PURE__*/React.createElement("span", {
      key: j,
      style: {
        color: col(tk.c),
        whiteSpace: 'pre',
        flexShrink: 0
      }
    }, tk.s))), step.note ? /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: 38,
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 26,
        color: GRAY,
        opacity: active,
        whiteSpace: 'pre-line',
        maxWidth: 250,
        lineHeight: 1.35,
        flexShrink: 0
      }
    }, step.note) : null);
  }
  function Pinned({
    T,
    CUES
  }) {
    const items = [{
      label: 'A',
      text: '75° 18\' 9"',
      in: CUES.SomarA + 0.8,
      out: CUES.Montar - 0.3
    }, {
      label: 'B',
      text: '3° 44\' 59"',
      in: CUES.SubtrairB + 0.8,
      out: CUES.Montar - 0.3
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 100,
        top: 300,
        width: 380,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 30
      }
    }, items.map((item, i) => {
      const op = MOTION.enter(0, 1, item.in, item.in + 0.7)(T) * (1 - MOTION.glide(0, 1, item.out, item.out + 0.6)(T));
      const dy = MOTION.pop(28, 0, item.in, item.in + 0.9)(T);
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          opacity: op,
          transform: `translateY(${dy}px)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: 36,
          color: '#ffffff',
          lineHeight: 1
        }
      }, item.label), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: 42,
          color: GRAY,
          marginTop: 8
        }
      }, item.text));
    }));
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
        width: 1740,
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
        fontSize: 31,
        color: GRAY,
        marginTop: 14,
        maxWidth: 1500,
        lineHeight: 1.35
      }
    }, "Sendo A = 4\xB0 29\" + (14\xB0 15' 32\") \xB7 5 e B = (32\xB0 17' 33\") : 3 \u2212 7\xB0 52\", calcule A \u2212 B.")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 80,
        top: 212,
        width: 1740,
        height: 2,
        background: '#333333'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 240,
        right: 0,
        bottom: 60,
        overflow: 'hidden'
      }
    }, STEPS.map((s, i) => /*#__PURE__*/React.createElement(Row, {
      key: i,
      step: s,
      i: i,
      k: k,
      y: ACTIVE_Y - 240 + ctr[i] - base,
      cy: cy,
      or: or
    }))), /*#__PURE__*/React.createElement(Pinned, {
      T: T,
      CUES: CUES
    })));
  }
  window.Questoes = window.Questoes || {};
  window.Questoes["cap10-q01"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "Multiplicar",
      "dur": 5.5,
      "desc": "Cada parte do ângulo é multiplicada por 5"
    }, {
      "name": "Segundos",
      "dur": 4.5,
      "desc": "Os 160 segundos viram 2 minutos e 40 segundos"
    }, {
      "name": "Minutos",
      "dur": 4.5,
      "desc": "Os 77 minutos viram 1 grau e 17 minutos"
    }, {
      "name": "SomarA",
      "dur": 5.5,
      "desc": "Somando 4 graus e 29 segundos chega-se ao valor de A"
    }, {
      "name": "DividirB",
      "dur": 6,
      "desc": "A divisão por 3 é feita parte por parte, passando os restos adiante"
    }, {
      "name": "SubtrairB",
      "dur": 6,
      "desc": "Subtraindo 7 graus e 52 segundos, com empréstimo de 1 minuto"
    }, {
      "name": "Montar",
      "dur": 5,
      "desc": "A subtração A menos B é montada"
    }, {
      "name": "Emprestar",
      "dur": 5.5,
      "desc": "Empréstimos de 1 minuto e 1 grau preparam a subtração"
    }, {
      "name": "Subtrair",
      "dur": 5,
      "desc": "Cada parte é subtraída: 71 graus 33 minutos 10 segundos"
    }, {
      "name": "Resultado",
      "dur": 5.5,
      "desc": "O resultado fecha em laranja"
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
