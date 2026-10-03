// Builds dist/pybr2026-template.pptx: a themed deck whose layouts carry the
// Python Brasil 2026 brand, with one example slide per layout.
const path = require("path");
const fs = require("fs");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require("./lib/theme");
const { highlightCode, CODE_TEXT_COLOR } = require("./lib/highlight");

const ROOT = path.resolve(__dirname, "..");
const BRAND = path.join(ROOT, "assets", "brand");
const DIST = path.join(ROOT, "dist");
const OUT = path.join(DIST, "pybr2026-template.pptx");

const THEME = {
  name: "Python Brasil 2026",
  headFontFace: "Cascadia Mono",
  bodyFontFace: "Inter",
  colors: {
    dk1: "0F0F0F", // preto (fundo escuro, texto no claro)
    lt1: "F0F8FF", // gelo (texto no escuro, cartões no claro)
    dk2: "1A1A1A", // cartões no escuro
    lt2: "E8F4BA", // verde claro (fundo claro)
    accent1: "B7FF06", // verde limão: só sobre fundo escuro
    accent2: "C95FB4", // roxo: só sobre fundo escuro
    accent3: "3F6300", // oliva: destaque sobre fundo claro
    accent4: "7A2F6B", // ameixa: roxo sobre fundo claro
    accent5: "A8A8A8", // texto secundário sobre fundo escuro
    accent6: "4A4A4A", // texto secundário sobre fundo claro
    hlink: "C95FB4",
    folHlink: "7A2F6B",
  },
};
const HEX = THEME.colors;

const W = 10;
const H = 5.625;
const M = 0.5; // margem lateral
const TITLE = { x: M, y: 0.42, w: W - 2 * M, h: 1.0 };
const BODY = { x: M, y: 1.55, w: W - 2 * M, h: 3.3 };
const FOOTER_Y = 5.08;
const LANG = "pt-BR";

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = "Python Brasil 2026: modelo de apresentação";
pres.subject = "Modelo de slides para palestrantes e organização da Python Brasil 2026";
pres.author = "Comunidade Python Brasil";
pres.company = "Python Brasil 2026";
pres.lang = LANG;
const C = pres.SchemeColor;

// Two color modes share every layout definition.
const DARK = {
  suffix: "",
  bg: HEX.dk1,
  text: C.background1,
  textHex: HEX.lt1,
  muted: C.accent5,
  mutedHex: HEX.accent5,
  card: C.text2,
  cardHex: HEX.dk2,
  accent: C.accent1,
  accentHex: HEX.accent1,
  purple: C.accent2,
  purpleHex: HEX.accent2,
  onAccent: C.text1,
  logo: path.join(BRAND, "logo-light-on-dark.png"),
  dragon: path.join(BRAND, "dragon-lime.png"),
};
const LIGHT = {
  suffix: " (claro)",
  bg: HEX.lt2,
  text: C.text1,
  textHex: HEX.dk1,
  muted: C.accent6,
  mutedHex: HEX.accent6,
  card: C.background1,
  cardHex: HEX.lt1,
  accent: C.accent3,
  accentHex: HEX.accent3,
  purple: C.accent4,
  purpleHex: HEX.accent4,
  onAccent: C.background1,
  logo: path.join(BRAND, "logo-dark-on-light.png"),
  dragon: path.join(BRAND, "dragon-dark.png"),
};

// ---------- layout building blocks ----------

const LOGO_RATIO = 262 / 1653;
function logo(mode, { x = M, y = FOOTER_Y, w = 1.5 } = {}) {
  return { image: { x, y, w, h: w * LOGO_RATIO, path: mode.logo } };
}

function slideNumber(mode) {
  return { x: W - M - 0.6, y: FOOTER_Y - 0.03, w: 0.6, h: 0.3, fontSize: 10, color: mode.mutedHex, align: "right", fontFace: THEME.headFontFace };
}

function ph(name, type, box, text, options = {}) {
  return { placeholder: { options: { name, type, ...box, margin: 0, lang: LANG, valign: "top", ...options }, text } };
}

