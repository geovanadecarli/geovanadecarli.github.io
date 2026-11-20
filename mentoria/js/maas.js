/* =====================================================================
   SESSÃO GUIADA (Sessão 01 · MAAS)
   Os textos ficam no banco (exercicios.conteudo). Aqui só o funcionamento.
   Telas: abertura → antes[] → intro MAAS → 11 pilares → roda → leitura
          → depois[] → compromisso → salvo
   Tipos de tela em antes/depois: perguntas · presente · titulo · agenda
   Tipos de campo em "perguntas": paragrafo · marcar · simnao · eusou
   ===================================================================== */
var MAAS = (function () {
  var OURO = '#B8924A', ROXO_CLARO = '#CBBEDB';

  function nomes(c) { return (c.pilares || []).map(function (p) { return p.nome; }); }
  function vazio(c) {
    var n = (c.pilares || []).length;
    return { passo: 0, notas: Array(n).fill(0), reflexoes: Array(n).fill(''), leitura: ['', '', '', ''], prioridades: null, atitude: '', extra: {}, concluido_em: null, historico: [] };
  }
  function completar(c, d) {
    var v = vazio(c); d = d || {};
    Object.keys(v).forEach(function (k) { if (d[k] === undefined || d[k] === null && k === 'extra') d[k] = v[k]; });
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
  function telasDe(c) {
    var t = [{ k: 'abertura' }];
    (c.antes || []).forEach(function (x) { t.push({ k: 'extra', x: x }); });
    t.push({ k: 'intro' });
    (c.pilares || []).forEach(function (p, i) { t.push({ k: 'pilar', i: i }); });
    t.push({ k: 'roda' }, { k: 'leitura' });
    (c.depois || []).forEach(function (x) { t.push({ k: 'extra', x: x }); });
    t.push({ k: 'compromisso' }, { k: 'salvo' });
    return t;
  }
  function idx(telas, k) { for (var i = 0; i < telas.length; i++) if (telas[i].k === k) return i; return 0; }
  /* onde a pessoa está (para o painel ao vivo) */
  function onde(c, d) {
    if (!d) return { texto: 'não iniciada' };
    if (d.concluido_em) return { texto: 'concluída' };
    var t = telasDe(c)[d.passo || 0] || { k: 'abertura' };
    if (t.k === 'pilar') return { texto: 'pilar ' + (t.i + 1) + ' de ' + c.pilares.length + ' · ' + c.pilares[t.i].nome, pilar: t.i };
    var nomesT = { abertura: 'na abertura', intro: 'lendo sobre o MAAS', roda: 'vendo a roda', leitura: 'na leitura da roda', compromisso: 'no compromisso', salvo: 'concluída' };
    if (t.k === 'extra') return { texto: t.x.titulo || 'em andamento' };
    return { texto: nomesT[t.k] || 'em andamento' };
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

  var CAIXA = '<svg viewBox="0 0 120 120" class="caixa-presente" aria-hidden="true">' +
    '<rect x="18" y="52" width="84" height="56" rx="3" fill="#4B2A6B"/>' +
    '<rect x="12" y="38" width="96" height="18" rx="3" fill="#5C3780" class="tampa"/>' +
    '<rect x="54" y="38" width="12" height="70" fill="#B8924A"/>' +
    '<path d="M60 38 C44 14 26 24 38 36 C44 41 54 39 60 38 Z M60 38 C76 14 94 24 82 36 C76 41 66 39 60 38 Z" fill="none" stroke="#B8924A" stroke-width="4" stroke-linejoin="round" class="laco"/></svg>';

  /* ---------- tela do participante ---------- */
  function montar(raiz, ex, dadosIniciais, ctx) {
    var c = ex.conteudo, NP = c.pilares.length, nm = nomes(c), T = telasDe(c);
    var d = completar(c, JSON.parse(JSON.stringify(dadosIniciais || {})));
    if (d.passo >= T.length) d.passo = 0;
    var timer = null;
    function salvarLogo(imediato) {
      clearTimeout(timer);
      if (ctx.aoDigitar) ctx.aoDigitar();
      timer = setTimeout(function () { ctx.salvar(d); }, imediato ? 0 : 800);
    }
    function ir(p) { d.passo = Math.max(0, Math.min(T.length - 1, p)); salvarLogo(true); desenhar(true); }

    function topo(extra) {
      return '<div class="maas-topo"><a href="#" class="maas-voltar">← trilha</a><span class="maas-rot">SESSÃO 01 · ' + esc((c.abertura.titulo || '').toUpperCase()) + '</span></div>' + (extra || '');
    }
    function barraGeral(p) {
      return '<div class="maas-prog" aria-hidden="true"><div style="width:' + Math.round(p / (T.length - 2) * 100) + '%"></div></div>';
    }
    function slider(i, grande) {
      return '<div class="maas-nota' + (grande ? ' grande' : '') + '"><input type="range" min="0" max="10" step="1" value="' + (d.notas[i] || 0) + '" data-i="' + i + '" aria-label="Nota de 0 a 10 para ' + esc(nm[i]) + '"' +
        ' style="--p:' + ((d.notas[i] || 0) * 10) + '%"><output data-i="' + i + '">' + (d.notas[i] || 0) + '</output></div>';
    }
    function nav(p, proxTexto, voltaTexto) {
      return '<div class="maas-nav"><button class="maas-btn leve" data-ir="' + (p - 1) + '">' + (voltaTexto || '← Voltar') + '</button><button class="maas-btn" data-ir="' + (p + 1) + '">' + (proxTexto || 'Continuar →') + '</button></div>';
    }

    function campoExtra(f, n) {
      var v = d.extra[f.id], h = '<div class="maas-campo"><label class="maas-q"><span class="maas-num">' + n + '</span><span class="maas-qt">' + texto(f.rotulo) + '</span></label>';
      if (f.tipo === 'paragrafo') h += '<textarea class="maas-area" rows="4" data-x="' + esc(f.id) + '">' + esc(v || '') + '</textarea>';
      else if (f.tipo === 'marcar') {
        var sel = Array.isArray(v) ? v : [];
        h += '<div class="maas-prior">' + f.opcoes.map(function (o) { var on = sel.indexOf(o) >= 0; return '<label class="' + (on ? 'on' : '') + '"><input type="checkbox" data-xm="' + esc(f.id) + '" value="' + esc(o) + '"' + (on ? ' checked' : '') + '><span>' + esc(o) + '</span></label>'; }).join('') + '</div>';
      } else if (f.tipo === 'simnao') {
        var r = (v && v.resposta) || '';
        h += '<div class="maas-simnao">' + ['Sim', 'Não'].map(function (o) { return '<label class="' + (r === o ? 'on' : '') + '"><input type="radio" name="sn_' + esc(f.id) + '" data-xs="' + esc(f.id) + '" value="' + o + '"' + (r === o ? ' checked' : '') + '><span>' + o + '</span></label>'; }).join('') + '</div>' +
          '<div class="maas-qual"' + (r === 'Sim' ? '' : ' hidden') + ' data-qualbox="' + esc(f.id) + '"><label class="maas-rot" style="margin-top:12px">' + esc(f.qual || 'Se sim, qual?') + '</label><textarea class="maas-area" rows="3" data-xq="' + esc(f.id) + '">' + esc((v && v.qual) || '') + '</textarea></div>';
      } else if (f.tipo === 'eusou') {
        var arr = Array.isArray(v) ? v : [];
        h += '<ol class="maas-eusou">';
        for (var k = 0; k < (f.linhas || 5); k++) h += '<li><span>Eu sou</span><input type="text" data-xl="' + esc(f.id) + '" data-k="' + k + '" value="' + esc(arr[k] || '') + '" aria-label="Eu sou, item ' + (k + 1) + '"></li>';
        h += '</ol>';
      }
      return h + '</div>';
    }
    function telaExtra(x, p) {
      var h = topo(barraGeral(p)) + '<section class="maas-tela' + (x.tipo === 'titulo' ? ' maas-so-titulo' : '') + '">';
      if (x.tipo === 'perguntas') {
        h += (x.rotulo ? '<p class="maas-rot">' + esc(x.rotulo) + '</p>' : '') + '<h1 class="maas-titulo menor">' + esc(x.titulo) + '</h1><div class="maas-filete"></div>';
        if (x.intro) h += '<div class="maas-texto">' + texto(x.intro) + '</div>';
        if (x.lista) h += '<ol class="maas-romano">' + x.lista.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol>';
        h += x.campos.map(function (f, i) { return campoExtra(f, i + 1); }).join('');
        h += nav(p);
      } else if (x.tipo === 'presente') {
        var aberto = !!d.extra[x.id];
        h += '<div class="maas-presente">' + (x.rotulo ? '<p class="maas-rot">' + esc(x.rotulo) + '</p>' : '') + '<h1 class="maas-titulo menor">' + esc(x.titulo) + '</h1>' +
          '<button class="presente-btn' + (aberto ? ' aberto' : '') + '" data-presente="' + esc(x.id) + '" aria-expanded="' + aberto + '" aria-label="Abrir o presente">' + CAIXA + '</button>' +
          '<p class="maas-texto pequeno presente-dica"' + (aberto ? ' hidden' : '') + '>' + esc(x.texto || 'Toque na caixa para abrir.') + '</p>' +
          '<div class="presente-revela"' + (aberto ? '' : ' hidden') + '><p class="maas-rot">' + esc(x.revelacao.rotulo) + '</p><h2 class="maas-titulo menor">' + esc(x.revelacao.titulo) + '</h2><div class="maas-filete" style="margin:16px auto"></div><div class="maas-texto">' + texto(x.revelacao.texto) + '</div></div></div>';
        h += nav(p);
      } else if (x.tipo === 'titulo') {
        h += '<span class="maas-estrela">✧</span>' + (x.rotulo ? '<p class="maas-rot">' + esc(x.rotulo) + '</p>' : '') + '<h1 class="maas-titulo">' + esc(x.titulo) + '</h1>' + (x.texto ? '<div class="maas-filete" style="margin:22px auto"></div><div class="maas-texto">' + texto(x.texto) + '</div>' : '');
        h += nav(p);
      } else if (x.tipo === 'agenda') {
        h += (x.rotulo ? '<p class="maas-rot">' + esc(x.rotulo) + '</p>' : '') + '<h1 class="maas-titulo menor">' + esc(x.titulo) + '</h1><div class="maas-filete"></div>' +
          (x.intro ? '<div class="maas-texto pequeno">' + texto(x.intro) + '</div>' : '') +
          '<div class="maas-agenda">' + x.itens.map(function (it) {
            return '<div class="ag-item"><div class="ag-cat">' + esc(it.categoria) + '</div><div class="ag-t">' + esc(it.atividade) + '</div>' +
              (it.obs ? '<div class="ag-obs">' + texto(it.obs) + '</div>' : '') + (it.estrelas ? '<div class="ag-est">★ ' + esc(it.estrelas) + '</div>' : '') + '</div>';
          }).join('') + '</div>';
        h += nav(p);
      }
      return h + '</section>';
    }

    function desenhar(rolar) {
      var p = d.passo, t = T[p], h = '';
      if (t.k === 'abertura') {
        h = topo() + '<section class="maas-tela maas-abertura"><span class="maas-estrela">✧</span><p class="maas-rot">' + esc(c.abertura.rotulo) + '</p>' +
          '<h1 class="maas-titulo">' + esc(c.abertura.titulo) + '</h1><div class="maas-filete"></div><div class="maas-texto">' + texto(c.abertura.texto) + '</div>' +
          '<button class="maas-btn" data-ir="' + (p + 1) + '">' + esc(c.abertura.botao) + '</button></section>';
      } else if (t.k === 'extra') {
        h = telaExtra(t.x, p);
      } else if (t.k === 'intro') {
        var vid = c.intro.video ? videoEmbed(c.intro.video) : '';
        h = topo(barraGeral(p)) + '<section class="maas-tela"><h1 class="maas-titulo menor">' + esc(c.intro.titulo) + '</h1><div class="maas-filete"></div>' +
          '<div class="maas-texto">' + texto(c.intro.texto) + '</div>' +
          '<p class="maas-rot" style="margin-top:28px">COMO FUNCIONA</p><ol class="maas-passos">' +
          c.intro.passos.map(function (tx, i) { return '<li><span>' + (i + 1) + '</span>' + esc(tx) + '</li>'; }).join('') + '</ol>' +
          vid + nav(p, esc(c.intro.botao)) + '</section>';
      } else if (t.k === 'pilar') {
        var i = t.i, pl = c.pilares[i];
        h = topo('<div class="maas-prog" aria-label="Pilar ' + (i + 1) + ' de ' + NP + '"><div style="width:' + ((i + 1) / NP * 100) + '%"></div></div>') + '<section class="maas-tela maas-pilar">' +
          '<div class="maas-cab"><div><p class="maas-rot">PILAR ' + (i + 1) + ' DE ' + NP + '</p><h1 class="maas-titulo">' + esc(pl.nome) + '</h1></div>' +
          '<div class="maas-mini" aria-hidden="true">' + radar(d.notas, { tamanho: 120, mini: true, destaque: i }) + '</div></div>' +
          '<div class="maas-filete"></div><div class="maas-texto">' + texto(pl.texto) + '</div>' +
          '<ol class="maas-perguntas">' + pl.perguntas.map(function (q) { return '<li>' + esc(q) + '</li>'; }).join('') + '</ol>' +
          '<label class="maas-rot" for="refl">MINHAS REFLEXÕES <span style="letter-spacing:0;text-transform:none;font-weight:400">· opcional</span></label>' +
          '<textarea id="refl" class="maas-area" rows="5" data-refl="' + i + '" placeholder="Escreva o que vier.">' + esc(d.reflexoes[i] || '') + '</textarea>' +
          '<p class="maas-rot" style="margin-top:22px">SUA NOTA PARA ' + esc(pl.nome.toUpperCase()) + '</p>' + slider(i, true) +
          '<div class="maas-escala"><span>0 · abandonado</span><span>10 · pleno</span></div>' +
          nav(p, i < NP - 1 ? 'Próximo pilar →' : 'Ver minha roda →', i ? '← Pilar anterior' : '← Voltar') + '</section>';
      } else if (t.k === 'roda' || t.k === 'salvo') {
        var depois = t.k === 'salvo';
        h = topo() + '<section class="maas-tela">' +
          (depois ? '<div class="maas-salvo">' + texto(c.compromisso.salvo) + '</div>' : '') +
          '<h1 class="maas-titulo menor">' + esc(c.roda.titulo) + '</h1><div class="maas-filete"></div>' +
          '<div class="maas-roda-wrap"><div class="maas-roda" id="rodaGrande">' + radar(d.notas, { nomes: nm, anima: true, anterior: ultimaAnterior() }) + '</div>' +
          '<div class="maas-legenda" id="legenda" aria-live="polite">Toque num ponto para ver o pilar.</div>' +
          (ultimaAnterior() ? '<p class="maas-comp"><span class="c-ant"></span> MAAS anterior <span class="c-atu"></span> hoje</p>' : '') +
          '<ul class="maas-lista">' + nm.map(function (nome, k) { return '<li><span class="n">' + (k + 1) + '</span><span class="t">' + esc(nome) + '</span>' + slider(k) + '</li>'; }).join('') + '</ul></div>' +
          '<div class="maas-texto destaque">' + texto(c.roda.texto) + '</div>' +
          (depois ? '<div class="maas-nav"><a class="maas-btn leve" href="#">← Voltar para a trilha</a><button class="maas-btn" data-ir="' + idx(T, 'leitura') + '">Rever a sessão</button></div>'
                  : nav(p, 'Continuar →', '← Pilar ' + NP)) + '</section>';
      } else if (t.k === 'leitura') {
        if (!Array.isArray(d.prioridades)) { d.prioridades = menores3(d.notas); salvarLogo(); }
        var baixos = menores3(d.notas);
        h = topo(barraGeral(p)) + '<section class="maas-tela"><h1 class="maas-titulo menor">' + esc(c.leitura.titulo) + '</h1><div class="maas-filete"></div>' +
          c.leitura.perguntas.map(function (q, k) {
            return '<label class="maas-q"><span class="maas-num">' + (k + 1) + '</span><span class="maas-qt">' + esc(q) + '</span></label><textarea class="maas-area" rows="3" data-leit="' + k + '">' + esc(d.leitura[k] || '') + '</textarea>';
          }).join('') +
          '<p class="maas-rot" style="margin-top:30px">' + esc(c.leitura.prioridadesTitulo.toUpperCase()) + '</p><p class="maas-texto pequeno">' + esc(c.leitura.prioridadesTexto) + '</p>' +
          '<div class="maas-prior">' + nm.map(function (nome, k) {
            var on = d.prioridades.indexOf(k) >= 0;
            return '<label class="' + (on ? 'on' : '') + '"><input type="checkbox" data-prior="' + k + '"' + (on ? ' checked' : '') + '><span>' + (k + 1) + '. ' + esc(nome) + '</span><b>' + d.notas[k] + '</b>' + (baixos.indexOf(k) >= 0 ? '<i>menor nota</i>' : '') + '</label>';
          }).join('') + '</div>' +
          '<blockquote class="maas-frase">' + esc(c.leitura.frase) + '</blockquote>' + nav(p, 'Continuar →', '← Minha roda') + '</section>';
      } else {
        h = topo(barraGeral(p)) + '<section class="maas-tela"><h1 class="maas-titulo menor">' + esc(c.compromisso.titulo) + '</h1><div class="maas-filete"></div>' +
          '<label class="maas-q"><span class="maas-qt">' + esc(c.compromisso.pergunta) + '</span></label>' +
          '<textarea class="maas-area" rows="4" data-atitude>' + esc(d.atitude || '') + '</textarea>' +
          (d.prioridades && d.prioridades.length ? '<p class="maas-texto pequeno">Seus pilares prioritários: <b>' + d.prioridades.map(function (k) { return esc(nm[k]); }).join(', ') + '</b></p>' : '') +
          '<div class="maas-nav"><button class="maas-btn leve" data-ir="' + (p - 1) + '">← Voltar</button><button class="maas-btn" id="bSalvarMaas">' + esc(c.compromisso.botao) + '</button></div></section>';
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
      $$('[data-x]', raiz).forEach(function (t) { t.oninput = function () { d.extra[t.getAttribute('data-x')] = t.value; salvarLogo(); }; });
      $$('[data-xm]', raiz).forEach(function (cb) {
        cb.onchange = function () {
          var id = cb.getAttribute('data-xm');
          d.extra[id] = $$('[data-xm="' + id + '"]:checked', raiz).map(function (x) { return x.value; });
          cb.parentNode.classList.toggle('on', cb.checked); salvarLogo();
        };
      });
      $$('[data-xs]', raiz).forEach(function (rb) {
        rb.onchange = function () {
          var id = rb.getAttribute('data-xs'), v = d.extra[id] || {};
          v.resposta = rb.value; d.extra[id] = v;
          $$('[data-xs="' + id + '"]', raiz).forEach(function (x) { x.parentNode.classList.toggle('on', x.checked); });
          $('[data-qualbox="' + id + '"]', raiz).hidden = rb.value !== 'Sim';
          salvarLogo();
        };
      });
      $$('[data-xq]', raiz).forEach(function (t) { t.oninput = function () { var id = t.getAttribute('data-xq'), v = d.extra[id] || {}; v.qual = t.value; d.extra[id] = v; salvarLogo(); }; });
      $$('[data-xl]', raiz).forEach(function (t) {
        t.oninput = function () {
          var id = t.getAttribute('data-xl'), arr = Array.isArray(d.extra[id]) ? d.extra[id] : [];
          arr[Number(t.getAttribute('data-k'))] = t.value; d.extra[id] = arr; salvarLogo();
        };
      });
      $$('[data-presente]', raiz).forEach(function (b) {
        b.onclick = function () {
          d.extra[b.getAttribute('data-presente')] = true; salvarLogo();
          b.classList.add('aberto'); b.setAttribute('aria-expanded', 'true');
          var dica = $('.presente-dica', raiz); if (dica) dica.hidden = true;
          var rv = $('.presente-revela', raiz); rv.hidden = false; rv.classList.add('sobe');
        };
      });
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
      if (bs) bs.onclick = function () { d.concluido_em = new Date().toISOString(); ir(idx(T, 'salvo')); };
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
  function respExtra(f, v) {
    if (f.tipo === 'simnao') return v && v.resposta ? '<div class="resposta">' + esc(v.resposta) + (v.qual ? ' — ' + texto(v.qual) : '') + '</div>' : resp('');
    if (f.tipo === 'marcar') return Array.isArray(v) && v.length ? '<div class="resposta">' + v.map(esc).join(' · ') + '</div>' : resp('');
    if (f.tipo === 'eusou') { var a = (Array.isArray(v) ? v : []).filter(preenchido); return a.length ? '<div class="resposta">' + a.map(function (x) { return 'Eu sou ' + esc(x); }).join('<br>') + '</div>' : resp(''); }
    return resp(v);
  }
  function blocoExtras(lista, d) {
    return (lista || []).filter(function (x) { return x.tipo === 'perguntas'; }).map(function (x) {
      return '<h4>' + esc(x.titulo) + '</h4>' + x.campos.map(function (f) { return '<p class="rotulo-peq">' + texto(f.rotulo) + '</p>' + respExtra(f, d.extra[f.id]); }).join('');
    }).join('');
  }
  function leitura(ex, dados) {
    var c = ex.conteudo, nm = nomes(c);
    if (!dados) return '<div class="resposta vazio">Ainda não começou a sessão.</div>';
    var d = completar(c, JSON.parse(JSON.stringify(dados))), ant = (d.historico || []).length ? d.historico[d.historico.length - 1] : null;
    var h = '<div class="maas-adm"><p class="miudo" style="margin-bottom:8px">Status: <b>' + status(dados) + '</b> · ' + esc(onde(c, d).texto) + '</p>';
    h += blocoExtras(c.antes, d);
    h += '<h4>Roda do MAAS</h4><div class="maas-adm-grade"><div class="maas-adm-roda">' + radar(d.notas, { nomes: nm, anterior: ant ? ant.notas : null }) +
      (ant ? '<p class="maas-comp"><span class="c-ant"></span> ' + new Date(ant.em).toLocaleDateString('pt-BR') + ' <span class="c-atu"></span> atual</p>' : '') + '</div>' +
      '<table class="maas-adm-notas">' + nm.map(function (n, k) {
        var pr = (d.prioridades || []).indexOf(k) >= 0;
        return '<tr class="' + (pr ? 'pr' : '') + '"><td>' + (k + 1) + '. ' + esc(n) + (pr ? ' <span class="pill">prioridade</span>' : '') + '</td><td><b>' + d.notas[k] + '</b>' + (ant ? ' <span class="miudo">(' + ant.notas[k] + ')</span>' : '') + '</td></tr>';
      }).join('') + '</table></div>';
    var refl = nm.map(function (n, k) { return preenchido(d.reflexoes[k]) ? '<p class="rotulo-peq">' + (k + 1) + '. ' + esc(n) + '</p><div class="resposta">' + texto(d.reflexoes[k]) + '</div>' : ''; }).join('');
    h += '<h4>Reflexões por pilar</h4>' + (refl || '<div class="resposta vazio">nenhuma reflexão escrita</div>');
    h += '<h4>Leitura da roda</h4>' + c.leitura.perguntas.map(function (q, k) { return '<p class="rotulo-peq">' + esc(q) + '</p>' + resp(d.leitura[k]); }).join('');
    h += '<h4>Pilares prioritários</h4>' + (d.prioridades && d.prioridades.length ? '<p>' + d.prioridades.map(function (k) { return esc(nm[k]); }).join(' · ') + '</p>' : '<div class="resposta vazio">ainda não escolheu</div>');
    h += blocoExtras(c.depois, d);
    h += '<h4>Atitude da semana</h4>' + resp(d.atitude);
    return h + '</div>';
  }

  return { radar: radar, montar: montar, leitura: leitura, status: status, completar: completar, onde: onde };
})();
