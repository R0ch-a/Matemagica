/* ============================================================
   Capitulo 9 · Questao 8 — resolucao animada
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

  /* tokens: rm = texto reto, it = itálico (variáveis), fr = fração, cases = sistema */
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
  const fr = (n, d, c) => ({
    k: 'f',
    n,
    d,
    c: c || 'n'
  });
  const cases = (l1, l2, c) => ({
    k: 'c',
    l1,
    l2,
    c: c || 'n'
  });
  const STEPS = [{
    label: 'enunciado',
    note: 'U = ℚ × ℚ',
    tall: true,
    toks: [cases('15x − 16y = 24', '3x = 4y')]
  }, {
    label: 'isolar x na 2ª equação',
    tall: true,
    toks: [rm('3x = 4y', 'r'), rm('  ⇒  ', 'r'), it('x', 'm'), rm(' = ', 'm'), fr('4y', '3', 'm')]
  }, {
    label: 'substituir na 1ª equação',
    tall: true,
    toks: [rm('15 · ', 'r'), fr('4y', '3', 'm'), rm(' − 16y = 24', 'r')]
  }, {
    label: 'simplificar o produto',
    tall: true,
    toks: [fr('60y', '3', 'm'), rm(' − 16y = 24', 'r')]
  }, {
    label: 'dividir',
    toks: [rm('20y', 'm'), rm(' − 16y = 24', 'r')]
  }, {
    label: 'termos semelhantes',
    toks: [rm('4y', 'm'), rm(' = 24', 'r')]
  }, {
    label: 'valor de y',
    toks: [it('y', 'r'), rm(' = ', 'r'), rm('6', 'm')]
  }, {
    label: 'voltar na 2ª equação',
    toks: [rm('3x = 4 · ', 'r'), rm('6', 'm'), rm(' = 24', 'm')]
  }, {
    label: 'valor de x',
    toks: [it('x', 'r'), rm(' = ', 'r'), rm('8', 'm')]
  }, {
    label: 'calcular a expressão',
    toks: [it('x', 'r'), rm(' − ', 'r'), it('y', 'r'), rm(' − 1 = ', 'r'), rm('8', 'm'), rm(' − ', 'r'), rm('6', 'm'), rm(' − 1', 'r')]
  }, {
    label: 'resultado',
    toks: [rm('= ', 'r'), rm('1', 'o')]
  }, {
    label: 'conclusão',
    tall: true,
    toks: [rm('∴  (', 'o'), it('x', 'o'), rm(', ', 'o'), it('y', 'o'), rm(') = (8, 6)     ', 'o'), it('x', 'o'), rm(' − ', 'o'), it('y', 'o'), rm(' − 1 = 1', 'o')]
  }];
  const CUE_NAMES = ['Enunciado', 'IsolarX', 'Substituir', 'Produto', 'Dividir', 'Semelhantes', 'ValorY', 'Voltar', 'ValorX', 'Expressao', 'Resultado', 'Conclusao'];
  const ACTIVE_Y = 700;
  const NAT_H = i => STEPS[i].tall ? 210 : 128;
  function Tok({
    tok,
    col
  }) {
    const c = col(tok.c);
    if (tok.k === 't') {
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
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        color: c,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: '1.1em',
        lineHeight: 0.9,
        transform: 'scaleY(2.6)',
        transformOrigin: '50% 50%',
        marginRight: 22
      }
    }, '{'), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        flexDirection: 'column',
        gap: 14,
        whiteSpace: 'nowrap'
      }
    }, /*#__PURE__*/React.createElement("span", null, tok.l1), /*#__PURE__*/React.createElement("span", null, tok.l2)));
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
        lineHeight: 1.05
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
        marginLeft: 44,
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 40,
        color: GRAY,
        opacity: active,
        whiteSpace: 'nowrap',
        flexShrink: 0
      }
    }, step.note) : null);
  }
  function PinnedX({
    T,
    CUES
  }) {
    const items = [{
      label: 'guardando x',
      in: CUES.IsolarX + 0.8,
      out: CUES.ValorY + 0.2,
      frac: true
    }, {
      label: 'nos dois lados',
      text: '÷ 4',
      in: CUES.ValorY - 0.2,
      out: CUES.Voltar - 0.3
    }, {
      label: 'valor de y',
      text: 'y = 6',
      italicFirst: true,
      in: CUES.ValorY + 0.7,
      out: CUES.Resultado - 0.3
    }, {
      label: 'nos dois lados',
      text: '÷ 3',
      in: CUES.ValorX - 0.2,
      out: CUES.Expressao - 0.3
    }, {
      label: 'x encontrado',
      text: 'x = 8',
      italicFirst: true,
      in: CUES.ValorX + 0.7,
      out: CUES.Resultado - 0.3
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
          display: 'flex',
          alignItems: 'center',
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: 46,
          color: GRAY,
          marginTop: 10
        }
      }, item.frac ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
        style: {
          fontStyle: 'italic'
        }
      }, "x"), /*#__PURE__*/React.createElement("span", {
        style: {
          whiteSpace: 'pre'
        }
      }, " = "), /*#__PURE__*/React.createElement(Tok, {
        tok: fr('4y', '3', 'r'),
        col: () => GRAY
      })) : item.italicFirst ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
        style: {
          fontStyle: 'italic'
        }
      }, item.text.slice(0, 1)), /*#__PURE__*/React.createElement("span", {
        style: {
          whiteSpace: 'pre'
        }
      }, item.text.slice(1))) : /*#__PURE__*/React.createElement("span", null, item.text)));
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
    }, "QUEST\xC3O 8"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 31,
        color: GRAY,
        marginTop: 14,
        maxWidth: 1500,
        lineHeight: 1.35
      }
    }, "Sendo o sistema 15x \u2212 16y = 24 e 3x = 4y, com U = \u211A \xD7 \u211A, calcule o valor de x \u2212 y \u2212 1.")), /*#__PURE__*/React.createElement("div", {
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
    }))), /*#__PURE__*/React.createElement(PinnedX, {
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
  window.Questoes["cap09-q08-sistema"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "Enunciado",
      "dur": 5,
      "desc": "O sistema aparece inteiro no quadro"
    }, {
      "name": "IsolarX",
      "dur": 5,
      "desc": "A segunda equação é usada para isolar x"
    }, {
      "name": "Substituir",
      "dur": 5,
      "desc": "O x isolado entra na primeira equação"
    }, {
      "name": "Produto",
      "dur": 4.5,
      "desc": "O produto 15 vezes a fração é simplificado"
    }, {
      "name": "Dividir",
      "dur": 4,
      "desc": "A fração some e sobra 20y"
    }, {
      "name": "Semelhantes",
      "dur": 4.5,
      "desc": "Termos semelhantes reduzem para 4y igual a 24"
    }, {
      "name": "ValorY",
      "dur": 4,
      "desc": "y igual a 6"
    }, {
      "name": "Voltar",
      "dur": 4.5,
      "desc": "O y volta na segunda equação"
    }, {
      "name": "ValorX",
      "dur": 4,
      "desc": "x igual a 8"
    }, {
      "name": "Expressao",
      "dur": 5,
      "desc": "Os valores entram em x menos y menos 1"
    }, {
      "name": "Resultado",
      "dur": 4.5,
      "desc": "O resultado 1 aparece em laranja"
    }, {
      "name": "Conclusao",
      "dur": 5.5,
      "desc": "O portanto encerra com o par ordenado e a resposta"
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
