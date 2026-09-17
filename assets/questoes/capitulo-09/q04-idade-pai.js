/* ============================================================
   Capitulo 9 · Questao 4 — resolucao animada
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
    label: 'nomear as idades de hoje',
    note: 'filho = x\npai = 3x',
    tall: true,
    toks: [rm('pai = 3', 'm'), it('x', 'm'), rm('        filho = ', 'r'), it('x', 'm')]
  }, {
    label: 'daqui a 10 anos',
    note: 'soma 10 em\ncada idade',
    tall: true,
    toks: [rm('pai = 3', 'r'), it('x', 'r'), rm(' + 10', 'm'), rm('        filho = ', 'r'), it('x', 'r'), rm(' + 10', 'm')]
  }, {
    label: 'lá o pai será o dobro do filho',
    note: '',
    tall: true,
    toks: [rm('3', 'm'), it('x', 'm'), rm(' + 10 = 2 · (', 'm'), it('x', 'm'), rm(' + 10)', 'm')]
  }, {
    label: 'distributiva',
    note: '2 · x = 2x\n2 · 10 = 20',
    tall: true,
    toks: [rm('3', 'r'), it('x', 'r'), rm(' + 10 = ', 'r'), rm('2', 'm'), it('x', 'm'), rm(' + 20', 'm')]
  }, {
    label: 'incógnitas de um lado, números do outro',
    note: 'trocando o sinal\nao mudar de membro',
    tall: true,
    toks: [rm('3', 'r'), it('x', 'r'), rm(' − 2', 'm'), it('x', 'm'), rm(' = 20 − 10', 'm')]
  }, {
    label: 'somas em cada membro',
    note: '',
    toks: [it('x', 'r'), rm(' = ', 'r'), rm('10', 'm'), rm('   → filho', 'r')]
  }, {
    label: 'idade do pai',
    note: '3 · 10',
    tall: true,
    toks: [rm('pai = 3', 'r'), it('x', 'r'), rm(' = 3 · 10 = ', 'r'), rm('30 anos', 'm')]
  }, {
    label: 'verificação',
    note: '40 é o dobro de 20',
    tall: true,
    toks: [rm('30 + 10 = 40        10 + 10 = 20', 'r')]
  }, {
    label: 'resultado',
    tall: true,
    toks: [rm('∴  o pai tem 30 anos', 'o')]
  }];
  const CUE_NAMES = ['Nomear', 'MaisDez', 'Dobro', 'Distributiva', 'Isolar', 'ValorX', 'IdadePai', 'Verificacao', 'Resultado'];
  const ACTIVE_Y = 690;
  const NAT_H = i => STEPS[i].tall ? 190 : 132;
  function Tabela({
    T,
    CUES,
    cy,
    or
  }) {
    const inTab = MOTION.enter(0, 1, 0.4, 1.6)(T);
    const colDez = MOTION.glide(0, 1, CUES.MaisDez - 0.5, CUES.MaisDez + 0.6)(T);
    const solvedX = MOTION.glide(0, 1, CUES.ValorX - 0.2, CUES.ValorX + 0.6)(T);
    const solvedPai = MOTION.glide(0, 1, CUES.IdadePai - 0.2, CUES.IdadePai + 0.6)(T);
    const fin = MOTION.glide(0, 1, CUES.Resultado - 0.3, CUES.Resultado + 0.6)(T);
    const dobro = MOTION.glide(0, 1, CUES.Dobro - 0.4, CUES.Dobro + 0.5)(T) * (1 - 0.5 * fin);
    const head = (t, live) => ({
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 22,
      letterSpacing: '0.08em',
      color: mix(DIM, live ? cy : GRAY, t),
      padding: '0 0 16px 0'
    });
    const cell = (col, big) => ({
      fontFamily: "'STIX Two Text', Georgia, serif",
      fontSize: big ? 40 : 36,
      color: col,
      padding: '22px 0',
      borderTop: '1px solid #333333'
    });
    const cFilho = mix(mix(INK, cy, solvedX * 0.75), GRAY, 0);
    const cPai = mix(mix(INK, cy, solvedPai * 0.75), or, fin);
    const cDez = mix(mix(DIM, INK, colDez), cy, clamp(colDez * 0.5 + solvedPai * 0.4, 0, 1));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 90,
        top: 430,
        width: 620,
        opacity: inTab,
        transform: `translateY(${18 * (1 - inTab)}px)`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '150px 1fr 1fr',
        alignItems: 'baseline'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: head(inTab, false)
    }), /*#__PURE__*/React.createElement("div", {
      style: head(inTab, false)
    }, "HOJE"), /*#__PURE__*/React.createElement("div", {
      style: head(colDez, true)
    }, "DAQUI A 10 ANOS"), /*#__PURE__*/React.createElement("div", {
      style: {
        ...cell(mix(DIM, GRAY, inTab)),
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 26
      }
    }, "pai"), /*#__PURE__*/React.createElement("div", {
      style: cell(cPai, true)
    }, solvedPai > 0.5 ? '30 anos' : /*#__PURE__*/React.createElement("span", null, "3", /*#__PURE__*/React.createElement("em", null, "x"))), /*#__PURE__*/React.createElement("div", {
      style: cell(mix(cDez, cPai, 0.35 * colDez), true)
    }, solvedPai > 0.5 ? '40 anos' : /*#__PURE__*/React.createElement("span", null, "3", /*#__PURE__*/React.createElement("em", null, "x"), " + 10")), /*#__PURE__*/React.createElement("div", {
      style: {
        ...cell(mix(DIM, GRAY, inTab)),
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 26
      }
    }, "filho"), /*#__PURE__*/React.createElement("div", {
      style: cell(cFilho, true)
    }, solvedX > 0.5 ? '10 anos' : /*#__PURE__*/React.createElement("em", null, "x")), /*#__PURE__*/React.createElement("div", {
      style: cell(mix(cDez, cFilho, 0.35 * colDez), true)
    }, solvedX > 0.5 ? '20 anos' : /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("em", null, "x"), " + 10"))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 26,
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 24,
        color: mix(DIM, cy, dobro),
        opacity: 0.25 + 0.75 * dobro,
        lineHeight: 1.4
      }
    }, "na coluna da direita", /*#__PURE__*/React.createElement("br", null), "o pai \xE9 o dobro do filho"));
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
    const op = d < 0 ? clamp(1 + d * 1.7, 0, 1) : clamp((3.4 - d) / 0.8, 0, 1) * (1 - 0.2 * clamp(d, 0, 1));
    const scale = 1 - 0.44 * clamp(d, 0, 1);
    const size = step.tall ? 46 : 52;
    const active = clamp(1 - Math.abs(d) * 1.4, 0, 1);
    const col = role => {
      if (role === 'o') return or;
      if (role === 'r') return GRAY;
      return mix(role === 'm' ? cy : INK, GRAY, age);
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 70,
        top: y,
        width: 1120,
        opacity: op,
        transform: `translateY(-50%) scale(${scale})`,
        transformOrigin: '0 50%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Caveat', cursive",
        fontSize: 58,
        color: mix('#ffffff', DIM, 1 - active),
        lineHeight: 1
      }
    }, step.label), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
        marginTop: 14,
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
    }, tk.s)), step.note ? /*#__PURE__*/React.createElement("span", {
      style: {
        marginLeft: 34,
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 24,
        color: GRAY,
        opacity: active,
        whiteSpace: 'pre-line',
        maxWidth: 230,
        lineHeight: 1.35,
        flexShrink: 0
      }
    }, step.note) : null));
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
        left: 70,
        top: 88,
        width: 1200,
        opacity: headOp
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 20,
        color: cy,
        letterSpacing: '0.14em'
      }
    }, "QUEST\xC3O 4"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 30,
        color: GRAY,
        marginTop: 14,
        lineHeight: 1.4
      }
    }, "A idade de um pai \xE9 o triplo da idade do filho. Determine a idade do pai, sabendo que, daqui a 10 anos, ela ser\xE1 o dobro da idade do filho.")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 70,
        top: 248,
        width: 1780,
        height: 2,
        background: '#333333'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 280,
        width: 1220,
        bottom: 70,
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
    }))), /*#__PURE__*/React.createElement(Tabela, {
      T: T,
      CUES: CUES,
      cy: cy,
      or: or
    })));
  }
  window.Questoes = window.Questoes || {};
  window.Questoes["cap09-q04"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "Nomear",
      "dur": 6,
      "desc": "A tabela aparece: filho x e pai 3x nas idades de hoje"
    }, {
      "name": "MaisDez",
      "dur": 5.5,
      "desc": "Daqui a 10 anos soma-se 10 em cada idade, coluna da direita"
    }, {
      "name": "Dobro",
      "dur": 6,
      "desc": "La o pai sera o dobro do filho: 3x mais 10 igual a 2 vezes x mais 10"
    }, {
      "name": "Distributiva",
      "dur": 5,
      "desc": "Aplicando a distributiva no segundo membro"
    }, {
      "name": "Isolar",
      "dur": 6,
      "desc": "Incognitas de um lado e numeros do outro, trocando o sinal"
    }, {
      "name": "ValorX",
      "dur": 4.5,
      "desc": "x igual a 10: a idade do filho"
    }, {
      "name": "IdadePai",
      "dur": 5,
      "desc": "A idade do pai e 3 vezes 10, igual a 30 anos"
    }, {
      "name": "Verificacao",
      "dur": 5.5,
      "desc": "Verificacao: daqui a 10 anos 40 e o dobro de 20"
    }, {
      "name": "Resultado",
      "dur": 6,
      "desc": "Resultado final: o pai tem 30 anos"
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
