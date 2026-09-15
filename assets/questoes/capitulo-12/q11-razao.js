/* ============================================================
   Capitulo 12 · Questao 11 — resolucao animada
   Convertida da composicao original (JSX -> JS). Desenha a tela
   1920x1080 como funcao do tempo T; o player vem de
   assets/js/questao-player.js.
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
    label: 'enunciado',
    note: 'a e b positivos',
    tall: true,
    toks: [fr('a', 'b', 'n', true, true), rm(' = '), fr('3', '4'), rm('      '), it('a'), rm(' · '), it('b'), rm(' = 192')]
  }, {
    label: 'uma só incógnita',
    note: 'razão 3 : 4',
    tall: true,
    toks: [cs([it('a', 'm'), rm(' = 3k', 'm')], [it('b', 'm'), rm(' = 4k', 'm')], 'm')]
  }, {
    label: 'substituir no produto',
    note: '',
    toks: [rm('3k', 'm'), rm(' · ', 'r'), rm('4k', 'm'), rm(' = 192', 'r')]
  }, {
    label: 'multiplicar',
    note: '3 · 4 = 12',
    toks: [rm('12', 'm'), pw('k', '2', 'm', true), rm(' = 192', 'r')]
  }, {
    label: 'dividir por 12',
    note: '',
    toks: [pw('k', '2', 'r', true), rm(' = ', 'r'), rm('16', 'm')]
  }, {
    label: 'raiz nos dois lados',
    note: 'k > 0',
    tall: true,
    toks: [it('k', 'r'), rm(' = ', 'r'), sq([rm('16', 'm')], 'm'), rm(' = ', 'r'), rm('4', 'm')]
  }, {
    label: 'voltar nas expressões',
    note: '',
    tall: true,
    toks: [cs([it('a', 'r'), rm(' = 3 · ', 'r'), rm('4', 'm')], [it('b', 'r'), rm(' = 4 · ', 'r'), rm('4', 'm')], 'r')]
  }, {
    label: 'resultado',
    note: '',
    tall: true,
    toks: [cs([it('a', 'o'), rm(' = ', 'o'), rm('12', 'o')], [it('b', 'o'), rm(' = ', 'o'), rm('16', 'o')], 'o')]
  }, {
    label: 'verificação',
    note: '',
    tall: true,
    toks: [rm('12 · 16 = 192', 'r'), rm('      ', 'r'), fr('12', '16', 'r'), rm(' = ', 'r'), fr('3', '4', 'r')]
  }, {
    label: 'conclusão',
    note: '',
    tall: true,
    toks: [rm('∴  os números são 12 e 16', 'o')]
  }];
  const CUE_NAMES = ['Enunciado', 'Incognita', 'Substituir', 'Multiplicar', 'Dividir', 'Raiz', 'Voltar', 'Resultado', 'Verificacao', 'Conclusao'];
  const ACTIVE_Y = 700;
  const NAT_H = i => STEPS[i].tall ? 200 : STEPS[i].label.length > 14 ? 176 : 128;
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
    const size = step.tall ? 52 : 58;
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
        width: 1830,
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
        opacity: op,
        transform: `translateY(-50%) scale(${scale})`,
        transformOrigin: '0 50%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 400,
        textAlign: 'right',
        paddingRight: 40,
        fontFamily: "'Caveat', cursive",
        fontSize: 76,
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
        marginLeft: 40,
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 30,
        color: GRAY,
        opacity: active,
        whiteSpace: 'pre-line',
        maxWidth: 300,
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
      label: 'nos dois lados',
      text: '÷ 12',
      in: CUES.Dividir - 0.2,
      out: CUES.Raiz - 0.3
    }, {
      label: 'nos dois lados',
      text: '√',
      in: CUES.Raiz - 0.2,
      out: CUES.Voltar - 0.3
    }, {
      label: 'k encontrado',
      text: 'k = 4',
      in: CUES.Raiz + 0.8,
      out: CUES.Conclusao - 0.3
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 110,
        top: 320,
        width: 420,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 34
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
          fontSize: 40,
          color: '#ffffff',
          lineHeight: 1
        }
      }, item.label), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: 46,
          color: GRAY,
          marginTop: 10
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
    }, "QUEST\xC3O 11"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 31,
        color: GRAY,
        marginTop: 14,
        maxWidth: 1500,
        lineHeight: 1.35
      }
    }, "A raz\xE3o entre dois n\xFAmeros positivos \xE9 3 : 4. Sabendo que o produto desses n\xFAmeros \xE9 192, determine-os.")), /*#__PURE__*/React.createElement("div", {
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
      CUES: CUES
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
  window.Questoes["cap12-q11"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "Enunciado",
      "dur": 5.5,
      "desc": "A razão a sobre b igual a 3 sobre 4 e o produto 192 aparecem"
    }, {
      "name": "Incognita",
      "dur": 5,
      "desc": "Os dois números são escritos como 3k e 4k"
    }, {
      "name": "Substituir",
      "dur": 4.5,
      "desc": "3k vezes 4k entra no produto igual a 192"
    }, {
      "name": "Multiplicar",
      "dur": 4.5,
      "desc": "O produto vira 12 k ao quadrado igual a 192"
    }, {
      "name": "Dividir",
      "dur": 4.5,
      "desc": "Dividindo os dois lados por 12: k ao quadrado igual a 16"
    }, {
      "name": "Raiz",
      "dur": 5,
      "desc": "Raiz nos dois lados: k igual a 4, pois k é positivo"
    }, {
      "name": "Voltar",
      "dur": 5,
      "desc": "O k volta em 3k e 4k"
    }, {
      "name": "Resultado",
      "dur": 5,
      "desc": "Os números 12 e 16 aparecem em laranja"
    }, {
      "name": "Verificacao",
      "dur": 5,
      "desc": "Conferindo: 12 vezes 16 dá 192 e a razão se reduz a 3 sobre 4"
    }, {
      "name": "Conclusao",
      "dur": 5.5,
      "desc": "O portanto encerra: os números são 12 e 16"
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
