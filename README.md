# esperanto-text

Type and convert the six Esperanto letters **ĉ ĝ ĥ ĵ ŝ ŭ**.

The first obstacle for every learner is typing them. This library converts between the real letters, the **x-system** (`cxu`) and the **h-system** (`chu`), and turns typing into the real letters as it happens. It is a plain TypeScript function, a DOM helper for any input, and a React hook. No dependencies.

**Live demo:** https://esperantaskanaduko.com/open-source/esperanto-text/

```bash
npm install esperanto-text
# not on npm yet? install from GitHub:
npm install github:Esperanta-Skanaduko/esperanto-text
```

## Convert text

```ts
import { toUnicode, toXSystem, toHSystem, detectSpelling } from 'esperanto-text';

toUnicode('Morgaux estas jxauxdo');   // 'Morgaŭ estas ĵaŭdo'  (the spelling is detected)
toXSystem('Ĉu vi ŝatas ĝin?');        // 'Cxu vi sxatas gxin?'
toHSystem('ĵaŭdo');                   // 'jhaudo'   (the h-system writes ŭ as a plain u)
detectSpelling('cxu');                // 'x'  ('unicode' | 'x' | 'h' | 'mixed' | 'none')
```

`fromXSystem`, `fromHSystem`, `toXSystem` and `toHSystem` are exported too. Case follows the letter: `Cx` gives `Ĉ`, and a word in capitals such as `ĈU` becomes `CXU`.

## Type as you go

```ts
import { attachEsperantoInput } from 'esperanto-text/dom';

const detach = attachEsperantoInput(document.querySelector('textarea')!, { x: true, h: false });
```

Typing `cx` gives `ĉ`. **Backspace straight after a conversion puts the typed letters back**, so `Linux` can still be written. Only single typed characters are converted; pasted text is left alone. The h-system (`ch` gives `ĉ`) is off by default because `ch` is common in other languages.

```tsx
import { useEsperantoInput } from 'esperanto-text/react';

const Field = () => {
  const { inputProps } = useEsperantoInput('');
  return <input {...inputProps} lang="eo" />;
};
```

For a textarea write `useEsperantoInput<HTMLTextAreaElement>()`. The hook keeps the caret where you expect it. `react` is an optional peer dependency.

The pure functions behind both, `convertTyped` and `revertTyped`, are exported for other frameworks.

## What is exact and what is not

| | |
| --- | --- |
| **x-system** | Exact. The letter `x` is not in the Esperanto alphabet, so `cx gx hx jx sx ux` can only mean a supersign letter. |
| **Foreign words** | `Linux`, `Redux`, `lux` and a few more contain `ux` and are protected by default (`protectedWords`). |
| **URLs and e-mail** | Never converted (`skipUrls: false` to change that). |
| **h-system** | **Best effort.** `ch gh hh jh sh` become `ĉ ĝ ĥ ĵ ŝ`, and `au` and `eu` become `aŭ` and `eŭ`. In compounds these can be two real letters: `flughaveno` (flugi + haveno), `traurba` (tra + urbo), `reuzi`. A short default list of such cases is protected (`DEFAULT_H_EXCEPTIONS`); any other compound will be converted wrongly. Pass your own `exceptions`. |

The h-system problem is a property of the spelling, not of this library; the author of the Rust crate [esperanto-text](https://github.com/thombles/esperanto-text) describes the same ambiguities in [a blog post](https://octet-stream.net/b/tdu/blog/2020/06/11/automatic-esperanto-transliteration.html). If your text is yours to choose, prefer the x-system.

## Development

```bash
npm install
npm test            # vitest + jsdom, 41 tests including negative controls
npm run typecheck
npm run build       # dist/
npm run build:site  # site/esperanto-text.js for the demo page
```

The `site/` folder is the demo page published at the link above.

## License

[MIT](LICENSE), © Victor Williams. Part of [Esperanta Skanaduko](https://esperantaskanaduko.com).
