# Marky

A Markdown parser written in TypeScript that spits out HTML. Currently supports
only a subset of the Markdown spec. Meant to be used with
[Deno](https://deno.land).

## Usage

```typescript
import { marky } from "https://deno.land/x/marky/mod.ts";

const html = marky("**hi there**"); // => <p><strong>hi there</strong></p>
```

## Spec

### Bold text

Bold text is created by wrapping selected text with two asterisk characters.

```markdown
There's **nothing** quite like a cold beverage on a hot summer night.
```

### Italic text

Italic text is created by wrapping selected text with one underscore character.

```markdown
There's _nothing_ quite like a cold beverage on a hot summer night.
```

### Inline code

Inline code text is created by wrapping selected text with one backtick
character.

```markdown
There's `nothing` quite like a cold beverage on a hot summer night.
```

### Striked out text

Striked out text is created by wrapping selected text with two tilde characters.

```markdown
There's ~~nothing~~ quite like a cold beverage on a hot summer night.
```

### Paragraphs

Paragraphs are created by simply leaving one empty line break between text,
which, technically means having two line breaks, but remember it as just one
empty line between text.

### Headings

Headings are created by adding a octothorp (hashtag) character in front of a
block of text that is separated from others by one empty line.

```markdown
# This is a big title

And some paragraph goes here.

## A little smaller title

And another paragraph goes here.
```

As you can see, the smaller the amount of octothorp characters the bigger the
title will be. You can use as many octothorps as you wish, but browsers can only
recognize up to 6 of them.

### Code blocks

Code blocks are created by wrapping your code with three backtick characters.

````markdown
```
code goes here
```
````

If you want to also make sure that the HTML output would have a class associated
with the programming language used in the code block, make sure to append the
language name to the first occurence of backticks, like so:

````markdown
```javascript
code goes here
```
````

## To-do until stable release

- [x] Parse bold text
- [x] Parse italic text
- [x] Parse paragraphs
- [x] Parse inline code
- [x] Parse striked out text
- [x] Parse headings
- [x] Parse code blocks
- [ ] Parse links
- [ ] Parse images
- [ ] Parse quote blocks (and nested quote blocks!)
- [ ] Parse unordered lists (and nested lists!)
- [ ] Parse ordered lists (and nested lists!)
- [ ] Parse horizontal line separators
