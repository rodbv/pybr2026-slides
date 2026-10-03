// Builds dist/pybr2026-template.pptx: a themed deck whose layouts carry the
// Python Brasil 2026 brand, with one example slide per layout.
const path = require("path");
const fs = require("fs");
const pptxgen = require("pptxgenjs");
const sharp = require("sharp");
const QRCode = require("qrcode");
const { applyTheme } = require("./lib/theme");
const { continueNumbering } = require("./lib/numbering");
const { fixNotes } = require("./lib/notes");
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
const FOOTER_Y = 5.15;
const LANG = "pt-BR";
const { CAPS_SPACING, capitalizeMarkedRuns } = require("./lib/caps");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = "Python Brasil 2026: modelo de apresentação";
pres.subject = "Modelo de slides para palestrantes e organização da Python Brasil 2026";
pres.author = "Comunidade Python Brasil";
pres.company = "Python Brasil 2026";
pres.lang = LANG;
const C = pres.SchemeColor;

// pptxgenjs stores one copy of an image per layout that uses it, so images repeated on
// every layout are resized to the size they show at before the deck is written.
const RESIZED = [];
function resized(src, size) {
  const out = path.join(BUILD, `${path.basename(src, ".png")}-${size.width || size.height}.png`);
  RESIZED.push({ src, out, size });
  return out;
}

// Two color modes share every layout definition. Lime fills (discs, table header, text
// highlight) carry black text in both modes; as a text color, lime is used only on dark.
const DARK = {
  suffix: "",
  bg: HEX.dk1,
  text: C.background2,
  textHex: HEX.lt2,
  muted: C.accent5,
  mutedHex: HEX.accent5,
  cardHex: "242424",
  outlineHex: "3A3A3A",
  accent: C.accent1,
  accentHex: HEX.accent1,
  logo: path.join(BRAND, "logo-light-on-dark.png"),
  dragon: path.join(BRAND, "dragon-lime.png"),
  footerLogo: resized(path.join(BRAND, "logo-light-on-dark.png"), { width: 480 }),
  footerWitch: resized(path.join(BRAND, "witch-light.png"), { height: 140 }),
  watermark: resized(path.join(BRAND, "witch-light.png"), { height: 700 }),
  lockup: resized(path.join(BRAND, "lockup-on-dark.png"), { width: 1600 }),
  emFloripa: path.join(BRAND, "em-floripa-on-dark.png"),
  year: path.join(BRAND, "year-on-dark.png"),
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
  // On white, the brand's own pages use black text with lime fills, so the accent is black.
  accent: C.text1,
  accentHex: HEX.dk1,
  logo: path.join(BRAND, "logo-dark-on-light.png"),
  dragon: path.join(BRAND, "dragon-dark.png"),
  footerLogo: resized(path.join(BRAND, "logo-dark-on-light.png"), { width: 480 }),
  footerWitch: resized(path.join(BRAND, "witch-dark.png"), { height: 140 }),
  watermark: resized(path.join(BRAND, "witch-dark.png"), { height: 700 }),
  lockup: resized(path.join(BRAND, "lockup-on-light.png"), { width: 1600 }),
  emFloripa: path.join(BRAND, "em-floripa-on-light.png"),
  year: path.join(BRAND, "year-on-light.png"),
};
const LIME = HEX.accent1;
const ON_LIME = HEX.dk1;

// ---------- layout building blocks ----------

const LOGO_RATIO = 262 / 1653;
function logo(mode, { x = M, y = FOOTER_Y, w = 1.5, src = mode.footerLogo, transparency = 0 } = {}) {
  return { image: { x, y, w, h: w * LOGO_RATIO, path: src, transparency } };
}

const MAGO_RATIO = 2580 / 3381;
const WITCH_RATIO = 2234 / 2012;

// Footer: a small, translucent signature, the witch beside the logo on the logo's center line.
const FOOTER_LOGO_W = 1.0;
const FOOTER_WITCH_H = 0.3;
const FOOTER_TRANSPARENCY = 35;
function footer(mode, x = M) {
  const witchW = FOOTER_WITCH_H * WITCH_RATIO;
  const logoH = FOOTER_LOGO_W * LOGO_RATIO;
  return [
    { image: { x, y: FOOTER_Y + logoH / 2 - FOOTER_WITCH_H / 2, w: witchW, h: FOOTER_WITCH_H, path: mode.footerWitch, transparency: FOOTER_TRANSPARENCY } },
    logo(mode, { x: x + witchW + 0.06, w: FOOTER_LOGO_W, transparency: FOOTER_TRANSPARENCY }),
  ];
}

function slideNumber(mode) {
  return { x: W - M - 0.6, y: FOOTER_Y - 0.07, w: 0.6, h: 0.3, fontSize: 11, color: mode.mutedHex, align: "right", fontFace: THEME.headFontFace };
}

function ph(name, type, box, text, options = {}) {
  return { placeholder: { options: { name, type, ...box, margin: 0, lang: LANG, valign: "top", ...options }, text } };
}

// Content titles go uppercase with a thin rule below, as on the brand's pages. pptxgenjs
// has no all-caps option, so the 1 pt letter spacing marks these runs for lib/caps.js.
const TITLE_RULE_Y = 1.38;
function titlePh(mode, box = TITLE, text = "Título do slide") {
  return ph("title", "title", box, text, { fontSize: 28, bold: true, color: mode.text, align: "left", fit: "shrink", charSpacing: CAPS_SPACING });
}

