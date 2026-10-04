# Referência do modelo

Detalhes do modelo de slides da Python Brasil 2026 para quem quer criar slides novos, mudar o visual ou conferir uma regra. Para começar a usar o modelo, veja o [README](../README.md).

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
| Encerramento | "Valeu!" ou "Perguntas?", contatos e um QR code grande com o link dos slides |
| Em branco | Só o nome do evento e o número do slide |

Para criar um slide novo a partir de um layout, use Slide > Novo slide e escolha o layout no painel lateral (LibreOffice: Propriedades > Layouts; Google Slides e PowerPoint: botão Layout).

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
| Cartão de código, nos dois modos | `#1A1A1A` | | |
| Fundo claro | `#FFFFFF` | | |
| Texto no claro | `#0F0F0F` | `#FFFFFF` | 19,2:1 |
| Marca-texto no claro | `#0F0F0F` | `#B7FF06` | 15,8:1 |
| Texto secundário no claro | `#4A4A4A` | `#FFFFFF` | 8,9:1 |
| Link no claro (violeta), sublinhado | `#BF2EB2` | `#FFFFFF` | 4,9:1 |
| Cartões no claro | `#E8F4BA`, borda `#C9D9A0` | | |
| Texto em cartão claro | `#0F0F0F` | `#E8F4BA` | 16,5:1 |

Regras para manter o contraste quando você editar:

- Verde limão `#B7FF06` como cor de texto, só sobre fundo escuro. Sobre fundo branco o contraste é 1,2:1 e o texto some. No fundo claro, destaque a palavra com o limão como cor de realce do texto (marca-texto) e mantenha o texto preto.
- Discos e retângulos limão aparecem nos dois modos, sempre com texto preto `#0F0F0F`.
- Cartões têm borda fina: só a cor de fundo deles fica a 1,1:1 do fundo do slide e some em projetor fraco.
- Se for usar outras cores, confira o contraste no [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).

O telão da Python Brasil 2026 é de LED. Em telão de LED, o fundo escuro costuma funcionar melhor, por isso o modelo começa pelos layouts escuros.

As cores estão no tema do arquivo. Se você trocar uma cor do tema (LibreOffice: Slide > Mestre; PowerPoint: Exibir > Slide mestre > Cores), todos os slides mudam juntos.

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

- Magia: estrelas, estrela pixelada, explosões e brilhos, em limão, violeta ou preto.
- Ícones pixelados: seta e `</>`, em quadrado limão.
- Moldura e etiqueta em forma de pílula.
- Ilustrações em traço preto: o mago "Olá, mundo!", a bruxinha surfista e o mago digitando.
- Padrões de chevron, em limão e em preto e branco.

**Frases:** a chamada "Um evento feito pra todo mundo" e o lema "pessoas > tecnologia".

Para manter a marca, use as peças como estão: sem distorcer, sem recolorir fora da paleta e sem efeitos. Para aumentar ou diminuir uma peça, arraste um canto segurando Shift.

### Figurinhas

O último slide traz figurinhas para copiar e colar: o logo, a assinatura PythonBrasil, a bruxinha surfista, os dois magos, a explosão de magia, os ícones pixelados, o círculo pixelado e o marca-texto. Os arquivos em PNG estão em [`assets/brand/`](../assets/brand/), com outras peças do brandboard: as estrelas pretas (`magia-estrela.png`, `magia-brilhos.png`), a estrela pixelada (`magia-estrela-pixel.png`) e as versões escura e clara das ilustrações. As peças pretas servem para o fundo claro.

## Acessibilidade

- Tamanhos: 20 pt no corpo (diminui até caber, nunca abaixo de 18 pt), 18 pt em cartões e rótulos, 15 pt no código, 32 pt nos títulos. O slide tem 10 polegadas de largura, então 20 pt aqui equivalem a 27 pt num slide widescreen padrão de 13,33 polegadas.
- Idioma do texto marcado como português do Brasil, para leitores de tela e corretor ortográfico.
- Todas as caixas de texto são texto de verdade, não imagem, com exceção do logo e das ilustrações.
- Ao inserir as suas imagens, preencha o texto alternativo (botão direito > Descrição ou Texto alternativo).
- Os espaços reservados têm nomes (`title`, `body`, `code`), o que ajuda a navegação por teclado e a ordem de leitura.

## Código nos slides

O modelo usa o tema **Monokai** para código. O verde-limão e o magenta do Monokai combinam com o limão e o violeta da Python Brasil, e todas as cores do tema passam no contraste AA sobre o cartão de código (`#1A1A1A`).

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
