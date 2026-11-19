# Guia do seu site de links

## 1. Como trocar textos e links

Abra `index.html`. Tudo que pode ser trocado fica no bloco `const SITE = { ... }`, logo no começo do arquivo.

- Troque só o que está entre aspas.
- Não apague aspas, vírgulas ou chaves.
- Link vazio `""` faz o botão abrir o seu WhatsApp com a mensagem pronta.

**Trocar o evento:** mude `titulo`, `dia`, `mes`, `cidade`, `link` e `sumirDepoisDe`. A data vai no formato ano-mês-dia, por exemplo `"2027-03-15"`. O botão some sozinho no dia seguinte a essa data. Para esconder o botão antes disso, use `mostrar: false`.

**Prévia no WhatsApp:** fica nas linhas `og:` no topo do arquivo. Depois de publicar, troque o endereço `https://geovanadecarli.com.br/` pelo endereço real do site.

## 2. Contagem de cliques (GoatCounter, grátis)

1. Crie uma conta em goatcounter.com e escolha um código, por exemplo `geovanadecarli`.
2. No `index.html`, coloque o código em `goatcounter: "geovanadecarli"`.
3. No painel do GoatCounter, cada botão aparece como `clique-encomenda`, `clique-evento`, `clique-loja`, `clique-mentoria`, `clique-paris`, `clique-instagram`, e assim por diante.

## 3. Publicar grátis (GitHub Pages)

Escolhemos o GitHub Pages porque você consegue editar o site direto no navegador, sem instalar nada.

1. Crie uma conta em github.com.
2. Clique em **New repository**. Use o nome `links` e marque **Public**. Clique em **Create repository**.
3. Clique em **uploading an existing file**. Arraste o `index.html` e a pasta `fotos`. Clique em **Commit changes**.
4. Vá em **Settings → Pages**. Em **Branch**, escolha `main` e `/ (root)`. Clique em **Save**.
5. Depois de 1 a 2 minutos, o site fica no ar em `https://SEU-USUARIO.github.io/links/`.

**Para editar depois:** abra o `index.html` no GitHub, clique no lápis, troque o texto e clique em **Commit changes**. O site atualiza sozinho em cerca de 1 minuto.

## 4. Domínio próprio (geovanadecarli.com.br)

1. Compre o domínio no registro.br (cerca de R$ 40 por ano).
2. No registro.br, abra o domínio e vá em **DNS → Editar zona**. Crie estes registros:
   - Tipo `A`, nome vazio, valor `185.199.108.153`
   - Tipo `A`, nome vazio, valor `185.199.109.153`
   - Tipo `A`, nome vazio, valor `185.199.110.153`
   - Tipo `A`, nome vazio, valor `185.199.111.153`
   - Tipo `CNAME`, nome `www`, valor `SEU-USUARIO.github.io`
3. No GitHub, vá em **Settings → Pages → Custom domain**. Digite `geovanadecarli.com.br` e clique em **Save**.
4. A configuração pode levar algumas horas para funcionar. Quando funcionar, marque **Enforce HTTPS**.
5. No Instagram, troque o link da bio para `https://geovanadecarli.com.br`.