function titlePh(mode, box = TITLE, text = "Título do slide") {
  return ph("title", "title", box, text, { fontSize: 32, bold: true, color: mode.text, align: "left", fit: "shrink" });
}

// defineSlideMaster only knows rect, text, image, line and chart objects; a text object
// with a shape gives layouts their circles and rounded cards.
function shape(kind, box, fillHex, options = {}, text = " ") {
  return { text: { text, options: { shape: kind, ...box, fill: { color: fillHex }, line: { color: fillHex, width: 0 }, ...options } } };
}

function bodyPh(mode, name, box, text = "Clique para adicionar texto", options = {}) {
  return ph(name, "body", box, text, { fontSize: 18, color: mode.text, bullet: { indent: 18 }, paraSpaceAfter: 8, ...options });
}

function imagePh(mode, name, box, text = "Clique no ícone para inserir uma imagem") {
  return ph(name, "pic", box, text, { fontSize: 12, color: mode.muted, align: "center", valign: "middle", fill: { color: mode.card } });
}

function defineLayout(name, mode, objects, extra = {}) {
  pres.defineSlideMaster({
    title: name + mode.suffix,
    background: { color: mode.bg },
    slideNumber: slideNumber(mode),
    objects: [logo(mode), ...objects],
    ...extra,
  });
}

// ---------- layouts ----------

