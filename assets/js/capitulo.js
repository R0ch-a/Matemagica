/* ============================================================
   capitulo.js — pagina de capitulo

   Cada <article class="questao"> do HTML e' uma questao. Uma por
   vez fica visivel, escolhida pela ancora da URL (#q10). O script:
     - monta o menu do header a partir dos artigos;
     - aponta o icone do YouTube para o data-youtube da questao;
     - monta a resolucao guiada pela rolagem (questao-cena.js);
     - cria os links de questao anterior / proxima.
   Sem JS, todas as questoes aparecem como texto, uma embaixo da outra.
   ============================================================ */
(function () {
  'use strict';

  var artigos = Array.prototype.slice.call(document.querySelectorAll('.questao[id]'));
  var btn   = document.getElementById('q-menu-btn');
  var lista = document.getElementById('q-menu-list');
  var yt    = document.getElementById('yt-link');
  if (!artigos.length) return;

  var capitulo = document.body.getAttribute('data-capitulo') || '';
  var cenaMontada = null;

  function tituloDe(art) {
    var el = art.querySelector('.questao-titulo');
    return el ? el.textContent.trim() : art.id;
  }
  function numeroDe(art) {
    return tituloDe(art).replace(/^\D+/, '');
  }
  function resumoDe(art) {
    // Enunciados com fracao ou raiz viram texto embaralhado; data-resumo
    // da' ao menu uma versao em uma linha.
    var manual = art.getAttribute('data-resumo');
    if (manual) return manual.length > 90 ? manual.slice(0, 88).replace(/\s+\S*$/, '') + '…' : manual;
    var el = art.querySelector('.questao-enunciado');
    var txt = el ? el.textContent.replace(/\s+/g, ' ').trim() : '';
    return txt.length > 90 ? txt.slice(0, 88).replace(/\s+\S*$/, '') + '…' : txt;
  }

  /* ---------------------------------------------------------
     Menu
     --------------------------------------------------------- */
  var itens = [];

  if (btn && lista) {
    artigos.forEach(function (art) {
      var li = document.createElement('li');
      li.setAttribute('role', 'none');
      var a = document.createElement('a');
      a.className = 'q-menu-item';
      a.href = '#' + art.id;
      a.setAttribute('role', 'menuitem');
      a.innerHTML = '<span class="q-menu-n"></span><span class="q-menu-s"></span>';
      a.querySelector('.q-menu-n').textContent = tituloDe(art);
      a.querySelector('.q-menu-s').textContent = resumoDe(art);
      a.addEventListener('click', function () { fechar(true); });
      li.appendChild(a);
      lista.appendChild(li);
      itens.push(a);
    });

    btn.addEventListener('click', function () {
      if (lista.hidden) abrir(); else fechar(false);
    });

    btn.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        abrir(e.key === 'ArrowUp' ? itens.length - 1 : null);
      }
    });

    lista.addEventListener('keydown', function (e) {
      var i = itens.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); itens[(i + 1) % itens.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); itens[(i - 1 + itens.length) % itens.length].focus(); }
      else if (e.key === 'Home') { e.preventDefault(); itens[0].focus(); }
      else if (e.key === 'End') { e.preventDefault(); itens[itens.length - 1].focus(); }
      else if (e.key === 'Escape') { e.preventDefault(); fechar(true); }
      else if (e.key === 'Tab') { fechar(false); }
    });

    document.addEventListener('click', function (e) {
      if (!lista.hidden && !e.target.closest('.q-menu')) fechar(false);
    });
  }

  function abrir(foco) {
    lista.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    // Foca a questao atual (ou a indicada), para as setas partirem dela.
    var alvo = foco != null ? itens[foco] : lista.querySelector('[aria-current="true"]') || itens[0];
    if (alvo) alvo.focus();
  }

  function fechar(devolverFoco) {
    if (lista.hidden) return;
    lista.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    if (devolverFoco) btn.focus();
  }

  /* ---------------------------------------------------------
     Troca de questao
     --------------------------------------------------------- */
  function linkNav(art, rotulo, classe) {
    var a = document.createElement('a');
    a.href = '#' + art.id;
    a.className = classe;
    a.innerHTML = '<span class="nav-rotulo"></span><span class="nav-titulo"></span>';
    a.querySelector('.nav-rotulo').textContent = rotulo;
    a.querySelector('.nav-titulo').textContent = tituloDe(art);
    return a;
  }

  function mostrar(id, rolarAoTopo) {
    var art = null;
    for (var i = 0; i < artigos.length; i++) if (artigos[i].id === id) art = artigos[i];
    art = art || artigos[0];
    var idx = artigos.indexOf(art);

    artigos.forEach(function (a) { a.hidden = a !== art; });

    if (cenaMontada) { cenaMontada.desmontar(); cenaMontada = null; }
    var cena = art.querySelector('[data-cena]');
    if (cena && window.QuestaoCena) cenaMontada = QuestaoCena.montar(cena, cena.getAttribute('data-cena'));

    // Menu
    if (btn) {
      btn.querySelector('.q-menu-num').textContent = numeroDe(art);
      btn.setAttribute('aria-label', 'Mudar de questão. Atual: ' + tituloDe(art));
    }
    itens.forEach(function (a, i) {
      if (i === idx) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });

    // YouTube
    if (yt) {
      var url = (art.getAttribute('data-youtube') || '').trim();
      if (url) {
        yt.href = url;
        yt.classList.remove('is-disabled');
        yt.removeAttribute('aria-disabled');
        yt.title = 'Assistir à resolução narrada no YouTube';
        yt.setAttribute('aria-label', yt.title + ' (' + tituloDe(art) + ')');
      } else {
        yt.removeAttribute('href');
        yt.classList.add('is-disabled');
        yt.setAttribute('aria-disabled', 'true');
        yt.title = 'Vídeo narrado em breve';
        yt.setAttribute('aria-label', yt.title);
      }
    }

    // Anterior / proxima
    var nav = art.querySelector('.questao-nav');
    if (nav) {
      nav.innerHTML = '';
      if (idx > 0) nav.appendChild(linkNav(artigos[idx - 1], '← Anterior', 'nav-anterior'));
      if (idx < artigos.length - 1) nav.appendChild(linkNav(artigos[idx + 1], 'Próxima →', 'nav-proxima'));
    }

    document.title = tituloDe(art) + ' — Capítulo ' + capitulo + ' · Questões resolvidas · 7º ano';
    if (rolarAoTopo) window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', function () {
    mostrar(location.hash.slice(1), true);
  });

  // A resolucao depende do React (defer): espera o documento todo.
  function iniciar() { mostrar(location.hash.slice(1), false); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar);
  else iniciar();
})();
