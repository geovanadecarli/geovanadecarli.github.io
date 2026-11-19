/* =====================================================================
   MENTORIA ESTRELA · configuração e peças comuns
   A chave abaixo é a "publishable" do Supabase: pode ficar pública.
   Quem protege os dados são as regras do banco (banco.sql).
   ===================================================================== */
var CONFIG = {
  url: 'https://kpaebujuixufwjqyuale.supabase.co',
  chave: 'sb_publishable_QE2CAfOaz-R_79vXfLvG-w_O-NEWGjK',
  whatsapp: '5541992645317'
};

var sb = supabase.createClient(CONFIG.url, CONFIG.chave, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
});

/* senha fácil de ditar: estrela-4821 */
function gerarSenha() {
  var p = ['estrela', 'tela', 'pincel', 'cor', 'arte', 'luz', 'brilho', 'aquarela'];
  var n = new Uint32Array(2); (window.crypto || window.msCrypto).getRandomValues(n);
  return p[n[0] % p.length] + '-' + (1000 + n[1] % 9000);
}

function esc(t) {
  return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
/* texto com quebras de linha e **negrito** simples */
function texto(t) {
  return esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
}
function $(s, r) { return (r || document).querySelector(s); }
function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }

function quando(iso) {
  if (!iso) return '';
  var d = new Date(iso), agora = new Date(), diff = (agora - d) / 1000;
  if (diff < 60) return 'agora';
  if (diff < 3600) return 'há ' + Math.round(diff / 60) + ' min';
  if (d.toDateString() === agora.toDateString()) return 'hoje, ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) + ', ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

/* ---------- Campos dos exercícios ----------
   Tipos aceitos em conteudo.campos:
   info       { tipo:'info', texto }                    só texto, sem resposta
   texto      { id, tipo:'texto', rotulo, ajuda }        uma linha
   paragrafo  { id, tipo:'paragrafo', rotulo, ajuda }    texto longo
   escala     { id, tipo:'escala', rotulo, min:0, max:10, rotuloMin, rotuloMax }
   marcar     { id, tipo:'marcar', rotulo, opcoes:[...] }  várias opções
   escolha    { id, tipo:'escolha', rotulo, opcoes:[...] } uma opção
   lista      { id, tipo:'lista', rotulo, linhas:5 }     itens numerados
-------------------------------------------------------------------- */
function camposRespondiveis(conteudo) {
  return ((conteudo && conteudo.campos) || []).filter(function (c) { return c.tipo !== 'info' && c.id; });
}
function preenchido(v) {
  if (v == null) return false;
  if (Array.isArray(v)) return v.some(function (x) { return String(x || '').trim() !== ''; });
  return String(v).trim() !== '';
}
function progresso(conteudo, dados) {
  var cs = camposRespondiveis(conteudo), n = 0;
  dados = dados || {};
  cs.forEach(function (c) { if (preenchido(dados[c.id])) n++; });
  return { feitos: n, total: cs.length };
}

function htmlCampos(conteudo, dados, leitura) {
  dados = dados || {};
  var h = '';
  if (conteudo && conteudo.intro) h += '<div class="intro">' + texto(conteudo.intro) + '</div>';
  ((conteudo && conteudo.campos) || []).forEach(function (c, i) {
    var v = dados[c.id], nome = 'c_' + i;
    if (c.tipo === 'info') { h += '<div class="info">' + texto(c.texto) + '</div>'; return; }
    h += '<div class="q" data-campo="' + esc(c.id) + '" data-tipo="' + esc(c.tipo) + '">';
    h += '<p class="rotulo">' + texto(c.rotulo || '') + '</p>';
    if (c.ajuda) h += '<p class="ajuda">' + texto(c.ajuda) + '</p>';

    if (c.tipo === 'texto') {
      h += leitura ? resp(v) : '<input type="text" value="' + esc(v || '') + '" aria-label="' + esc(c.rotulo) + '">';
    } else if (c.tipo === 'paragrafo') {
      h += leitura ? resp(v) : '<textarea rows="4" aria-label="' + esc(c.rotulo) + '">' + esc(v || '') + '</textarea>';
    } else if (c.tipo === 'escala') {
      var min = c.min == null ? 0 : c.min, max = c.max == null ? 10 : c.max;
      h += '<div class="escala" role="radiogroup" aria-label="' + esc(c.rotulo) + '" style="grid-template-columns:repeat(' + (max - min + 1) + ',1fr)">';
      for (var n = min; n <= max; n++) {
        var on = String(v) === String(n);
        h += leitura
          ? '<span class="' + (on ? 'on' : '') + '">' + n + '</span>'
          : '<button type="button" role="radio" aria-checked="' + on + '" class="' + (on ? 'on' : '') + '" data-v="' + n + '">' + n + '</button>';
      }
      h += '</div>';
      if (c.rotuloMin || c.rotuloMax) h += '<div class="extremos"><span>' + esc(c.rotuloMin || '') + '</span><span>' + esc(c.rotuloMax || '') + '</span></div>';
    } else if (c.tipo === 'marcar' || c.tipo === 'escolha') {
      var multi = c.tipo === 'marcar', sel = multi ? (Array.isArray(v) ? v : []) : [v];
      h += '<div class="opcoes">';
      (c.opcoes || []).forEach(function (o) {
        var on = sel.indexOf(o) >= 0;
        if (leitura) { h += '<div class="op ' + (on ? 'on' : 'off') + '">' + (on ? '✓ ' : '') + esc(o) + '</div>'; return; }
        h += '<label class="op"><input type="' + (multi ? 'checkbox' : 'radio') + '" name="' + nome + '" value="' + esc(o) + '"' + (on ? ' checked' : '') + '><span>' + esc(o) + '</span></label>';
      });
      h += '</div>';
    } else if (c.tipo === 'lista') {
      var linhas = c.linhas || 5, arr = Array.isArray(v) ? v : [];
      h += '<ol class="lista">';
      for (var k = 0; k < linhas; k++) {
        h += leitura ? '<li>' + (preenchido(arr[k]) ? esc(arr[k]) : '<span class="vazio">—</span>') + '</li>'
                     : '<li><input type="text" value="' + esc(arr[k] || '') + '" aria-label="Item ' + (k + 1) + '"></li>';
      }
      h += '</ol>';
    }
    h += '</div>';
  });
  return h;
}
function resp(v) {
  return preenchido(v) ? '<div class="resposta">' + texto(v) + '</div>' : '<div class="resposta vazio">sem resposta ainda</div>';
}

/* Lê os valores digitados de volta para um objeto */
function lerCampos(raiz) {
  var dados = {};
  $$('.q[data-campo]', raiz).forEach(function (q) {
    var id = q.getAttribute('data-campo'), tipo = q.getAttribute('data-tipo');
    if (tipo === 'texto') dados[id] = $('input', q).value;
    else if (tipo === 'paragrafo') dados[id] = $('textarea', q).value;
    else if (tipo === 'escala') { var b = $('button.on', q); dados[id] = b ? Number(b.getAttribute('data-v')) : null; }
    else if (tipo === 'marcar') dados[id] = $$('input:checked', q).map(function (i) { return i.value; });
    else if (tipo === 'escolha') { var r = $('input:checked', q); dados[id] = r ? r.value : null; }
    else if (tipo === 'lista') dados[id] = $$('input', q).map(function (i) { return i.value; });
  });
  return dados;
}

/* Liga os cliques e digitação; chama aoMudar() a cada mudança */
function ligarCampos(raiz, aoMudar) {
  raiz.addEventListener('input', aoMudar);
  raiz.addEventListener('change', aoMudar);
  raiz.addEventListener('click', function (e) {
    var b = e.target.closest('.escala button');
    if (!b) return;
    var era = b.classList.contains('on');
    $$('button', b.parentNode).forEach(function (x) { x.classList.remove('on'); x.setAttribute('aria-checked', 'false'); });
    if (!era) { b.classList.add('on'); b.setAttribute('aria-checked', 'true'); }
    aoMudar();
  });
}

function guardarLocal(chave, valor) { try { localStorage.setItem(chave, JSON.stringify(valor)); } catch (e) {} }
function lerLocal(chave) { try { return JSON.parse(localStorage.getItem(chave) || 'null'); } catch (e) { return null; } }
function apagarLocal(chave) { try { localStorage.removeItem(chave); } catch (e) {} }

function msgErro(err) {
  var m = (err && (err.message || err.error_description)) || String(err || '');
  if (/invalid login credentials/i.test(m)) return 'E-mail ou senha não conferem. Confira e tente de novo.';
  if (/rate limit|429|too many|security purposes/i.test(m)) return 'Muitas tentativas em pouco tempo. Espere alguns minutos e tente de novo.';
  if (/already registered|already been registered/i.test(m)) return 'Esse e-mail já tem login.';
  if (/fetch|network/i.test(m)) return 'Sem conexão com a internet. Confira o Wi-Fi ou os dados móveis.';
  if (/JWT|expired/i.test(m)) return 'Seu acesso expirou. Entre de novo com o seu e-mail.';
  return 'Algo deu errado: ' + m;
}
