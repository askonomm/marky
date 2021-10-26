# Marky

A tiny Markdown parser written in TypeScript that spits out HTML. Currently supports only a subset of the Markdown spec. Meant to be used with [Deno](https://deno.land).

## Usage

```typescript
import { marky } from 'https://deno.land/x/marky/mod.ts';

const html = marky('**hi there**'); // => <p><strong>hi there</strong></p>
```

## To-do

- [x] Parse bold text
- [x] Parse italic text
- [x] Parse paragraphs
- [x] Parse inline code
- [ ] Parse striked out text
- [ ] Parse underlined text
- [ ] Parse headings
- [ ] Parse code blocks
- [ ] Parse links
- [ ] Parse images
- [ ] Parse quote blocks (and nested quote blocks!)
- [ ] Parse unordered lists (and nested lists!)
- [ ] Parse ordered lists (and nested lists!)
- [ ] Parse horizontal line separators