for (const mode of [DARK, LIGHT]) {
  const dragonH = 4.3;
  const dragonW = dragonH * (664 / 841);

  if (mode === DARK) {
    pres.defineSlideMaster({
      title: "Capa",
      background: { color: mode.bg },
      objects: [
        logo(mode, { x: M, y: 0.45, w: 3.2 }),
        { image: { x: W - dragonW - 0.35, y: H - dragonH - 0.2, w: dragonW, h: dragonH, path: mode.dragon } },
        ph("title", "title", { x: M, y: 1.55, w: 5.7, h: 1.7 }, "Título da palestra", { fontSize: 36, bold: true, color: mode.accent, align: "left", valign: "bottom", fit: "shrink" }),
        ph("subtitle", "body", { x: M, y: 3.35, w: 5.7, h: 0.6 }, "Subtítulo ou frase de efeito", { fontSize: 18, color: mode.text }),
        ph("speaker", "body", { x: M, y: 4.05, w: 5.7, h: 0.6 }, "Nome da pessoa palestrante · @usuario", { fontSize: 16, bold: true, color: mode.text }),
        { text: { text: "14 a 19 de outubro de 2026  {Floripa/SC}", options: { x: M, y: FOOTER_Y - 0.05, w: 5.7, h: 0.35, fontSize: 12, fontFace: THEME.headFontFace, color: mode.purpleHex, margin: 0, isTextBox: true, lang: LANG } } },
      ],
    });

    pres.defineSlideMaster({
      title: "Encerramento",
      background: { color: mode.bg },
      slideNumber: slideNumber(mode),
      objects: [
        logo(mode),
        { image: { x: M, y: 0.55, w: dragonW * 0.85, h: dragonH * 0.85, path: mode.dragon } },
        ph("title", "title", { x: 4.3, y: 1.2, w: 5.2, h: 1.2 }, "Obrigado!", { fontSize: 40, bold: true, color: mode.accent, align: "left", fit: "shrink" }),
        bodyPh(mode, "body", { x: 4.3, y: 2.5, w: 5.2, h: 2.3 }, "Contatos, links e onde encontrar os slides", { bullet: false, fontSize: 18, paraSpaceAfter: 10 }),
      ],
    });
  }

  // Seção: círculo limão com o número, título à direita
  defineLayout("Seção", mode, [
    shape("ellipse", { x: M, y: 1.75, w: 2.1, h: 2.1 }, mode.accentHex),
    ph("number", "body", { x: M, y: 1.75, w: 2.1, h: 2.1 }, "01", { fontSize: 40, bold: true, color: mode.onAccent, align: "center", valign: "middle", fontFace: THEME.headFontFace }),
    ph("title", "title", { x: 3.1, y: 1.75, w: 6.4, h: 2.1 }, "Título da seção", { fontSize: 36, bold: true, color: mode.text, align: "left", valign: "middle", fit: "shrink" }),
  ]);

  defineLayout("Título e conteúdo", mode, [titlePh(mode), bodyPh(mode, "body", BODY)]);

  defineLayout("Somente título", mode, [titlePh(mode)]);

  const colW = (W - 2 * M - 0.4) / 2;
  defineLayout("Duas colunas", mode, [
    titlePh(mode),
    bodyPh(mode, "left", { ...BODY, w: colW }),
    bodyPh(mode, "right", { ...BODY, x: M + colW + 0.4, w: colW }),
  ]);

  defineLayout("Texto e imagem", mode, [
    titlePh(mode),
    bodyPh(mode, "body", { ...BODY, w: 4.6 }),
    imagePh(mode, "image", { x: M + 4.6 + 0.4, y: BODY.y, w: W - M - (M + 4.6 + 0.4), h: BODY.h }),
  ]);

  pres.defineSlideMaster({
    title: "Imagem e texto" + mode.suffix,
    background: { color: mode.bg },
    slideNumber: slideNumber(mode),
    objects: [
      logo(mode, { x: 4.9 }),
      imagePh(mode, "image", { x: 0, y: 0, w: 4.4, h: H }),
      titlePh(mode, { x: 4.9, y: TITLE.y, w: W - 4.9 - M, h: TITLE.h }),
      bodyPh(mode, "body", { x: 4.9, y: BODY.y, w: W - 4.9 - M, h: BODY.h }),
    ],
  });

  // Código: cartão escuro em ambos os modos, para o realce de sintaxe ter o mesmo contraste
  defineLayout("Código", mode, [
    titlePh(mode),
    shape("roundRect", { x: M, y: BODY.y, w: W - 2 * M, h: 2.85 }, HEX.dk2, { rectRadius: 0.1 }),
    ph("code", "body", { x: M + 0.25, y: BODY.y + 0.15, w: W - 2 * M - 0.5, h: 2.6 }, "# Cole seu código aqui: até 8 linhas de 15 pt", { fontSize: 15, color: CODE_TEXT_COLOR, fontFace: THEME.headFontFace, paraSpaceAfter: 0, lineSpacing: 17, fit: "shrink" }),
    bodyPh(mode, "note", { x: M, y: BODY.y + 2.95, w: W - 2 * M, h: 0.4 }, "O que este trecho mostra", { bullet: false, fontSize: 14, valign: "middle" }),
  ]);

  defineLayout("Citação", mode, [
    { text: { text: "“", options: { x: M, y: 0.6, w: 1.4, h: 1.6, fontSize: 120, fontFace: THEME.headFontFace, color: mode.accentHex, margin: 0, isTextBox: true, valign: "top" } } },
    ph("quote", "body", { x: M + 1.5, y: 1.1, w: W - 2 * M - 1.5, h: 2.6 }, "A citação vai aqui, em até quatro linhas.", { fontSize: 26, color: mode.text, valign: "middle" }),
    ph("author", "body", { x: M + 1.5, y: 3.8, w: W - 2 * M - 1.5, h: 0.6 }, "Nome, cargo ou fonte", { fontSize: 16, color: mode.muted, fontFace: THEME.headFontFace }),
  ]);

  // Três cartões: fundo e numeração fixos no layout, texto editável
  const cardGap = 0.35;
  const cardW = (W - 2 * M - 2 * cardGap) / 3;
  const cards = [];
  ["01", "02", "03"].forEach((n, i) => {
    const x = M + i * (cardW + cardGap);
    cards.push(shape("roundRect", { x, y: BODY.y, w: cardW, h: BODY.h }, mode.cardHex, { rectRadius: 0.12 }));
    cards.push(shape("ellipse", { x: x + 0.3, y: BODY.y + 0.3, w: 0.6, h: 0.6 }, mode.accentHex, { fontSize: 14, bold: true, fontFace: THEME.headFontFace, color: mode === DARK ? HEX.dk1 : HEX.lt1, align: "center", valign: "middle", margin: 0 }, n));
    cards.push(bodyPh(mode, `card${i + 1}`, { x: x + 0.3, y: BODY.y + 1.1, w: cardW - 0.6, h: BODY.h - 1.4 }, "Título do cartão\nDescrição curta", { bullet: false, fontSize: 16, paraSpaceAfter: 6 }));
  });
  defineLayout("Três cartões", mode, [titlePh(mode), ...cards]);

  // Números em destaque: três círculos limão com valor e rótulo
  const stats = [];
  const statD = 2.2;
  const statGap = (W - 2 * M - 3 * statD) / 2;
  for (let i = 0; i < 3; i++) {
    const x = M + i * (statD + statGap);
    stats.push(shape("ellipse", { x, y: 1.7, w: statD, h: statD }, mode.accentHex));
    stats.push(ph(`value${i + 1}`, "body", { x, y: 1.7, w: statD, h: statD }, "44", { fontSize: 48, bold: true, fontFace: THEME.headFontFace, color: mode.onAccent, align: "center", valign: "middle" }));
    stats.push(bodyPh(mode, `label${i + 1}`, { x: x - 0.2, y: 4.05, w: statD + 0.4, h: 0.7 }, "rótulo", { bullet: false, fontSize: 16, align: "center" }));
  }
  defineLayout("Números em destaque", mode, [titlePh(mode), ...stats]);

  defineLayout("Palestrante", mode, [
    imagePh(mode, "photo", { x: M, y: 1.3, w: 3.0, h: 3.0 }, "Foto"),
    ph("title", "title", { x: 4.0, y: 1.3, w: W - 4.0 - M, h: 0.9 }, "Nome da pessoa", { fontSize: 30, bold: true, color: mode.text, align: "left", fit: "shrink" }),
    ph("role", "body", { x: 4.0, y: 2.2, w: W - 4.0 - M, h: 0.65 }, "Cargo, empresa ou comunidade", { fontSize: 14, color: mode.purple, fontFace: THEME.headFontFace }),
    bodyPh(mode, "bio", { x: 4.0, y: 2.95, w: W - 4.0 - M, h: 1.85 }, "Três fatos sobre você", { fontSize: 16 }),
  ]);

  if (mode === DARK) {
    pres.defineSlideMaster({
      title: "Imagem cheia",
      background: { color: mode.bg },
      // The caption bar lives on the example slide: slide-level placeholders draw above
      // every layout object, so a bar on the layout would sit under the image.
      objects: [imagePh(mode, "image", { x: 0, y: 0, w: W, h: H }, "Clique no ícone para inserir uma imagem de fundo")],
    });
  }

  defineLayout("Em branco", mode, []);
}

