# Instruções para agentes

Este repositório gera o modelo de slides da Python Brasil 2026 em `.pptx` e `.odp`. Você pode estar aqui por dois motivos:

1. **Uma pessoa palestrante pediu ajuda com a palestra** (slides, imagens, diagramas, um gráfico). Siga as regras da marca e de conteúdo abaixo.
2. **Alguém quer mudar o modelo.** Leia também a seção "Mudar o modelo".

## Regras da marca

| Cor | Hex | RGB | Uso |
|---|---|---|---|
| Preto | `#0F0F0F` | 15, 15, 15 | Fundo escuro, texto no fundo claro, texto sobre o limão |
| Off-white | `#E8F4BA` | 232, 244, 186 | Texto no fundo escuro, cartões no fundo claro |
| Verde limão | `#B7FF06` | 183, 255, 6 | Destaque: discos, painéis, barras, marca-texto |
| Violeta | `#BF2EB2` | 191, 46, 178 | Links no fundo claro |
| Violeta claro | `#D26CC9` | 210, 108, 201 | Links no fundo escuro |
| Cinza | `#ABABAB` | 171, 171, 171 | Texto secundário no fundo escuro |
| Cinza escuro | `#4A4A4A` | 74, 74, 74 | Texto secundário no fundo claro |

- Fontes: Cascadia Mono nos títulos e no código, Roboto no texto.
- Verde limão como cor de texto, só no fundo escuro. No fundo branco, o contraste é 1,2:1. No fundo claro, destaque a palavra com o limão como marca-texto e mantenha o texto preto.
- Todo texto precisa de contraste de 4,5:1 com o fundo (WCAG 2.1 AA). A tabela completa está em [`docs/referencia.md`](docs/referencia.md#cores-e-contraste).
- Código usa o tema GitHub Light sobre o cartão branco `#FFFFFF`, com borda `#D0D7DE`, nos slides escuros e nos claros. Monokai sobre `#1A1A1A` fica só como alternativa para quem quer código em fundo escuro, com a fonte bem grande.
- Tela de LED do tamanho de uma parede: versão escura, que não ofusca o público. Projetor, TV ou monitor: versão clara. O código fica em fundo claro nas duas.
- Use as peças de `assets/brand/` como estão: sem distorcer, sem recolorir fora da paleta e sem efeitos. Uma figurinha por slide costuma bastar.
- A identidade visual é de Ana Terhorst; mantenha o crédito no slide de figurinhas.
- Gráficos e diagramas: barras e caixas em limão, rótulos com os números, fundo transparente ou da cor do slide.

## Regras de conteúdo

- O conteúdo é da pessoa palestrante. Organize, encurte e escolha os layouts, mas não invente fatos, exemplos, números nem opiniões. Se faltar alguma coisa, pergunte.
- Uma ideia por slide, de 3 a 5 tópicos curtos. O que não cabe vai para as anotações.
- Texto no corpo de 20 pt, nunca abaixo de 18 pt. Código: até 8 linhas e 60 colunas por slide.
- Conte mais ou menos 1 minuto por slide, depois de separar uns 5 minutos para perguntas. Pergunte a duração da palestra se não souber.
- Toda imagem leva texto alternativo; gráficos levam os números no texto alternativo.
- Linguagem neutra de gênero quando possível ("pessoa palestrante", "o público").
- O tom é de dica, não de regra: apoio, sem cobrança e sem prometer resultado. Evite "é só", "é fácil" e "todo mundo sabe".

## Mudar o modelo

- `pptx/build.js` gera o `.pptx` com pptxgenjs: layouts, slides de exemplo e o objeto `THEME` com a paleta e as fontes.
- `pptx/notes.pt-BR.js` tem as anotações, uma lista por slide, na ordem do deck. O build falha se o número de anotações for diferente do número de slides: ao criar ou apagar um slide, mude as anotações também.
- `pptx/lib/` corrige o arquivo depois do pptxgenjs: tema, numeração, anotações, versaletes e o formato das categorias dos gráficos.
- `assets/make_examples.py` baixa as imagens de exemplo; `assets/make_brand_assets.sh` gera as figurinhas.
- O texto dos slides e das anotações é em português do Brasil.

Para conferir uma mudança, gere o arquivo e olhe só os slides que mudaram:

```sh
npm run build
soffice --headless --convert-to pdf --outdir build dist/pybr2026-template.pptx
pdftoppm -f 17 -l 17 -png -r 110 -singlefile build/pybr2026-template.pdf build/slide17
```

O [`CONTRIBUTING.md`](CONTRIBUTING.md) explica como publicar uma versão.
