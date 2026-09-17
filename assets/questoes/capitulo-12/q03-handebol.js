/* ============================================================
   Capitulo 12 · Questao 3 — resolucao animada
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
    label: 'o desempenho pedido',
    note: 'nessa ordem',
    tall: true,
    toks: [rm('desempenho = ', 'r'), fr('acertos', 'erros', 'm')]
  }, {
    label: 'os erros de Júnior',
    note: '12 tentativas',
    tall: true,
    toks: [rm('12 − 9 = ', 'r'), rm('3', 'm'), rm(' erros', 'r')]
  }, {
    label: 'a razão de Júnior',
    note: 'acertos : erros',
    tall: true,
    toks: [fr('9', '3', 'r'), rm(' = ', 'r'), rm('3', 'm')]
  }, {
    label: 'os erros de João',
    note: '16 tentativas',
    tall: true,
    toks: [rm('16 − 12 = ', 'r'), rm('4', 'm'), rm(' erros', 'r')]
  }, {
    label: 'a razão de João',
    note: 'a mesma ordem',
    tall: true,
    toks: [fr('12', '4', 'r'), rm(' = ', 'r'), rm('3', 'm')]
  }, {
    label: 'comparar as duas razões',
    note: '',
    tall: true,
    toks: [fr('9', '3', 'r'), rm('  =  ', 'm'), fr('12', '4', 'r'), rm('    →    ', 'r'), rm('3 = 3', 'm')]
  }, {
    label: 'resultado',
    note: '',
    tall: true,
    toks: [rm('∴  os dois tiveram o mesmo desempenho', 'o')]
  }];
  const CUE_NAMES = ['Definicao', 'ErrosJ', 'RazaoJ', 'ErrosO', 'RazaoO', 'Comparar', 'Resultado'];
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
    const cards = [{
      nome: 'JÚNIOR',
      acertos: '9',
      tent: '12',
      erros: '3',
      razao: '3',
      inErros: CUES.ErrosJ - 0.1,
      inRazao: CUES.RazaoJ - 0.1
    }, {
      nome: 'JOÃO',
      acertos: '12',
      tent: '16',
      erros: '4',
      razao: '3',
      inErros: CUES.ErrosO - 0.1,
      inRazao: CUES.RazaoO - 0.1
    }];
    const inP = MOTION.enter(0, 1, 0.4, 1.6)(T);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 110,
        top: 380,
        width: 360,
        display: 'flex',
        flexDirection: 'column',
        gap: 54,
        opacity: inP
      }
    }, cards.map((c, i) => {
      const opE = MOTION.enter(0, 1, c.inErros, c.inErros + 0.8)(T);
      const opR = MOTION.enter(0, 1, c.inRazao, c.inRazao + 0.8)(T);
      const colE = mix(INK, cy, 0.85 * opE);
      const colR = mix(mix(INK, cy, 0.85 * opR), or, fin);
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 12
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 24,
          color: GRAY,
          letterSpacing: '0.12em'
        }
      }, c.nome), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: 24,
          color: mix(DIM, GRAY, 0.9)
        }
      }, c.acertos + ' de ' + c.tent + ' tentativas'), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'baseline',
          gap: 16,
          opacity: opE
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: 24,
          color: GRAY
        }
      }, "erros"), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: "'STIX Two Text', Georgia, serif",
          fontSize: 44,
          color: colE,
          lineHeight: 1
        }
      }, c.erros)), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'baseline',
          gap: 16,
          opacity: opR
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: 24,
          color: GRAY
        }
      }, "raz\xE3o"), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: "'STIX Two Text', Georgia, serif",
          fontSize: 56,
          color: colR,
          lineHeight: 1
        }
      }, c.razao)));
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
    }, "QUEST\xC3O 3"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 31,
        color: GRAY,
        marginTop: 14,
        maxWidth: 1500,
        lineHeight: 1.35
      }
    }, "Em uma partida de handebol, J\xFAnior conseguiu marcar 9 gols de 12 tentativas. Jo\xE3o, por sua vez, tentou 16 vezes e marcou 12 gols. Se o desempenho dos jogadores \xE9 dado pela raz\xE3o entre acertos e erros, nessa ordem, quem teve o melhor desempenho na partida?")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 96,
        top: 266,
        width: 1728,
        height: 2,
        background: '#333333'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 296,
        right: 0,
        bottom: 0,
        overflow: 'hidden'
      }
    }, STEPS.map((s, i) => /*#__PURE__*/React.createElement(Row, {
      key: i,
      step: s,
      i: i,
      k: k,
      y: ACTIVE_Y - 296 + ctr[i] - base,
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
  window.Questoes["cap12-q03"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "Definicao",
      "dur": 6,
      "desc": "O desempenho e a razao entre acertos e erros, nessa ordem"
    }, {
      "name": "ErrosJ",
      "dur": 5.5,
      "desc": "Os erros de Junior: 12 tentativas menos 9 gols da 3 erros"
    }, {
      "name": "RazaoJ",
      "dur": 6,
      "desc": "A razao de Junior: 9 sobre 3 igual a 3"
    }, {
      "name": "ErrosO",
      "dur": 5.5,
      "desc": "Os erros de Joao: 16 tentativas menos 12 gols da 4 erros"
    }, {
      "name": "RazaoO",
      "dur": 6,
      "desc": "A razao de Joao: 12 sobre 4 tambem igual a 3"
    }, {
      "name": "Comparar",
      "dur": 6.5,
      "desc": "Comparando as duas razoes: 9 sobre 3 e igual a 12 sobre 4"
    }, {
      "name": "Resultado",
      "dur": 6,
      "desc": "Resultado: os dois jogadores tiveram o mesmo desempenho"
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