// ---------- example slides ----------

function slide(layout, section, notes) {
  const s = pres.addSlide({ masterName: layout, sectionTitle: section });
  if (notes) s.addNotes(notes);
  return s;
}

function bullets(items) {
  return items.map((t, i) => ({ text: t, options: { bullet: true, breakLine: i < items.length - 1 } }));
}

function heading(text) {
  return { text, options: { bold: true, bullet: false, breakLine: true, paraSpaceAfter: 10 } };
}

const CAPA = "Capa e estrutura";
pres.addSection({ title: CAPA });

let s = slide("Capa", CAPA, "Capa. Troque título, subtítulo e nome. O dragão e o logo fazem parte do layout; para outra capa, duplique este slide.");
s.addText("Título da palestra em até duas linhas", { placeholder: "title" });
s.addText("Subtítulo, trilha ou frase de efeito", { placeholder: "subtitle" });
s.addText([{ text: "Nome da pessoa palestrante", options: { bold: true } }, { text: "  ·  @usuario", options: { bold: false, color: HEX.accent5 } }], { placeholder: "speaker" });

s = slide("Seção", CAPA, "Divisor de seção. Edite o número dentro do círculo e o título.");
s.addText("01", { placeholder: "number" });
s.addText("Título da seção", { placeholder: "title" });

