/* ============================================================
   Capitulo 12 · Questao 4 — resolucao animada
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
    iconeFarinha: BASE + 'icones/farinha.json',
    iconeOvos:    BASE + 'icones/ovos.json',
    iconeBolo:    BASE + 'icones/bolo.json'
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
    label: 'o que a receita diz',
    h: 170,
    toks: [rm('3 ovos', 'm'), rm('  ↔  ', 'r'), rm('0,5 kg de farinha', 'm')]
  }, {
    label: 'montar a proporção',
    note: 'ovos sobre kg',
    h: 330,
    toks: [fr('3', '0,5', 'm'), rm('  =  ', 'r'), fr('x', '2', 'm')]
  }, {
    label: 'produto dos extremos = produto dos meios',
    h: 180,
    toks: [rm('3 · 2  =  0,5 · x', 'm')]
  }, {
    label: 'multiplicar',
    note: '3 · 2 = 6',
    h: 170,
    toks: [rm('6  =  0,5x', 'm')]
  }, {
    label: 'dividir os dois membros por 0,5',
    h: 310,
    toks: [fr('6', '0,5', 'r'), rm('  =  x    →    ', 'r'), bx('x = 12', 'm')]
  }, {
    label: 'resposta',
    h: 210,
    toks: [rm('∴  são necessários 12 ovos', 'o')]
  }];
  const CUE_NAMES = ['Receita', 'Proporcao', 'Propriedade', 'Multiplicar', 'Dividir', 'Resposta'];
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
      a.goToAndStop(clamp(t * 24, 0, a.totalFrames - 1), true);
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
    const solved = MOTION.glide(0, 1, CUES.Dividir + 0.3, CUES.Dividir + 1.2)(T);
    const fin = MOTION.glide(0, 1, CUES.Resposta - 0.3, CUES.Resposta + 0.6)(T);
    const cOvos = mix(mix(INK, cy, solved * 0.9), or, fin);
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
        width: 430,
        opacity: inP,
        transform: `translateY(${20 * (1 - inP)}px)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 30
      }
    }, linha('iconeOvos', './icone-ovos.json', 'OVOS', 'a descobrir', solved > 0.5 ? '12' : 'x', cOvos), linha('iconeFarinha', './icone-farinha.json', 'FARINHA', 'na receita: 0,5 kg', '2 kg', mix(INK, cy, 0.35)), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        background: '#333333'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 22
      }
    }, /*#__PURE__*/React.createElement(LottieIcon, {
      resKey: "iconeBolo",
      path: "./icone-bolo.json",
      size: 96,
      t: T
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Courier New', Courier, monospace",
        fontSize: 24,
        color: GRAY,
        lineHeight: 1.5
      }
    }, "3 ovos", /*#__PURE__*/React.createElement("br", null), "para 0,5 kg")));
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
    }, "QUEST\xC3O 4"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 31,
        color: GRAY,
        marginTop: 14,
        lineHeight: 1.35
      }
    }, "Em uma receita de bolo, s\xE3o necess\xE1rios 3 ovos para cada 0,5 kg de farinha utilizada. Quantos ovos ser\xE3o necess\xE1rios para 2 kg de farinha?")), /*#__PURE__*/React.createElement("div", {
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
    }))), /*#__PURE__*/React.createElement(Painel, {
      T: T,
      CUES: CUES,
      cy: cy,
      or: or
    })));
  }
  window.Questoes = window.Questoes || {};
  window.Questoes["cap12-q04"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "Receita",
      "dur": 6,
      "desc": "A receita: 3 ovos para cada meio quilo de farinha"
    }, {
      "name": "Proporcao",
      "dur": 6.5,
      "desc": "Montando a proporcao: 3 sobre 0,5 igual x sobre 2"
    }, {
      "name": "Propriedade",
      "dur": 6,
      "desc": "Propriedade fundamental: 3 vezes 2 igual 0,5 vezes x"
    }, {
      "name": "Multiplicar",
      "dur": 5.5,
      "desc": "Multiplicando: 6 igual 0,5x"
    }, {
      "name": "Dividir",
      "dur": 6.5,
      "desc": "Dividindo os dois membros por 0,5: x igual a 12"
    }, {
      "name": "Resposta",
      "dur": 6,
      "desc": "Resposta: sao necessarios 12 ovos para 2 kg de farinha"
    }],
    playback: {
      "mode": "once"
    },
    tweaks: {
      "corModificado": "#2dd4bf",
      "corResultado": "#f9a03c"
    }
  };
})();
