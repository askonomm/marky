# Marky

A Markdown parser written in TypeScript that spits out HTML available as a Deno
third party module and as a ES module.

## Usage

### Deno

```typescript
import { marky } from "https://deno.land/x/marky@v1.0/mod.ts";

const html = marky("**hi there**"); // => <p><strong>hi there</strong></p>
```

### ESM

You can also use Marky anywhere where ES modules are supported by downloading
and using the `marky.esm.js` file, and then importing it as follows:

```javascript
import { marky } from "./marky.esm.js";

const html = marky("**hi there**"); // => <p><strong>hi there</strong></p>
```

Or if you want to use Marky in the browser and don't want to bother downloading
and hosting Marky yourself then you can import it conveniently via JSDelivr like
this:

```html
<script type="module">
import { marky } from "https://cdn.jsdelivr.net/gh/askonomm/marky@1.0/marky.esm.js";

document.querySelector('body').innerHTML = marky("** hi there**");
</script>
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

### Links

Links can be created by wrapping the label of a link in two square brackets,
followed by the link being wrapped in two parentheses.

```markdown
You should totally [visit my site](https://bien.ee).
```

### Images

Images can be created just like links, where you wrap the label (well, alt title
in this case) in two square brackets which is followed by the image aadress
being wrapped in two parentheses. Except, add a exclamation mark in front, which
will signify that we're dealing with an image and not with a link.

```markdown
Here's a photo ![profile photo](https://somewhere.com/photo.jpg)
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

### Horizontal line separator block

Horizontal line separator is created by having a block separated by a empty line
break (just like paragraphs or code blocks) and writing three concecutive
asterisk characters.

```markdown
This is a paragraph.

***

And this is another paragraph separated by a horizontal line.
```

### Paragraph blocks

Paragraphs are created by simply leaving one empty line break between text,
which, technically means having two line breaks, but remember it as just one
empty line between text.

### Heading blocks

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

### Quote blocks

Quote blocks are created by prepending an arrow and space to the left of the
text you want to quote.

```markdown
This is a paragraph of text.

> This is a paragraph of text in a quote
```

Quote blocks behave like any other block, in that if you separate quote blocks
by one item where there is no text (only arrow), you create new paragraphs. You
can also nest quote blocks by appeding more arrows.

```markdown
This is a paragraph of text.

> This is a paragraph of text in a quote
>
> This is another paragraph of text in a quote.
>
> > This is a paragraph of text in a nested quote.
```

### List blocks

List blocks are created by prepending an asterisk character for unordered lists
and a number with a dot suffix to ordered lists.

```markdown
This is a paragraph.

* This is an unordered list item.
* And this is another one.

1. This is an ordered list item.
2. And this is another one.
```

Nested lists are also supported, which can be created with a dash character
prepended to list items, like so:

```markdown
* This is a list item.
- * This is a nested list item
- - 1. This is yet another level of nesting.
- * And so on.
* And so on.
```