function titleRule(mode, x = 0) {
  return { line: { x, y: TITLE_RULE_Y, w: W - x, h: 0, line: { color: mode.textHex, width: 0.75 } } };
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

// A layout whose first object is the slide title gets the rule below it.
function defineTitledLayout(name, mode, objects) {
  defineLayout(name, mode, [titleRule(mode), ...objects]);
}

// ---------- layouts ----------

const DRAGON_RATIO = 664 / 841;
const LOCKUP_RATIO = 1638 / 3128;

// The stacked lockup as the site's hero shows it: "em floripa" under "brasil" and
// "2026" beside it, both sized and placed as fractions of the lockup's width.
function coverLockup(mode, { x = W - M - 4.2, y = 2.15, w = 4.2 } = {}) {
  const h = w * LOCKUP_RATIO;
  const tagY = y + h + 0.06;
  return [
    { image: { x, y, w, h, path: mode.lockup, altText: "python brasil" } },
    { image: { x, y: tagY, w: w * 0.18, h: w * 0.18 * (101 / 546), path: mode.emFloripa } },
    { image: { x: x + w * 0.295, y: tagY + 0.01, w: w * 0.075, h: w * 0.075 * (75 / 218), path: mode.year } },
  ];
}

for (const mode of [DARK, LIGHT]) {
  const dragonH = 4.3;
  const dragonW = dragonH * DRAGON_RATIO;

  // Capa: o disco limão com a data repete o selo da página do evento
  const dateD = 1.7;
  pres.defineSlideMaster({
    title: "Capa" + mode.suffix,
    background: { color: mode.bg },
    objects: [
      ...coverLockup(mode),
      // The date sits in its own text box: an ellipse only lays text out in its inscribed rectangle.
      shape("ellipse", { x: W - M - dateD, y: 0.3, w: dateD, h: dateD }, LIME),
      { text: { text: "14 a 19\nde outubro\nde 2026\n{Floripa/SC}", options: { x: W - M - dateD, y: 0.3, w: dateD, h: dateD, fontSize: 13, bold: true, fontFace: THEME.headFontFace, color: ON_LIME, align: "center", valign: "middle", margin: 0, isTextBox: true, lang: LANG } } },
      ph("title", "title", { x: M, y: 0.9, w: 4.6, h: 2.3 }, "Título da palestra", { fontSize: 36, bold: true, color: mode.accent, align: "left", valign: "bottom", fit: "shrink" }),
      ph("subtitle", "body", { x: M, y: 3.35, w: 4.6, h: 0.5 }, "Subtítulo ou frase de efeito", { fontSize: 20, color: mode.text, fit: "shrink" }),
      ph("speaker", "body", { x: M, y: 4.0, w: 4.6, h: 0.5 }, "Nome da pessoa palestrante · @usuario", { fontSize: 18, bold: true, color: mode.text, fit: "shrink" }),
    ],
  });

  // Encerramento ("Valeu!" ou "Perguntas?"): o QR code grande leva o público aos slides
  const qrD = 3.3;
  const qrX = W - M - qrD;
  const closeW = qrX - 0.5 - M;
  pres.defineSlideMaster({
    title: "Encerramento" + mode.suffix,
    background: { color: mode.bg },
    slideNumber: slideNumber(mode),
    objects: [
      ...footer(mode),
      ph("title", "title", { x: M, y: 0.8, w: closeW, h: 1.4 }, "Valeu!", { fontSize: 44, bold: true, color: mode.accent, align: "left", valign: "bottom", fit: "shrink" }),
      bodyPh(mode, "body", { x: M, y: 2.4, w: closeW, h: 2.3 }, "Contatos: handle, e-mail, site", { bullet: false }),
      imagePh(mode, "qr", { x: qrX, y: 0.55, w: qrD, h: qrD }, "QR code com o link dos slides"),
      ph("qrCaption", "body", { x: qrX, y: 0.55 + qrD + 0.1, w: qrD, h: 0.45 }, "endereço.com.br/slides", { fontSize: 16, color: mode.text, fontFace: THEME.headFontFace, align: "center", fit: "shrink" }),
    ],
  });

  defineTitledLayout("Agenda", mode, [
    titlePh(mode, TITLE, "Agenda"),
    bodyPh(mode, "body", { ...BODY, w: TEXT_W }, "Tópico", { fontSize: 24, bullet: { type: "number", indent: 34 }, paraSpaceAfter: 14 }),
  ]);

  // Seção: disco limão com o número, título à direita, dragão translúcido ao fundo
  const secD = 1.9;
  const markH = 3.3;
  const watermark = { image: { x: W - markH * WITCH_RATIO + 0.5, y: H - markH + 0.25, w: markH * WITCH_RATIO, h: markH, path: mode.watermark, transparency: 88 } };
  defineLayout("Seção", mode, [
    watermark,
    shape("ellipse", { x: M, y: 1.85, w: secD, h: secD }, LIME),
    ph("number", "body", { x: M, y: 1.85, w: secD, h: secD }, "01", { fontSize: 40, bold: true, color: ON_LIME, align: "center", valign: "middle", fontFace: THEME.headFontFace }),
    ph("title", "title", { x: M + secD + 0.4, y: 1.6, w: W - M - (M + secD + 0.4), h: 2.4 }, "Título da seção", { fontSize: 34, bold: true, color: mode.text, align: "left", valign: "middle", fit: "shrink" }),
  ]);

  defineTitledLayout("Título e conteúdo", mode, [titlePh(mode), bodyPh(mode, "body", { ...BODY, w: TEXT_W })]);

  defineTitledLayout("Somente título", mode, [titlePh(mode)]);

  // Duas colunas: o título de cada coluna tem espaço reservado próprio
  const colGap = 0.5;
  const colW = (W - 2 * M - colGap) / 2;
  const colHeadH = 0.5;
  const colBodyY = BODY.y + colHeadH + 0.15;
  defineTitledLayout("Duas colunas", mode, [
    titlePh(mode),
    headingPh(mode, "leftTitle", { x: M, y: BODY.y, w: colW, h: colHeadH }, "Título da coluna"),
    bodyPh(mode, "left", { x: M, y: colBodyY, w: colW, h: BODY.y + BODY.h - colBodyY }),
    headingPh(mode, "rightTitle", { x: M + colW + colGap, y: BODY.y, w: colW, h: colHeadH }, "Título da coluna"),
    bodyPh(mode, "right", { x: M + colW + colGap, y: colBodyY, w: colW, h: BODY.y + BODY.h - colBodyY }),
  ]);

  const textColW = 4.4;
  defineTitledLayout("Texto e imagem", mode, [
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
      titleRule(mode, 4.4),
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
  defineTitledLayout("Três imagens", mode, [titlePh(mode), ...shots]);

  // Código: cartão escuro em ambos os modos, para o realce de sintaxe ter o mesmo contraste
  const codeCard = (box) => shape("roundRect", box, HEX.dk2, { rectRadius: 0.1, line: { color: mode === DARK ? DARK.outlineHex : HEX.dk2, width: 1 } });
  const codePh = (name, box, text) => ph(name, "body", box, text, { fontSize: 15, color: CODE_TEXT_COLOR, fontFace: THEME.headFontFace, paraSpaceAfter: 0, lineSpacing: 17, fit: "shrink" });
  const codeH = 2.85;
  defineTitledLayout("Código", mode, [
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
  defineTitledLayout("Código lado a lado", mode, [titlePh(mode), ...pair]);

  // Citação: as aspas fazem parte do texto, para ficarem sempre junto da primeira linha
  defineLayout("Citação", mode, [
    ph("quote", "body", { x: M, y: 0.6, w: TEXT_W + 0.5, h: 2.4 }, "“A citação vai aqui, em até três linhas.”", { fontSize: 32, color: mode.text, valign: "bottom", fit: "shrink" }),
    ph("author", "body", { x: M, y: 3.15, w: TEXT_W + 0.5, h: 0.5 }, "Nome, cargo ou fonte", { fontSize: 18, color: mode.muted, fontFace: THEME.headFontFace }),
  ]);

  // Frase: uma ideia só, grande, como "Perguntas?"
  defineLayout("Frase", mode, [
    watermark,
    ph("title", "title", { x: M, y: 0.9, w: TEXT_W, h: 3.4 }, "Uma frase só", { fontSize: 48, bold: true, color: mode.accent, align: "left", valign: "middle", fit: "shrink" }),
  ]);

  defineTitledLayout("Referências", mode, [titlePh(mode, TITLE, "Referências"), bodyPh(mode, "body", BODY, "Título do material  endereço.com.br/link", { bullet: false, fontSize: 18, paraSpaceAfter: 12 })]);

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
  defineTitledLayout("Três cartões", mode, [titlePh(mode), ...cards]);

  // Números em destaque: o número grande na cor de destaque, sem moldura, cabe "1.200" ou "R$ 3,5 mi"
  // The gap keeps neighbouring values and labels from reading as one line.
  const statGap = 0.45;
  const statW = (W - 2 * M - 2 * statGap) / 3;
  const stats = [];
  for (let i = 0; i < 3; i++) {
    const x = M + i * (statW + statGap);
    stats.push(ph(`value${i + 1}`, "body", { x, y: 1.75, w: statW, h: 1.4 }, "44", { fontSize: 60, bold: true, fontFace: THEME.headFontFace, color: mode.accent, align: "center", valign: "bottom", fit: "shrink" }));
    stats.push(bodyPh(mode, `label${i + 1}`, { x, y: 3.25, w: statW, h: 0.9 }, "rótulo", { bullet: false, fontSize: 18, align: "center" }));
  }
  defineTitledLayout("Números em destaque", mode, [titlePh(mode), ...stats]);

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
// Every example slide carries a real tip for the person presenting, so the deck
// teaches the layouts and the craft at the same time.

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

// The brand's marker pen: black bold text on a lime highlight, readable on both backgrounds.
function marked(text) {
  return { text, options: { highlight: LIME, color: ON_LIME, bold: true } };
}

function quoted(text, accentHex) {
  const mark = (m) => ({ text: m, options: { color: accentHex, bold: true } });
  return [mark("“"), { text }, mark("”")];
}

function fill(sl, texts) {
  for (const [placeholder, text] of Object.entries(texts)) sl.addText(text, { placeholder });
}

function coverSlide(mode, section, title, subtitle, notes) {
  const sl = slide("Capa" + mode.suffix, section, notes);
  fill(sl, {
    title,
    subtitle,
    speaker: [{ text: "Seu nome aqui", options: { bold: true } }, { text: "  ·  @seu_usuario", options: { bold: false, color: mode.mutedHex } }],
  });
}

const QR_PATH = path.join(BUILD, "qr-exemplo.png");
const QR_BOX = { x: W - M - 3.3, y: 0.55, w: 3.3, h: 3.3 }; // same box as the layout's qr placeholder
const QR_URL = "https://2026.pythonbrasil.org.br/";
const CLOSING_NOTES =
  "Encerramento, para \"Valeu!\", \"Obrigada!\", \"Obrigado!\" ou \"Perguntas?\". Este slide pode ficar na tela durante as perguntas. " +
  "Com o QR code, o público abre os seus slides pelo celular, sem copiar o link da tela. Ele funciona melhor apontando para uma página só, com slides, código, referências e contatos: o README de um repositório no GitHub, um gist, uma página no GitHub Pages ou um Linktree. Assim você troca os links depois sem mudar o QR code. " +
  "Para trocar o QR code: no LibreOffice, Inserir > Objeto > Código QR e de barras; no Google Slides e no PowerPoint, gere a imagem num gerador de QR code e substitua a de exemplo. " +
  "Com o link escrito embaixo, quem está sem a câmera à mão também chega lá. Vale testar a leitura com o celular a alguns metros da tela.";
const QUESTIONS_NOTES =
  "Uns 5 minutos para perguntas costumam bastar; combinar com quem modera como avisar o fim do tempo ajuda. " +
  "Repetir a pergunta no microfone ajuda a sala e a gravação, que não ouvem quem perguntou. " +
  "Tudo bem não saber uma resposta. \"Não sei, posso ver e te respondo depois\" é uma resposta honesta, e o contato no slide ajuda a continuar a conversa. " +
  "Se uma pergunta desrespeitar o código de conduta, você não precisa responder: pode agradecer, passar para a próxima e avisar a organização depois.";

const CONTACTS = [
  { text: "Seu nome aqui", options: { bold: true, breakLine: true } },
  { text: "@seu_usuario", options: { fontFace: THEME.headFontFace, fontSize: 18, breakLine: true } },
  { text: "voce@exemplo.com.br", options: { fontFace: THEME.headFontFace, fontSize: 18 } },
];

function closingSlide(mode, section, title, body = CONTACTS, notes = CLOSING_NOTES) {
  const sl = slide("Encerramento" + mode.suffix, section, notes);
  fill(sl, { title, body, qrCaption: "2026.pythonbrasil.org.br" });
  sl.addImage({ placeholder: "qr", path: QR_PATH, ...QR_BOX, altText: `QR code para ${QR_URL}` });
  return sl;
}

// WCAG 2.1 contrast ratio between two hex colors.
function contrastRatio(a, b) {
  const luminance = (hex) => {
    const [r, g, bl] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 10) / 10;
}

function chartSlide(mode, section, notes, colors) {
  const contrast = [...colors.map(([label, hex]) => [label, contrastRatio(hex, mode.bg)]), ["Mínimo", 4.5]];
  const sl = slide("Somente título" + mode.suffix, section, notes);
  sl.addText("Contraste das cores deste modelo", { placeholder: "title" });
  sl.addChart(
    pres.ChartType.bar,
    [{ name: "Contraste com o fundo", labels: contrast.map(([label]) => label), values: contrast.map(([, value]) => value) }],
    {
      dataLabelFormatCode: "0.0",
      x: M, y: BODY.y, w: W - 2 * M, h: BODY.h - 0.5,
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
  sl.addText([
    { text: "Outras cores? Confira o contraste em " },
    { text: "webaim.org/resources/contrastchecker", options: { fontFace: THEME.headFontFace, color: mode.accentHex } },
  ], { x: M, y: BODY.y + BODY.h - 0.4, w: W - 2 * M, h: 0.4, fontSize: 16, color: mode.textHex, fontFace: THEME.bodyFontFace, margin: 0, valign: "middle", isTextBox: true, lang: LANG });
}
const CHART_NOTES =
  "Somente título com um gráfico nativo. No PowerPoint e no LibreOffice, edite os dados com o botão direito > Editar dados. " +
  "O Google Slides converte este gráfico em imagem na importação; lá, crie o gráfico em Inserir > Gráfico. " +
  "Cada barra é o contraste de uma cor do modelo com o fundo do slide. O WCAG pede pelo menos 4,5:1 para texto, a última barra. " +
  "Se você usar outras cores, o verificador do WebAIM (webaim.org/resources/contrastchecker) mostra o contraste de cada par de cor de texto e cor de fundo.";

const ESCURO = "Layouts escuros";
pres.addSection({ title: ESCURO });

coverSlide(DARK, ESCURO,
  "Que bom que você vai palestrar na Python Brasil 2026",
  "Mais dicas nas anotações de cada slide",
  "Capa. Troque o título, o subtítulo e o nome. O dragão, o logo e o selo da data fazem parte do layout. " +
  "Cada slide mostra um layout e traz uma dica, e as anotações, como esta, explicam a dica (no Google Slides, elas se chamam \"anotações do apresentador\"). No LibreOffice, abra Exibir > Notas; no Google Slides e no PowerPoint, as anotações ficam embaixo do slide. Nenhuma dica é regra: use as que fizerem sentido para você e para a sua palestra, e apague o resto. " +
  "Depois do encerramento escuro vem a versão clara dos layouts, com ainda mais dicas, se você quiser. " +
  "Agradecemos por compartilhar o que você sabe: a Python Brasil existe porque pessoas como você sobem ao palco.");

let s = slide("Frase", ESCURO,
  "Frase: uma ideia só, grande, para a mensagem principal ou para mudar de assunto. Se a frase passar de duas linhas, o layout Título e conteúdo costuma servir melhor. " +
  "Uma pergunta para começar a montar a palestra: o que o público deve levar da sala, numa frase só? Os outros slides servem a essa frase. " +
  "Quase toda pessoa palestrante fica nervosa, inclusive quem palestra há anos. O público escolheu a sua sala porque quer ouvir você e torce para dar certo. " +
  "Se bater o nervosismo, procure um rosto amigo na plateia e fale para essa pessoa, como numa conversa. Dá até para combinar antes com uma pessoa amiga para sentar na frente. " +
  "Se algo falhar no palco, comente com calma o que aconteceu e siga em frente: a sala esquece em minutos.");
fill(s, { title: "A sala está torcendo por você." });

s = slide("Citação", ESCURO,
  "O seu jeito de falar, o seu humor e a sua criatividade valem mais do que qualquer coisa neste modelo. " +
  "Citação: até três linhas, com a fonte embaixo, quem disse e onde. Vale conferir a autoria numa fonte primária: muita frase famosa circula com o nome errado. " +
  "As aspas verdes fazem parte do texto: ao trocar a citação, mantenha as duas.");
fill(s, {
  quote: quoted("A praticidade vence a pureza.", LIME),
  author: "The Zen of Python, PEP 20",
});
// The context line lives on the slide, not the layout: other quotes do not need it.
s.addText([{ text: "Dicas, " }, marked("não regras"), { text: ": use as que servirem para você." }], { x: M, y: 3.75, w: TEXT_W + 0.5, h: 0.5, fontSize: 20, color: DARK.textHex, fontFace: THEME.bodyFontFace, margin: 0, valign: "top", isTextBox: true, lang: LANG });

s = slide("Título e conteúdo", ESCURO,
  "Chegue cedo ao local da palestra. Com tempo para conhecer a sala, respirar e conversar com as pessoas, você sobe ao palco com mais calma. " +
  "Título e conteúdo: de três a cinco tópicos por slide. O texto começa em 20 pt; se o programa diminuir a fonte para caber, dois slides costumam ficar mais legíveis.");
fill(s, {
  title: "Na hora de começar",
  body: bullets([
    "Solte o ar devagar e beba um gole de água",
    "O público está do seu lado",
    "Fale mais devagar do que parece natural",
    "A palestra é sua, no seu ritmo",
  ]),
});

s = slide("Palestrante", ESCURO,
  "Sobre mim, logo depois da capa. Quem abre a sessão costuma apresentar você; se o tempo estiver curto, este slide pode sair ou virar uma linha na capa. " +
  "Uma autodescrição ajuda pessoas cegas ou com baixa visão a formar a imagem de quem fala. Uma ou duas frases bastam, por exemplo: " +
  "\"Sou a Maria, tenho 1,60 m, cabelo preto solto, uso óculos verdes e uma camiseta da PyLadies.\"");
fill(s, {
  title: "Seu nome aqui",
  role: "O que você faz · onde",
  bio: bullets(["Quem abre a sessão costuma apresentar você", "Com o tempo curto, este slide pode sair", "Uma autodescrição ajuda quem não vê a tela"]),
});

s = slide("Agenda", ESCURO, "Agenda: a numeração é automática. Voltar a ele entre as partes ajuda o público a saber onde está.");
fill(s, {
  title: "Agenda",
  body: numbered([
    "Mostra ao público o caminho da palestra",
    "Três a cinco partes costumam bastar",
    "Pode voltar entre uma parte e outra",
    "Cada parte também pode abrir com uma Seção",
    "Opcional: pode sair se o tempo for curto",
  ]),
});

s = slide("Seção", ESCURO, "Divisor de seção. Edite o número dentro do círculo e o título. Repetir o nome da parte da agenda ajuda o público a se localizar.");
fill(s, { number: "01", title: "Uma seção para cada parte da agenda" });

s = slide("Duas colunas", ESCURO,
  "Duas colunas, cada uma com o seu título: antes e depois, problema e solução. " +
  "Quem senta no fundo da sala também quer ler o slide. O slide apoia a sua fala; o detalhe e a “colinha” vão para as anotações do slide, que só você vê.");
fill(s, {
  title: "Texto no slide",
  leftTitle: "Em vez de",
  left: bullets(["Parágrafos inteiros", "Ler o slide em voz alta", "Diminuir a fonte para caber", "A “colinha” no slide"]),
  rightTitle: "Experimente",
  right: bullets(["Uma ideia por slide", "Falar o que o slide não diz", "Dividir em dois slides", "A “colinha” nas anotações do slide"]),
});

s = slide("Texto e imagem", ESCURO,
  "Texto à esquerda, imagem à direita. Clique no ícone do espaço reservado para inserir a imagem; ela é cortada para caber. " +
  "O texto alternativo de cada imagem (botão direito > Descrição, ou Texto alternativo) ajuda quem usa leitor de tela. " +
  "Na palestra, uma frase sobre o que a imagem mostra ajuda quem não enxerga e quem só ouve a gravação, por exemplo: \"Este diagrama mostra a requisição passando pelo cache antes do banco.\"");
fill(s, {
  title: "Imagens que explicam",
  body: bullets(["Um diagrama no lugar de um parágrafo", "Uma imagem por ideia", "Descreva para quem não vê"]),
});

s = slide("Imagem e texto", ESCURO,
  "Imagem sangrada à esquerda, texto à direita. Boa para fotos de pessoas, lugares e produtos. " +
  "Fotos de bancos como Unsplash e Wikimedia Commons têm licenças diferentes: vale conferir se a licença permite o uso numa palestra gravada e dar o crédito, por exemplo: Foto: nome da pessoa, licença, site.");
fill(s, {
  title: "Licença e crédito",
  body: bullets(["Fotos suas ou de licença livre", "A licença permite este uso?", "Crédito da autoria no slide", "Pelo menos 1000 px de altura"]),
});

s = slide("Três imagens", ESCURO,
  "Três imagens com legenda: passos de um fluxo, antes e depois, ou telas de um app. " +
  "A tela inteira encolhida vira texto difícil de ler. Antes de capturar, vale aumentar o zoom do navegador ou a fonte do terminal. " +
  "Confira também o que mais aparece na captura: senhas, tokens, e-mails, nomes de clientes, abas e notificações. Um retângulo por cima, no editor de imagem, esconde o que escapou.");
fill(s, {
  title: "Capturas de tela legíveis",
  caption1: "Só a parte que importa",
  caption2: "Fonte grande antes de capturar",
  caption3: "Sem senhas, tokens nem e-mails",
});

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
  "Se o trecho for maior, uma saída é dividir em mais slides ou refatorar o exemplo para mostrar só o que importa: 20 linhas pequenas ficam difíceis de ler do fundo da sala. " +
  "Para ter as mesmas cores no seu código, use o slidesnippet.com com: tema Monokai, fundo #1A1A1A, fonte de 20px e altura de linha 1.2. " +
  "Google Slides e PowerPoint: clique em Copy styled, clique dentro do cartão e cole. No Google, cole pelo menu Editar > Colar para manter as cores. " +
  "LibreOffice: clique em Download SVG e arraste o arquivo para o slide, sobre o cartão. " +
  "Outra opção popular é o carbon.now.sh: escolha o tema Monokai, exporte em PNG ou SVG e insira a imagem no slide, em qualquer programa. " +
  "Em imagens, escreva o código no texto alternativo (botão direito > Descrição, ou Texto alternativo), para leitores de tela.";

function codeSlide(layout, section, tip, notes = CODE_NOTES) {
  const sl = slide(layout, section, notes);
  fill(sl, { title: "Código: 8 linhas cabem bem", code: highlightCode(SAMPLE_CODE, "python"), note: tip });
  return sl;
}
s = codeSlide("Código", ESCURO, [
  { text: "Dica: ", options: { bold: true } },
  { text: "gere o código colorido no slidesnippet.com, tema Monokai, fundo #1A1A1A." },
]);
// The wizard sticker from the stickers slide, in the empty corner of the code card, as an example of use.
s.addImage({ path: resized(path.join(BRAND, "sticker-mago.png"), { width: 600 }), x: 8.2, y: 2.75, w: 1.6 * MAGO_RATIO, h: 1.6, altText: "Figurinha do mago digitando no teclado" });

const LONG_CODE = `from dataclasses import dataclass
from datetime import datetime, timedelta


@dataclass
class Palestra:
    titulo: str
    inicio: datetime
    duracao_min: int = 25

    @property
    def fim(self) -> datetime:
        return self.inicio + timedelta(minutes=self.duracao_min)

    def conflita_com(self, outra: "Palestra") -> bool:
        return self.inicio < outra.fim and outra.inicio < self.fim

    def cabe_no_slot(self, slot_min: int) -> bool:
        # Reserva 5 minutos para perguntas
        return self.duracao_min + 5 <= slot_min
`;
// The whole class at 6 pt shows what a long snippet looks like from the back of the room.
const tiny = (runs) => runs.map((r) => ({ ...r, options: { ...r.options, fontSize: 6, lineSpacing: 7.5 } }));

s = slide("Código lado a lado", ESCURO,
  "Dois trechos lado a lado: antes e depois de uma refatoração, ou duas formas de resolver o mesmo problema. Cada cartão aceita até 8 linhas e cerca de 30 colunas. " +
  "Neste exemplo, a esquerda mostra a classe inteira, que só cabe em letra miúda; a direita mostra só a parte que a explicação usa. " +
  "Para gerar o código colorido, veja as anotações do slide 12.");
fill(s, {
  title: "Um exemplo menor também ensina",
  leftTitle: "20 linhas, letra miúda :(",
  codeLeft: tiny(highlightCode(LONG_CODE)),
  rightTitle: "4 linhas, letra grande :)",
  codeRight: highlightCode(`def cabe(palestra, slot):
    # 5 min para perguntas
    fim = palestra.duracao + 5
    return fim <= slot
`),
});

s = slide("Números em destaque", ESCURO, "Números. Até três costumam ler bem; o rótulo diz o que cada número mede. " +
  "O círculo pixelado em volta do 8 é uma figurinha: arraste e estique para marcar outro número, ou apague. " +
  "Neste exemplo: a partir de 18 pt, quem senta no fundo da sala costuma ler o texto; 8 linhas de código cabem no cartão com letra grande; 5 minutos é uma reserva comum para perguntas, se o seu horário permitir.");
s.addText("Três números que ajudam", { placeholder: "title" });
[["18", "pontos: o texto se lê do fundo da sala"], ["8", "linhas de código cabem bem"], ["5", "minutos para perguntas no fim"]].forEach(([v, l], i) => {
  fill(s, { [`value${i + 1}`]: v, [`label${i + 1}`]: l });
});
// The pixel circle from the stickers slide, around the middle number, as an example of use.
s.addImage({ path: path.join(BRAND, "pixel-circle.png"), x: 4.2, y: 2.2, w: 1.6, h: 1.0, altText: "Círculo pixelado limão em volta do número 8" });

s = slide("Três cartões", ESCURO, "Três cartões, cada um com título e texto. " +
  "Vídeo com som: nem sempre o áudio do computador sai nas caixas da sala. Com uma palestra emendada na outra, nem sempre dá para testar o som antes; como plano B, um vídeo legendado ou narrado por você ao vivo funciona sem áudio. " +
  "Live coding: com um vídeo da demo funcionando, ou capturas de cada passo salvas no computador, você troca para a gravação se algo falhar no palco e segue a palestra. " +
  "Internet: com centenas de pessoas na mesma rede, a conexão fica lenta ou cai; vídeos, páginas e notebooks baixados antes não dependem dela. " +
  "Arquivo: se o seu computador não funcionar com o projetor, o PDF abre em qualquer outro, com as fontes certas. Se algo falhar mesmo assim, a sala entende: acontece em toda conferência.");
s.addText("Antes de subir no palco", { placeholder: "title" });
[
  ["Live coding", "Um plano B ajuda: capturas de tela ou um vídeo gravado da demo."],
  ["Internet", "A rede pode cair. Vídeos e páginas baixados não dependem dela."],
  ["Arquivo", "Uma cópia em PDF num pendrive abre em qualquer computador."],
].forEach(([h, t], i) => fill(s, { [`card${i + 1}Title`]: h, [`card${i + 1}`]: t }));

s = slide("Somente título", ESCURO,
  "Somente título: espaço livre para tabelas, gráficos e diagramas. Aqui, uma tabela nativa. " +
  "A moderação da sessão costuma estar ocupada com a palestra anterior; quem é da organização ou do voluntariado na sala pode ajudar com o projetor, o microfone e o tempo. " +
  "O grupo de palestrantes no Telegram reúne a organização e as outras pessoas palestrantes: é um bom lugar para dúvidas antes do evento. " +
  "Um carregador e um adaptador de vídeo (HDMI ou USB-C) na mochila ajudam: nem toda sala tem os dois.");
s.addText("O seu dia de palestra", { placeholder: "title" });
const tableHead = { bold: true, color: HEX.dk1, fill: { color: HEX.accent1 } };
const tableCell = { color: DARK.textHex, fill: { color: DARK.cardHex } };
const row = (cells, options) => cells.map((text) => ({ text, options }));
s.addTable(
  [
    row(["Quando", "Sugestão"], tableHead),
    ...[
      ["Antes do evento", "Tirar dúvidas no grupo de palestrantes no Telegram"],
      ["No dia", "Chegar cedo, conhecer o lugar, conversar"],
      ["Na sala", "Se houver intervalo, testar projetor e som; microfone a um palmo da boca"],
      ["15 min antes", "Dar um oi para quem é da organização na sala"],
      ["Depois", "Publicar os slides no link do QR code"],
    ].map((cells) => row(cells, tableCell)),
  ],
  { x: M, y: BODY.y, w: W - 2 * M, colW: [2.2, 6.8], fontSize: 18, fontFace: THEME.bodyFontFace, rowH: 0.48, border: { type: "solid", pt: 1, color: HEX.dk1 }, margin: 0.08, valign: "middle", lang: LANG }
);

chartSlide(DARK, ESCURO, CHART_NOTES, [["Texto", DARK.textHex], ["Limão", LIME], ["Cinza", DARK.mutedHex]]);

s = slide("Imagem cheia", ESCURO,
  "Imagem de fundo com legenda. Clique com o botão direito na imagem > Substituir imagem. Com a faixa translúcida embaixo, a legenda fica legível sobre qualquer foto; para usar a faixa em outra foto, duplique este slide. " +
  "Fotos suas ou de licença livre funcionam bem. Vale conferir se a licença permite o uso e creditar a autoria na legenda, como no exemplo.");
// The sample image fills the placeholder; an empty placeholder would be drawn above the caption.
s.addImage({ placeholder: "image", path: path.join(BRAND, "sample-fullbleed.png"), x: 0, y: 0, w: W, h: H, altText: "Imagem de exemplo: dragão da Python Brasil 2026 sobre fundo escuro" });
s.addShape(pres.ShapeType.rect, { x: 0, y: H - 0.9, w: W, h: 0.9, fill: { color: HEX.dk1, transparency: 25 }, line: { color: HEX.dk1, width: 0 }, objectName: "Faixa da legenda" });
s.addText("Foto: Nome da Pessoa · CC BY 4.0", { x: M, y: H - 0.75, w: W - 2 * M, h: 0.6, fontSize: 14, color: DARK.textHex, valign: "middle", isTextBox: true, margin: 0, lang: LANG });

s = slide("Referências", ESCURO, "Referências. Um material por linha: o nome e o endereço curto. Links longos são difíceis de copiar da tela. " +
  "Uma página só com todos os links (o README de um repositório no GitHub, um gist, uma página no GitHub Pages ou um Linktree) cabe num QR code no encerramento, e o público abre tudo pelo celular.");
s.addText("Referências", { placeholder: "title" });
const reference = ([name, url], i, all) => [
  { text: name + "  ", options: {} },
  { text: url, options: { fontFace: THEME.headFontFace, color: DARK.mutedHex, breakLine: i < all.length - 1 } },
];
s.addText([
  ["Código de conduta da Python Brasil", "python.org.br/cdc"],
  ["Código colorido para slides", "slidesnippet.com"],
  ["Fontes Inter e Cascadia Mono", "fonts.google.com"],
  ["Verificador de contraste", "webaim.org/resources/contrastchecker"],
].flatMap(reference), { placeholder: "body" });

s = closingSlide(DARK, ESCURO, "Perguntas?", CONTACTS, "Este não é o último slide do modelo: a seguir vem a versão clara dos layouts, com ainda mais dicas. " + CLOSING_NOTES + " As dicas para a hora das perguntas estão nas anotações do último slide claro.");
// Readers who skip the notes would stop here, so the slide itself says the deck goes on.
s.addText("Continua: versão clara com mais dicas →", { x: M, y: 4.45, w: 5.2, h: 0.4, fontSize: 16, bold: true, color: LIME, fontFace: THEME.headFontFace, margin: 0, valign: "middle", isTextBox: true, lang: LANG, objectName: "Aviso: o modelo continua" });

// ----- light variants -----
const CLARO = "Layouts claros";
pres.addSection({ title: CLARO });

coverSlide(LIGHT, CLARO,
  "Todos os layouts têm versão clara",
  "Para salas claras ou projetores fracos",
  "Capa, versão clara. Se a sala for muito iluminada ou o projetor for fraco, o fundo claro fica mais legível. Pergunte à organização como é a sua sala.");

s = slide("Seção (claro)", CLARO,
  "Divisor de seção, versão clara. A troca de parte é uma boa hora para uma pausa, e entre um slide e outro também: respire, beba um gole de água e siga. " +
  "A pausa parece longa para quem fala e curta para quem ouve, e o público aproveita para acompanhar.");
fill(s, { number: "02", title: "Uma pausa para respirar e beber água" });

s = slide("Título e conteúdo (claro)", CLARO,
  "Título e conteúdo, versão clara. O telão mostra tudo o que aparece na sua tela, inclusive uma mensagem pessoal no meio da palestra. " +
  "O modo Não perturbe existe no Linux, no macOS e no Windows; dá para ativar antes de subir ao palco e desativar depois. " +
  "Ao digitar um endereço, o navegador sugere o que está no histórico; numa janela anônima ou num perfil novo do navegador, o histórico fica vazio.");
fill(s, {
  title: "A sua tela no telão",
  body: bullets([
    "Notificações desligadas (modo Não perturbe)",
    "Papel de parede neutro",
    "Só as abas e os programas da palestra",
    "Janela anônima: o histórico não aparece ao digitar endereços",
  ]),
});

s = slide("Duas colunas (claro)", CLARO, "Duas colunas, versão clara. Um ensaio completo em voz alta mostra quanto tempo a palestra leva; ensaiada só na cabeça, ela costuma passar do tempo.");
fill(s, {
  title: "Um ensaio em voz alta ajuda",
  leftTitle: "Ensaiar",
  left: bullets(["Com cronômetro", "Com alguém assistindo", "No computador do dia"]),
  rightTitle: "Cortar",
  right: bullets(["O que passar do tempo", "Detalhes que cabem nas anotações", "Slides que você pula ao ensaiar"]),
});

s = slide("Texto e imagem (claro)", CLARO, "Texto e imagem, versão clara. Parte do público pode ter baixa visão ou daltonismo; parte vai ver só a gravação. " +
  "Para a informação não depender só da cor, junte a cor a um rótulo, um ícone ou uma forma: em vez de uma bolinha verde e uma vermelha, escreva também \"passou\" e \"falhou\".");
fill(s, {
  title: "Imagens acessíveis",
  body: bullets(["Texto alternativo em toda imagem", "Legenda curta se a imagem não for óbvia", "Informação que não depende só da cor"]),
});

s = slide("Imagem e texto (claro)", CLARO, "Imagem e texto, versão clara. As anotações do slide aparecem só para você durante a apresentação (LibreOffice: Console do apresentador; Google Slides: Visualização do apresentador; PowerPoint: Modo de Exibição do Apresentador).");
fill(s, {
  title: "Olho no olho",
  body: bullets(["Olhar para uma pessoa amiga, não só para a tela", "As anotações do slide como apoio", "Apontar com palavras, não com o mouse"]),
});

codeSlide("Código (claro)", CLARO, [
  { text: "Dica: ", options: { bold: true } },
  { text: "no LibreOffice, baixe o SVG do slidesnippet.com e arraste para o slide." },
], "Código, versão clara: o cartão continua escuro, para o código ter o mesmo contraste. Para gerar o código colorido, veja as anotações do slide 12.");

s = slide("Citação (claro)", CLARO, "Citação, versão clara, com a fonte embaixo: aqui, a PEP 20, que você também vê com import this.");
// Light slides mark the key word with the lime highlight, as the brand's light pages do.
const [open, , close] = quoted("", HEX.dk1);
fill(s, { quote: [open, marked("Legibilidade"), { text: " conta." }, close], author: "PEP 20" });

s = slide("Frase (claro)", CLARO, "Frase, versão clara. Com menos texto no slide, a letra fica maior e a atenção do público fica em você.");
fill(s, { title: "Menos texto, letra maior." });

s = slide("Números em destaque (claro)", CLARO, "Números, versão clara. No fundo branco, o limão como cor de texto quase some; para destacar, use o limão como marca-texto atrás do texto preto, como aqui. O contraste de 4,5:1 é o mínimo do WCAG para texto; todas as cores deste modelo passam. " +
  "Uma ideia por slide ajuda quem lê devagar ou usa leitor de tela, e nenhuma informação passada só pela cor ajuda quem tem daltonismo.");
s.addText("Acessibilidade em números", { placeholder: "title" });
[["4,5:1", "contraste mínimo do texto"], ["1", "ideia por slide"], ["0", "informações passadas só pela cor"]].forEach(([v, l], i) => {
  fill(s, { [`value${i + 1}`]: [marked(v)], [`label${i + 1}`]: l });
});

s = slide("Três cartões (claro)", CLARO,
  "Três cartões, versão clara. O código de conduta da Python Brasil vale para todas as pessoas no evento, inclusive no palco: python.org.br/cdc. Dúvidas sobre algum conteúdo podem ir para o grupo de palestrantes no Telegram. " +
  "Se você sofrer ou presenciar assédio, discriminação ou humilhação, procure a Equipe de Resposta.");
s.addText("O código de conduta no palco", { placeholder: "title" });
[
  ["Todo público", "O público inclui crianças, então o conteúdo é para todas as idades."],
  ["Respeito", "Humor sem alvo e exemplos que incluem todo mundo."],
  ["Dúvidas", "Na dúvida sobre algum conteúdo, a organização ajuda."],
].forEach(([h, t], i) => fill(s, { [`card${i + 1}Title`]: h, [`card${i + 1}`]: t }));

s = slide("Palestrante (claro)", CLARO, "Palestrante, versão clara. Com os pronomes no slide, quem cita a sua palestra depois acerta. Uma foto recente ajuda o público a encontrar você nos intervalos para continuar a conversa.");
fill(s, {
  title: "Seu nome aqui",
  role: "Pronomes, cargo e comunidade",
  bio: bullets(["Onde o público encontra você", "Três fatos, não um currículo", "Uma foto recente"]),
});

chartSlide(LIGHT, CLARO, "Gráfico, versão clara. Para editar os dados, veja as anotações do slide 17.", [["Texto", LIGHT.textHex], ["Cinza", LIGHT.mutedHex]]);

// The deck ends with the organization's message to the speaker.
closingSlide(LIGHT, CLARO, "Valeu!", [
  { text: "Ficamos muito felizes por ter você na Python Brasil 2026.", options: { bold: true, breakLine: true } },
  { text: "Conte com a gente: estamos aqui para apoiar e torcer por você.", options: { breakLine: true } },
  { text: "Organização da Python Brasil 2026", options: { fontFace: THEME.headFontFace, fontSize: 18, color: LIGHT.mutedHex } },
], "Uma mensagem da organização para você, no layout de encerramento. Na sua palestra, troque o texto pelos seus contatos e o QR code pelo link dos seus slides; as dicas de QR code estão no slide Perguntas?, no fim da parte escura. " + QUESTIONS_NOTES);

// ----- stickers -----
const FIGURINHAS = "Figurinhas";
pres.addSection({ title: FIGURINHAS });
s = slide("Somente título", FIGURINHAS,
  "Figurinhas para copiar e colar nos seus slides: clique numa figurinha, copie (Ctrl+C ou Cmd+C) e cole no seu slide. " +
  "Para mudar o tamanho sem deformar, arraste um canto segurando Shift. O logo preto vai sobre fundo claro; o claro, sobre fundo escuro. " +
  "O marca-texto é a cor de realce do texto, que acompanha a palavra quando você edita: copie a figurinha e troque a palavra, ou selecione uma palavra sua e escolha o realce limão #B7FF06. " +
  "Um destaque chama atenção quando aparece pouco: uma figurinha por slide costuma bastar. Os arquivos originais estão na pasta assets/brand do repositório.");
s.addText("Figurinhas", { placeholder: "title" });
// A Florianópolis greeting for whoever reads the template to the end.
s.addText("Dazumbanho! Chegasse ao fim ixtepô!", { x: W - M - 5.8, y: 0.45, w: 5.8, h: 0.6, fontSize: 16, bold: true, color: LIME, fontFace: THEME.headFontFace, align: "right", valign: "middle", margin: 0, isTextBox: true, lang: LANG, objectName: "Fim do modelo" });
const sticker = (file, box, altText) => s.addImage({ path: resized(path.join(BRAND, file), { width: 900 }), ...box, altText });
sticker("lockup-on-dark.png", { x: M, y: 1.7, w: 2.6, h: 2.6 * LOCKUP_RATIO }, "Logo python brasil com o dragão, versão clara");
sticker("sticker-witch.png", { x: 3.55, y: 1.6, w: 1.6, h: 1.6 * (2132 / 2354) }, "Adesivo da bruxinha surfista com contorno limão");
sticker("witch-light.png", { x: 5.5, y: 1.7, w: 1.45, h: 1.45 / WITCH_RATIO }, "Bruxinha surfista, versão clara");
sticker("dragon-lime.png", { x: 7.5, y: 1.55, w: 1.2, h: 1.2 / DRAGON_RATIO }, "Dragão da Python Brasil 2026");
s.addShape(pres.ShapeType.roundRect, { x: M, y: 3.35, w: 2.6, h: 1.5, fill: { color: "FFFFFF" }, line: { color: "FFFFFF", width: 0 }, rectRadius: 0.08, objectName: "Fundo claro do logo" });
sticker("lockup-on-light.png", { x: M + 0.2, y: 3.45, w: 2.2, h: 2.2 * LOCKUP_RATIO }, "Logo python brasil com o dragão, versão escura");
s.addImage({ path: path.join(BRAND, "pixel-circle.png"), x: 3.45, y: 3.45, w: 2.1, h: 2.1 * (420 / 700), altText: "Círculo pixelado limão para marcar uma palavra" });
s.addText("olha aqui", { x: 3.45, y: 3.45, w: 2.1, h: 2.1 * (420 / 700), fontSize: 20, bold: true, color: DARK.textHex, fontFace: THEME.headFontFace, align: "center", valign: "middle", margin: 0, isTextBox: true, lang: LANG });
sticker("sticker-mago.png", { x: 8.3, y: 3.3, w: 1.6 * MAGO_RATIO, h: 1.6 }, "Figurinha do mago digitando no teclado, com contorno limão");
// The marker is the native text highlight, black on lime, so it follows edits and reads on dark and on white slides.
s.addText([marked("marca-texto")], { x: 5.6, y: 3.8, w: 2.6, h: 0.6, fontSize: 26, fontFace: THEME.headFontFace, align: "center", valign: "middle", margin: 0, isTextBox: true, lang: LANG, objectName: "Marca-texto limão" });

// ---------- write ----------
(async () => {
  fs.mkdirSync(DIST, { recursive: true });
  fs.mkdirSync(BUILD, { recursive: true });
  // pptxgenjs reads image files only when it writes the deck, so the resized images and the QR code can be made here.
  for (const { src, out, size } of RESIZED) await sharp(src).resize(size).png().toFile(out);
  await QRCode.toFile(QR_PATH, QR_URL, { margin: 2, width: 800, color: { dark: "#0F0F0FFF", light: "#FFFFFFFF" } });
  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  await continueNumbering(OUT);
  await fixNotes(OUT, LANG);
  await capitalizeMarkedRuns(OUT);
  console.log(`wrote ${path.relative(ROOT, OUT)}`);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
