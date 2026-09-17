/* ============================================================
   Capitulo 12 · Questao 1 — resolucao animada
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
  const STEPS = [{
    label: 'o antecedente',
    note: 'mmc(3, 4) = 12',
    tall: true,
    toks: [fr('2', '3', 'r'), rm(' + ', 'r'), fr('3', '4', 'r'), rm(' = ', 'r'), fr('8', '12', 'm'), rm(' + ', 'r'), fr('9', '12', 'm')]
  }, {
    label: 'somar',
    note: '8 + 9 = 17',
    tall: true,
    toks: [rm('antecedente = ', 'r'), fr('17', '12', 'm')]
  }, {
    label: 'o consequente',
    note: 'o mesmo mmc',
    tall: true,
    toks: [fr('2', '3', 'r'), rm(' − ', 'r'), fr('3', '4', 'r'), rm(' = ', 'r'), fr('8', '12', 'm'), rm(' − ', 'r'), fr('9', '12', 'm')]
  }, {
    label: 'subtrair',
    note: '8 − 9 = −1',
    tall: true,
    toks: [rm('consequente = ', 'r'), fr('−1', '12', 'm')]
  }, {
    label: 'montar a razão',
    note: 'antecedente\nsobre consequente',
    tall: true,
    toks: [fr('17', '12', 'r'), rm('  :  ', 'm'), fr('−1', '12', 'r')]
  }, {
    label: 'dividir é multiplicar pelo inverso',
    note: 'os 12 se cancelam',
    tall: true,
    toks: [fr('17', '12', 'r'), rm('  ·  ', 'm'), fr('12', '−1', 'm'), rm(' = ', 'r'), rm('−17', 'm')]
  }, {
    label: 'a inversa troca os dois termos',
    note: 'antecedente ↔\nconsequente',
    tall: true,
    toks: [rm('−17 = ', 'r'), fr('−17', '1', 'r'), rm('    →    ', 'r'), fr('1', '−17', 'm')]
  }, {
    label: 'resultado',
    note: '',
    tall: true,
    toks: [rm('∴  a inversa da razão é  ', 'o'), fr('−1', '17', 'o')]
  }];
  const CUE_NAMES = ['Antecedente', 'SomaAnt', 'Consequente', 'SomaCons', 'Montar', 'Inverso', 'Trocar', 'Resultado'];
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
    const fin = MOTION.glide(0, 1, CUES.Resultado - 0.3, CUES.Resultado + 0.6)(T);
    const items = [{
      label: 'ANTECEDENTE',
      n: '17',
      d: '12',
      in: CUES.SomaAnt - 0.1
    }, {
      label: 'CONSEQUENTE',
      n: '−1',
      d: '12',
      in: CUES.SomaCons - 0.1
    }, {
      label: 'A RAZÃO',
      n: '−17',
      d: '',
      in: CUES.Inverso + 0.5
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 120,
        top: 360,
        width: 340,
        display: 'flex',
        flexDirection: 'column',
        gap: 46
      }
    }, items.map((item, i) => {
      const op = MOTION.enter(0, 1, item.in, item.in + 0.8)(T);
      const dy = MOTION.pop(24, 0, item.in, item.in + 1)(T);
      const col = mix(mix(INK, cy, 0.85 * op), or, fin);
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          opacity: op,
          transform: `translateY(${dy}px)`,
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 22,
          color: GRAY,
          letterSpacing: '0.1em'
        }
      }, item.label), item.d ? /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: 110,
          fontFamily: "'STIX Two Text', Georgia, serif",
          fontSize: 54,
          color: col
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          lineHeight: 1.1
        }
      }, item.n), /*#__PURE__*/React.createElement("span", {
        style: {
          height: 3,
          background: col,
          alignSelf: 'stretch',
          margin: '8px 0',
          borderRadius: 2
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          lineHeight: 1.1
        }
      }, item.d)) : /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: "'STIX Two Text', Georgia, serif",
          fontSize: 62,
          color: col,
          lineHeight: 1
        }
      }, item.n));
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
    }, "QUEST\xC3O 1"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 31,
        color: GRAY,
        marginTop: 14,
        maxWidth: 1500,
        lineHeight: 1.35
      }
    }, "Em uma raz\xE3o, o antecedente \xE9 (2/3 + 3/4) e o consequente \xE9 (2/3 \u2212 3/4). Determine a inversa dessa raz\xE3o.")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 96,
        top: 224,
        width: 1728,
        height: 2,
        background: '#333333'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 252,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
      }
    }, STEPS.map((s, i) => /*#__PURE__*/React.createElement(Row, {
      key: i,
      step: s,
      i: i,
      k: k,
      y: ACTIVE_Y - 252 + ctr[i] - base,
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
  window.Questoes["cap12-q01"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "Antecedente",
      "dur": 6.5,
      "desc": "O antecedente: 2 tercos mais 3 quartos, com denominadores igualados em 12"
    }, {
      "name": "SomaAnt",
      "dur": 5.5,
      "desc": "Somando: o antecedente e 17 doze avos"
    }, {
      "name": "Consequente",
      "dur": 6,
      "desc": "O consequente: 2 tercos menos 3 quartos, com o mesmo mmc 12"
    }, {
      "name": "SomaCons",
      "dur": 5.5,
      "desc": "Subtraindo: o consequente e menos 1 doze avos"
    }, {
      "name": "Montar",
      "dur": 6,
      "desc": "Montando a razao: 17 doze avos dividido por menos 1 doze avos"
    }, {
      "name": "Inverso",
      "dur": 6.5,
      "desc": "Dividir e multiplicar pelo inverso: os 12 se cancelam e a razao e menos 17"
    }, {
      "name": "Trocar",
      "dur": 6.5,
      "desc": "A inversa troca antecedente e consequente: 1 sobre menos 17"
    }, {
      "name": "Resultado",
      "dur": 6,
      "desc": "Resultado: a inversa da razao e menos 1 sobre 17"
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