s = slide("Título e conteúdo", CAPA, "Layout básico. Use de três a cinco tópicos por slide e tamanho mínimo de 18 pt.");
s.addText("Como usar este modelo", { placeholder: "title" });
s.addText(bullets([
  "Cada slide deste arquivo mostra um layout: duplique o que precisar",
  "Novo slide: Slide > Novo slide, depois escolha o layout no painel",
  "Fontes: Inter para texto e Cascadia Mono para títulos e código",
  "Fundo escuro para capas e destaques, fundo claro para conteúdo longo",
  "Mantenha o contraste: nunca verde limão sobre fundo claro",
]), { placeholder: "body" });

s = slide("Duas colunas", CAPA, "Comparações: antes e depois, problema e solução, prós e contras. O primeiro parágrafo de cada coluna é o título.");
s.addText("Duas colunas", { placeholder: "title" });
s.addText([heading("Problema"), ...bullets(["Scripts duplicados em cada repositório", "Ninguém sabe qual versão roda em produção", "Deploy manual às sextas"])], { placeholder: "left" });
s.addText([heading("Solução"), ...bullets(["Um pacote interno com CLI", "Versão fixada no lock file", "Pipeline que publica a cada tag"])], { placeholder: "right" });

s = slide("Texto e imagem", CAPA, "Texto à esquerda, imagem à direita. Clique no ícone do espaço reservado para inserir a imagem; ela é cortada para caber.");
s.addText("Texto e imagem", { placeholder: "title" });
s.addText(bullets(["Diagrama, captura de tela ou foto", "Uma ideia por slide", "Legenda curta se a imagem não for óbvia"]), { placeholder: "body" });

s = slide("Imagem e texto", CAPA, "Imagem sangrada à esquerda. Boa para fotos de pessoas, lugares e produtos.");
s.addText("Imagem e texto", { placeholder: "title" });
s.addText(bullets(["A imagem ocupa a altura inteira", "O texto fica na metade direita", "Use fotos com boa resolução (mínimo 1000 px de altura)"]), { placeholder: "body" });

const SAMPLE_CODE = `@dataclass
class Palestra:
    titulo: str
    duracao_min: int = 25

    def cabe_no_slot(self, slot_min: int) -> bool:
        # Reserva 5 minutos para perguntas
        return self.duracao_min + 5 <= slot_min
`;
const CODE_NOTES =
  "Código com o tema Monokai. O cartão escuro aceita até 8 linhas de 15 pt. " +
  "Para ter as mesmas cores no seu código, use o slidesnippet.com com: tema Monokai, fundo #1A1A1A, fonte de 20px e altura de linha 1.2. " +
  "Google Slides e PowerPoint: clique em Copy styled, clique dentro do cartão e cole. No Google, cole pelo menu Editar > Colar para manter as cores. " +
  "LibreOffice: clique em Download SVG e arraste o arquivo para o slide, sobre o cartão. " +
  "Em imagens, escreva o código no texto alternativo (botão direito > Descrição, ou Texto alternativo), para leitores de tela. " +
  "Se for fazer live coding, prepare um plano B: capturas de tela de cada passo ou um vídeo gravado da demo, salvos no computador, para o caso de algo falhar no palco ou a internet cair.";

function codeSlide(layout, section, tip) {
  const sl = slide(layout, section, CODE_NOTES);
  sl.addText("Exemplo de código", { placeholder: "title" });
  sl.addText(highlightCode(SAMPLE_CODE, "python"), { placeholder: "code" });
  sl.addText(tip, { placeholder: "note" });
}
codeSlide("Código", CAPA, [
  { text: "Dica: ", options: { bold: true } },
  { text: "gere o código colorido no slidesnippet.com, tema Monokai, fundo #1A1A1A." },
]);

