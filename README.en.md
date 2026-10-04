# Python Brasil 2026 slide template

[Português](README.md) · English · [Español](README.es.md)

A ready-to-use presentation template for speakers at [Python Brasil 2026](https://2026.pythonbrasil.org.br/), in Florianópolis, from October 14 to 19. Open it, replace the example text with yours, and present. The example slides and the speaker notes are in Portuguese.

## Choose how you will edit

| You use | Do this |
|---|---|
| Google Slides | **[Make a copy in Google Slides](https://docs.google.com/presentation/d/1Wy1BdlDfRLMqblnBwGq42-O9-O1lEkB04zzoWlSeAUE/copy)**. The copy goes to your Google Drive. |
| PowerPoint or Keynote | Download the [`.pptx`](https://github.com/rodbv/pybr2026-slides/releases/latest/download/pybr2026-template.pptx) and [install the fonts](#do-i-need-to-install-fonts). |
| LibreOffice | Download the [`.odp`](https://github.com/rodbv/pybr2026-slides/releases/latest/download/pybr2026-template.odp). The fonts are inside the file. |
| A text editor | Use the [Markdown template](https://github.com/rodbv/pybr2026-marp), which also has example slides in English and Spanish. You write the slides as text, and an AI agent such as Copilot or Claude applies the visual style. |

![Some slides of the template, one every 2.5 seconds: cover, quote, speaker, agenda, image, code, numbers, chart, flow, highlight, questions, light cover and stickers](https://github.com/rodbv/pybr2026-slides/releases/latest/download/tour.gif)

<details>
<summary>See all 39 slides at once</summary>

![Overview of the 39 example slides](https://github.com/rodbv/pybr2026-slides/releases/latest/download/overview.png)

</details>

## After you open it

1. Save a copy with the name of your talk.
2. Duplicate the slides you will use and delete the others. The example slides show each layout, first in the dark version and then in the light one.
3. Read the speaker notes of each slide: they have tips for your talk.

The gray boxes mark where images go. Right-click a box and choose "Replace image" ("Change Picture" in PowerPoint).

The template is a starting point: change anything you like. To keep the look of the event, use the colors and fonts below. The [visual identity summary](docs/referencia.md#identidade-visual) (in Portuguese) has the rest: logos, stickers and contrast rules.

## Colors and fonts

| | Color | Hex | RGB | Use |
|---|---|---|---|---|
| ![Black sample](docs/cores/0F0F0F.png) | Black | `#0F0F0F` | 15, 15, 15 | Dark background, text on light background |
| ![Off white sample](docs/cores/E8F4BA.png) | Off white | `#E8F4BA` | 232, 244, 186 | Text on dark background |
| ![Citrus green sample](docs/cores/B7FF06.png) | Citrus green | `#B7FF06` | 183, 255, 6 | Highlight; as a text color, only on dark background |
| ![Violet sample](docs/cores/BF2EB2.png) | Violet | `#BF2EB2` | 191, 46, 178 | Links on light background |

| Font | Use |
|---|---|
| [Cascadia Mono](https://fonts.google.com/specimen/Cascadia+Mono) | Titles and code |
| [Roboto](https://fonts.google.com/specimen/Roboto) | Text |

Will you create material with an AI agent? Ask it to read [`AGENTS.md`](AGENTS.md): the file has the colors, the fonts and the brand rules.

## Before you present

- **Text:** people in the back row need to read the slide too. Nothing below 18 pt. If the text does not fit, split the slide in two and move the rest to the speaker notes.
- **Code:** up to 8 lines and about 60 columns per slide. If the snippet is longer, split it across slides or show only the part that matters.
- **Link to your slides:** replace the QR code on the closing slide with a QR code for the link to your slides. Write the link below it too.
- **Questions:** keep about 5 minutes for questions. Repeat each question into the microphone before you answer, for the room and the recording.
- **Live coding:** have a plan B, such as a video of the working demo or screenshots of each step.
- **Internet:** the event network can fail. Download the videos, pages and notebooks you will show before the talk.
- **PDF:** export your slides as PDF (File > Export or Download > PDF) and bring it on a USB drive. The PDF opens on any computer, with the right fonts.

## Frequently asked questions

<details>
<summary>Do I need to install fonts?</summary>

Only for the `.pptx`. Google Slides finds the fonts on its own, and the `.odp` has the fonts inside. The template uses Roboto for text and Cascadia Mono for titles and code; both are in the [`fonts/`](fonts/) folder.

- **Windows:** select the `.ttf` files, right-click and choose "Install".
- **macOS:** open each `.ttf` file and click "Install Font".
- **Linux:** copy the `.ttf` files to `~/.local/share/fonts/` and run `fc-cache -f`.

Without the fonts, the program uses another font. The text stays readable, but titles can break in different places.

</details>

<details>
<summary>How do I replace an image or the QR code?</summary>

Right-click the gray box or the QR code and choose "Replace image" ("Change Picture" in PowerPoint). The size written in the box is the size that fills the space on a Full HD screen.

To make the QR code in LibreOffice, use Insert > OLE Object > QR and Barcode. In the other programs, make the image on a QR code website. Test it with your phone a few meters from the screen.

</details>

<details>
<summary>How do I add colored code?</summary>

Presentation programs do not color code. Paste your snippet into [SlideSnippet](https://www.slidesnippet.com/), choose the Monokai theme and copy the result into the card on the "Código" slide. The options for each program are in the [reference](docs/referencia.md#código-nos-slides) (in Portuguese).

</details>

<details>
<summary>How do I change the chart data?</summary>

In PowerPoint and LibreOffice, double-click the chart and change the names and numbers in the spreadsheet. Google Slides imports the chart as an image: there, create your own with Insert > Chart.

</details>

## Found a problem?

Open an [issue on GitHub](https://github.com/rodbv/pybr2026-slides/issues). Say what happened and in which program, and add a screenshot if you can.

## More information

These pages are in Portuguese:

- [Reference](docs/referencia.md): layouts, colors and contrast, visual identity, accessibility and code on slides.
- [Contributing](CONTRIBUTING.md): how the template is built and published.

## Licenses

- Template, example text and code in this repository: [CC0 1.0](LICENSE) (public domain). Use, change and share them without asking for permission or giving credit.
- Logo, illustrations and visual identity: Python Brasil 2026 and APyB, from the official brandboard of the event, created by [Ana Terhorst](https://anaterhorstdesign.com).
- Roboto and Cascadia Mono fonts: SIL Open Font License 1.1, in `fonts/`.
