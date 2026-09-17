/* ============================================================
   Capitulo 9 · Questao 12 · c — resolucao animada
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

  /* tokens */
  const rm = (s, c) => ({
    k: 't',
    s,
    c: c || 'n'
  });
  const st = (s, c) => ({
    k: 't',
    s,
    c: c || 'n',
    x: true
  });
  const fr = (n, d, c) => ({
    k: 'f',
    n,
    d,
    c: c || 'n'
  });
  const bx = (s, c) => ({
    k: 'b',
    s,
    c: c || 'm'
  });
  const sys = (lines, opt) => Object.assign({
    k: 's',
    lines
  }, opt || {});
  const STEPS = [{
    label: 'montar o sistema',
    h: 320,
    toks: [sys([{
      toks: [rm('5a + c = 200', 'm')]
    }, {
      toks: [rm('3a + 4c = 239', 'm')]
    }], {
      ann: ['salgados', 'doces']
    })]
  }, {
    label: 'multiplicar a 1ª linha por (−4)',
    note: 'cancela\nos c',
    h: 300,
    toks: [sys([{
      toks: [rm('5a + c = 200', 'm')]
    }, {
      toks: [rm('3a + 4c = 239', 'r')]
    }], {
      ann: ['× (−4)', '']
    })]
  }, {
    label: 'linha reescrita',
    note: '200·(−4)\n= −800',
    h: 300,
    toks: [sys([{
      toks: [rm('−20a − 4c = −800', 'm')]
    }, {
      toks: [rm('  3a + 4c = 239', 'r')]
    }])]
  }, {
    label: 'somar membro a membro',
    h: 420,
    toks: [sys([{
      toks: [rm('−20a ', 'r'), st('− 4c', 'm'), rm(' = −800', 'r')]
    }, {
      toks: [rm('   3a ', 'r'), st('+ 4c', 'm'), rm(' = 239', 'r')]
    }], {
      plus: true,
      sum: [rm('−17a = −561', 'm')]
    })]
  }, {
    label: 'dividir os dois membros por (−17)',
    h: 280,
    toks: [fr('−17a', '−17', 'r'), rm(' = ', 'r'), fr('−561', '−17', 'r'), rm('   →   ', 'r'), bx('a = 33', 'm')]
  }, {
    label: 'voltar na equação dos salgados',
    note: '5 · 33 = 165',
    h: 150,
    toks: [rm('5 · ', 'r'), rm('33', 'm'), rm(' + c = 200', 'r')]
  }, {
    label: 'isolar c',
    note: '200 − 165',
    h: 220,
    toks: [bx('c = 35', 'm')]
  }, {
    label: 'conferindo os doces',
    note: '99 + 140',
    h: 150,
    toks: [rm('3 · 33 + 4 · 35 = 239', 'r')]
  }, {
    label: 'total de pessoas',
    h: 210,
    toks: [rm('∴  33 + 35 = 68 pessoas', 'o')]
  }];
  const CUE_NAMES = ['Sistema', 'Multiplicar', 'Reescrever', 'Somar', 'DividirA', 'Voltar', 'ValorC', 'Conferir', 'Total'];
  const ACTIVE_Y = 660;
  const NAT_H = i => STEPS[i].h || 150;
  function Tok({
    tok,
    col
  }) {
    const c = col(tok.c);
    if (tok.k === 't') {
      if (tok.x) {
        return /*#__PURE__*/React.createElement("span", {
          style: {
            position: 'relative',
            color: c,
            whiteSpace: 'pre',
            flexShrink: 0
          }
        }, tok.s, /*#__PURE__*/React.createElement("span", {
          style: {
            position: 'absolute',
            left: '-8%',
            right: '-8%',
            top: '52%',
            height: 4,
            background: c,
            borderRadius: 2,
            transform: 'rotate(-13deg)'
          }
        }));
      }
      return /*#__PURE__*/React.createElement("span", {
        style: {
          color: c,
          whiteSpace: 'pre',
          fontStyle: tok.i ? 'italic' : 'normal',
          flexShrink: 0
        }
      }, tok.s);
    }
    if (tok.k === 'f') {
      return /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '0 10px',
          flexShrink: 0,
          color: c
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          padding: '0 8px',
          lineHeight: 1.12,
          whiteSpace: 'nowrap'
        }
      }, tok.n), /*#__PURE__*/React.createElement("span", {
        style: {
          height: 3,
          background: c,
          alignSelf: 'stretch',
          margin: '8px 0',
          borderRadius: 2
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          padding: '0 8px',
          lineHeight: 1.12,
          whiteSpace: 'nowrap'
        }
      }, tok.d));
    }
    if (tok.k === 'b') {
      return /*#__PURE__*/React.createElement("span", {
        style: {
          color: c,
          border: `2px solid ${c}`,
          background: mix(BG, c, 0.16),
          borderRadius: 8,
          padding: '10px 26px',
          whiteSpace: 'pre',
          flexShrink: 0,
          lineHeight: 1.1
        }
      }, tok.s);
    }
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        flexDirection: 'column',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 52,
        color: col('m'),
        opacity: tok.plus ? 1 : 0,
        flexShrink: 0
      }
    }, "+"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '1.1em',
        lineHeight: 0.9,
        transform: 'scaleY(2.7)',
        transformOrigin: '50% 50%',
        marginRight: 24,
        color: col('r'),
        flexShrink: 0
      }
    }, '{'), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        flexDirection: 'column',
        gap: 18
      }
    }, tok.lines.map((ln, i) => /*#__PURE__*/React.createElement("span", {
      key: i,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        whiteSpace: 'nowrap'
      }
    }, ln.toks.map((t2, j) => /*#__PURE__*/React.createElement(Tok, {
      key: j,
      tok: t2,
      col: col
    })), tok.ann && tok.ann[i] ? /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 44,
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: '0.62em',
        color: col('m'),
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 70,
        height: 3,
        background: col('m'),
        borderRadius: 2,
        display: 'block'
      }
    }), tok.ann[i]) : null)))), tok.sum ? /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        flexDirection: 'column',
        marginTop: 20
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        height: 3,
        background: col('r'),
        borderRadius: 2,
        width: 560
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        marginTop: 20,
        marginLeft: 128,
        whiteSpace: 'nowrap'
      }
    }, tok.sum.map((t2, j) => /*#__PURE__*/React.createElement(Tok, {
      key: j,
      tok: t2,
      col: col
    })))) : null);
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
    const op = d < 0 ? clamp(1 + d * 1.7, 0, 1) : clamp((3.2 - d) / 0.8, 0, 1) * (1 - 0.2 * clamp(d, 0, 1));
    const scale = 1 - 0.46 * clamp(d, 0, 1);
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
        width: 1840,
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
        opacity: op,
        transform: `translateY(-50%) scale(${scale})`,
        transformOrigin: '0 50%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 470,
        textAlign: 'right',
        paddingRight: 44,
        fontFamily: "'Caveat', cursive",
        fontSize: 66,
        color: mix('#ffffff', DIM, 1 - active),
        flexShrink: 0,
        lineHeight: 1
      }
    }, step.label), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 54,
        lineHeight: 1.05
      }
    }, step.toks.map((tk, j) => /*#__PURE__*/React.createElement(Tok, {
      key: j,
      tok: tk,
      col: col
    }))), step.note ? /*#__PURE__*/React.createElement("div", {
      style: {
        marginLeft: 48,
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 26,
        color: GRAY,
        opacity: active,
        whiteSpace: 'pre-line',
        maxWidth: 200,
        lineHeight: 1.4,
        flexShrink: 0
      }
    }, step.note) : null);
  }
  function Painel({
    T,
    CUES,
    cy,
    or
  }) {
    const inP = MOTION.enter(0, 1, 0.4, 1.6)(T);
    const solvedA = MOTION.glide(0, 1, CUES.DividirA - 0.2, CUES.DividirA + 0.7)(T);
    const solvedC = MOTION.glide(0, 1, CUES.ValorC - 0.2, CUES.ValorC + 0.7)(T);
    const fin = MOTION.glide(0, 1, CUES.Total - 0.3, CUES.Total + 0.6)(T);
    const cA = mix(mix(INK, cy, solvedA * 0.9), or, fin);
    const cC = mix(mix(INK, cy, solvedC * 0.9), or, fin);
    const linha = (nome, consumo, valor, cor) => /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 23,
        color: GRAY,
        letterSpacing: '0.06em'
      }
    }, nome), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 58,
        color: cor,
        lineHeight: 1
      }
    }, valor), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 23,
        color: mix(DIM, GRAY, 0.85),
        lineHeight: 1.45
      }
    }, consumo));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 96,
        top: 300,
        width: 400,
        opacity: inP,
        transform: `translateY(${20 * (1 - inP)}px)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 34
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 21,
        color: mix(DIM, GRAY, 0.9),
        letterSpacing: '0.12em'
      }
    }, "CADA PESSOA COME"), linha('ADULTOS (a)', '5 salgados · 3 doces', solvedA > 0.5 ? '33' : 'a', cA), linha('CRIANÇAS (c)', '1 salgado · 4 doces', solvedC > 0.5 ? '35' : 'c', cC), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        background: '#333333'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 25,
        color: GRAY,
        lineHeight: 1.5
      }
    }, "200 salgados", /*#__PURE__*/React.createElement("br", null), "239 doces"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 23,
        color: GRAY,
        letterSpacing: '0.06em'
      }
    }, "PESSOAS"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 58,
        color: mix(mix(DIM, INK, 0.4), or, fin)
      }
    }, fin > 0.4 ? '68' : '?')));
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
    const sh = j => NAT_H(j) * (1 - 0.46 * clamp(k - j, 0, 1));
    const ctr = [0];
    for (let i = 1; i < STEPS.length; i++) ctr[i] = ctr[i - 1] + (sh(i - 1) + sh(i)) / 2;
    const kf = clamp(Math.floor(k), 0, STEPS.length - 1);
    const frac = clamp(k - kf, 0, 1);
    const base = ctr[kf] + frac * ((ctr[Math.min(kf + 1, STEPS.length - 1)] || 0) - ctr[kf]);
    const camera = 1 + 0.02 * clamp(T / Math.max(authoredTotal, 1), 0, 1);
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
        transformOrigin: '50% 62%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 96,
        top: 92,
        width: 1400,
        opacity: headOp
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 20,
        color: cy,
        letterSpacing: '0.14em'
      }
    }, "QUEST\xC3O 12 \xB7 c"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 31,
        color: GRAY,
        marginTop: 14,
        lineHeight: 1.35
      }
    }, "Para uma festa, foram encomendados 200 salgados e 239 doces. Cada adulto comeria 5 salgados e 3 doces, enquanto cada crian\xE7a comeria 1 salgado e 4 doces. Quantas pessoas foram \xE0 festa?")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 96,
        top: 214,
        width: 1728,
        height: 2,
        background: '#333333'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 244,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
      }
    }, STEPS.map((s, i) => /*#__PURE__*/React.createElement(Row, {
      key: i,
      step: s,
      i: i,
      k: k,
      y: ACTIVE_Y - 244 + ctr[i] - base,
      cy: cy,
      or: or
    }))), /*#__PURE__*/React.createElement(Painel, {
      T: T,
      CUES: CUES,
      cy: cy,
      or: or
    })));
  }
  window.Questoes = window.Questoes || {};
  window.Questoes["cap09-q12c"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "Sistema",
      "dur": 6.5,
      "desc": "O sistema aparece: 5a mais c igual 200 salgados e 3a mais 4c igual 239 doces"
    }, {
      "name": "Multiplicar",
      "dur": 6,
      "desc": "A primeira linha inteira e multiplicada por menos 4"
    }, {
      "name": "Reescrever",
      "dur": 5,
      "desc": "A linha reescrita: menos 20a menos 4c igual menos 800"
    }, {
      "name": "Somar",
      "dur": 7,
      "desc": "Somando membro a membro, os termos em c se cancelam e sobra menos 17a igual menos 561"
    }, {
      "name": "DividirA",
      "dur": 5.5,
      "desc": "Dividindo por menos 17: a igual a 33 adultos"
    }, {
      "name": "Voltar",
      "dur": 5,
      "desc": "Voltando na equacao dos salgados: 5 vezes 33 mais c igual 200"
    }, {
      "name": "ValorC",
      "dur": 5,
      "desc": "c igual a 35 criancas"
    }, {
      "name": "Conferir",
      "dur": 5,
      "desc": "Conferindo os doces: 99 mais 140 igual 239"
    }, {
      "name": "Total",
      "dur": 6,
      "desc": "Total de pessoas: 33 mais 35 igual 68"
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
