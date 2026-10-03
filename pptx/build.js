// Builds dist/pybr2026-template.pptx: a themed deck whose layouts carry the
// Python Brasil 2026 brand, with one example slide per layout.
const path = require("path");
const fs = require("fs");
const pptxgen = require("pptxgenjs");
const QRCode = require("qrcode");
const { applyTheme } = require("./lib/theme");
const { continueNumbering } = require("./lib/numbering");
const { highlightCode, CODE_TEXT_COLOR } = require("./lib/highlight");

const ROOT = path.resolve(__dirname, "..");
const BRAND = path.join(ROOT, "assets", "brand");
const DIST = path.join(ROOT, "dist");
const BUILD = path.join(ROOT, "build");
const OUT = path.join(DIST, "pybr2026-template.pptx");

const THEME = {
  name: "Python Brasil 2026",
  headFontFace: "Cascadia Mono",
  bodyFontFace: "Inter",
  colors: {
    dk1: "0F0F0F", // preto (fundo escuro, texto no claro)
    lt1: "F0F8FF", // gelo (texto no escuro, cartões no claro)
    dk2: "1A1A1A", // cartão de código
    lt2: "E8F4BA", // verde claro (cartões no claro)
    accent1: "B7FF06", // verde limão: texto só sobre escuro; preenchimento com texto preto em ambos
    accent2: "C95FB4", // roxo: só sobre fundo escuro
    accent3: "3F6300", // oliva: texto em destaque sobre fundo claro
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
const TEXT_W = 8.0; // keeps body lines under about 60 characters at 20 pt
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

// Two color modes share every layout definition. Lime fills (discs, table header)
// carry black text in both modes; as a text color, lime is used only on dark.
const DARK = {
  suffix: "",
  bg: HEX.dk1,
  text: C.background1,
  textHex: HEX.lt1,
  muted: C.accent5,
  mutedHex: HEX.accent5,
  cardHex: "242424",
  outlineHex: "3A3A3A",
  accent: C.accent1,
  accentHex: HEX.accent1,
  logo: path.join(BRAND, "logo-light-on-dark.png"),
  dragon: path.join(BRAND, "dragon-lime.png"),
};
const LIGHT = {
  suffix: " (claro)",
  bg: "FFFFFF",
  text: C.text1,
  textHex: HEX.dk1,
  muted: C.accent6,
  mutedHex: HEX.accent6,
  cardHex: HEX.lt2,
  outlineHex: "C9D9A0",
  accent: C.accent3,
  accentHex: HEX.accent3,
  logo: path.join(BRAND, "logo-dark-on-light.png"),
  dragon: path.join(BRAND, "dragon-dark.png"),
};
const LIME = HEX.accent1;
const ON_LIME = HEX.dk1;

// ---------- layout building blocks ----------

const LOGO_RATIO = 262 / 1653;
function logo(mode, { x = M, y = FOOTER_Y, w = 1.5 } = {}) {
  return { image: { x, y, w, h: w * LOGO_RATIO, path: mode.logo } };
}

// Footer: the dragon beside the logo, both centered on the logo's line.
const FOOTER_DRAGON_H = 0.42;
function footer(mode, x = M) {
  const dragonW = FOOTER_DRAGON_H * (664 / 841);
  const logoH = 1.5 * LOGO_RATIO;
  return [
    { image: { x, y: FOOTER_Y + logoH / 2 - FOOTER_DRAGON_H / 2, w: dragonW, h: FOOTER_DRAGON_H, path: mode.dragon } },
    logo(mode, { x: x + dragonW + 0.08 }),
  ];
}

function slideNumber(mode) {
  return { x: W - M - 0.6, y: FOOTER_Y - 0.03, w: 0.6, h: 0.3, fontSize: 11, color: mode.mutedHex, align: "right", fontFace: THEME.headFontFace };
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
  return ph(name, "body", box, text, { fontSize: 20, color: mode.text, bullet: { indent: 20 }, paraSpaceAfter: 10, fit: "shrink", ...options });
}

function headingPh(mode, name, box, text, options = {}) {
  return ph(name, "body", box, text, { fontSize: 22, bold: true, color: mode.accent, fontFace: THEME.headFontFace, fit: "shrink", ...options });
}

// A surface needs an outline: its fill alone is about 1.1:1 against either background.
function surface(mode, kind, box, options = {}) {
  return shape(kind, box, mode.cardHex, { line: { color: mode.outlineHex, width: 1 }, ...options });
}

function imagePh(mode, name, box, text = "Clique no ícone ou arraste uma imagem") {
  return ph(name, "pic", box, text, { fontSize: 14, color: mode.muted, align: "center", valign: "middle", fill: { color: mode.cardHex }, line: { color: mode.outlineHex, width: 1 } });
}

function defineLayout(name, mode, objects, extra = {}) {
  pres.defineSlideMaster({
    title: name + mode.suffix,
    background: { color: mode.bg },
    slideNumber: slideNumber(mode),
    objects: [...footer(mode), ...objects],
    ...extra,
  });
}

// ---------- layouts ----------

const DRAGON_RATIO = 664 / 841;

for (const mode of [DARK, LIGHT]) {
  const dragonH = 4.3;
  const dragonW = dragonH * DRAGON_RATIO;

  // Capa: o disco limão com a data repete o selo da página do evento
  const dateD = 1.7;
  pres.defineSlideMaster({
    title: "Capa" + mode.suffix,
    background: { color: mode.bg },
    objects: [
      { image: { x: W - dragonW - 0.35, y: H - dragonH - 0.2, w: dragonW, h: dragonH, path: mode.dragon } },
      logo(mode, { x: M, y: 0.45, w: 3.2 }),
      // The date sits in its own text box: an ellipse only lays text out in its inscribed rectangle.
      shape("ellipse", { x: W - M - dateD, y: 0.3, w: dateD, h: dateD }, LIME),
      { text: { text: "14 a 19\nde outubro\nde 2026\n{Floripa/SC}", options: { x: W - M - dateD, y: 0.3, w: dateD, h: dateD, fontSize: 13, bold: true, fontFace: THEME.headFontFace, color: ON_LIME, align: "center", valign: "middle", margin: 0, isTextBox: true, lang: LANG } } },
      ph("title", "title", { x: M, y: 1.15, w: 5.8, h: 2.05 }, "Título da palestra", { fontSize: 36, bold: true, color: mode.accent, align: "left", valign: "bottom", fit: "shrink" }),
      ph("subtitle", "body", { x: M, y: 3.35, w: 5.8, h: 0.5 }, "Subtítulo ou frase de efeito", { fontSize: 20, color: mode.text, fit: "shrink" }),
      ph("speaker", "body", { x: M, y: 4.0, w: 5.8, h: 0.5 }, "Nome da pessoa palestrante · @usuario", { fontSize: 18, bold: true, color: mode.text, fit: "shrink" }),
    ],
  });

  // Encerramento ("Obrigado!" ou "Perguntas?"): o QR code grande leva o público aos slides
  const qrD = 3.3;
  const qrX = W - M - qrD;
  const closeW = qrX - 0.5 - M;
  pres.defineSlideMaster({
    title: "Encerramento" + mode.suffix,
    background: { color: mode.bg },
    slideNumber: slideNumber(mode),
    objects: [
      ...footer(mode),
      ph("title", "title", { x: M, y: 0.8, w: closeW, h: 1.4 }, "Obrigado!", { fontSize: 44, bold: true, color: mode.accent, align: "left", valign: "bottom", fit: "shrink" }),
      bodyPh(mode, "body", { x: M, y: 2.4, w: closeW, h: 2.3 }, "Contatos: handle, e-mail, site", { bullet: false }),
      imagePh(mode, "qr", { x: qrX, y: 0.55, w: qrD, h: qrD }, "QR code com o link dos slides"),
      ph("qrCaption", "body", { x: qrX, y: 0.55 + qrD + 0.1, w: qrD, h: 0.45 }, "endereço.com.br/slides", { fontSize: 16, color: mode.text, fontFace: THEME.headFontFace, align: "center", fit: "shrink" }),
    ],
  });

  defineLayout("Agenda", mode, [
    titlePh(mode, TITLE, "Agenda"),
    bodyPh(mode, "body", { ...BODY, w: TEXT_W }, "Tópico", { fontSize: 24, bullet: { type: "number", indent: 34 }, paraSpaceAfter: 14 }),
  ]);

  // Seção: disco limão com o número, título à direita, dragão translúcido ao fundo
  const secD = 1.9;
  const markH = 3.3;
  const watermark = { image: { x: W - markH * DRAGON_RATIO + 0.4, y: H - markH + 0.3, w: markH * DRAGON_RATIO, h: markH, path: mode.dragon, transparency: 88 } };
  defineLayout("Seção", mode, [
    watermark,
    shape("ellipse", { x: M, y: 1.85, w: secD, h: secD }, LIME),
    ph("number", "body", { x: M, y: 1.85, w: secD, h: secD }, "01", { fontSize: 40, bold: true, color: ON_LIME, align: "center", valign: "middle", fontFace: THEME.headFontFace }),
    ph("title", "title", { x: M + secD + 0.4, y: 1.6, w: W - M - (M + secD + 0.4), h: 2.4 }, "Título da seção", { fontSize: 34, bold: true, color: mode.text, align: "left", valign: "middle", fit: "shrink" }),
  ]);

  defineLayout("Título e conteúdo", mode, [titlePh(mode), bodyPh(mode, "body", { ...BODY, w: TEXT_W })]);

  defineLayout("Somente título", mode, [titlePh(mode)]);

  // Duas colunas: o título de cada coluna tem espaço reservado próprio
  const colGap = 0.5;
  const colW = (W - 2 * M - colGap) / 2;
  const colHeadH = 0.5;
  const colBodyY = BODY.y + colHeadH + 0.15;
  defineLayout("Duas colunas", mode, [
    titlePh(mode),
    headingPh(mode, "leftTitle", { x: M, y: BODY.y, w: colW, h: colHeadH }, "Título da coluna"),
    bodyPh(mode, "left", { x: M, y: colBodyY, w: colW, h: BODY.y + BODY.h - colBodyY }),
    headingPh(mode, "rightTitle", { x: M + colW + colGap, y: BODY.y, w: colW, h: colHeadH }, "Título da coluna"),
    bodyPh(mode, "right", { x: M + colW + colGap, y: colBodyY, w: colW, h: BODY.y + BODY.h - colBodyY }),
  ]);

  const textColW = 4.4;
  defineLayout("Texto e imagem", mode, [
    titlePh(mode),
    bodyPh(mode, "body", { ...BODY, w: textColW }),
    imagePh(mode, "image", { x: M + textColW + 0.4, y: BODY.y, w: W - M - (M + textColW + 0.4), h: BODY.h }),
  ]);

  pres.defineSlideMaster({
    title: "Imagem e texto" + mode.suffix,
    background: { color: mode.bg },
    slideNumber: slideNumber(mode),
    objects: [
      ...footer(mode, 4.9),
      imagePh(mode, "image", { x: 0, y: 0, w: 4.4, h: H }),
      titlePh(mode, { x: 4.9, y: TITLE.y, w: W - 4.9 - M, h: TITLE.h }),
      bodyPh(mode, "body", { x: 4.9, y: BODY.y, w: W - 4.9 - M, h: BODY.h }),
    ],
  });

  // Três imagens: capturas de tela lado a lado, cada uma com legenda
  const shotGap = 0.3;
  const shotW = (W - 2 * M - 2 * shotGap) / 3;
  const shotH = 2.45;
  const shots = [];
  for (let i = 0; i < 3; i++) {
    const x = M + i * (shotW + shotGap);
    shots.push(imagePh(mode, `image${i + 1}`, { x, y: BODY.y, w: shotW, h: shotH }));
    shots.push(bodyPh(mode, `caption${i + 1}`, { x, y: BODY.y + shotH + 0.15, w: shotW, h: 0.75 }, "Legenda curta", { bullet: false, fontSize: 18, paraSpaceAfter: 0 }));
  }
  defineLayout("Três imagens", mode, [titlePh(mode), ...shots]);

  // Código: cartão escuro em ambos os modos, para o realce de sintaxe ter o mesmo contraste
  const codeCard = (box) => shape("roundRect", box, HEX.dk2, { rectRadius: 0.1, line: { color: mode === DARK ? DARK.outlineHex : HEX.dk2, width: 1 } });
  const codePh = (name, box, text) => ph(name, "body", box, text, { fontSize: 15, color: CODE_TEXT_COLOR, fontFace: THEME.headFontFace, paraSpaceAfter: 0, lineSpacing: 17, fit: "shrink" });
  const codeH = 2.85;
  defineLayout("Código", mode, [
    titlePh(mode),
    codeCard({ x: M, y: BODY.y, w: W - 2 * M, h: codeH }),
    codePh("code", { x: M + 0.25, y: BODY.y + 0.15, w: W - 2 * M - 0.5, h: codeH - 0.25 }, "# Até 8 linhas e 60 colunas por slide"),
    bodyPh(mode, "note", { x: M, y: BODY.y + codeH + 0.1, w: W - 2 * M, h: 0.4 }, "O que este trecho mostra", { bullet: false, fontSize: 16, valign: "middle" }),
  ]);

  // Código lado a lado: antes e depois, cada cartão com cerca de 30 colunas
  const pairGap = 0.4;
  const pairW = (W - 2 * M - pairGap) / 2;
  const pairHeadH = 0.45;
  const pairY = BODY.y + pairHeadH + 0.05;
  const pair = [];
  [["leftTitle", "codeLeft", "Antes"], ["rightTitle", "codeRight", "Depois"]].forEach(([head, code, label], i) => {
    const x = M + i * (pairW + pairGap);
    pair.push(headingPh(mode, head, { x, y: BODY.y - 0.05, w: pairW, h: pairHeadH }, label, { fontSize: 20 }));
    pair.push(codeCard({ x, y: pairY, w: pairW, h: codeH }));
    pair.push(codePh(code, { x: x + 0.25, y: pairY + 0.15, w: pairW - 0.5, h: codeH - 0.25 }, "# Até 8 linhas e 30 colunas"));
  });
  defineLayout("Código lado a lado", mode, [titlePh(mode), ...pair]);

  // Citação: as aspas fazem parte do texto, para ficarem sempre junto da primeira linha
  defineLayout("Citação", mode, [
    ph("quote", "body", { x: M, y: 0.9, w: TEXT_W + 0.5, h: 2.6 }, "“A citação vai aqui, em até três linhas.”", { fontSize: 32, color: mode.text, valign: "bottom", fit: "shrink" }),
    ph("author", "body", { x: M, y: 3.7, w: TEXT_W + 0.5, h: 0.5 }, "Nome, cargo ou fonte", { fontSize: 18, color: mode.muted, fontFace: THEME.headFontFace }),
  ]);

  // Frase: uma ideia só, grande, como "Perguntas?"
  defineLayout("Frase", mode, [
    watermark,
    ph("title", "title", { x: M, y: 0.9, w: TEXT_W, h: 3.4 }, "Uma frase só", { fontSize: 48, bold: true, color: mode.accent, align: "left", valign: "middle", fit: "shrink" }),
  ]);

  defineLayout("Referências", mode, [titlePh(mode, TITLE, "Referências"), bodyPh(mode, "body", BODY, "Título do material  endereço.com.br/link", { bullet: false, fontSize: 18, paraSpaceAfter: 12 })]);

  // Três cartões: fundo e numeração fixos no layout; título e texto editáveis
  const cardGap = 0.35;
  const cardW = (W - 2 * M - 2 * cardGap) / 3;
  const badgeD = 0.7;
  const cards = [];
  ["01", "02", "03"].forEach((n, i) => {
    const x = M + i * (cardW + cardGap);
    cards.push(surface(mode, "roundRect", { x, y: BODY.y, w: cardW, h: BODY.h }, { rectRadius: 0.12 }));
    cards.push(shape("ellipse", { x: x + 0.3, y: BODY.y + 0.3, w: badgeD, h: badgeD }, LIME, { fontSize: 18, bold: true, fontFace: THEME.headFontFace, color: ON_LIME, align: "center", valign: "middle", margin: 0 }, n));
    cards.push(headingPh(mode, `card${i + 1}Title`, { x: x + 0.3, y: BODY.y + 1.15, w: cardW - 0.6, h: 0.65 }, "Título", { fontSize: 18 }));
    cards.push(bodyPh(mode, `card${i + 1}`, { x: x + 0.3, y: BODY.y + 1.85, w: cardW - 0.6, h: BODY.h - 2.0 }, "Descrição curta", { bullet: false, fontSize: 18, paraSpaceAfter: 6 }));
  });
  defineLayout("Três cartões", mode, [titlePh(mode), ...cards]);

  // Números em destaque: o número grande na cor de destaque, sem moldura, cabe "1.200" ou "R$ 3,5 mi"
  const statW = (W - 2 * M) / 3;
  const stats = [];
  for (let i = 0; i < 3; i++) {
    const x = M + i * statW;
    stats.push(ph(`value${i + 1}`, "body", { x, y: 1.75, w: statW, h: 1.4 }, "44", { fontSize: 72, bold: true, fontFace: THEME.headFontFace, color: mode.accent, align: "center", valign: "bottom", fit: "shrink" }));
    stats.push(bodyPh(mode, `label${i + 1}`, { x, y: 3.25, w: statW, h: 0.9 }, "rótulo", { bullet: false, fontSize: 18, align: "center" }));
  }
  defineLayout("Números em destaque", mode, [titlePh(mode), ...stats]);

  defineLayout("Palestrante", mode, [
    imagePh(mode, "photo", { x: M, y: 1.3, w: 3.0, h: 3.0 }, "Foto"),
    ph("title", "title", { x: 4.0, y: 1.3, w: W - 4.0 - M, h: 0.9 }, "Nome da pessoa", { fontSize: 30, bold: true, color: mode.text, align: "left", fit: "shrink" }),
    ph("role", "body", { x: 4.0, y: 2.2, w: W - 4.0 - M, h: 0.7 }, "Cargo, empresa ou comunidade", { fontSize: 16, color: mode.accent, fontFace: THEME.headFontFace, fit: "shrink" }),
    bodyPh(mode, "bio", { x: 4.0, y: 3.0, w: W - 4.0 - M, h: 1.8 }, "Três fatos sobre você", { fontSize: 18 }),
  ]);

  if (mode === DARK) {
    pres.defineSlideMaster({
      title: "Imagem cheia",
      background: { color: mode.bg },
      // The caption bar lives on the example slide: slide-level placeholders draw above
      // every layout object, so a bar on the layout would sit under the image.
      objects: [imagePh(mode, "image", { x: 0, y: 0, w: W, h: H }, "Clique no ícone ou arraste uma imagem de fundo")],
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

// pptxgenjs applies the placeholder's numbering to the first paragraph only, so each item repeats it.
function numbered(items) {
  return items.map((t, i) => ({ text: t, options: { bullet: { type: "number", indent: 34 }, breakLine: i < items.length - 1 } }));
}

function quoted(text, accentHex) {
  const mark = (m) => ({ text: m, options: { color: accentHex, bold: true } });
  return [mark("“"), { text }, mark("”")];
}

function coverSlide(mode, section) {
  const sl = slide("Capa" + mode.suffix, section, "Capa. Troque título, subtítulo e nome. O dragão, o logo e o selo da data fazem parte do layout; para outra capa, duplique este slide.");
  sl.addText("Título da palestra em até três linhas, sem pressa", { placeholder: "title" });
  sl.addText("Subtítulo, trilha ou frase de efeito", { placeholder: "subtitle" });
  sl.addText([{ text: "Nome da pessoa palestrante", options: { bold: true } }, { text: "  ·  @usuario", options: { bold: false, color: mode.mutedHex } }], { placeholder: "speaker" });
}

const QR_PATH = path.join(BUILD, "qr-exemplo.png");
const QR_BOX = { x: W - M - 3.3, y: 0.55, w: 3.3, h: 3.3 }; // same box as the layout's qr placeholder
const QR_URL = "https://2026.pythonbrasil.org.br/";
const CLOSING_NOTES =
  "Encerramento, para \"Obrigado!\" ou \"Perguntas?\". Deixe este slide na tela durante as perguntas. " +
  "O QR code é o jeito mais fácil de o público abrir os seus slides: ninguém copia um link da tela. " +
  "Aponte o QR code para um lugar só, com slides, código e contatos (repositório, gist ou página). " +
  "Para trocar o QR code: no LibreOffice, Inserir > Objeto > Código QR e de barras; no Google Slides e no PowerPoint, gere a imagem num gerador de QR code e substitua a de exemplo. " +
  "Escreva o link embaixo do QR code também, para quem não tem a câmera à mão, e teste a leitura com o celular a alguns metros da tela. " +
  "Reserve uns 5 minutos do seu horário para perguntas e combine com quem modera como avisar o fim do tempo. " +
  "Repita cada pergunta no microfone antes de responder: a sala e a gravação não ouvem quem perguntou.";

function closingSlide(mode, section, title) {
  const sl = slide("Encerramento" + mode.suffix, section, CLOSING_NOTES);
  sl.addText(title, { placeholder: "title" });
  sl.addText([
    { text: "Nome da pessoa palestrante", options: { bold: true, breakLine: true } },
    { text: "@usuario", options: { fontFace: THEME.headFontFace, fontSize: 18, breakLine: true } },
    { text: "pessoa@exemplo.com.br", options: { fontFace: THEME.headFontFace, fontSize: 18 } },
  ], { placeholder: "body" });
  sl.addImage({ placeholder: "qr", path: QR_PATH, ...QR_BOX, altText: `QR code para ${QR_URL}` });
  sl.addText("2026.pythonbrasil.org.br", { placeholder: "qrCaption" });
}

function chartSlide(mode, section, notes) {
  const sl = slide("Somente título" + mode.suffix, section, notes);
  sl.addText("Gráfico nativo (dados de exemplo)", { placeholder: "title" });
  sl.addChart(
    pres.ChartType.bar,
    [{ name: "Inscrições", labels: ["2022", "2023", "2024", "2025", "2026"], values: [520, 640, 710, 830, 900] }],
    {
      x: M, y: BODY.y, w: W - 2 * M, h: BODY.h,
      barDir: "col",
      chartColors: [mode.accentHex],
      showValue: true,
      dataLabelPosition: "outEnd",
      dataLabelColor: mode.textHex,
      dataLabelFontSize: 14,
      dataLabelFontBold: true,
      dataLabelFontFace: THEME.bodyFontFace,
      catAxisLabelColor: mode.textHex,
      catAxisLabelFontSize: 14,
      catAxisLabelFontFace: THEME.bodyFontFace,
      catAxisLineShow: false,
      valAxisHidden: true,
      valGridLine: { style: "none" },
      catGridLine: { style: "none" },
      showLegend: false,
      showTitle: false,
    }
  );
}
const CHART_NOTES = "Somente título com um gráfico nativo. No PowerPoint e no LibreOffice, edite os dados com o botão direito > Editar dados. O Google Slides converte este gráfico em imagem na importação; lá, crie o gráfico em Inserir > Gráfico. Os números são de exemplo.";

const ESCURO = "Layouts escuros";
pres.addSection({ title: ESCURO });

coverSlide(DARK, ESCURO);

let s = slide("Agenda", ESCURO, "Agenda. De três a cinco tópicos; a numeração é automática. Volte a este slide entre as partes, ou use o slide de Seção, para o público saber onde está.");
s.addText("Agenda", { placeholder: "title" });
s.addText(numbered(["Por que mais um pacote", "Como ele funciona por dentro", "O que deu errado em produção", "Próximos passos"]), { placeholder: "body" });

s = slide("Seção", ESCURO, "Divisor de seção. Edite o número dentro do círculo e o título.");
s.addText("01", { placeholder: "number" });
s.addText("Título da seção", { placeholder: "title" });

s = slide("Título e conteúdo", ESCURO, "Layout básico. Use de três a cinco tópicos por slide. O texto começa em 20 pt; se o programa diminuir a fonte para caber, divida o slide em dois. As fontes Inter e Cascadia Mono são gratuitas, em fonts.google.com; instale as duas antes de editar, ou os títulos mudam de largura.");
s.addText("Como usar este modelo", { placeholder: "title" });
s.addText(bullets([
  "Cada slide mostra um layout: duplique o que precisar",
  "Slide novo: escolha o layout no painel de layouts",
  "Instale Inter e Cascadia Mono (fonts.google.com)",
  "Verde-limão como texto, só sobre fundo escuro",
]), { placeholder: "body" });

s = slide("Duas colunas", ESCURO, "Comparações: antes e depois, problema e solução, prós e contras. Cada coluna tem o seu título.");
s.addText("Duas colunas", { placeholder: "title" });
s.addText("Problema", { placeholder: "leftTitle" });
s.addText(bullets(["Scripts copiados entre repositórios", "Versão em produção desconhecida", "Deploy manual às sextas"]), { placeholder: "left" });
s.addText("Solução", { placeholder: "rightTitle" });
s.addText(bullets(["Um pacote interno com CLI", "Versão fixada no lock file", "Publicação a cada tag"]), { placeholder: "right" });

s = slide("Texto e imagem", ESCURO, "Texto à esquerda, imagem à direita. Clique no ícone do espaço reservado para inserir a imagem; ela é cortada para caber.");
s.addText("Texto e imagem", { placeholder: "title" });
s.addText(bullets(["Diagrama, captura de tela ou foto", "Uma ideia por slide", "Legenda curta se a imagem não for óbvia"]), { placeholder: "body" });

s = slide("Imagem e texto", ESCURO, "Imagem sangrada à esquerda. Boa para fotos de pessoas, lugares e produtos.");
s.addText("Imagem e texto", { placeholder: "title" });
s.addText(bullets(["A imagem ocupa a altura inteira", "O texto fica na metade direita", "Use fotos com boa resolução (mínimo 1000 px de altura)"]), { placeholder: "body" });

s = slide("Três imagens", ESCURO, "Três imagens com legenda: passos de um fluxo, antes e depois, ou telas de um app. Corte cada captura para mostrar só o que importa: a tela inteira encolhida vira texto que ninguém lê.");
s.addText("Três passos na tela", { placeholder: "title" });
["1. Abra o terminal", "2. Rode o comando", "3. Veja o resultado"].forEach((t, i) => s.addText(t, { placeholder: `caption${i + 1}` }));

const SAMPLE_CODE = `@dataclass
class Palestra:
    titulo: str
    duracao_min: int = 25

    def cabe_no_slot(self, slot_min: int) -> bool:
        # Reserva 5 minutos para perguntas
        return self.duracao_min + 5 <= slot_min
`;
const CODE_NOTES =
  "Código com o tema Monokai. O cartão escuro aceita até 8 linhas de 15 pt, com cerca de 60 colunas. " +
  "Se o trecho for maior, divida em mais slides ou refatore o exemplo para mostrar só o que importa: 20 linhas pequenas ninguém lê do fundo da sala. " +
  "Para ter as mesmas cores no seu código, use o slidesnippet.com com: tema Monokai, fundo #1A1A1A, fonte de 20px e altura de linha 1.2. " +
  "Google Slides e PowerPoint: clique em Copy styled, clique dentro do cartão e cole. No Google, cole pelo menu Editar > Colar para manter as cores. " +
  "LibreOffice: clique em Download SVG e arraste o arquivo para o slide, sobre o cartão. " +
  "Em imagens, escreva o código no texto alternativo (botão direito > Descrição, ou Texto alternativo), para leitores de tela. " +
  "Se for fazer live coding, prepare um plano B: capturas de tela de cada passo ou um vídeo gravado da demo, salvos no computador, para o caso de algo falhar no palco ou a internet cair.";

function codeSlide(layout, section, tip) {
  const sl = slide(layout, section, CODE_NOTES);
  sl.addText("Código: até 8 linhas por slide", { placeholder: "title" });
  sl.addText(highlightCode(SAMPLE_CODE, "python"), { placeholder: "code" });
  sl.addText(tip, { placeholder: "note" });
}
codeSlide("Código", ESCURO, [
  { text: "Dica: ", options: { bold: true } },
  { text: "gere o código colorido no slidesnippet.com, tema Monokai, fundo #1A1A1A." },
]);

s = slide("Código lado a lado", ESCURO, "Dois trechos lado a lado: antes e depois de uma refatoração, ou duas formas de resolver o mesmo problema. Cada cartão aceita até 8 linhas e cerca de 30 colunas. " + CODE_NOTES.slice(CODE_NOTES.indexOf("Para ter")));
s.addText("Refatoração", { placeholder: "title" });
s.addText("Antes", { placeholder: "leftTitle" });
s.addText(highlightCode(`total = 0
for p in palestras:
    if p.trilha == "web":
        total += p.duracao
`), { placeholder: "codeLeft" });
s.addText("Depois", { placeholder: "rightTitle" });
s.addText(highlightCode(`total = sum(
    p.duracao
    for p in palestras
    if p.trilha == "web"
)
`), { placeholder: "codeRight" });

s = slide("Citação", ESCURO, "Citação. Até três linhas; coloque a fonte embaixo. As aspas verdes fazem parte do texto: ao trocar a citação, mantenha as duas.");
s.addText(quoted("Simples é melhor que complexo. Complexo é melhor que complicado.", LIME), { placeholder: "quote" });
s.addText("Tim Peters, The Zen of Python", { placeholder: "author" });

s = slide("Frase", ESCURO, "Uma frase só, para a ideia que o público deve levar para casa ou para mudar de assunto. Se a frase passar de duas linhas, ela é um slide de conteúdo.");
s.addText("Teste o projetor antes da sua palestra.", { placeholder: "title" });

s = slide("Números em destaque", ESCURO, "Números. Três no máximo; o rótulo diz o que o número mede.");
s.addText("A Python Brasil 2026 em números", { placeholder: "title" });
[["44", "palestras"], ["8", "tutoriais"], ["6", "dias de evento"]].forEach(([v, l], i) => {
  s.addText(v, { placeholder: `value${i + 1}` });
  s.addText(l, { placeholder: `label${i + 1}` });
});

s = slide("Três cartões", ESCURO, "Três cartões, cada um com título e texto. Este exemplo traz dicas para o dia da palestra: apague o slide da sua apresentação.");
s.addText("Antes de subir no palco", { placeholder: "title" });
[
  ["Live coding", "Tenha um plano B: capturas de tela ou um vídeo gravado da demo."],
  ["Internet", "A rede do evento pode cair. Baixe vídeos e páginas que vai mostrar."],
  ["Arquivo", "Leve os slides em PDF num pendrive, com vídeos e imagens juntos."],
].forEach(([h, t], i) => {
  s.addText(h, { placeholder: `card${i + 1}Title` });
  s.addText(t, { placeholder: `card${i + 1}` });
});

s = slide("Palestrante", ESCURO, "Apresentação da pessoa palestrante, para a abertura ou para a organização apresentar keynotes. Quem abre a sessão costuma apresentar você antes da palestra. Se o tempo estiver curto, o slide \"Sobre mim\" pode sair, ou virar uma linha na capa.");
s.addText("Nome da pessoa", { placeholder: "title" });
s.addText("Engenharia de software · Python Floripa", { placeholder: "role" });
s.addText(bullets(["Trabalha com Python desde 2015", "Mantém um projeto open source", "Primeira Python Brasil foi em 2018"]), { placeholder: "bio" });

s = slide("Somente título", ESCURO, "Somente título: espaço livre para tabelas, gráficos e diagramas. Aqui, uma tabela nativa com a programação do dia.");
s.addText("Programação: quinta, 15 de outubro", { placeholder: "title" });
const tableHead = { bold: true, color: HEX.dk1, fill: { color: HEX.accent1 } };
const tableCell = { color: HEX.lt1, fill: { color: DARK.cardHex } };
s.addTable(
  [
    [{ text: "Horário", options: tableHead }, { text: "Atividade", options: tableHead }, { text: "Sala", options: tableHead }],
    [{ text: "09:00", options: tableCell }, { text: "Abertura", options: tableCell }, { text: "Auditório", options: tableCell }],
    [{ text: "09:30", options: tableCell }, { text: "Keynote", options: tableCell }, { text: "Auditório", options: tableCell }],
    [{ text: "10:30", options: tableCell }, { text: "Intervalo", options: tableCell }, { text: "Hall", options: tableCell }],
    [{ text: "11:00", options: tableCell }, { text: "Palestras em paralelo", options: tableCell }, { text: "Salas 1 a 3", options: tableCell }],
    [{ text: "12:30", options: tableCell }, { text: "Almoço", options: tableCell }, { text: "Restaurante", options: tableCell }],
  ],
  { x: M, y: BODY.y, w: W - 2 * M, colW: [1.6, 5.4, 2.0], fontSize: 18, fontFace: THEME.bodyFontFace, rowH: 0.48, border: { type: "solid", pt: 1, color: HEX.dk1 }, margin: 0.08, valign: "middle", lang: LANG }
);

chartSlide(DARK, ESCURO, CHART_NOTES);

s = slide("Imagem cheia", ESCURO, "Imagem de fundo com legenda. Clique com o botão direito na imagem > Substituir imagem. A faixa inferior é translúcida para a legenda ficar legível sobre qualquer foto. Duplique este slide para manter a faixa.");
// The sample image fills the placeholder; an empty placeholder would be drawn above the caption.
s.addImage({ placeholder: "image", path: path.join(BRAND, "sample-fullbleed.png"), x: 0, y: 0, w: W, h: H, altText: "Imagem de exemplo: dragão da Python Brasil 2026 sobre fundo escuro" });
s.addShape(pres.ShapeType.rect, { x: 0, y: H - 0.9, w: W, h: 0.9, fill: { color: HEX.dk1, transparency: 25 }, line: { color: HEX.dk1, width: 0 }, objectName: "Faixa da legenda" });
s.addText("Legenda ou crédito da imagem", { x: M, y: H - 0.75, w: W - 2 * M, h: 0.6, fontSize: 14, color: HEX.lt1, valign: "middle", isTextBox: true, margin: 0, lang: LANG });

s = slide("Referências", ESCURO, "Referências. Um material por linha: o nome e o endereço curto. Links longos ninguém copia da tela; junte tudo numa página e mostre o QR code no encerramento.");
s.addText("Referências", { placeholder: "title" });
const reference = ([name, url], i, all) => [
  { text: name + "  ", options: {} },
  { text: url, options: { fontFace: THEME.headFontFace, color: DARK.mutedHex, breakLine: i < all.length - 1 } },
];
s.addText([
  ["The Zen of Python", "peps.python.org/pep-0020"],
  ["Guia de estilo", "peps.python.org/pep-0008"],
  ["Tutorial oficial", "docs.python.org/pt-br/3/tutorial"],
  ["Python Brasil", "python.org.br"],
].flatMap(reference), { placeholder: "body" });

closingSlide(DARK, ESCURO, "Perguntas?");

// ----- light variants -----
const CLARO = "Layouts claros";
pres.addSection({ title: CLARO });

coverSlide(LIGHT, CLARO);

s = slide("Seção (claro)", CLARO, "Divisor de seção, versão clara.");
s.addText("02", { placeholder: "number" });
s.addText("Versão clara dos layouts", { placeholder: "title" });

s = slide("Título e conteúdo (claro)", CLARO, "Fundo claro para conteúdo longo e salas com muita luz.");
s.addText("Quando usar o fundo claro", { placeholder: "title" });
s.addText(bullets([
  "Salas muito iluminadas ou projetores fracos",
  "Slides com muito texto ou tabelas grandes",
  "Capturas de tela de interfaces claras",
  "Destaques em texto ficam oliva; o limão aparece nos discos",
]), { placeholder: "body" });

s = slide("Duas colunas (claro)", CLARO, "Duas colunas, versão clara.");
s.addText("Duas colunas", { placeholder: "title" });
s.addText("Antes", { placeholder: "leftTitle" });
s.addText(bullets(["Testes só na máquina de quem escreveu", "Cobertura desconhecida"]), { placeholder: "left" });
s.addText("Depois", { placeholder: "rightTitle" });
s.addText(bullets(["Testes a cada push", "Cobertura publicada no PR"]), { placeholder: "right" });

s = slide("Texto e imagem (claro)", CLARO, "Texto e imagem, versão clara.");
s.addText("Texto e imagem", { placeholder: "title" });
s.addText(bullets(["Mesma estrutura do layout escuro", "A moldura da imagem fica verde-clara"]), { placeholder: "body" });

s = slide("Imagem e texto (claro)", CLARO, "Imagem e texto, versão clara.");
s.addText("Imagem e texto", { placeholder: "title" });
s.addText(bullets(["Imagem sangrada à esquerda", "Texto na metade direita"]), { placeholder: "body" });

codeSlide("Código (claro)", CLARO, [
  { text: "Dica: ", options: { bold: true } },
  { text: "no LibreOffice, baixe o SVG do slidesnippet.com e arraste para o slide." },
]);

s = slide("Citação (claro)", CLARO, "Citação, versão clara.");
s.addText(quoted("Legibilidade conta.", HEX.accent3), { placeholder: "quote" });
s.addText("PEP 20", { placeholder: "author" });

s = slide("Frase (claro)", CLARO, "Uma frase só, versão clara.");
s.addText("Menos texto, letra maior.", { placeholder: "title" });

s = slide("Números em destaque (claro)", CLARO, "Números, versão clara. Os números ficam em oliva.");
s.addText("Resultados", { placeholder: "title" });
[["3x", "mais rápido"], ["40%", "menos código"], ["0", "incidentes"]].forEach(([v, l], i) => {
  s.addText(v, { placeholder: `value${i + 1}` });
  s.addText(l, { placeholder: `label${i + 1}` });
});

s = slide("Três cartões (claro)", CLARO, "Três cartões, versão clara. Este exemplo traz dicas de legibilidade: apague o slide da sua apresentação.");
s.addText("Para a última fileira também ler", { placeholder: "title" });
[
  ["Menos texto", "Se o texto só cabe com fonte menor, divida em dois slides."],
  ["Fonte grande", "Nada abaixo de 18 pt. Quem está no fundo da sala agradece."],
  ["Você é a palestra", "O slide apoia a sua fala. O resto vai para as notas."],
].forEach(([h, t], i) => {
  s.addText(h, { placeholder: `card${i + 1}Title` });
  s.addText(t, { placeholder: `card${i + 1}` });
});

s = slide("Palestrante (claro)", CLARO, "Palestrante, versão clara.");
s.addText("Nome da pessoa", { placeholder: "title" });
s.addText("Ciência de dados · Python Nordeste", { placeholder: "role" });
s.addText(bullets(["Dá aulas de Python para iniciantes", "Organiza meetups desde 2021", "Gosta de pandas e de gatos"]), { placeholder: "bio" });

chartSlide(LIGHT, CLARO, "Gráfico, versão clara: as barras ficam oliva. " + CHART_NOTES);

closingSlide(LIGHT, CLARO, "Obrigado!");

// ---------- write ----------
(async () => {
  fs.mkdirSync(DIST, { recursive: true });
  fs.mkdirSync(BUILD, { recursive: true });
  // pptxgenjs reads image files only when it writes the deck, so the QR code can be made here.
  await QRCode.toFile(QR_PATH, QR_URL, { margin: 2, width: 800, color: { dark: "#0F0F0FFF", light: "#FFFFFFFF" } });
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  await continueNumbering(OUT);
  console.log(`wrote ${path.relative(ROOT, OUT)}`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
