# Como contribuir

Para usar o modelo numa palestra, o [README](README.md) basta. Esta página é para quem quer mudar o modelo pelo código.

Encontrou um problema? Abra uma [issue](https://github.com/rodbv/pybr2026-slides/issues).

## Gerar os arquivos

O `.pptx` é gerado por um script Node com [pptxgenjs](https://gitbrent.github.io/PptxGenJS/). Edite `pptx/build.js` para mudar layouts, cores ou textos de exemplo.

```sh
npm install
npm run build     # escreve dist/pybr2026-template.pptx
npm run render    # PDF, PNGs e GIF em dist/preview/ e dist/pybr2026-template.odp (precisa de LibreOffice, poppler e ImageMagick)
```

As anotações dos slides ficam em `pptx/notes.pt-BR.js`, com uma lista de dicas curtas por slide, na ordem do deck. A paleta e as fontes ficam no objeto `THEME` no topo de `pptx/build.js`. O arquivo `pptx/lib/theme.js` grava essas cores no tema do `.pptx`; `pptx/lib/highlight.js` colore o código de exemplo.

O `.odp` é gerado pelo LibreOffice a partir do `.pptx` e leva as fontes dentro do arquivo.

As imagens de exemplo (caixas cinza com o tamanho de cada espaço) vêm do [imgplaceholdr.com](https://imgplaceholdr.com); `python3 assets/make_examples.py` baixa as imagens de novo.

As figurinhas saem do manual de marca oficial em PDF, que não fica no repositório. `assets/extract_brandboard.sh` recorta as peças do PDF em PNG transparente a 600 dpi, na pasta `assets/brandboard/` (fora do git), e `assets/make_brand_assets.sh` gera a partir delas as versões usadas no modelo, em `assets/brand/` (precisa de poppler e ImageMagick 7).

## Publicar uma versão

A pasta `dist/` fica fora do git. Para publicar uma versão, crie e envie uma tag:

```sh
git tag v3.0
git push origin v3.0
```

A Action `.github/workflows/release.yml` gera os arquivos e cria uma [Release](https://github.com/rodbv/pybr2026-slides/releases) com o `.pptx`, o `.odp`, o GIF e a visão geral. O README aponta sempre para a Release mais recente; as versões anteriores ficam na página de Releases.

## Atualizar a cópia no Google Slides

A cópia no Google Slides não é atualizada pelo script. Depois de mudar o `.pptx`, envie o arquivo para o Drive, abra e escolha Arquivo > Salvar como Apresentações Google, compartilhe como "Qualquer pessoa com o link: Leitor" e troque o ID no link "Fazer uma cópia" do README.