s = slide("Citação", CAPA, "Citação. Até quatro linhas; coloque a fonte embaixo.");
s.addText("Simples é melhor que complexo. Complexo é melhor que complicado.", { placeholder: "quote" });
s.addText("Tim Peters, The Zen of Python", { placeholder: "author" });

s = slide("Números em destaque", CAPA, "Números. Três no máximo; o rótulo diz o que o número mede.");
s.addText("A Python Brasil 2026 em números", { placeholder: "title" });
[["44", "palestras"], ["8", "tutoriais"], ["6", "dias de evento"]].forEach(([v, l], i) => {
  s.addText(v, { placeholder: `value${i + 1}` });
  s.addText(l, { placeholder: `label${i + 1}` });
});

s = slide("Três cartões", CAPA, "Três cartões. O primeiro parágrafo de cada cartão é o título. Este exemplo traz dicas para o dia da palestra: apague o slide da sua apresentação.");
s.addText("Antes de subir no palco", { placeholder: "title" });
[
  ["Live coding", "Tenha um plano B: capturas de tela ou um vídeo gravado da demo."],
  ["Internet", "A rede do evento pode cair. Baixe vídeos e páginas que vai mostrar."],
  ["Arquivo", "Leve os slides em PDF num pendrive, com vídeos e imagens juntos."],
].forEach(([h, t], i) => {
  s.addText([heading(h), { text: t, options: { bullet: false } }], { placeholder: `card${i + 1}` });
});

s = slide("Palestrante", CAPA, "Apresentação da pessoa palestrante, para a abertura ou para a organização apresentar keynotes.");
s.addText("Nome da pessoa", { placeholder: "title" });
s.addText("Engenharia de software · Comunidade Python Floripa", { placeholder: "role" });
s.addText(bullets(["Trabalha com Python desde 2015", "Mantém um projeto open source", "Primeira Python Brasil foi em 2018"]), { placeholder: "bio" });

s = slide("Somente título", CAPA, "Somente título: espaço livre para tabelas, gráficos e diagramas. Aqui, uma tabela nativa com a programação do dia.");
s.addText("Programação: quinta, 15 de outubro", { placeholder: "title" });
const tableHead = { bold: true, color: HEX.dk1, fill: { color: HEX.accent1 } };
const tableCell = { color: HEX.lt1, fill: { color: HEX.dk2 } };
s.addTable(
  [
    [{ text: "Horário", options: tableHead }, { text: "Atividade", options: tableHead }, { text: "Sala", options: tableHead }],
    [{ text: "09:00", options: tableCell }, { text: "Abertura", options: tableCell }, { text: "Auditório", options: tableCell }],
    [{ text: "09:30", options: tableCell }, { text: "Keynote", options: tableCell }, { text: "Auditório", options: tableCell }],
    [{ text: "10:30", options: tableCell }, { text: "Intervalo", options: tableCell }, { text: "Hall", options: tableCell }],
    [{ text: "11:00", options: tableCell }, { text: "Palestras em paralelo", options: tableCell }, { text: "Salas 1 a 3", options: tableCell }],
    [{ text: "12:30", options: tableCell }, { text: "Almoço", options: tableCell }, { text: "Restaurante", options: tableCell }],
  ],
  { x: M, y: BODY.y, w: W - 2 * M, colW: [1.6, 5.4, 2.0], fontSize: 16, fontFace: THEME.bodyFontFace, rowH: 0.48, border: { type: "solid", pt: 1, color: HEX.dk1 }, margin: 0.08, valign: "middle", lang: LANG }
);

