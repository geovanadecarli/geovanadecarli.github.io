/* =====================================================================
   MAAS · Mapa de Autoavaliação Sistêmico
   Os textos ficam no banco (exercicios.conteudo). Aqui só o funcionamento.
   ===================================================================== */
var MAAS = (function () {
  var OURO = '#B8924A', ROXO = '#4B2A6B', ROXO_CLARO = '#CBBEDB';

  function nomes(c) { return (c.pilares || []).map(function (p) { return p.nome; }); }
  function vazio(c) {
    var n = (c.pilares || []).length;
    return { passo: 0, notas: Array(n).fill(0), reflexoes: Array(n).fill(''), leitura: ['', '', '', ''], prioridades: null, atitude: '', concluido_em: null, historico: [] };
  }
  function completar(c, d) {
    var v = vazio(c); d = d || {};
    Object.keys(v).forEach(function (k) { if (d[k] === undefined) d[k] = v[k]; });
    return d;
  }
  function status(d) {
    if (!d) return 'não iniciada';
    if (d.concluido_em) return 'concluída';
    return 'em andamento';
  }
  function menores3(notas) {
    return notas.map(function (n, i) { return [n, i]; }).sort(function (a, b) { return a[0] - b[0] || a[1] - b[1]; }).slice(0, 3).map(function (x) { return x[1]; });
  }

  /* ---------- a roda ---------- */
  function ponto(cx, cy, r, k, n) {
    var a = (-90 + k * 360 / n) * Math.PI / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }
  function estrela(cx, cy, r) {
    var p = [];
    for (var i = 0; i < 10; i++) {
      var rr = i % 2 ? r * 0.42 : r, a = (-90 + i * 36) * Math.PI / 180;
      p.push((cx + rr * Math.cos(a)).toFixed(1) + ',' + (cy + rr * Math.sin(a)).toFixed(1));
    }
    return '<polygon points="' + p.join(' ') + '" fill="none" stroke="' + OURO + '" stroke-width="1.2" stroke-linejoin="round"/>';
  }
  /* o: { tamanho, nomes, destaque (índice), anterior (notas), anima, mini } */
  function radar(notas, o) {
    o = o || {};
    var S = o.tamanho || 320, n = notas.length, cx = S / 2, cy = S / 2;
    var R = S / 2 - (o.mini ? 8 : 30);
    var h = '<svg class="roda" viewBox="0 0 ' + S + ' ' + S + '" role="img" aria-label="Roda do MAAS">';
    for (var r = 1; r <= 10; r++) {
      h += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R * r / 10).toFixed(1) + '" fill="none" stroke="' + ROXO_CLARO + '" stroke-width="' + (r === 10 ? 1 : .7) + '"' + (r === 10 ? '' : ' stroke-dasharray="2 3"') + '/>';
    }
    for (var k = 0; k < n; k++) {
      var e = ponto(cx, cy, R, k, n), on = o.destaque === k;
      h += '<line x1="' + cx + '" y1="' + cy + '" x2="' + e[0].toFixed(1) + '" y2="' + e[1].toFixed(1) + '" stroke="' + (on ? OURO : ROXO_CLARO) + '" stroke-width="' + (on ? 1.6 : .7) + '"/>';
      if (!o.mini) {
        var l = ponto(cx, cy, R + 16, k, n);
        h += '<text x="' + l[0].toFixed(1) + '" y="' + l[1].toFixed(1) + '" text-anchor="middle" dominant-baseline="central" font-size="12" font-family="Jost,sans-serif" fill="' + (on ? OURO : '#6B5E73') + '" font-weight="' + (on ? 600 : 400) + '">' + (k + 1) + '</text>';
      }
    }
    function forma(vals, cor, preench, cls) {
      var pts = vals.map(function (v, k) { var p = ponto(cx, cy, R * Math.max(0, Math.min(10, Number(v) || 0)) / 10, k, n); return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
      return '<polygon class="' + cls + '" points="' + pts + '" fill="' + preench + '" stroke="' + cor + '" stroke-width="' + (o.mini ? 1.4 : 1.8) + '" stroke-linejoin="round"/>';
    }
    if (o.anterior) h += forma(o.anterior, '#9C86B8', 'rgba(122,90,156,.08)', 'ant');
    h += '<g class="' + (o.anima ? 'anima' : '') + '" style="transform-origin:' + cx + 'px ' + cy + 'px">';
    h += forma(notas, OURO, 'rgba(184,146,74,.16)', 'atual');
    notas.forEach(function (v, k) {
      var p = ponto(cx, cy, R * (Number(v) || 0) / 10, k, n), on = o.destaque === k;
      h += '<circle class="pt" data-i="' + k + '" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + (o.mini ? (on ? 3.5 : 2) : (on ? 6 : 4.5)) + '" fill="' + OURO + '" stroke="#FBF7EF" stroke-width="1.2">' +
        (o.nomes ? '<title>' + esc(o.nomes[k]) + ': ' + v + '</title>' : '') + '</circle>';
      if (!o.mini) h += '<circle class="alvo" data-i="' + k + '" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="14" fill="transparent"/>';
    });
    h += '</g>' + estrela(cx, cy, o.mini ? 6 : 11) + '</svg>';
    return h;
  }

  /* ---------- tela do participante ---------- */
  function montar(raiz, ex, dadosIniciais, ctx) {
    var c = ex.conteudo, NP = c.pilares.length, nm = nomes(c);
    var d = completar(c, JSON.parse(JSON.stringify(dadosIniciais || {})));
    var timer = null;
    function salvarLogo(imediato) {
      clearTimeout(timer);
      if (ctx.aoDigitar) ctx.aoDigitar();
      timer = setTimeout(function () { ctx.salvar(d); }, imediato ? 0 : 800);
    }
    function ir(p) { d.passo = p; salvarLogo(true); desenhar(true); }

    function topo(extra) {
      return '<div class="maas-topo"><a href="#" class="maas-voltar">← trilha</a><span class="maas-rot">SESSÃO 01 · ' + esc((c.abertura.titulo || '').toUpperCase()) + '</span></div>' + (extra || '');
    }
    function barraPilares(i) {
      return '<div class="maas-prog" aria-label="Pilar ' + (i + 1) + ' de ' + NP + '"><div style="width:' + ((i + 1) / NP * 100) + '%"></div></div>';
    }
    function slider(i, grande) {
      return '<div class="maas-nota' + (grande ? ' grande' : '') + '"><input type="range" min="0" max="10" step="1" value="' + (d.notas[i] || 0) + '" data-i="' + i + '" aria-label="Nota de 0 a 10 para ' + esc(nm[i]) + '"' +
        ' style="--p:' + ((d.notas[i] || 0) * 10) + '%"><output data-i="' + i + '">' + (d.notas[i] || 0) + '</output></div>';
    }

    function desenhar(rolar) {
      var p = d.passo, h = '';
      if (p <= 0) {
        h = topo() + '<section class="maas-tela maas-abertura"><span class="maas-estrela">✧</span><p class="maas-rot">' + esc(c.abertura.rotulo) + '</p>' +
          '<h1 class="maas-titulo">' + esc(c.abertura.titulo) + '</h1><div class="maas-filete"></div><div class="maas-texto">' + texto(c.abertura.texto) + '</div>' +
          '<button class="maas-btn" data-ir="1">' + esc(c.abertura.botao) + '</button></section>';
      } else if (p === 1) {
        var vid = c.intro.video ? videoEmbed(c.intro.video) : '';
        h = topo() + '<section class="maas-tela"><h1 class="maas-titulo menor">' + esc(c.intro.titulo) + '</h1><div class="maas-filete"></div>' +
          '<div class="maas-texto">' + texto(c.intro.texto) + '</div>' +
          '<p class="maas-rot" style="margin-top:28px">COMO FUNCIONA</p><ol class="maas-passos">' +
          c.intro.passos.map(function (t, i) { return '<li><span>' + (i + 1) + '</span>' + esc(t) + '</li>'; }).join('') + '</ol>' +
          vid + '<div class="maas-nav"><button class="maas-btn leve" data-ir="0">← Voltar</button><button class="maas-btn" data-ir="2">' + esc(c.intro.botao) + '</button></div></section>';
      } else if (p >= 2 && p < 2 + NP) {
        var i = p - 2, pl = c.pilares[i];
        h = topo(barraPilares(i)) + '<section class="maas-tela maas-pilar">' +
          '<div class="maas-cab"><div><p class="maas-rot">PILAR ' + (i + 1) + ' DE ' + NP + '</p><h1 class="maas-titulo">' + esc(pl.nome) + '</h1></div>' +
          '<div class="maas-mini" aria-hidden="true">' + radar(d.notas, { tamanho: 120, mini: true, destaque: i }) + '</div></div>' +
          '<div class="maas-filete"></div><div class="maas-texto">' + texto(pl.texto) + '</div>' +
          '<ol class="maas-perguntas">' + pl.perguntas.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ol>' +
          '<label class="maas-rot" for="refl">MINHAS REFLEXÕES <span style="letter-spacing:0;text-transform:none;font-weight:400">· opcional</span></label>' +
          '<textarea id="refl" class="maas-area" rows="5" data-refl="' + i + '" placeholder="Escreva o que vier.">' + esc(d.reflexoes[i] || '') + '</textarea>' +
          '<p class="maas-rot" style="margin-top:22px">SUA NOTA PARA ' + esc(pl.nome.toUpperCase()) + '</p>' + slider(i, true) +
          '<div class="maas-escala"><span>0 · abandonado</span><span>10 · pleno</span></div>' +
          '<div class="maas-nav"><button class="maas-btn leve" data-ir="' + (p - 1) + '">' + (i ? '← Pilar anterior' : '← Voltar') + '</button>' +
          '<button class="maas-btn" data-ir="' + (p + 1) + '">' + (i < NP - 1 ? 'Próximo pilar →' : 'Ver minha roda →') + '</button></div></section>';
      } else if (p === 2 + NP || p === 5 + NP) {
        var depois = p === 5 + NP;
        h = topo() + '<section class="maas-tela">' +
          (depois ? '<div class="maas-salvo">' + texto(c.compromisso.salvo) + '</div>' : '') +
          '<h1 class="maas-titulo menor">' + esc(c.roda.titulo) + '</h1><div class="maas-filete"></div>' +
          '<div class="maas-roda-wrap"><div class="maas-roda" id="rodaGrande">' + radar(d.notas, { nomes: nm, anima: true, anterior: ultimaAnterior() }) + '</div>' +
          '<div class="maas-legenda" id="legenda" aria-live="polite">Toque num ponto para ver o pilar.</div>' +
          (ultimaAnterior() ? '<p class="maas-comp"><span class="c-ant"></span> MAAS anterior <span class="c-atu"></span> hoje</p>' : '') +
          '<ul class="maas-lista">' + nm.map(function (nome, k) { return '<li><span class="n">' + (k + 1) + '</span><span class="t">' + esc(nome) + '</span>' + slider(k) + '</li>'; }).join('') + '</ul></div>' +
          '<div class="maas-texto destaque">' + texto(c.roda.texto) + '</div>' +
          '<div class="maas-nav">' + (depois ? '<a class="maas-btn leve" href="#">← Voltar para a trilha</a><button class="maas-btn" data-ir="' + (3 + NP) + '">Rever leitura</button>'
                                             : '<button class="maas-btn leve" data-ir="' + (1 + NP) + '">← Pilar ' + NP + '</button><button class="maas-btn" data-ir="' + (3 + NP) + '">Continuar →</button>') + '</div></section>';
      } else if (p === 3 + NP) {
        if (!Array.isArray(d.prioridades)) { d.prioridades = menores3(d.notas); salvarLogo(); }
        var baixos = menores3(d.notas);
        h = topo() + '<section class="maas-tela"><h1 class="maas-titulo menor">' + esc(c.leitura.titulo) + '</h1><div class="maas-filete"></div>' +
          c.leitura.perguntas.map(function (q, k) {
            return '<label class="maas-q"><span class="maas-num">' + (k + 1) + '</span><span class="maas-qt">' + esc(q) + '</span></label><textarea class="maas-area" rows="3" data-leit="' + k + '">' + esc(d.leitura[k] || '') + '</textarea>';
          }).join('') +
          '<p class="maas-rot" style="margin-top:30px">' + esc(c.leitura.prioridadesTitulo.toUpperCase()) + '</p><p class="maas-texto pequeno">' + esc(c.leitura.prioridadesTexto) + '</p>' +
          '<div class="maas-prior">' + nm.map(function (nome, k) {
            var on = d.prioridades.indexOf(k) >= 0;
            return '<label class="' + (on ? 'on' : '') + '"><input type="checkbox" data-prior="' + k + '"' + (on ? ' checked' : '') + '><span>' + (k + 1) + '. ' + esc(nome) + '</span><b>' + d.notas[k] + '</b>' + (baixos.indexOf(k) >= 0 ? '<i>menor nota</i>' : '') + '</label>';
          }).join('') + '</div>' +
          '<blockquote class="maas-frase">' + esc(c.leitura.frase) + '</blockquote>' +
          '<div class="maas-nav"><button class="maas-btn leve" data-ir="' + (2 + NP) + '">← Minha roda</button><button class="maas-btn" data-ir="' + (4 + NP) + '">Continuar →</button></div></section>';
      } else {
        h = topo() + '<section class="maas-tela"><h1 class="maas-titulo menor">' + esc(c.compromisso.titulo) + '</h1><div class="maas-filete"></div>' +
          '<label class="maas-q"><span class="maas-qt">' + esc(c.compromisso.pergunta) + '</span></label>' +
          '<textarea class="maas-area" rows="4" data-atitude>' + esc(d.atitude || '') + '</textarea>' +
          (d.prioridades && d.prioridades.length ? '<p class="maas-texto pequeno">Seus pilares prioritários: <b>' + d.prioridades.map(function (k) { return esc(nm[k]); }).join(', ') + '</b></p>' : '') +
          '<div class="maas-nav"><button class="maas-btn leve" data-ir="' + (3 + NP) + '">← Voltar</button><button class="maas-btn" id="bSalvarMaas">' + esc(c.compromisso.botao) + '</button></div></section>';
      }
      raiz.innerHTML = '<div class="maas">' + h + '<div class="maas-status" id="salvo" role="status"></div></div>';
      if (rolar) window.scrollTo(0, 0);
      ligar();
    }

    function ultimaAnterior() {
      var hs = d.historico || [];
      return hs.length ? hs[hs.length - 1].notas : null;
    }

    function ligar() {
      $$('[data-ir]', raiz).forEach(function (b) { b.onclick = function () { ir(Number(b.getAttribute('data-ir'))); }; });
      $$('input[type=range]', raiz).forEach(function (r) {
        r.oninput = function () {
          var i = Number(r.getAttribute('data-i')), v = Number(r.value);
          d.notas[i] = v; r.style.setProperty('--p', v * 10 + '%');
          $$('output[data-i="' + i + '"]', raiz).forEach(function (o) { o.textContent = v; });
          var mini = $('.maas-mini', raiz);
          if (mini) mini.innerHTML = radar(d.notas, { tamanho: 120, mini: true, destaque: i });
          var g = $('#rodaGrande', raiz);
          if (g) { g.innerHTML = radar(d.notas, { nomes: nm, anterior: ultimaAnterior() }); legendaPara(i); }
          salvarLogo();
        };
      });
      $$('[data-refl]', raiz).forEach(function (t) { t.oninput = function () { d.reflexoes[Number(t.getAttribute('data-refl'))] = t.value; salvarLogo(); }; });
      $$('[data-leit]', raiz).forEach(function (t) { t.oninput = function () { d.leitura[Number(t.getAttribute('data-leit'))] = t.value; salvarLogo(); }; });
      $$('[data-atitude]', raiz).forEach(function (t) { t.oninput = function () { d.atitude = t.value; salvarLogo(); }; });
      $$('[data-prior]', raiz).forEach(function (cb) {
        cb.onchange = function () {
          var k = Number(cb.getAttribute('data-prior'));
          if (cb.checked) {
            if (d.prioridades.length >= 3) { cb.checked = false; alert('Escolha no máximo 3 pilares. Desmarque um para trocar.'); return; }
            d.prioridades.push(k);
          } else d.prioridades = d.prioridades.filter(function (x) { return x !== k; });
          cb.parentNode.classList.toggle('on', cb.checked);
          salvarLogo();
        };
      });
      var g = $('#rodaGrande', raiz);
      if (g) g.onclick = function (e) { var t = e.target.closest('[data-i]'); if (t) legendaPara(Number(t.getAttribute('data-i'))); };
      var bs = $('#bSalvarMaas', raiz);
      if (bs) bs.onclick = function () { d.concluido_em = new Date().toISOString(); ir(5 + NP); };
    }
    function legendaPara(i) {
      var l = $('#legenda', raiz);
      if (l) l.innerHTML = '<b>' + (i + 1) + '. ' + esc(nm[i]) + '</b> · nota ' + d.notas[i];
    }
    desenhar(false);
    return { dados: function () { return d; } };
  }

  function videoEmbed(url) {
    var m = /(?:youtu\.be\/|v=|shorts\/)([\w-]{11})/.exec(url), src = url;
    if (m) src = 'https://www.youtube-nocookie.com/embed/' + m[1];
    var vm = /vimeo\.com\/(\d+)/.exec(url);
    if (vm) src = 'https://player.vimeo.com/video/' + vm[1];
    return '<div class="maas-video"><iframe src="' + esc(src) + '" title="Vídeo da Geovana sobre o MAAS" allow="fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>';
  }

  /* ---------- leitura para a mentora ---------- */
  function leitura(ex, dados) {
    var c = ex.conteudo, nm = nomes(c);
    if (!dados) return '<div class="resposta vazio">Ainda não começou o MAAS.</div>';
    var d = completar(c, dados), ant = (d.historico || []).length ? d.historico[d.historico.length - 1] : null;
    var NP = nm.length, passo = d.passo || 0;
    var onde = d.concluido_em ? 'concluído em ' + new Date(d.concluido_em).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
      : passo < 2 ? 'na abertura' : passo < 2 + NP ? 'no pilar ' + (passo - 1) + ' de ' + NP : passo === 2 + NP ? 'vendo a roda' : passo === 3 + NP ? 'na leitura da roda' : 'no compromisso';
    var h = '<div class="maas-adm"><p class="miudo" style="margin-bottom:8px">Status: <b>' + status(dados) + '</b> · ' + onde + '</p>' +
      '<div class="maas-adm-grade"><div class="maas-adm-roda">' + radar(d.notas, { nomes: nm, anterior: ant ? ant.notas : null }) +
      (ant ? '<p class="maas-comp"><span class="c-ant"></span> ' + new Date(ant.em).toLocaleDateString('pt-BR') + ' <span class="c-atu"></span> atual</p>' : '') + '</div>' +
      '<table class="maas-adm-notas">' + nm.map(function (n, k) {
        var pr = (d.prioridades || []).indexOf(k) >= 0;
        return '<tr class="' + (pr ? 'pr' : '') + '"><td>' + (k + 1) + '. ' + esc(n) + (pr ? ' <span class="pill">prioridade</span>' : '') + '</td><td><b>' + d.notas[k] + '</b>' + (ant ? ' <span class="miudo">(' + ant.notas[k] + ')</span>' : '') + '</td></tr>';
      }).join('') + '</table></div>';
    var refl = nm.map(function (n, k) { return preenchido(d.reflexoes[k]) ? '<p class="rotulo-peq">' + (k + 1) + '. ' + esc(n) + '</p><div class="resposta">' + texto(d.reflexoes[k]) + '</div>' : ''; }).join('');
    h += '<h4>Reflexões por pilar</h4>' + (refl || '<div class="resposta vazio">nenhuma reflexão escrita</div>');
    h += '<h4>Leitura da roda</h4>' + c.leitura.perguntas.map(function (q, k) { return '<p class="rotulo-peq">' + esc(q) + '</p>' + resp(d.leitura[k]); }).join('');
    h += '<h4>Pilares prioritários</h4>' + (d.prioridades && d.prioridades.length ? '<p>' + d.prioridades.map(function (k) { return esc(nm[k]); }).join(' · ') + '</p>' : '<div class="resposta vazio">ainda não escolheu</div>');
    h += '<h4>Atitude da semana</h4>' + resp(d.atitude);
    return h + '</div>';
  }

  return { radar: radar, montar: montar, leitura: leitura, status: status, completar: completar };
})();
