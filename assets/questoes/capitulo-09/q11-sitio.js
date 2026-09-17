/* ============================================================
   Capitulo 9 · Questao 11 — resolucao animada
   Convertida da composicao original (JSX -> JS). Desenha a tela
   1920x1080 como funcao do tempo T; quem controla T e' a rolagem,
   em assets/js/questao-cena.js.
   Usa icones Lottie: o componente pega a URL em window.__resources,
   preenchido logo abaixo a partir da pasta deste arquivo.
   ============================================================ */
(function () {
  // Icones Lottie desta questao. BASE aponta para a pasta deste
  // arquivo, entao os caminhos valem de qualquer pagina.
  var BASE = ((document.currentScript && document.currentScript.src) || '').replace(/[^/]+$/, '');
  window.__resources = Object.assign({}, window.__resources, {
    iconeGalinha2: BASE + 'icones/galinha.json',
    iconeVaca:     BASE + 'icones/vaca.json'
  });
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
    label: 'montar o sistema',
    h: 300,
    toks: [sys([{
      toks: [rm('g + v = 75', 'm')]
    }, {
      toks: [rm('2g + 4v = 260', 'm')]
    }], {
      ann: ['animais', 'patas']
    })]
  }, {
    label: 'multiplicar a 1ª linha por (−2)',
    note: 'cancela\nos g',
    h: 290,
    toks: [sys([{
      toks: [rm('g + v = 75', 'm')]
    }, {
      toks: [rm('2g + 4v = 260', 'r')]
    }], {
      ann: ['× (−2)', '']
    })]
  }, {
    label: 'linha reescrita',
    note: '75·(−2)\n= −150',
    h: 290,
    toks: [sys([{
      toks: [rm('−2g − 2v = −150', 'm')]
    }, {
      toks: [rm(' 2g + 4v = 260', 'r')]
    }])]
  }, {
    label: 'somar membro a membro',
    h: 400,
    toks: [sys([{
      toks: [st('−2g', 'm'), rm(' − 2v = −150', 'r')]
    }, {
      toks: [st(' 2g', 'm'), rm(' + 4v = 260', 'r')]
    }], {
      plus: true,
      sum: [rm('2v = 110', 'm')]
    })]
  }, {
    label: 'dividir os dois membros por 2',
    h: 270,
    toks: [fr('2v', '2', 'r'), rm(' = ', 'r'), fr('110', '2', 'r'), rm('   →   ', 'r'), bx('v = 55', 'm')]
  }, {
    label: 'voltar na contagem de animais',
    h: 140,
    toks: [rm('g + ', 'r'), rm('55', 'm'), rm(' = 75', 'r')]
  }, {
    label: 'isolar g',
    note: '75 − 55',
    h: 210,
    toks: [bx('g = 20', 'm')]
  }, {
    label: 'comparar as quantidades',
    note: 'vacas −\ngalinhas',
    h: 150,
    toks: [rm('55 − 20 = ', 'r'), rm('35', 'm')]
  }, {
    label: 'resposta',
    h: 190,
    toks: [rm('∴  alternativa b', 'o')]
  }];
  const CUE_NAMES = ['Sistema', 'Multiplicar', 'Reescrever', 'Somar', 'DividirV', 'Voltar', 'ValorG', 'Testar', 'Resposta'];
  const ACTIVE_Y = 590;
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
  function LottieIcon({
    resKey,
    path,
    size,
    t
  }) {
    const box = React.useRef(null);
    const anim = React.useRef(null);
    React.useEffect(() => {
      let alive = true;
      const url = window.__resources && window.__resources[resKey] || path;
      fetch(url).then(r => r.json()).then(data => {
        if (!alive || !box.current || !window.lottie) return;
        anim.current = window.lottie.loadAnimation({
          container: box.current,
          renderer: 'svg',
          loop: false,
          autoplay: false,
          animationData: data
        });
      }).catch(() => {});
      return () => {
        alive = false;
        if (anim.current) anim.current.destroy();
      };
    }, []);
    React.useEffect(() => {
      const a = anim.current;
      if (!a || !a.totalFrames) return;
      a.goToAndStop(t * 24 % a.totalFrames, true);
    });
    return /*#__PURE__*/React.createElement("div", {
      ref: box,
      style: {
        width: size,
        height: size,
        flexShrink: 0
      }
    });
  }
  function Painel({
    T,
    CUES,
    cy,
    or
  }) {
    const inP = MOTION.enter(0, 1, 0.4, 1.6)(T);
    const solvedV = MOTION.glide(0, 1, CUES.DividirV - 0.2, CUES.DividirV + 0.7)(T);
    const solvedG = MOTION.glide(0, 1, CUES.ValorG - 0.2, CUES.ValorG + 0.7)(T);
    const fin = MOTION.glide(0, 1, CUES.Resposta - 0.3, CUES.Resposta + 0.6)(T);
    const cG = mix(mix(INK, cy, solvedG * 0.9), or, fin);
    const cV = mix(mix(INK, cy, solvedV * 0.9), or, fin);
    const linha = (resKey, path, nome, sub, valor, cor) => /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 24
      }
    }, /*#__PURE__*/React.createElement(LottieIcon, {
      resKey: resKey,
      path: path,
      size: 132,
      t: T
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 23,
        color: GRAY,
        letterSpacing: '0.06em'
      }
    }, nome), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 54,
        color: cor,
        lineHeight: 1
      }
    }, valor), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 22,
        color: mix(DIM, GRAY, 0.8)
      }
    }, sub)));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 96,
        top: 330,
        width: 420,
        opacity: inP,
        transform: `translateY(${20 * (1 - inP)}px)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 28
      }
    }, linha('iconeGalinha2', './icone-galinha2.json', 'GALINHAS (g)', '2 patas cada', solvedG > 0.5 ? '20' : 'g', cG), linha('iconeVaca', './icone-vaca.json', 'VACAS (v)', '4 patas cada', solvedV > 0.5 ? '55' : 'v', cV), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        background: '#333333'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 25,
        color: GRAY,
        lineHeight: 1.5
      }
    }, "75 animais", /*#__PURE__*/React.createElement("br", null), "260 patas"));
  }
  function Alternativas({
    T,
    CUES,
    cy,
    or
  }) {
    const itens = [['a', 'a quantidade de vacas é o dobro da de galinhas', '2 · 20 = 40 ≠ 55', false], ['b', 'tem 35 vacas leiteiras a mais que galinhas', '55 − 20 = 35', true], ['c', 'a quantidade de galinhas é 25% da de vacas', '25% de 55 = 13,75 ≠ 20', false], ['d', 'tem 20 galinhas a menos que vacas leiteiras', 'a diferença é 35, não 20', false]];
    const inA = MOTION.enter(0, 1, 0.8, 2)(T);
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 96,
        bottom: 46,
        width: 1180,
        opacity: inA,
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, itens.map(([letra, texto, conta, certa], i) => {
      const ver = MOTION.enter(0, 1, CUES.Testar + 0.3 + i * 0.5, CUES.Testar + 1.1 + i * 0.5)(T);
      const pick = certa ? MOTION.pop(0, 1, CUES.Resposta - 0.1, CUES.Resposta + 0.9)(T) : 0;
      const base = certa ? mix(GRAY, or, pick) : mix(GRAY, DIM, ver * 0.55);
      return /*#__PURE__*/React.createElement("div", {
        key: letra,
        style: {
          display: 'flex',
          alignItems: 'baseline',
          gap: 18
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 24,
          color: base,
          width: 34
        }
      }, letra, ")"), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: "'STIX Two Text', Georgia, serif",
          fontSize: 30,
          color: base,
          flexShrink: 0
        }
      }, texto), /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: 22,
          marginLeft: 22,
          color: certa ? mix(cy, or, pick) : mix(DIM, GRAY, 0.7),
          opacity: ver
        }
      }, (certa ? '✓  ' : '✗  ') + conta));
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
    }, "QUEST\xC3O 11"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 31,
        color: GRAY,
        marginTop: 14,
        lineHeight: 1.35
      }
    }, "Em um s\xEDtio, h\xE1 75 animais, entre galinhas e vacas leiteiras, totalizando 260 patas. Para que esse s\xEDtio d\xEA lucro, a quantidade de vacas precisa ser maior que a de galinhas. Tendo isso em vista, o s\xEDtio \xE9 lucrativo porque")), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 96,
        top: 272,
        width: 1728,
        height: 2,
        background: '#333333'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 300,
        right: 0,
        bottom: 260,
        overflow: 'hidden'
      }
    }, STEPS.map((s, i) => /*#__PURE__*/React.createElement(Row, {
      key: i,
      step: s,
      i: i,
      k: k,
      y: ACTIVE_Y - 300 + ctr[i] - base,
      cy: cy,
      or: or
    }))), /*#__PURE__*/React.createElement(Painel, {
      T: T,
      CUES: CUES,
      cy: cy,
      or: or
    }), /*#__PURE__*/React.createElement(Alternativas, {
      T: T,
      CUES: CUES,
      cy: cy,
      or: or
    })));
  }
  window.Questoes = window.Questoes || {};
  window.Questoes["cap09-q11"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "Sistema",
      "dur": 6.5,
      "desc": "O sistema aparece: g mais v igual 75 animais e 2g mais 4v igual 260 patas"
    }, {
      "name": "Multiplicar",
      "dur": 6,
      "desc": "A primeira linha inteira e multiplicada por menos 2"
    }, {
      "name": "Reescrever",
      "dur": 5,
      "desc": "A linha reescrita: menos 2g menos 2v igual menos 150"
    }, {
      "name": "Somar",
      "dur": 7,
      "desc": "Somando membro a membro, os termos em g se cancelam e sobra 2v igual 110"
    }, {
      "name": "DividirV",
      "dur": 5.5,
      "desc": "Dividindo por 2: v igual a 55 vacas leiteiras"
    }, {
      "name": "Voltar",
      "dur": 5,
      "desc": "Voltando na contagem de animais: g mais 55 igual 75"
    }, {
      "name": "ValorG",
      "dur": 5,
      "desc": "g igual a 20 galinhas"
    }, {
      "name": "Testar",
      "dur": 8,
      "desc": "Testando cada alternativa com os valores encontrados"
    }, {
      "name": "Resposta",
      "dur": 6,
      "desc": "A alternativa b e a correta: tem 35 vacas a mais que galinhas"
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
