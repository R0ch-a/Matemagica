/* ============================================================
   Capitulo 12 · Questao 3 · f — resolucao animada
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
  const fr = (n, d, c, ni, di) => ({
    k: 'f',
    n,
    d,
    c: c || 'n',
    ni: !!ni,
    di: !!di
  });
  const pw = (b, e, c, bi) => ({
    k: 'p',
    b,
    e,
    c: c || 'n',
    bi: !!bi
  });
  const sq = (inner, c) => ({
    k: 's',
    inner,
    c: c || 'n'
  });
  const cs = (l1, l2, c) => ({
    k: 'c',
    l1,
    l2,
    c: c || 'n'
  });
  const ff = (n1, d1, n2, d2, c) => ({
    k: 'x',
    n1,
    d1,
    n2,
    d2,
    c: c || 'n'
  });
  const STEPS = [{
    label: 'a proporção dada',
    note: '',
    tall: true,
    toks: [ff('x − 2', '3', 'x − 1', '2', 'm'), rm('  =  ', 'r'), fr('1', '2', 'm')]
  }, {
    label: 'dividir é multiplicar pelo inverso',
    note: 'inverte a de baixo',
    tall: true,
    toks: [fr('x − 2', '3', 'r'), rm('  ·  ', 'm'), fr('2', 'x − 1', 'm'), rm('  =  ', 'r'), fr('1', '2', 'r')]
  }, {
    label: 'multiplicar as frações',
    note: '',
    tall: true,
    toks: [fr('2x − 4', '3x − 3', 'm'), rm('  =  ', 'r'), fr('1', '2', 'r')]
  }, {
    label: 'produto dos extremos = produto dos meios',
    note: '',
    tall: true,
    toks: [rm('2 · (2', 'm'), it('x', 'm'), rm(' − 4)  =  1 · (3', 'm'), it('x', 'm'), rm(' − 3)', 'm')]
  }, {
    label: 'distribuir',
    note: '',
    tall: true,
    toks: [rm('4', 'm'), it('x', 'm'), rm(' − 8  =  3', 'm'), it('x', 'm'), rm(' − 3', 'm')]
  }, {
    label: 'juntar os termos',
    note: 'trocando de membro',
    tall: true,
    toks: [rm('4', 'r'), it('x', 'r'), rm(' − 3', 'm'), it('x', 'm'), rm('  =  −3 + 8', 'm')]
  }, {
    label: 'resultado',
    note: '',
    tall: true,
    toks: [rm('∴  ', 'o'), it('x', 'o'), rm('  =  5', 'o')]
  }];
  const CUE_NAMES = ['Proporcao', 'Inverso', 'Multiplicar', 'Propriedade', 'Distribuir', 'Juntar', 'Resultado'];
  const ACTIVE_Y = 660;
  const NAT_H = i => STEPS[i].label.length > 20 ? 200 : 178;
  function Tok({
    tok,
    col
  }) {
    if (tok.k === 't') {
      return /*#__PURE__*/React.createElement("span", {
        style: {
          color: col(tok.c),
          whiteSpace: 'pre',
          fontStyle: tok.i ? 'italic' : 'normal',
          flexShrink: 0
        }
      }, tok.s);
    }
    if (tok.k === 'p') {
      const c = col(tok.c);
      return /*#__PURE__*/React.createElement("span", {
        style: {
          color: c,
          whiteSpace: 'pre',
          flexShrink: 0
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontStyle: tok.bi ? 'italic' : 'normal'
        }
      }, tok.b), /*#__PURE__*/React.createElement("sup", {
        style: {
          fontSize: '0.55em',
          verticalAlign: 'super'
        }
      }, tok.e));
    }
    if (tok.k === 'f') {
      const c = col(tok.c);
      return /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '0 12px',
          flexShrink: 0,
          color: c
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          padding: '0 8px',
          lineHeight: 1.12,
          whiteSpace: 'nowrap',
          fontStyle: tok.ni ? 'italic' : 'normal'
        }
      }, tok.n), /*#__PURE__*/React.createElement("span", {
        style: {
          height: 3,
          background: c,
          alignSelf: 'stretch',
          margin: '9px 0',
          borderRadius: 2
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          padding: '0 8px',
          lineHeight: 1.12,
          whiteSpace: 'nowrap',
          fontStyle: tok.di ? 'italic' : 'normal'
        }
      }, tok.d));
    }
    if (tok.k === 'x') {
      const c = col(tok.c);
      const inner = (n, d) => /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontSize: '0.78em',
          padding: '4px 10px'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          lineHeight: 1.1,
          whiteSpace: 'nowrap'
        }
      }, n), /*#__PURE__*/React.createElement("span", {
        style: {
          height: 2,
          background: c,
          alignSelf: 'stretch',
          margin: '6px 0',
          borderRadius: 2
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          lineHeight: 1.1,
          whiteSpace: 'nowrap'
        }
      }, d));
      return /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '0 14px',
          flexShrink: 0,
          color: c
        }
      }, inner(tok.n1, tok.d1), /*#__PURE__*/React.createElement("span", {
        style: {
          height: 3,
          background: c,
          alignSelf: 'stretch',
          margin: '8px 0',
          borderRadius: 2
        }
      }), inner(tok.n2, tok.d2));
    }
    if (tok.k === 'c') {
      const c = col(tok.c);
      return /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          color: c,
          flexShrink: 0,
          margin: '0 4px'
        }
      }, /*#__PURE__*/React.createElement("svg", {
        viewBox: "0 0 24 100",
        preserveAspectRatio: "none",
        style: {
          width: '0.42em',
          height: '2.1em',
          flexShrink: 0,
          display: 'block',
          marginRight: 16
        }
      }, /*#__PURE__*/React.createElement("path", {
        d: "M20,2 C11,2 12,12 12,26 C12,42 8,48 2,50 C8,52 12,58 12,74 C12,88 11,98 20,98",
        fill: "none",
        stroke: c,
        strokeWidth: "3",
        strokeLinecap: "round",
        vectorEffect: "non-scaling-stroke"
      })), /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          flexDirection: 'column',
          gap: 16,
          whiteSpace: 'nowrap'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          alignItems: 'center'
        }
      }, tok.l1.map((x, i) => /*#__PURE__*/React.createElement(Tok, {
        key: i,
        tok: x,
        col: col
      }))), /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          alignItems: 'center'
        }
      }, tok.l2.map((x, i) => /*#__PURE__*/React.createElement(Tok, {
        key: i,
        tok: x,
        col: col
      })))));
    }
    const c = col(tok.c);
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'flex-start',
        margin: '0 8px',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 36 100",
      preserveAspectRatio: "none",
      style: {
        width: '0.52em',
        height: '1.5em',
        flexShrink: 0,
        display: 'block',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("path", {
      d: "M2,62 L11,55 L20,95 L33,4 L36,4",
      fill: "none",
      stroke: c,
      strokeWidth: "4",
      strokeLinejoin: "miter",
      strokeLinecap: "butt",
      vectorEffect: "non-scaling-stroke"
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        borderTop: `3px solid ${c}`,
        paddingTop: 8,
        paddingLeft: 6,
        paddingRight: 4,
        display: 'inline-flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        flexShrink: 0
      }
    }, tok.inner.map((x, i) => /*#__PURE__*/React.createElement(Tok, {
      key: i,
      tok: x,
      col: col
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
    const op = d < 0 ? clamp(1 + d * 1.7, 0, 1) : clamp((3.9 - d) / 0.8, 0, 1) * (1 - 0.2 * clamp(d, 0, 1));
    const scale = 1 - 0.46 * clamp(d, 0, 1);
    const size = 50;
    const active = clamp(1 - Math.abs(d) * 1.4, 0, 1);
    const col = role => {
      if (role === 'o') return or;
      if (role === 'r') return GRAY;
      return mix(role === 'm' ? cy : INK, GRAY, age);
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 60,
        top: y,
        width: 1400,
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
        opacity: op,
        transform: `translateY(-50%) scale(${scale})`,
        transformOrigin: '0 50%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 420,
        textAlign: 'right',
        paddingRight: 40,
        fontFamily: "'Caveat', cursive",
        fontSize: 58,
        color: mix('#ffffff', DIM, 1 - active),
        flexShrink: 0,
        lineHeight: 1.02
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
        fontSize: 24,
        color: GRAY,
        opacity: active,
        whiteSpace: 'pre-line',
        maxWidth: 210,
        lineHeight: 1.35,
        flexShrink: 0
      }
    }, step.note) : null);
  }
  function Pinned({
    T,
    CUES,
    cy,
    or
  }) {
    const inP = MOTION.enter(0, 1, 0.4, 1.6)(T);
    const hlProp = MOTION.glide(0, 1, CUES.Propriedade - 0.5, CUES.Propriedade + 0.4)(T) * (1 - MOTION.glide(0, 1, CUES.Distribuir - 0.4, CUES.Distribuir + 0.4)(T));
    const ver = MOTION.enter(0, 1, CUES.Resultado + 0.5, CUES.Resultado + 1.4)(T);
    const fin = MOTION.glide(0, 1, CUES.Resultado - 0.3, CUES.Resultado + 0.6)(T);
    const cr = mix(GRAY, cy, clamp(hlProp, 0, 1));
    const frac = (n, d, col, size) => /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '0 8px',
        color: col,
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: size
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        lineHeight: 1.1,
        padding: '0 6px',
        whiteSpace: 'nowrap'
      }
    }, n), /*#__PURE__*/React.createElement("span", {
      style: {
        height: 2,
        background: col,
        alignSelf: 'stretch',
        margin: '6px 0',
        borderRadius: 2
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        lineHeight: 1.1,
        padding: '0 6px',
        whiteSpace: 'nowrap'
      }
    }, d));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 110,
        top: 380,
        width: 380,
        opacity: inP,
        display: 'flex',
        flexDirection: 'column',
        gap: 44
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 21,
        color: GRAY,
        letterSpacing: '0.11em'
      }
    }, "PROPRIEDADE FUNDAMENTAL"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 38,
        color: cr,
        fontStyle: 'italic'
      }
    }, frac('a', 'b', cr, 38), /*#__PURE__*/React.createElement("span", {
      style: {
        fontStyle: 'normal'
      }
    }, ' = '), frac('c', 'd', cr, 38), /*#__PURE__*/React.createElement("span", {
      style: {
        fontStyle: 'normal',
        margin: '0 12px'
      }
    }, "\u2194"), /*#__PURE__*/React.createElement("span", null, 'a · d = b · c'))), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        background: '#333333'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        opacity: ver
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 21,
        color: GRAY,
        letterSpacing: '0.11em'
      }
    }, "VERIFICA\xC7\xC3O COM x = 5"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 34,
        color: GRAY
      }
    }, frac('5 − 2', '3', GRAY, 34), /*#__PURE__*/React.createElement("span", null, ' = 1'), /*#__PURE__*/React.createElement("span", {
      style: {
        margin: '0 22px'
      }
    }, ' '), frac('5 − 1', '2', GRAY, 34), /*#__PURE__*/React.createElement("span", null, ' = 2')), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 34,
        color: mix(GRAY, or, fin)
      }
    }, frac('1', '2', mix(GRAY, or, fin), 34), /*#__PURE__*/React.createElement("span", null, ' = '), frac('1', '2', mix(GRAY, or, fin), 34))));
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
    }, "QUEST\xC3O 3 \xB7 f"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 31,
        color: GRAY,
        marginTop: 14,
        maxWidth: 1500,
        lineHeight: 1.35
      }
    }, "Calcule o valor de x na propor\xE7\xE3o [(x \u2212 2)/3] / [(x \u2212 1)/2] = 1/2.")), /*#__PURE__*/React.createElement("div", {
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
        top: 256,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
      }
    }, STEPS.map((s, i) => /*#__PURE__*/React.createElement(Row, {
      key: i,
      step: s,
      i: i,
      k: k,
      y: ACTIVE_Y - 256 + ctr[i] - base,
      cy: cy,
      or: or
    }))), /*#__PURE__*/React.createElement(Pinned, {
      T: T,
      CUES: CUES,
      cy: cy,
      or: or
    })), tw.legenda ? /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 96,
        bottom: 58,
        display: 'flex',
        gap: 40,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 19,
        color: GRAY,
        alignItems: 'center'
      }
    }, [[cy, 'modificado nesta etapa'], [GRAY, 'repetido da etapa anterior'], [or, 'resultado final']].map(([c, l]) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        display: 'flex',
        gap: 12,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 15,
        height: 15,
        borderRadius: 8,
        background: c,
        display: 'block'
      }
    }), /*#__PURE__*/React.createElement("span", null, l)))) : null);
  }
  window.Questoes = window.Questoes || {};
  window.Questoes["cap12-q03f"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "Proporcao",
      "dur": 6.5,
      "desc": "A proporcao dada: x menos 2 sobre 3, dividido por x menos 1 sobre 2, igual a um meio"
    }, {
      "name": "Inverso",
      "dur": 6.5,
      "desc": "Dividir e multiplicar pelo inverso: inverte a fracao de baixo"
    }, {
      "name": "Multiplicar",
      "dur": 6,
      "desc": "Multiplicando as fracoes: 2x menos 4 sobre 3x menos 3"
    }, {
      "name": "Propriedade",
      "dur": 6.5,
      "desc": "Propriedade fundamental: produto dos extremos igual ao produto dos meios"
    }, {
      "name": "Distribuir",
      "dur": 6,
      "desc": "Distribuindo: 4x menos 8 igual 3x menos 3"
    }, {
      "name": "Juntar",
      "dur": 6,
      "desc": "Juntando os termos: 4x menos 3x igual menos 3 mais 8"
    }, {
      "name": "Resultado",
      "dur": 6.5,
      "desc": "Resultado: x igual a 5, com a verificacao ao lado"
    }],
    playback: {
      "mode": "loop"
    },
    tweaks: {
      "corModificado": "#2dd4bf",
      "corResultado": "#f9a03c",
      "legenda": false
    }
  };
})();
