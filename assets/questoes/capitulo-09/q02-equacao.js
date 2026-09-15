/* ============================================================
   Capitulo 9 · Questao 2 — resolucao animada
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
  const it = (s, c) => ({
    k: 't',
    s,
    c: c || 'n',
    i: true
  });
  const fr = (n, d, nc, dc) => ({
    k: 'f',
    n,
    d,
    nc: nc || 'n',
    dc: dc || nc || 'n'
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
  const STEPS = [{
    label: 'enunciado',
    note: '',
    tall: true,
    toks: [fr('x − 3', '5'), rm(' − '), fr('3(x + 1)', '4'), rm(' + '), fr('1', '2'), rm(' = '), rm('− '), fr('x', '10'), rm(' − '), fr('7 − x', '20')]
  }, {
    label: 'mmc dos denominadores',
    note: 'mmc(5, 4, 2, 10, 20) = 20',
    tall: true,
    toks: [fr('x − 3', '5', 'r', 'm'), rm(' − ', 'r'), fr('3(x + 1)', '4', 'r', 'm'), rm(' + ', 'r'), fr('1', '2', 'r', 'm'), rm(' = ', 'r'), rm('− ', 'r'), fr('x', '10', 'r', 'm'), rm(' − ', 'r'), fr('7 − x', '20', 'r', 'm')]
  }, {
    label: 'mesmo denominador',
    note: '20 ÷ denominador',
    tall: true,
    toks: [fr('4(x − 3)', '20', 'm', 'm'), rm(' − ', 'r'), fr('15(x + 1)', '20', 'm', 'm'), rm(' + ', 'r'), fr('10', '20', 'm', 'm'), rm(' = ', 'r'), rm('− ', 'r'), fr('2x', '20', 'm', 'm'), rm(' − ', 'r'), fr('7 − x', '20', 'r', 'm')]
  }, {
    label: 'cancelar os denominadores',
    note: 'denominadores iguais',
    toks: [rm('4(x − 3)', 'm'), rm(' − ', 'r'), rm('15(x + 1)', 'm'), rm(' + ', 'r'), rm('10', 'm'), rm(' = ', 'r'), rm('−2x', 'm'), rm(' − ', 'r'), rm('(7 − x)', 'm')]
  }, {
    label: 'distributiva',
    note: 'eliminar os parênteses',
    toks: [rm('4x − 12', 'm'), rm(' − 15x − 15', 'm'), rm(' + 10', 'r'), rm(' = ', 'r'), rm('−2x', 'r'), rm(' − 7 + x', 'm')]
  }, {
    label: 'termos semelhantes',
    note: '4x − 15x = −11x\n−12 − 15 + 10 = −17',
    toks: [rm('−11x', 'm'), rm(' − 17', 'm'), rm(' = ', 'r'), rm('−x', 'm'), rm(' − 7', 'r')]
  }, {
    label: 'isolar a incógnita',
    note: 'x à esquerda, números à direita',
    toks: [rm('−11x', 'r'), rm(' + x', 'm'), rm(' = ', 'r'), rm('−7', 'r'), rm(' + 17', 'm')]
  }, {
    label: 'somar',
    note: '',
    toks: [rm('−10x', 'm'), rm(' = ', 'r'), rm('10', 'm')]
  }, {
    label: 'dividir por −10',
    note: '−1 ∈ ℚ',
    toks: [it('x', 'r'), rm(' = ', 'r'), rm('−1', 'm')]
  }, {
    label: 'substituir na expressão',
    note: 'x = −1',
    tall: true,
    toks: [sq([pw('x', 'x', 'r', true), rm(' + ', 'r'), pw('x', '2', 'r', true)], 'r'), rm(' = ', 'r'), sq([pw('(−1)', '−1', 'm'), rm(' + ', 'r'), pw('(−1)', '2', 'm')], 'm')]
  }, {
    label: 'resultado',
    note: '',
    tall: true,
    toks: [rm('= ', 'r'), sq([rm('−1 + 1', 'm')], 'm'), rm(' = ', 'r'), sq([rm('0', 'o')], 'o'), rm(' = 0', 'o')]
  }, {
    label: 'conclusão',
    note: '',
    tall: true,
    toks: [rm('∴  ', 'o'), it('x', 'o'), rm(' = −1      ', 'o'), sq([pw('x', 'x', 'o', true), rm(' + ', 'o'), pw('x', '2', 'o', true)], 'o'), rm(' = 0', 'o')]
  }];
  const CUE_NAMES = ['Enunciado', 'MMC', 'Numeradores', 'Cancelar', 'Distributiva', 'Semelhantes', 'Isolar', 'Somar', 'Valor', 'Substituir', 'Resultado', 'Conclusao'];
  const ACTIVE_Y = 700;
  const NAT_H = i => STEPS[i].tall ? 200 : 128;
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
          verticalAlign: 'super',
          fontStyle: tok.bi ? 'italic' : 'normal'
        }
      }, tok.e));
    }
    if (tok.k === 'f') {
      const nc = col(tok.nc),
        dc = col(tok.dc);
      return /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '0 12px',
          flexShrink: 0
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          color: nc,
          padding: '0 8px',
          lineHeight: 1.12,
          whiteSpace: 'nowrap'
        }
      }, tok.n), /*#__PURE__*/React.createElement("span", {
        style: {
          height: 3,
          background: dc,
          alignSelf: 'stretch',
          margin: '9px 0',
          borderRadius: 2
        }
      }), /*#__PURE__*/React.createElement("span", {
        style: {
          color: dc,
          padding: '0 8px',
          lineHeight: 1.12,
          whiteSpace: 'nowrap'
        }
      }, tok.d));
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
        marginLeft: 40,
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 30,
        color: GRAY,
        opacity: active,
        whiteSpace: 'pre-line',
        maxWidth: 330,
        lineHeight: 1.35,
        flexShrink: 0
      }
    }, step.note) : null);
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
    }, "QUEST\xC3O 2"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 31,
        color: GRAY,
        marginTop: 14,
        maxWidth: 1500,
        lineHeight: 1.35
      }
    }, "No conjunto dos n\xFAmeros racionais, resolva a equa\xE7\xE3o e calcule o valor de", ' ', /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        verticalAlign: 'middle',
        transform: 'translateY(-2px)'
      }
    }, /*#__PURE__*/React.createElement(Tok, {
      tok: sq([pw('x', 'x', 'r', true), rm(' + ', 'r'), pw('x', '2', 'r', true)], 'r'),
      col: () => GRAY
    })), ".")), /*#__PURE__*/React.createElement("div", {
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
    })))), tw.legenda ? /*#__PURE__*/React.createElement("div", {
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
  window.Questoes["cap09-q02"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "Enunciado",
      "dur": 5,
      "desc": "A equação original aparece inteira no quadro"
    }, {
      "name": "MMC",
      "dur": 4.5,
      "desc": "Os denominadores acendem em ciano e o mmc 20 é anunciado"
    }, {
      "name": "Numeradores",
      "dur": 5,
      "desc": "Todos os termos passam a ter denominador 20 com novos numeradores"
    }, {
      "name": "Cancelar",
      "dur": 4.5,
      "desc": "Os denominadores iguais são eliminados"
    }, {
      "name": "Distributiva",
      "dur": 5,
      "desc": "Os parênteses são abertos pela distributiva"
    }, {
      "name": "Semelhantes",
      "dur": 5,
      "desc": "Termos semelhantes são reduzidos em cada lado"
    }, {
      "name": "Isolar",
      "dur": 5,
      "desc": "Os x vão para a esquerda e os números para a direita"
    }, {
      "name": "Somar",
      "dur": 4,
      "desc": "A equação vira menos dez x igual a dez"
    }, {
      "name": "Valor",
      "dur": 4.5,
      "desc": "Divisão por menos dez revela x igual a menos um"
    }, {
      "name": "Substituir",
      "dur": 5.5,
      "desc": "O valor de x é substituído na expressão com a raiz"
    }, {
      "name": "Resultado",
      "dur": 5,
      "desc": "A raiz de zero fecha em laranja: o resultado é zero"
    }, {
      "name": "Conclusao",
      "dur": 5.5,
      "desc": "O portanto encerra a resolução com a resposta final"
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