s = slide("Imagem cheia", CAPA, "Imagem de fundo com legenda. Clique com o botão direito na imagem > Substituir imagem. A faixa inferior é translúcida para a legenda ficar legível sobre qualquer foto. Duplique este slide para manter a faixa.");
// The sample image fills the placeholder; an empty placeholder would be drawn above the caption.
s.addImage({ placeholder: "image", path: path.join(BRAND, "sample-fullbleed.png"), x: 0, y: 0, w: W, h: H, altText: "Imagem de exemplo: dragão da Python Brasil 2026 sobre fundo escuro" });
s.addShape(pres.ShapeType.rect, { x: 0, y: H - 0.9, w: W, h: 0.9, fill: { color: HEX.dk1, transparency: 25 }, line: { color: HEX.dk1, width: 0 }, objectName: "Faixa da legenda" });
s.addText("Legenda ou crédito da imagem", { x: M, y: H - 0.75, w: W - 2 * M, h: 0.6, fontSize: 14, color: HEX.lt1, valign: "middle", isTextBox: true, margin: 0, lang: LANG });

// ----- light variants -----
const CLARO = "Conteúdo (claro)";
pres.addSection({ title: CLARO });

s = slide("Seção (claro)", CLARO, "Divisor de seção, versão clara.");
s.addText("02", { placeholder: "number" });
s.addText("Versão clara dos layouts", { placeholder: "title" });

s = slide("Título e conteúdo (claro)", CLARO, "Fundo claro para conteúdo longo e salas com muita luz.");
s.addText("Quando usar o fundo claro", { placeholder: "title" });
s.addText(bullets([
  "Salas muito iluminadas ou projetores fracos",
  "Slides com muito texto ou tabelas grandes",
  "Capturas de tela de interfaces claras",
  "Os destaques trocam o limão por oliva e o roxo por ameixa, para manter o contraste",
]), { placeholder: "body" });

s = slide("Duas colunas (claro)", CLARO, "Duas colunas, versão clara.");
s.addText("Duas colunas", { placeholder: "title" });
s.addText([heading("Antes"), ...bullets(["Testes rodavam só na máquina de quem escreveu", "Cobertura desconhecida"])], { placeholder: "left" });
s.addText([heading("Depois"), ...bullets(["Testes rodam a cada push", "Cobertura publicada no PR"])], { placeholder: "right" });

s = slide("Texto e imagem (claro)", CLARO, "Texto e imagem, versão clara.");
s.addText("Texto e imagem", { placeholder: "title" });
s.addText(bullets(["Mesma estrutura do layout escuro", "A moldura da imagem é gelo sobre verde claro"]), { placeholder: "body" });

s = slide("Imagem e texto (claro)", CLARO, "Imagem e texto, versão clara.");
s.addText("Imagem e texto", { placeholder: "title" });
s.addText(bullets(["Imagem sangrada à esquerda", "Texto na metade direita"]), { placeholder: "body" });

codeSlide("Código (claro)", CLARO, [
  { text: "Dica: ", options: { bold: true } },
  { text: "no LibreOffice, baixe o SVG do slidesnippet.com e arraste para o slide." },
]);

s = slide("Citação (claro)", CLARO, "Citação, versão clara.");
s.addText("Legibilidade conta.", { placeholder: "quote" });
s.addText("PEP 20", { placeholder: "author" });

s = slide("Números em destaque (claro)", CLARO, "Números, versão clara. Os círculos ficam oliva com texto gelo.");
s.addText("Resultados", { placeholder: "title" });
[["3x", "mais rápido"], ["40%", "menos código"], ["0", "incidentes"]].forEach(([v, l], i) => {
  s.addText(v, { placeholder: `value${i + 1}` });
  s.addText(l, { placeholder: `label${i + 1}` });
});

s = slide("Três cartões (claro)", CLARO, "Três cartões, versão clara. Este exemplo traz dicas de legibilidade: apague o slide da sua apresentação.");
s.addText("Para a última fileira também ler", { placeholder: "title" });
[
  ["Menos texto", "Se o texto só cabe com fonte menor, divida em dois slides."],
  ["Fonte grande", "Nada abaixo de 18\u00A0pt. Quem está no fundo da sala agradece."],
  ["Você é a palestra", "O slide apoia a sua fala. O resto vai para as notas."],
].forEach(([h, t], i) => {
  s.addText([heading(h), { text: t, options: { bullet: false } }], { placeholder: `card${i + 1}` });
});

