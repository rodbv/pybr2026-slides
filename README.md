# Modelo de slides da Python Brasil 2026

Português · [English](README.en.md) · [Español](README.es.md)

Um modelo de apresentação pronto para quem vai palestrar na [Python Brasil 2026](https://2026.pythonbrasil.org.br/), em Florianópolis, de 14 a 19 de outubro. Você abre, troca o texto de exemplo pelo seu e apresenta.

## Escolha como vai editar

| Você usa | Faça isto |
|---|---|
| Google Slides | **[Fazer uma cópia no Google Slides](https://docs.google.com/presentation/d/1LQZIauikHcRz-kbtwXgXqEaAjwqFKrtijFkz4NQCjps/copy)**. A cópia vai para o seu Google Drive. |
| PowerPoint ou Keynote | Baixe o [`.pptx`](https://github.com/rodbv/pybr2026-slides/releases/latest/download/pybr2026-template.pptx) e [instale as fontes](#preciso-instalar-fontes). |
| LibreOffice | Baixe o [`.odp`](https://github.com/rodbv/pybr2026-slides/releases/latest/download/pybr2026-template.odp). As fontes já vêm dentro do arquivo. |
| Um editor de texto | Use o [modelo em Markdown](https://github.com/rodbv/pybr2026-marp): você escreve os slides em texto e um agente de IA, como o Copilot ou o Claude, aplica o visual. |

![Alguns slides do modelo, um a cada 2,5 segundos: capa, frase, palestrante, agenda, imagem, código, números, gráfico, fluxo, destaque, perguntas, capa clara e figurinhas](https://github.com/rodbv/pybr2026-slides/releases/latest/download/tour.gif)

<details>
<summary>Ver os 38 slides de uma vez</summary>

![Visão geral dos 38 slides de exemplo](https://github.com/rodbv/pybr2026-slides/releases/latest/download/overview.png)

</details>

## Depois de abrir

Os slides de exemplo mostram cada layout e trazem dicas nas anotações. Use as dicas que servirem para você.

1. Guarde uma cópia do modelo sem mudanças, para consultar as dicas depois.
2. Numa segunda cópia, com o nome da sua palestra, escolha a versão escura ou a clara e apague a outra metade.
3. Duplique os slides que você vai usar e apague os outros. Para um slide novo, use Slide > Novo slide e escolha o layout.
4. Troque o texto e as imagens. As caixas cinza marcam o lugar das imagens: clique com o botão direito e escolha "Substituir imagem" (no PowerPoint, "Alterar Imagem").
5. Apague as anotações dos exemplos e escreva as suas.

Uma palestra de 25 minutos costuma caber em 15 a 25 slides: capa, agenda, uma seção para cada parte, o conteúdo e o encerramento, com uns 5 minutos para perguntas.

Antes de apresentar, procure no arquivo o que ficou do modelo: "Seu nome aqui", "@seu_usuario", "voce@exemplo.com.br", caixas cinza, "Dados de exemplo" e "Troque pelo seu QR code".

O modelo é um ponto de partida: mude o que quiser. Para manter a cara do evento, use as cores e as fontes abaixo. O [resumo da identidade visual](docs/referencia.md#identidade-visual) traz o resto: logos, figurinhas e regras de contraste.

## Cores e fontes

| | Cor | Hex | RGB | Uso |
|---|---|---|---|---|
| ![Amostra de preto](docs/cores/0F0F0F.png) | Preto | `#0F0F0F` | 15, 15, 15 | Fundo escuro, texto no fundo claro |
| ![Amostra de off white](docs/cores/E8F4BA.png) | Off white | `#E8F4BA` | 232, 244, 186 | Texto no fundo escuro |
| ![Amostra de verde limão](docs/cores/B7FF06.png) | Verde limão | `#B7FF06` | 183, 255, 6 | Destaque; como cor de texto, só no fundo escuro |
| ![Amostra de violeta](docs/cores/BF2EB2.png) | Violeta | `#BF2EB2` | 191, 46, 178 | Links no fundo claro |

| Fonte | Uso |
|---|---|
| [Cascadia Mono](https://fonts.google.com/specimen/Cascadia+Mono) | Títulos e código |
| [Roboto](https://fonts.google.com/specimen/Roboto) | Texto |

Vai criar material com um agente de IA? Peça que ele leia o [`AGENTS.md`](AGENTS.md): o arquivo traz as cores, as fontes e as regras da marca.

## Antes de apresentar

Primeira palestra? Que bom. A plateia da Python Brasil torce por você, e estas dicas são sugestões, não regras.

- **Texto:** com 18 pt ou mais, quem senta no fundo da sala também lê o slide. Se o texto não couber, divida o slide em dois e leve o resto para as anotações.
- **Código:** até 8 linhas e cerca de 60 colunas por slide. Se o trecho for maior, divida em mais slides ou mostre só a parte que importa.
- **QR code:** troque o QR code do encerramento pelo seu, com o link do seu contato, dos seus slides ou de uma página com tudo isso. Escreva o link embaixo dele também.
- **Perguntas:** reserve uns 5 minutos para perguntas. Repita cada pergunta no microfone antes de responder, para a sala e a gravação.
- **Live coding:** tenha um plano B, como um vídeo da demo funcionando ou capturas de tela de cada passo.
- **Internet:** com os vídeos, as páginas e os notebooks baixados, você não depende da rede do evento.
- **PDF:** exporte os slides em PDF e leve num pendrive. O PDF abre em qualquer computador, com as fontes certas. Google Slides: Arquivo > Fazer download > Documento PDF. PowerPoint: Arquivo > Exportar. LibreOffice: Arquivo > Exportar como > Exportar como PDF.

## Dúvidas frequentes

<details>
<summary>Preciso instalar fontes?</summary>

Só para o `.pptx`. O Google Slides encontra as fontes sozinho e o `.odp` já traz as fontes dentro. O modelo usa a Roboto no texto e a Cascadia Mono nos títulos e no código; as duas estão na pasta [`fonts/`](fonts/).

- **Windows:** selecione os `.ttf`, clique com o botão direito e escolha "Instalar".
- **macOS:** abra cada `.ttf` e clique em "Instalar fonte".
- **Linux:** copie os `.ttf` para `~/.local/share/fonts/` e rode `fc-cache -f`.

Sem as fontes, o programa usa outra fonte no lugar. O texto continua legível, mas os títulos podem quebrar em lugares diferentes.

</details>

<details>
<summary>Como troco uma imagem ou o QR code?</summary>

Clique com o botão direito na caixa cinza ou no QR code e escolha "Substituir imagem" (no PowerPoint, "Alterar Imagem"). O tamanho escrito na caixa é o tamanho que preenche o espaço numa tela Full HD.

Para gerar o QR code no LibreOffice, use Inserir > Objeto > Código QR e de barras. Nos outros programas, gere a imagem num site de QR code. Teste a leitura com o celular a alguns metros da tela.

</details>

<details>
<summary>Como coloco código colorido?</summary>

Os programas de apresentação não colorem código. Cole o seu trecho no [SlideSnippet](https://www.slidesnippet.com/) e escolha o tema Monokai. Depois:

- **Google Slides:** clique em "Copy styled" e cole no cartão do slide "Código" pelo menu Editar > Colar.
- **PowerPoint:** clique em "Copy styled" e cole com "Manter Formatação Original".
- **LibreOffice:** clique em "Download SVG" e arraste o arquivo para o cartão.

A [referência](docs/referencia.md#código-nos-slides) traz as opções completas.

</details>

<details>
<summary>Como troco os dados do gráfico?</summary>

- **PowerPoint:** clique com o botão direito no gráfico e escolha "Editar Dados".
- **LibreOffice:** clique duas vezes no gráfico e use Exibir > Tabela de dados.
- **Google Slides:** o gráfico vira imagem na importação. Crie o seu em Inserir > Gráfico.

</details>

## Achou um problema?

Abra uma [issue no GitHub](https://github.com/rodbv/pybr2026-slides/issues) contando o que aconteceu, em qual programa e, se puder, com uma captura de tela.

## Mais informações

- [Referência](docs/referencia.md): layouts, cores e contraste, identidade visual, acessibilidade e código nos slides.
- [Como contribuir](CONTRIBUTING.md): como o modelo é gerado e publicado.

## Licenças

- Modelo, textos de exemplo e código deste repositório: [CC0 1.0](LICENSE) (domínio público). Use, mude e compartilhe sem pedir permissão nem dar crédito.
- Logo, ilustrações e identidade visual: Python Brasil 2026 e APyB, do brandboard oficial do evento, criado por [Ana Terhorst](https://anaterhorstdesign.com).
- Fontes Roboto e Cascadia Mono: SIL Open Font License 1.1, em `fonts/`.
