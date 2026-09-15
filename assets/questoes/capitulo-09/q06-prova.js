/* ============================================================
   Capitulo 9 · Questao 6 — resolucao animada
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
  const cs = (l1, l2, c) => ({
    k: 'c',
    l1,
    l2,
    c: c || 'n'
  });
  const STEPS = [{
    label: 'incógnitas',
    note: 'a = acertos\ne = erros ou em branco',
    tall: true,
    toks: [cs([it('a', 'm'), rm(' + ', 'm'), it('e', 'm'), rm(' = 60', 'm')], [rm('5', 'm'), it('a', 'm'), rm(' − ', 'm'), it('e', 'm'), rm(' = 210', 'm')], 'm')]
  }, {
    label: 'isolar e na 1ª equação',
    note: '',
    toks: [it('e', 'm'), rm(' = 60 − ', 'm'), it('a', 'm')]
  }, {
    label: 'substituir na 2ª equação',
    note: '',
    toks: [rm('5', 'r'), it('a', 'r'), rm(' − ', 'r'), rm('(60 − a)', 'm'), rm(' = 210', 'r')]
  }, {
    label: 'abrir os parênteses',
    note: 'o sinal inverte',
    toks: [rm('5', 'r'), it('a', 'r'), rm(' ', 'r'), rm('− 60 + a', 'm'), rm(' = 210', 'r')]
  }, {
    label: 'somar 60 nos dois lados',
    note: '',
    toks: [rm('5', 'r'), it('a', 'r'), rm(' + ', 'r'), it('a', 'r'), rm(' = ', 'r'), rm('270', 'm')]
  }, {
    label: 'termos semelhantes',
    note: '',
    toks: [rm('6', 'm'), it('a', 'm'), rm(' = 270', 'r')]
  }, {
    label: 'dividir por 6',
    note: '',
    toks: [it('a', 'r'), rm(' = ', 'r'), rm('45', 'm')]
  }, {
    label: 'quantas ele errou',
    note: '',
    toks: [it('e', 'r'), rm(' = 60 − ', 'r'), rm('45', 'm'), rm(' = ', 'r'), rm('15', 'm')]
  }, {
    label: 'verificação',
    note: '5 · 45 = 225\n225 − 15 = 210',
    tall: true,
    toks: [rm('5 · 45 − 15 = 210', 'r')]
  }, {
    label: 'resultado',
    note: '',
    tall: true,
    toks: [rm('∴  ele acertou ', 'o'), rm('45', 'o'), rm(' questões', 'o')]
  }];
  const CUE_NAMES = ['Incognitas', 'IsolarE', 'Substituir', 'Parenteses', 'Somar', 'Semelhantes', 'Dividir', 'Erros', 'Verificacao', 'Resultado'];
  const ACTIVE_Y = 700;
  const NAT_H = i => STEPS[i].tall ? 210 : 128;
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
        width: 430,
        textAlign: 'right',
        paddingRight: 40,
        fontFamily: "'Caveat', cursive",
        fontSize: 72,
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
        maxWidth: 330,
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
      label: 'guardando e',
      text: 'e = 60 − a',
      in: CUES.IsolarE + 0.8,
      out: CUES.Erros - 0.3
    }, {
      label: 'nos dois lados',
      text: '+ 60',
      in: CUES.Somar - 0.2,
      out: CUES.Semelhantes - 0.3
    }, {
      label: 'nos dois lados',
      text: '÷ 6',
      in: CUES.Dividir - 0.2,
      out: CUES.Erros - 0.3
    }, {
      label: 'acertos',
      text: 'a = 45',
      in: CUES.Dividir + 0.8,
      out: CUES.Resultado - 0.3
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 100,
        top: 310,
        width: 400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 32
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
          fontSize: 38,
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
    const sh = j => NAT_H(j) * (1 - 0.46 * clamp(k - j, 0, 1));
    const ctr = [0];
    for (let i = 1; i < STEPS.length; i++) ctr[i] = ctr[i - 1] + (sh(i - 1) + sh(i)) / 2;
    const kf = clamp(Math.floor(k), 0, STEPS.length - 1);
    const frac = clamp(k - kf, 0, 1);
    const base = ctr[kf] + frac * ((ctr[Math.min(kf + 1, STEPS.length - 1)] || 0) - ctr[kf]);
    const camera = 1 + 0.02 * clamp(T / Math.max(authoredTotal, 1), 0, 1);
    const headOp = MOTION.enter(0, 1, 0.15, 1.2)(T);
    const pickOp = MOTION.pop(0, 1, CUES.Resultado - 0.2, CUES.Resultado + 0.9)(T);
    const opts = [['a', '30'], ['b', '35'], ['c', '40'], ['d', '45']];
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
    }, "QUEST\xC3O 6"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 31,
        color: GRAY,
        marginTop: 14,
        maxWidth: 1480,
        lineHeight: 1.35
      }
    }, "Uma prova de m\xFAltipla escolha com 60 quest\xF5es foi corrigida da seguinte forma: o aluno ganhava 5 pontos por quest\xE3o que acertava e perdia 1 ponto por quest\xE3o que errava ou deixava em branco. Se um aluno totalizou 210 pontos, o n\xFAmero de quest\xF5es que ele acertou foi")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 96,
        top: 252,
        width: 1728,
        height: 2,
        background: '#333333'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 280,
        right: 0,
        bottom: 0,
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
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 96,
        bottom: 58,
        display: 'flex',
        gap: 46,
        alignItems: 'baseline',
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 34
      }
    }, opts.map(([l, v], i) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        display: 'flex',
        gap: 12,
        alignItems: 'baseline',
        color: i === 3 ? mix(GRAY, or, pickOp) : GRAY,
        transform: `scale(${1 + (i === 3 ? 0.18 * pickOp : 0)})`,
        transformOrigin: '0 50%'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 24
      }
    }, l, ")"), /*#__PURE__*/React.createElement("span", null, v)))));
  }
  window.Questoes = window.Questoes || {};
  window.Questoes["cap09-q06"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "Incognitas",
      "dur": 6,
      "desc": "O sistema é montado: acertos mais erros igual a 60 e cinco acertos menos erros igual a 210"
    }, {
      "name": "IsolarE",
      "dur": 5,
      "desc": "A primeira equação dá e igual a 60 menos a"
    }, {
      "name": "Substituir",
      "dur": 5,
      "desc": "Esse e entra na equação dos pontos"
    }, {
      "name": "Parenteses",
      "dur": 5,
      "desc": "Os parênteses são abertos e o sinal inverte"
    }, {
      "name": "Somar",
      "dur": 5,
      "desc": "Somando 60 nos dois lados o total vai para 270"
    }, {
      "name": "Semelhantes",
      "dur": 4.5,
      "desc": "Termos semelhantes: seis a igual a 270"
    }, {
      "name": "Dividir",
      "dur": 4.5,
      "desc": "Dividindo por 6: a igual a 45"
    }, {
      "name": "Erros",
      "dur": 5,
      "desc": "As questões erradas ou em branco somam 15"
    }, {
      "name": "Verificacao",
      "dur": 5,
      "desc": "Conferindo a pontuação: 225 menos 15 dá 210"
    }, {
      "name": "Resultado",
      "dur": 5.5,
      "desc": "A alternativa d é destacada: ele acertou 45 questões"
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
