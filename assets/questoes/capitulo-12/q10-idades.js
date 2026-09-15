/* ============================================================
   Capitulo 12 · Questao 10 — resolucao animada
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
  const cs = (l1, l2, c) => ({
    k: 'c',
    l1,
    l2,
    c: c || 'n'
  });
  const fr = (n, d, c, ni, di) => ({
    k: 'f',
    n,
    d,
    c: c || 'n',
    ni: !!ni,
    di: !!di
  });
  const STEPS = [{
    label: 'escrever a raz\u00e3o',
    note: 'V = V\u00edtor\nD = Davi',
    tall: true,
    toks: [fr('3', '4', 'm'), rm(' = ', 'm'), fr('V', 'D', 'm', true, true)]
  }, {
    label: 'multiplica\u00e7\u00e3o cruzada',
    note: '3 \u00b7 D = 4 \u00b7 V',
    tall: true,
    toks: [rm('3', 'r'), rm('D', 'm'), rm(' = ', 'r'), rm('4', 'r'), rm('V', 'm')]
  }, {
    label: 'isolar D',
    note: '',
    tall: true,
    toks: [rm('D', 'r'), rm(' = ', 'r'), fr('4V', '3', 'm')]
  }, {
    label: 'equa\u00e7\u00e3o do enunciado',
    note: 'mais novo \u00d7 5\nmais velho \u00d7 2',
    tall: true,
    toks: [rm('5', 'm'), rm('V', 'm'), rm(' + ', 'm'), rm('2', 'm'), rm('D', 'm'), rm(' = 69', 'm')]
  }, {
    label: 'substituir D',
    note: '',
    tall: true,
    toks: [rm('5V + 2 \u00b7 ', 'r'), rm('(', 'm'), fr('4V', '3', 'm'), rm(')', 'm'), rm(' = 69', 'r')]
  }, {
    label: 'distributiva',
    note: '2 \u00b7 4V = 8V',
    tall: true,
    toks: [rm('5V + ', 'r'), fr('2 \u00b7 4V', '3', 'm'), rm(' = 5V + ', 'r'), fr('8V', '3', 'm'), rm(' = 69', 'r')]
  }, {
    label: 'multiplicar tudo por 3',
    note: '69 \u00b7 3 = 207',
    tall: true,
    toks: [rm('15V', 'm'), rm(' + ', 'r'), rm('8V', 'm'), rm(' = ', 'r'), rm('207', 'm')]
  }, {
    label: 'termos semelhantes',
    note: '',
    toks: [rm('23V', 'm'), rm(' = 207', 'r')]
  }, {
    label: 'dividir por 23',
    note: '',
    toks: [rm('V', 'r'), rm(' = ', 'r'), rm('9', 'm')]
  }, {
    label: 'voltar em D',
    note: '',
    tall: true,
    toks: [rm('D = ', 'r'), fr('4 \u00b7 9', '3', 'r'), rm(' = ', 'r'), rm('12', 'm')]
  }, {
    label: 'resultado',
    note: '',
    tall: true,
    toks: [cs([rm('V\u00edtor = ', 'o'), rm('9 anos', 'o')], [rm('Davi = ', 'o'), rm('12 anos', 'o')], 'o')]
  }, {
    label: 'verifica\u00e7\u00e3o',
    note: '45 + 24 = 69',
    tall: true,
    toks: [rm('5 \u00b7 9 + 2 \u00b7 12 = 69', 'r')]
  }];
  const CUE_NAMES = ['Razao', 'Cruzada', 'IsolarD', 'Equacao', 'Substituir', 'Distributiva', 'PorTres', 'Semelhantes', 'Dividir', 'VoltarD', 'Resultado', 'Verificacao'];
  const ACTIVE_Y = 700;
  const NAT_H = i => STEPS[i].tall ? 210 : 132;
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
    if (tok.k === 'f') {
      const fc = col(tok.c);
      return /*#__PURE__*/React.createElement("span", {
        style: {
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '0 10px',
          flexShrink: 0,
          color: fc
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
          background: fc,
          alignSelf: 'stretch',
          margin: '8px 0',
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
        width: 470,
        textAlign: 'right',
        paddingRight: 40,
        fontFamily: "'Caveat', cursive",
        fontSize: 66,
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
      label: 'guardando D',
      text: 'D = 4V/3',
      in: CUES.IsolarD + 0.8,
      out: CUES.Substituir - 0.3
    }, {
      label: 'nos dois lados',
      text: '× 3',
      in: CUES.PorTres - 0.2,
      out: CUES.Semelhantes - 0.3
    }, {
      label: 'nos dois lados',
      text: '÷ 23',
      in: CUES.Dividir - 0.2,
      out: CUES.VoltarD - 0.3
    }, {
      label: 'V encontrado',
      text: 'V = 9',
      in: CUES.Dividir + 0.8,
      out: CUES.Resultado - 0.3
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 100,
        top: 310,
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
          fontSize: 44,
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
    }, "QUEST\xC3O 10"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 31,
        color: GRAY,
        marginTop: 14,
        maxWidth: 1420,
        lineHeight: 1.35
      }
    }, "As idades de V\xEDtor e Davi, nessa ordem, est\xE3o na raz\xE3o de 3 para 4. Multiplicando a idade da pessoa mais nova por 5 e a idade da mais velha por 2 e somando os n\xFAmeros assim obtidos, o resultado \xE9 69 anos. Qual \xE9 a idade de V\xEDtor e a de Davi?")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 80,
        top: 252,
        width: 1740,
        height: 2,
        background: '#333333'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 280,
        right: 0,
        bottom: 50,
        overflow: 'hidden'
      }
    }, STEPS.map((s, i) => /*#__PURE__*/React.createElement(Row, {
      key: i,
      step: s,
      i: i,
      k: k,
      y: ACTIVE_Y - 280 + ctr[i] - base,
      cy: cy,
      or: or
    }))), /*#__PURE__*/React.createElement(Pinned, {
      T: T,
      CUES: CUES
    })));
  }
  window.Questoes = window.Questoes || {};
  window.Questoes["cap12-q10"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "Razao",
      "dur": 5.5,
      "desc": "A razão é escrita como 3 sobre 4 igual a V sobre D"
    }, {
      "name": "Cruzada",
      "dur": 5,
      "desc": "A multiplicação cruzada dá 3D igual a 4V"
    }, {
      "name": "IsolarD",
      "dur": 5,
      "desc": "D é isolado: 4V sobre 3"
    }, {
      "name": "Equacao",
      "dur": 5.5,
      "desc": "A segunda equação vem do enunciado: 5V mais 2D igual a 69"
    }, {
      "name": "Substituir",
      "dur": 5.5,
      "desc": "O D isolado entra na equação, entre parênteses"
    }, {
      "name": "Distributiva",
      "dur": 6,
      "desc": "A distributiva multiplica o 2 pelo numerador: 8V sobre 3"
    }, {
      "name": "PorTres",
      "dur": 5.5,
      "desc": "Multiplicando tudo por 3 a fração desaparece"
    }, {
      "name": "Semelhantes",
      "dur": 4.5,
      "desc": "Termos semelhantes: 23V igual a 207"
    }, {
      "name": "Dividir",
      "dur": 4.5,
      "desc": "Dividindo por 23: V igual a 9"
    }, {
      "name": "VoltarD",
      "dur": 5,
      "desc": "O V volta na expressão de D, que vale 12"
    }, {
      "name": "Resultado",
      "dur": 5.5,
      "desc": "Vítor tem 9 anos e Davi 12 anos, em laranja"
    }, {
      "name": "Verificacao",
      "dur": 5,
      "desc": "Conferindo: 45 mais 24 dá 69"
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