s = slide("Palestrante (claro)", CLARO, "Palestrante, versão clara.");
s.addText("Nome da pessoa", { placeholder: "title" });
s.addText("Ciência de dados · Python Nordeste", { placeholder: "role" });
s.addText(bullets(["Dá aulas de Python para iniciantes", "Organiza meetups desde 2021", "Gosta de pandas e de gatos"]), { placeholder: "bio" });

s = slide("Somente título (claro)", CLARO, "Somente título, versão clara, com um gráfico nativo. No PowerPoint e no LibreOffice, edite os dados com o botão direito > Editar dados. O Google Slides converte este gráfico em imagem na importação; lá, crie o gráfico em Inserir > Gráfico. Os números são de exemplo.");
s.addText("Gráfico nativo (dados de exemplo)", { placeholder: "title" });
s.addChart(
  pres.ChartType.bar,
  [{ name: "Inscrições", labels: ["2022", "2023", "2024", "2025", "2026"], values: [520, 640, 710, 830, 900] }],
  {
    x: M, y: BODY.y, w: W - 2 * M, h: BODY.h,
    barDir: "col",
    chartColors: [HEX.accent3],
    showValue: true,
    dataLabelPosition: "outEnd",
    dataLabelColor: HEX.dk1,
    dataLabelFontSize: 12,
    dataLabelFontFace: THEME.bodyFontFace,
    catAxisLabelColor: HEX.dk1,
    catAxisLabelFontSize: 12,
    catAxisLabelFontFace: THEME.bodyFontFace,
    valAxisLabelColor: HEX.accent6,
    valAxisLabelFontSize: 11,
    valAxisLabelFontFace: THEME.bodyFontFace,
    valGridLine: { color: "C9D9A0", size: 0.5 },
    catGridLine: { style: "none" },
    showLegend: false,
    showTitle: false,
  }
);

// ----- organization -----
const ORG = "Organização";
pres.addSection({ title: ORG });

s = slide("Somente título", ORG, "Patrocinadores. Insira os logos sobre os retângulos claros (logos coloridos funcionam melhor sobre fundo claro). Mantenha o alinhamento da grade.");
s.addText("Patrocinadores", { placeholder: "title" });
const tileCols = 4, tileRows = 2, tileGap = 0.3;
const tileW = (W - 2 * M - (tileCols - 1) * tileGap) / tileCols;
const tileH = (BODY.h - (tileRows - 1) * tileGap) / tileRows;
for (let r = 0; r < tileRows; r++) {
  for (let c = 0; c < tileCols; c++) {
    const x = M + c * (tileW + tileGap);
    const y = BODY.y + r * (tileH + tileGap);
    s.addShape(pres.ShapeType.roundRect, { x, y, w: tileW, h: tileH, fill: { color: HEX.lt1 }, rectRadius: 0.1, objectName: `Espaço para logo ${r * tileCols + c + 1}` });
    s.addText("Logo", { x, y, w: tileW, h: tileH, fontSize: 12, color: HEX.accent6, align: "center", valign: "middle", isTextBox: true, margin: 0, lang: LANG });
  }
}

s = slide("Encerramento", ORG, "Slide final. Deixe-o aberto durante as perguntas: contatos e link dos slides.");
s.addText("Obrigado!", { placeholder: "title" });
s.addText([
  { text: "Perguntas?", options: { bold: true, breakLine: true } },
  { text: "@usuario · pessoa@exemplo.com.br", options: { fontFace: THEME.headFontFace, fontSize: 16, breakLine: true } },
  { text: "Slides em: exemplo.com.br/slides", options: { fontFace: THEME.headFontFace, fontSize: 16 } },
], { placeholder: "body" });

// ---------- write ----------
(async () => {
  fs.mkdirSync(DIST, { recursive: true });
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  console.log(`wrote ${path.relative(ROOT, OUT)}`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
