# Modelo de slides da Python Brasil 2026

Modelo de apresentação para palestrantes e organização da [Python Brasil 2026](https://2026.pythonbrasil.org.br/), em Florianópolis, de 14 a 19 de outubro de 2026. Funciona no LibreOffice Impress, no Google Slides e no PowerPoint, em Linux, macOS e Windows.

**[Fazer uma cópia no Google Slides](https://docs.google.com/presentation/d/1UL0_ahhgmBJkYqj4TGBaNlWPmxEUHUAIg4989dEcJxY/copy)**

O link cria uma cópia editável no seu Google Drive, com todos os layouts. Não precisa baixar nada nem instalar fontes.

Também dá para baixar o [`.pptx`](https://github.com/rodbv/pybr2026-slides/releases/latest/download/pybr2026-template.pptx) e abrir no Google Slides (Arquivo > Abrir > Fazer upload). Esse arquivo é sempre a versão mais recente do modelo. Para usar no LibreOffice ou no PowerPoint, veja [Baixar](#baixar).

Prefere escrever os slides em Markdown, conversando com um agente de IA? Use o [modelo em Markdown com o Marp](https://github.com/rodbv/pybr2026-marp), em português, inglês e espanhol.

![Alguns slides do modelo, um a cada 2,5 segundos: capa, frase, palestrante, agenda, imagem, código, números, gráfico de contraste, fluxo, destaque, perguntas, capa clara e figurinhas](https://github.com/rodbv/pybr2026-slides/releases/latest/download/tour.gif)

<details>
<summary>Ver os 39 slides de uma vez</summary>

![Visão geral dos 39 slides de exemplo](https://github.com/rodbv/pybr2026-slides/releases/latest/download/overview.png)

</details>

## Baixar

| Arquivo | Para |
|---|---|
| [`pybr2026-template.odp`](https://github.com/rodbv/pybr2026-slides/releases/latest/download/pybr2026-template.odp) | LibreOffice e OpenOffice |
| [`pybr2026-template.pptx`](https://github.com/rodbv/pybr2026-slides/releases/latest/download/pybr2026-template.pptx) | PowerPoint, Keynote e também LibreOffice |

Os links baixam a versão mais recente. As versões anteriores ficam em [Releases](https://github.com/rodbv/pybr2026-slides/releases). Os dois arquivos têm o mesmo conteúdo. O `.odp` foi gerado pelo LibreOffice a partir do `.pptx` e leva as fontes dentro do arquivo: abre certo mesmo sem as fontes instaladas.

## Fontes

O modelo usa as duas fontes livres da identidade visual do evento:

- **Roboto** para texto
- **Cascadia Mono** para títulos e código

Instale as duas antes de abrir o arquivo; elas estão na pasta [`fonts/`](fonts/) com suas licenças (SIL Open Font License).

- **Linux:** copie os `.ttf` para `~/.local/share/fonts/` e rode `fc-cache -f`.
- **macOS:** abra cada `.ttf` e clique em "Instalar fonte", ou copie para `~/Library/Fonts/`.
- **Windows:** selecione os `.ttf`, botão direito, "Instalar".
- **Google Slides:** nada a instalar. As duas fontes existem no Google Fonts e o Slides as encontra pelo nome na importação.

O `.odp` já traz as duas fontes embutidas. No `.pptx`, sem as fontes instaladas, o programa substitui por outra fonte e os títulos podem quebrar em lugares diferentes. O texto continua legível.

## Como usar

Cada slide do arquivo mostra um layout preenchido com texto de exemplo. O arquivo tem três seções: layouts escuros, layouts claros e figurinhas. As anotações de cada slide explicam para que o layout serve e trazem dicas para a palestra.

1. Abra o arquivo e salve uma cópia com o nome da sua palestra.
2. Duplique os slides que você vai usar e apague os outros.
3. Para criar um slide novo a partir de um layout: Slide > Novo slide, depois escolha o layout no painel lateral (LibreOffice: "Propriedades > Layouts"; Google Slides e PowerPoint: botão "Layout").

### Google Slides

Use o link "Fazer uma cópia" no topo desta página. Os layouts, as cores do tema e as fontes vêm junto.

O Google Slides converte o gráfico do slide "Gráfico nativo" em imagem, e o eixo perde os rótulos. Para um gráfico editável no Slides, use Inserir > Gráfico.

### Imagens

Os espaços para imagem são caixas com borda fina, com o texto "Clique no ícone ou arraste uma imagem". No PowerPoint e no Google Slides, clique no ícone dentro da caixa para escolher a imagem. No LibreOffice, insira a imagem (Inserir > Imagem) e arraste-a sobre a caixa; apague a caixa depois. No slide "Imagem cheia", clique com o botão direito na imagem de exemplo e escolha "Substituir imagem".

O QR code do encerramento leva ao site do evento. Para trocar: no LibreOffice, Inserir > Objeto > Código QR e de barras; no Google Slides e no PowerPoint, gere a imagem num gerador de QR code e use "Substituir imagem". Escreva o link embaixo do QR code também e teste a leitura com o celular a alguns metros da tela.

## Antes de apresentar

- **Texto:** quem senta no fundo da sala precisa ler o slide também. O texto do modelo começa em 20 pt e diminui sozinho até caber; se ele diminuir, divida o slide em dois. Nada abaixo de 18 pt. O slide apoia a sua fala; o que não couber vai para as notas do apresentador.
- **Código:** até 8 linhas e cerca de 60 colunas por slide. Se o trecho for maior, divida em mais slides ou refatore o exemplo para mostrar só o que importa: 20 linhas pequenas ninguém lê do fundo da sala.
- **Link dos slides:** mostre um QR code no encerramento. Ninguém copia um link da tela, mas todo mundo aponta o celular. Aponte o QR code para um lugar só, com slides, código e contatos.
- **Perguntas:** reserve uns 5 minutos do seu horário para perguntas e combine com quem modera como avisar o fim do tempo. Repita cada pergunta no microfone antes de responder: a sala e a gravação não ouvem quem perguntou.
- **Sobre você:** quem abre a sessão costuma apresentar você antes da palestra. Se o tempo estiver curto, o slide "Sobre mim" pode sair, ou virar uma linha na capa.
- **Live coding:** tenha um plano B. Grave um vídeo da demo funcionando ou capture telas de cada passo, e deixe os arquivos no computador. Se algo falhar no palco, você troca para a gravação e segue.
- **Internet:** a rede do evento pode cair ou ficar lenta com centenas de pessoas conectadas. Baixe os vídeos, as páginas e os notebooks que vai mostrar; não dependa de streaming nem de demos online.
- **Arquivo:** leve uma cópia dos slides em PDF num pendrive, com os vídeos e as imagens juntos. O PDF abre em qualquer computador, com as fontes certas.

## Layouts

Todos existem em versão escura e clara, exceto a imagem cheia, que é só escura.

| Layout | Para |
|---|---|
| Capa | Título da palestra em até três linhas, subtítulo, nome e handle, com o logo e o selo da data |
| Agenda | Lista numerada de três a cinco partes da palestra |
| Seção | Divisor com número no disco limão, a bruxinha ao fundo e o logo, sem número de slide |
| Título e conteúdo | Tópicos; de três a cinco por slide |
| Duas colunas | Comparações com título em cada coluna: antes e depois, problema e solução |
| Texto e imagem | Texto à esquerda, imagem à direita |
| Imagem e texto | Imagem sangrada à esquerda, texto à direita |
| Três imagens | Três capturas de tela lado a lado, cada uma com legenda |
| Código | Cartão escuro com até 8 linhas e 60 colunas de código a 15 pt |
| Código lado a lado | Dois cartões de código, antes e depois, com até 8 linhas e 30 colunas cada |
| Citação | Frase em destaque com autoria |
| Frase | Uma frase só, grande, para a ideia principal ou para mudar de assunto |
| Números em destaque | Três números grandes com rótulo; cabem valores como "1.200" ou "R$ 3,5 mi" |
| Três cartões | Três blocos com título e descrição |
| Destaque | Painel limão com o título à esquerda e até quatro tópicos à direita, para a mensagem que a sala não pode perder |
| Palestrante | Foto, nome, cargo e três fatos |
| Somente título | Espaço livre para tabelas, gráficos e diagramas |
| Imagem cheia | Foto de fundo com faixa de legenda |
| Referências | Um material por linha, com nome e endereço curto |
| Encerramento | "Valeu!" ou "Perguntas?", contatos, um QR code grande com o link dos slides e o lema "pessoas > tecnologia" |
| Em branco | Só o nome do evento e o número do slide |

## Cores e contraste

Todas as combinações de texto e fundo usadas no modelo passam no nível AA do WCAG 2.1 (contraste mínimo de 4,5:1 para texto normal). As principais passam no AAA.

| Uso | Cor | Sobre | Contraste |
|---|---|---|---|
| Fundo escuro | `#0F0F0F` | | |
| Texto no escuro (verde claro) | `#E8F4BA` | `#0F0F0F` | 16,5:1 |
| Destaque no escuro (limão) | `#B7FF06` | `#0F0F0F` | 15,8:1 |
| Texto secundário no escuro (cinza) | `#ABABAB` | `#0F0F0F` | 8,4:1 |
| Link no escuro (violeta claro), sublinhado | `#D26CC9` | `#0F0F0F` | 6,1:1 |
| Cartões no escuro | `#242424`, borda `#3A3A3A` | | |
| Texto em cartão escuro | `#E8F4BA` | `#242424` | 13,4:1 |
| Fundo claro | `#FFFFFF` | | |
| Texto no claro | `#0F0F0F` | `#FFFFFF` | 19,2:1 |
| Marca-texto no claro | `#0F0F0F` | `#B7FF06` | 15,8:1 |
| Texto secundário no claro | `#4A4A4A` | `#FFFFFF` | 8,9:1 |
| Link no claro (violeta), sublinhado | `#BF2EB2` | `#FFFFFF` | 4,9:1 |
| Cartões no claro | `#E8F4BA`, borda `#C9D9A0` | | |
| Texto em cartão claro | `#0F0F0F` | `#E8F4BA` | 16,5:1 |

Regras para manter o contraste quando você editar:

- Verde limão `#B7FF06` como cor de texto, só sobre fundo escuro. Sobre fundo branco o contraste é 1,2:1 e o texto some. No fundo claro, destaque a palavra com o limão como cor de realce do texto (marca-texto) e mantenha o texto preto. O realce acompanha a palavra quando você edita.
- Discos e retângulos limão aparecem nos dois modos, sempre com texto preto `#0F0F0F`.
- Cartões e espaços para imagem têm borda fina: só a cor de fundo deles fica a 1,1:1 do fundo do slide e some em projetor fraco.
- Se for usar outras cores, confira o contraste no [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).

O telão da Python Brasil 2026 é de LED. Em telão de LED, o fundo escuro costuma funcionar melhor, por isso o modelo começa pelos layouts escuros.

## Identidade visual

Resumo do brandboard oficial da Python Brasil 2026, criado por [Ana Terhorst](https://anaterhorstdesign.com), para quem cria material novo a partir deste modelo, com ou sem ajuda de uma IA. As regras de contraste da seção anterior valem também aqui.

**Cores principais**

| Nome | Hex | Uso no modelo |
|---|---|---|
| Preto | `#0F0F0F` | Fundo escuro, texto no claro, texto sobre o limão |
| Off white | `#E8F4BA` | Texto no escuro, cartões no claro |
| Verde cítrico | `#B7FF06` | Destaque: discos, painéis, marca-texto; como cor de texto, só no escuro |
| Violeta | `#BF2EB2` | Links no claro (4,9:1 sobre branco). Sobre o preto fica em 3,9:1, abaixo do mínimo para texto |

**Tons de apoio:** `#D26CC9` (violeta claro, links no escuro), `#EFCBEC`, `#CCFF50`, `#EDFFC1`, `#ABABAB` (cinza, texto secundário no escuro) e `#E7E7E7`.

**Tipografia:** Cascadia Mono nos títulos, Roboto nos parágrafos.

**Logos:** a assinatura (adesivo "PythonBrasil" com o dragão), o logo horizontal ("python brasil 2026" empilhado, com o dragão), a sigla "pybr" e a abstração ("pybr" dentro de uma elipse pixelada).

**Elementos gráficos:**

- Magia: estrelas, explosões e brilhos, em limão, violeta ou preto.
- Ícones pixelados: seta e `</>`, em quadrado limão.
- Moldura e etiqueta em forma de pílula.
- Ilustrações em traço preto: o mago "Olá, mundo!", a bruxinha surfista e o mago digitando.
- Padrões de chevron, em limão e em preto e branco.

**Frases:** a chamada "Um evento feito pra todo mundo" e o lema "pessoas > tecnologia".

Para manter a marca, use as peças como estão: sem distorcer, sem recolorir fora da paleta e sem efeitos. Para aumentar ou diminuir uma peça, arraste um canto segurando Shift.

## Figurinhas

O último slide traz figurinhas para copiar e colar: o logo, a assinatura PythonBrasil, a bruxinha surfista, os dois magos, a explosão de magia, os ícones pixelados, o círculo pixelado e o marca-texto. Os arquivos em PNG estão em [`assets/brand/`](assets/brand/), com outras peças do brandboard.

As cores estão no tema do arquivo. Se você trocar uma cor do tema (LibreOffice: Slide > Mestre; PowerPoint: Exibir > Slide mestre > Cores), todos os slides mudam juntos.

## Acessibilidade

- Tamanhos: 20 pt no corpo (diminui até caber, nunca abaixo de 18 pt), 18 pt em cartões e rótulos, 15 pt no código, 32 pt nos títulos. O slide tem 10 polegadas de largura, então 20 pt aqui equivalem a 27 pt num slide widescreen padrão de 13,33 polegadas.
- Idioma do texto marcado como português do Brasil, para leitores de tela e corretor ortográfico.
- Todas as caixas de texto são texto de verdade, não imagem, com exceção do logo e das ilustrações.
- As imagens de exemplo têm texto alternativo; ao inserir as suas, preencha o texto alternativo (botão direito > Descrição ou Texto alternativo).
- Os espaços reservados têm nomes (`title`, `body`, `code`), o que ajuda a navegação por teclado e a ordem de leitura.

## Código nos slides

O modelo usa o tema **Monokai** para código. O verde-limão e o magenta do Monokai combinam com o limão e o violeta da Python Brasil, e todas as cores do tema passam no contraste AA sobre o cartão escuro (`#1A1A1A`).

Os programas de apresentação não colorem código. Para ter as mesmas cores no seu trecho, use o [SlideSnippet](https://www.slidesnippet.com/) com estas opções:

| Opção | Valor |
|---|---|
| Theme | Monokai |
| Font size | 20px (15 pt no slide) |
| Line height | 1.2 |
| Background | `#1A1A1A` (RGB 26, 26, 26) |

Depois, conforme o programa:

- **Google Slides:** escolha "Optimised for: Google Slides / Docs" e clique em "Copy styled". Clique dentro do cartão do slide "Código" e cole pelo menu Editar > Colar; o Ctrl+V pode perder as cores. O código continua editável.
- **PowerPoint:** escolha "Optimised for: PowerPoint / Word", clique em "Copy styled" e cole com "Manter formatação original".
- **LibreOffice:** o LibreOffice perde as cores ao colar texto do navegador. Clique em "Download SVG" e arraste o arquivo para o slide, sobre o cartão. O SVG fica nítido em qualquer tamanho. Para código editável, instale a extensão [Code Highlighter 2](https://extensions.libreoffice.org/en/extensions/show/5814) e escolha o estilo `monokai`.

Quando o código entrar como imagem, escreva o código no texto alternativo (botão direito > Descrição no LibreOffice, Texto alternativo no Google Slides e no PowerPoint), para leitores de tela.

O cartão aceita até 8 linhas de 15 pt.

## Para quem quer mudar o modelo pelo código

Esta parte serve para quem quer clonar ou fazer um fork do repositório e mudar o modelo. Para usar o modelo numa palestra, as seções acima bastam.

### Gerar os arquivos

O `.pptx` é gerado por um script Node com [pptxgenjs](https://gitbrent.github.io/PptxGenJS/). Edite `pptx/build.js` para mudar layouts, cores ou textos de exemplo.

```sh
npm install
npm run build     # escreve dist/pybr2026-template.pptx
npm run render    # PDF, PNGs e GIF em dist/preview/ e dist/pybr2026-template.odp (precisa de LibreOffice, poppler e ImageMagick)
```

As anotações dos slides ficam em `pptx/notes.pt-BR.js`, com uma lista de dicas curtas por slide, na ordem do deck. A paleta e as fontes ficam no objeto `THEME` no topo de `pptx/build.js`. O arquivo `pptx/lib/theme.js` grava essas cores no tema do `.pptx`; `pptx/lib/highlight.js` colore o código de exemplo.

As figurinhas saem do brandboard oficial em PDF, que não fica no repositório. `assets/extract_brandboard.sh` recorta as peças do PDF em PNG transparente a 600 dpi, na pasta `assets/brandboard/` (fora do git), e `assets/make_brand_assets.sh` gera a partir delas as versões usadas no modelo, em `assets/brand/` (precisa de poppler e ImageMagick 7).

A pasta `dist/` fica fora do git. Para publicar uma versão, crie e envie uma tag:

```sh
git tag v3.0
git push origin v3.0
```

A Action `.github/workflows/release.yml` gera os arquivos e cria uma Release com o `.pptx`, o `.odp`, o GIF e a visão geral. O README aponta sempre para a Release mais recente.

### Atualizar a cópia no Google Slides

A cópia no Google Slides não é atualizada pelo script. Depois de mudar o `.pptx`, envie o arquivo para o Drive, abra e escolha Arquivo > Salvar como Apresentações Google, compartilhe como "Qualquer pessoa com o link: Leitor" e troque o ID no link "Fazer uma cópia" deste README.

## Licenças

- Código deste repositório: MIT.
- Logo, ilustrações e identidade visual: Python Brasil 2026 e APyB, do brandboard oficial do evento, criado por [Ana Terhorst](https://anaterhorstdesign.com).
- Fontes Roboto e Cascadia Mono: SIL Open Font License 1.1, em `fonts/`.
