// Turns Python source into pptxgenjs text runs colored with the deck palette.
// Slide editors have no syntax highlighting, so the colors are baked into the runs.
const KEYWORDS = new Set(
  "False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield match case".split(" ")
);
const BUILTINS = new Set("print len range dict list set str int float bool type isinstance enumerate zip open super self cls".split(" "));

const TOKEN = /(#.*$)|("""[\s\S]*?"""|'''[\s\S]*?'''|f?"(?:\\.|[^"\\])*"|f?'(?:\\.|[^'\\])*')|(@\w+(?:\.\w+)*)|(\b\d+(?:\.\d+)?\b)|(\b[A-Za-z_]\w*\b)|(\s+|.)/gm;

function highlightPython(source, palette) {
  const lines = source.replace(/\n$/, "").split("\n");
  const runs = [];
  lines.forEach((line, i) => {
    const lineRuns = [];
    let prev = null;
    for (const m of line.matchAll(TOKEN)) {
      const [text, comment, string, decorator, number, word] = m;
      let color = palette.text;
      let bold = false;
      if (comment) color = palette.comment;
      else if (string) color = palette.string;
      else if (decorator) color = palette.decorator;
      else if (number) color = palette.number;
      else if (word) {
        if (KEYWORDS.has(word)) { color = palette.keyword; bold = true; }
        else if (prev === "def" || prev === "class") { color = palette.name; bold = true; }
        else if (BUILTINS.has(word)) color = palette.builtin;
        prev = word;
      }
      lineRuns.push({ text, options: { color, bold } });
    }
    if (lineRuns.length === 0) lineRuns.push({ text: " ", options: { color: palette.text } });
    if (i < lines.length - 1) lineRuns[lineRuns.length - 1].options.breakLine = true;
    runs.push(...lineRuns);
  });
  return runs;
}

module.exports = { highlightPython };
