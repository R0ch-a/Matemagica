/* ============================================================
   Capitulo 9 · Questao 3 · a — resolucao animada
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
    label: 'o sistema',
    note: 'U = ℚ × ℚ',
    h: 300,
    toks: [sys([{
      toks: [rm('5x − y = 13', 'm')]
    }, {
      toks: [rm('x + 2y = 7', 'm')]
    }])]
  }, {
    label: 'multiplicar a 1ª linha por 2',
    note: 'para deixar os\ncoeficientes\nde y opostos',
    h: 300,
    toks: [sys([{
      toks: [rm('5x − y = 13', 'm')]
    }, {
      toks: [rm('x + 2y = 7', 'r')]
    }], {
      ann: ['× 2', '']
    })]
  }, {
    label: 'linha reescrita',
    note: '5x·2   y·2   13·2',
    h: 300,
    toks: [sys([{
      toks: [rm('10x − 2y = 26', 'm')]
    }, {
      toks: [rm('x + 2y = 7', 'r')]
    }])]
  }, {
    label: 'somar membro a membro',
    note: '−2y + 2y = 0',
    h: 420,
    toks: [sys([{
      toks: [rm('10x ', 'r'), st('− 2y', 'm'), rm(' = 26', 'r')]
    }, {
      toks: [rm('  x ', 'r'), st('+ 2y', 'm'), rm(' = 7', 'r')]
    }], {
      plus: true,
      sum: [rm('11x = 33', 'm')]
    })]
  }, {
    label: 'dividir os dois membros por 11',
    h: 280,
    toks: [fr('11x', '11', 'r'), rm(' = ', 'r'), fr('33', '11', 'r'), rm('    →    ', 'r'), bx('x = 3', 'm')]
  }, {
    label: 'substituir x na 2ª equação',
    h: 150,
    toks: [rm('x + 2y = 7    ⇒    ', 'r'), rm('3', 'm'), rm(' + 2y = 7', 'r')]
  }, {
    label: 'isolar o termo com y',
    note: '7 − 3',
    h: 150,
    toks: [rm('2y = ', 'r'), rm('4', 'm')]
  }, {
    label: 'dividir os dois membros por 2',
    h: 280,
    toks: [fr('2y', '2', 'r'), rm(' = ', 'r'), fr('4', '2', 'r'), rm('    →    ', 'r'), bx('y = 2', 'm')]
  }, {
    label: 'conferindo nas duas equações',
    note: '',
    h: 150,
    toks: [rm('5 · 3 − 2 = 13        3 + 2 · 2 = 7', 'r')]
  }, {
    label: 'conjunto solução',
    h: 210,
    toks: [rm('S = {(3, 2)}', 'o')]
  }];
  const CUE_NAMES = ['Sistema', 'Multiplicar', 'Reescrever', 'Somar', 'DividirX', 'Substituir', 'IsolarY', 'DividirY', 'Conferir', 'Solucao'];
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
        maxWidth: 260,
        lineHeight: 1.4,
        flexShrink: 0
      }
    }, step.note) : null);
  }
  function Pinned({
    T,
    CUES
  }) {
    const items = [{
      label: 'nas duas linhas',
      text: '× 2',
      in: CUES.Multiplicar - 0.2,
      out: CUES.Somar - 0.3
    }, {
      label: 'nos dois membros',
      text: '÷ 11',
      in: CUES.DividirX - 0.2,
      out: CUES.IsolarY - 0.3
    }, {
      label: 'x encontrado',
      text: 'x = 3',
      in: CUES.DividirX + 0.9,
      out: CUES.Solucao - 0.3
    }, {
      label: 'nos dois membros',
      text: '÷ 2',
      in: CUES.DividirY - 0.2,
      out: CUES.Conferir - 0.3
    }, {
      label: 'y encontrado',
      text: 'y = 2',
      in: CUES.DividirY + 0.9,
      out: CUES.Solucao - 0.3
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 96,
        top: 300,
        width: 400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 30
      }
    }, items.map((item, i) => {
      const op = MOTION.enter(0, 1, item.in, item.in + 0.7)(T) * (1 - MOTION.glide(0, 1, item.out, item.out + 0.6)(T));
      const dy = MOTION.pop(26, 0, item.in, item.in + 0.9)(T);
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
          fontSize: 32,
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
    }, "QUEST\xC3O 3 \xB7 a"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 31,
        color: GRAY,
        marginTop: 14,
        lineHeight: 1.35
      }
    }, "Utilizando qualquer um dos m\xE9todos estudados e considerando U = \u211A \xD7 \u211A, resolva o sistema 5x \u2212 y = 13 e x + 2y = 7.")), /*#__PURE__*/React.createElement("div", {
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
    }))), /*#__PURE__*/React.createElement(Pinned, {
      T: T,
      CUES: CUES
    })));
  }
  window.Questoes = window.Questoes || {};
  window.Questoes["cap09-q03a"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "Sistema",
      "dur": 6,
      "desc": "O sistema aparece entre chaves: 5x menos y igual 13 e x mais 2y igual 7"
    }, {
      "name": "Multiplicar",
      "dur": 6,
      "desc": "A primeira linha inteira e multiplicada por 2, ilustrado ao lado da linha"
    }, {
      "name": "Reescrever",
      "dur": 5,
      "desc": "A linha reescrita: 10x menos 2y igual 26"
    }, {
      "name": "Somar",
      "dur": 7,
      "desc": "Somando membro a membro, os termos 2y se cancelam com o corte transversal e sobra 11x igual 33"
    }, {
      "name": "DividirX",
      "dur": 5.5,
      "desc": "Dividindo os dois membros por 11, x igual a 3 na caixa"
    }, {
      "name": "Substituir",
      "dur": 5,
      "desc": "Substituindo x por 3 na segunda equacao"
    }, {
      "name": "IsolarY",
      "dur": 4.5,
      "desc": "Isolando o termo com y: 2y igual a 4"
    }, {
      "name": "DividirY",
      "dur": 5.5,
      "desc": "Dividindo os dois membros por 2, y igual a 2 na caixa"
    }, {
      "name": "Conferir",
      "dur": 5,
      "desc": "Conferindo o par nas duas equacoes"
    }, {
      "name": "Solucao",
      "dur": 6,
      "desc": "Conjunto solucao S igual ao par ordenado 3 e 2"
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
