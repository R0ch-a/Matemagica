/* ============================================================
   Capitulo 9 · Questao 12 · b — resolucao animada
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
    iconeHomem:  BASE + 'icones/homem.json',
    iconeMulher: BASE + 'icones/mulher.json',
    iconeSaco:   BASE + 'icones/saco.json'
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
  const it = (s, c) => ({
    k: 't',
    s,
    c: c || 'n',
    i: true
  });
  const st = (s, c) => ({
    k: 't',
    s,
    c: c || 'n',
    x: true
  });
  const fr = (n, d, c, dx) => ({
    k: 'f',
    n,
    d,
    c: c || 'n',
    dx: !!dx
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
    label: 'mulheres é o quíntuplo dos homens',
    note: 'h = homens\nm = mulheres',
    h: 170,
    toks: [rm('m', 'm'), rm(' = 5', 'm'), it('h', 'm')]
  }, {
    label: 'saem 15 mulheres',
    note: '',
    h: 170,
    toks: [rm('mulheres = 5', 'r'), it('h', 'r'), rm(' − 15', 'm')]
  }, {
    label: 'aí os homens passam a ser 2/5 delas',
    h: 290,
    toks: [it('h', 'm'), rm(' = ', 'm'), fr('2', '5', 'm'), rm(' · (5', 'm'), it('h', 'm'), rm(' − 15)', 'm')]
  }, {
    label: 'multiplicar os dois membros por 5',
    note: 'o 5 de baixo\ncancela com\no 5 de cima',
    h: 320,
    toks: [it('h', 'r'), rm(' · ', 'm'), rm('5', 'm'), rm(' = ', 'r'), fr('2', '5', 'r', true), rm(' · (5', 'r'), it('h', 'r'), rm(' − 15) · ', 'r'), st('5', 'm')]
  }, {
    label: 'denominador cancelado',
    h: 180,
    toks: [rm('5', 'm'), it('h', 'm'), rm(' = 2 · (5', 'r'), it('h', 'r'), rm(' − 15)', 'r')]
  }, {
    label: 'distributiva',
    note: '2·5h = 10h\n2·15 = 30',
    h: 180,
    toks: [rm('5', 'r'), it('h', 'r'), rm(' = ', 'r'), rm('10', 'm'), it('h', 'm'), rm(' − 30', 'm')]
  }, {
    label: 'incógnitas de um lado',
    note: 'trocando o sinal\nao mudar de membro',
    h: 180,
    toks: [rm('5', 'r'), it('h', 'r'), rm(' − 10', 'm'), it('h', 'm'), rm(' = −30', 'r')]
  }, {
    label: 'termos semelhantes',
    h: 150,
    toks: [rm('−5', 'm'), it('h', 'm'), rm(' = −30', 'r')]
  }, {
    label: 'dividir os dois membros por (−5)',
    h: 280,
    toks: [fr('−5h', '−5', 'r'), rm(' = ', 'r'), fr('−30', '−5', 'r'), rm('    →    ', 'r'), bx('h = 6', 'm')]
  }, {
    label: 'número de mulheres',
    note: '5 · 6',
    h: 240,
    toks: [rm('m = 5', 'r'), it('h', 'r'), rm('    →    ', 'r'), bx('m = 30', 'm')]
  }, {
    label: 'conferindo a condição',
    note: '',
    h: 260,
    toks: [rm('30 − 15 = 15        6 = ', 'r'), fr('2', '5', 'r'), rm(' · 15', 'r')]
  }, {
    label: 'total de alunos',
    h: 210,
    toks: [rm('∴  6 + 30 = 36 alunos', 'o')]
  }];
  const CUE_NAMES = ['Quintuplo', 'Saem', 'Condicao', 'PorCinco', 'Cancelar', 'Distributiva', 'Isolar', 'Semelhantes', 'ValorH', 'ValorM', 'Conferir', 'Total'];
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
          whiteSpace: 'nowrap',
          position: 'relative'
        }
      }, tok.d, tok.dx ? /*#__PURE__*/React.createElement("span", {
        style: {
          position: 'absolute',
          left: 0,
          right: 0,
          top: '48%',
          height: 4,
          background: c,
          borderRadius: 2,
          transform: 'rotate(-13deg)'
        }
      }) : null));
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
    const solvedH = MOTION.glide(0, 1, CUES.ValorH - 0.2, CUES.ValorH + 0.7)(T);
    const solvedM = MOTION.glide(0, 1, CUES.ValorM - 0.2, CUES.ValorM + 0.7)(T);
    const fin = MOTION.glide(0, 1, CUES.Total - 0.3, CUES.Total + 0.6)(T);
    const cH = mix(mix(INK, cy, solvedH * 0.9), or, fin);
    const cM = mix(mix(INK, cy, solvedM * 0.9), or, fin);
    const linha = (resKey, path, nome, sub, valor, cor) => /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 24
      }
    }, /*#__PURE__*/React.createElement(LottieIcon, {
      resKey: resKey,
      path: path,
      size: 140,
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
        fontSize: 56,
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
        right: 90,
        top: 290,
        width: 440,
        opacity: inP,
        transform: `translateY(${20 * (1 - inP)}px)`,
        display: 'flex',
        flexDirection: 'column',
        gap: 30
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 16
      }
    }, /*#__PURE__*/React.createElement(LottieIcon, {
      resKey: "iconeSaco",
      path: "./icone-saco.json",
      size: 70,
      t: T
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 21,
        color: mix(DIM, GRAY, 0.9),
        letterSpacing: '0.12em'
      }
    }, "ACADEMIA DE ARTES MARCIAIS")), linha('iconeHomem', './icone-homem.json', 'HOMENS', 'h', solvedH > 0.5 ? '6' : 'h', cH), linha('iconeMulher', './icone-mulher.json', 'MULHERES', '5h', solvedM > 0.5 ? '30' : '5h', cM), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        background: '#333333'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 18
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 23,
        color: GRAY,
        letterSpacing: '0.06em'
      }
    }, "TOTAL"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 58,
        color: mix(mix(DIM, INK, 0.4), or, fin)
      }
    }, fin > 0.4 ? '36' : '?')));
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
    }, "QUEST\xC3O 12 \xB7 b"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'STIX Two Text', Georgia, serif",
        fontSize: 31,
        color: GRAY,
        marginTop: 14,
        lineHeight: 1.35
      }
    }, "Sobre os alunos de uma academia de artes marciais, sabe-se que o n\xFAmero de mulheres \xE9 o qu\xEDntuplo do n\xFAmero de homens. Se sa\xEDrem 15 mulheres, o n\xFAmero de homens passar\xE1 a ser 2/5 do n\xFAmero de mulheres. Qual \xE9 o total de alunos dessa academia?")), /*#__PURE__*/React.createElement("div", {
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
  window.Questoes["cap09-q12b"] = {
    Board: Board,
    passos: STEPS.map(s => s.label),
    bg: BG,
    width: 1920,
    height: 1080,
    scenes: [{
      "name": "Quintuplo",
      "dur": 6,
      "desc": "O dado inicial: o numero de mulheres e cinco vezes o de homens"
    }, {
      "name": "Saem",
      "dur": 5,
      "desc": "Saem 15 mulheres, sobram 5h menos 15"
    }, {
      "name": "Condicao",
      "dur": 6.5,
      "desc": "A nova condicao: h igual a dois quintos de 5h menos 15"
    }, {
      "name": "PorCinco",
      "dur": 6.5,
      "desc": "Multiplicando os dois membros por 5: o 5 do denominador e cortado junto com o 5 multiplicado"
    }, {
      "name": "Cancelar",
      "dur": 4.5,
      "desc": "Com o denominador cancelado: 5h igual a 2 vezes 5h menos 15"
    }, {
      "name": "Distributiva",
      "dur": 5,
      "desc": "Distributiva no segundo membro: 10h menos 30"
    }, {
      "name": "Isolar",
      "dur": 5.5,
      "desc": "Incognitas de um lado, trocando o sinal ao mudar de membro"
    }, {
      "name": "Semelhantes",
      "dur": 4.5,
      "desc": "Termos semelhantes: menos 5h igual menos 30"
    }, {
      "name": "ValorH",
      "dur": 5.5,
      "desc": "Dividindo por menos 5: h igual a 6 homens"
    }, {
      "name": "ValorM",
      "dur": 5,
      "desc": "O numero de mulheres e 5 vezes 6, igual a 30"
    }, {
      "name": "Conferir",
      "dur": 5.5,
      "desc": "Conferindo a condicao do enunciado"
    }, {
      "name": "Total",
      "dur": 6,
      "desc": "Total de alunos: 6 mais 30 igual 36"
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
