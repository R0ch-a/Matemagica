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
  const rm = (s, c) => ({
    s,
    c: c || 'n'
  });
  const it = (s, c) => ({
    s,
    c: c || 'n',
    i: true
  });
  const STEPS = [{
    label: 'nomear as quantias',
    note: 'x = Beatriz\ny = Cibele',
    tall: true,
    tag: 'a',
    toks: [it('x', 'm'), rm(' = quantia de Beatriz     ', 'r'), it('y', 'm'), rm(' = quantia de Cibele', 'r')]
  }, {
    label: 'o dobro de Beatriz',
    note: 'dobro: × 2',
    tag: 'a',
    toks: [rm('2', 'm'), it('x', 'm')]
  }, {
    label: 'a diferença',
    note: 'diferença: subtração',
    tag: 'a',
    toks: [rm('2', 'r'), it('x', 'r'), rm(' − ', 'm'), it('y', 'm')]
  }, {
    label: 'é de 12 reais',
    note: '',
    tall: true,
    tag: 'a',
    toks: [rm('2', 'r'), it('x', 'r'), rm(' − ', 'r'), it('y', 'r'), rm(' = ', 'm'), rm('12', 'm')]
  }, {
    label: 'testar o par (11, 10)',
    note: 'x = 11\ny = 10',
    tall: true,
    tag: 'b',
    toks: [rm('2 · ', 'r'), rm('11', 'm'), rm(' − ', 'r'), rm('10', 'm')]
  }, {
    label: 'calcular',
    note: '',
    tag: 'b',
    toks: [rm('22', 'm'), rm(' − 10 = ', 'r'), rm('12', 'm')]
  }, {
    label: 'comparar com 12',
    note: 'os dois lados\nsão iguais',
    tall: true,
    tag: 'b',
    toks: [rm('12 = 12', 'm'), rm('   ✓', 'o')]
  }, {
    label: 'resposta',
    tall: true,
    tag: 'b',
    toks: [rm('∴  sim, (11, 10) é solução', 'o')]
  }];
  const CUE_NAMES = ['Nomear', 'Dobro', 'Diferenca', 'Equacao', 'Testar', 'Calcular', 'Comparar', 'Resposta'];
  const ACTIVE_Y = 700;
  const NAT_H = i => STEPS[i].tall ? 200 : 132;
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
        width: 90,
        textAlign: 'right',
        paddingRight: 24,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 26,
        color: mix(GRAY, DIM, 1 - active),
        flexShrink: 0
      }
    }, step.tag, ")"), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 380,
        textAlign: 'right',
        paddingRight: 36,
        fontFamily: "'Caveat', cursive",
        fontSize: 68,
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
    }, step.toks.map((tk, j) => /*#__PURE__*/React.createElement("span", {
      key: j,
      style: {
        color: col(tk.c),
        whiteSpace: 'pre',
        fontStyle: tk.i ? 'italic' : 'normal',
        flexShrink: 0
      }
    }, tk.s))), step.note ? /*#__PURE__*/React.createElement("div", {
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
      label: 'equação',
      text: '2x − y = 12',
      in: CUES.Equacao + 0.8,
      out: CUES.Resposta - 0.3
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 100,
        top: 300,
        width: 400,
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
    }, "QUEST\xC3O 8"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 31,
        color: GRAY,
        marginTop: 14,
        maxWidth: 1420,
        lineHeight: 1.35
      }
    }, "A diferen\xE7a entre o dobro da quantia que Beatriz possui e a quantia que Cibele possui \xE9 de 12 reais. Escreva a equa\xE7\xE3o da situa\xE7\xE3o e verifique se o par ordenado (11, 10) \xE9 solu\xE7\xE3o.")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 80,
        top: 232,
        width: 1740,
        height: 2,
        background: '#333333'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 260,
        right: 0,
        bottom: 60,
        overflow: 'hidden'
      }
    }, STEPS.map((s, i) => /*#__PURE__*/React.createElement(Row, {
      key: i,
      step: s,
      i: i,
      k: k,
      y: ACTIVE_Y - 260 + ctr[i] - base,
      cy: cy,
      or: or
    }))), /*#__PURE__*/React.createElement(Pinned, {
      T: T,
      CUES: CUES
    })));
  }
  window.Questoes = window.Questoes || {};
  window.Questoes["cap09-q08-quantias"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "Nomear",
      "dur": 5.5,
      "desc": "As quantias recebem nomes: x para Beatriz e y para Cibele"
    }, {
      "name": "Dobro",
      "dur": 4.5,
      "desc": "O dobro da quantia de Beatriz é 2x"
    }, {
      "name": "Diferenca",
      "dur": 5,
      "desc": "A diferença entre 2x e y é escrita como subtração"
    }, {
      "name": "Equacao",
      "dur": 5.5,
      "desc": "A equação da situação fica 2x menos y igual a 12"
    }, {
      "name": "Testar",
      "dur": 5.5,
      "desc": "O par ordenado 11 e 10 é substituído na equação"
    }, {
      "name": "Calcular",
      "dur": 4.5,
      "desc": "2 vezes 11 menos 10 resulta em 12"
    }, {
      "name": "Comparar",
      "dur": 5,
      "desc": "Os dois lados são iguais a 12"
    }, {
      "name": "Resposta",
      "dur": 5.5,
      "desc": "Resposta: sim, o par é solução da equação"
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
