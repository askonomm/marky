import { marky } from "./marky.ts";
import { assertEquals } from "https://deno.land/std@0.113.0/testing/asserts.ts";

// Test bold text parsing and conversion
Deno.test("bold text parsing and conversion", () => {
  const testString = `Hello **Mr. Bond**.`;
  const expectedResult = `<p>Hello <strong>Mr. Bond</strong>.</p>`;
  assertEquals(expectedResult, marky(testString));
});

// Test italic text parsing and conversion
Deno.test("italic text parsing and conversion", () => {
  const testString = `Hello _Mr. Bond_.`;
  const expectedResult = `<p>Hello <em>Mr. Bond</em>.</p>`;
  assertEquals(expectedResult, marky(testString));
});

// Test inline code text parsing and conversion
Deno.test("inline code text parsing and conversion", () => {
  const testString = `Hello \`Mr. Bond\`.`;
  const expectedResult = `<p>Hello <code>Mr. Bond</code>.</p>`;
  assertEquals(expectedResult, marky(testString));
});

// Test strikethrough text parsing and conversion
Deno.test("strikethrough text parsing and conversion", () => {
  const testString = `Hello ~~Mr. Bond\~~.`;
  const expectedResult = `<p>Hello <del>Mr. Bond</del>.</p>`;
  assertEquals(expectedResult, marky(testString));
});

// Links and images text parsing and conversion
Deno.test("links and images parsing and conversion", () => {
  const testString =
    `Hello [Mr. Bond](https://google.com). Here's a ![cat](catpic.jpg)`;
  const expectedResult =
    `<p>Hello <a href="https://google.com">Mr. Bond</a>. Here's a <img src="catpic.jpg" alt="cat"></p>`;
  assertEquals(expectedResult, marky(testString));
});

// Test code blocks
Deno.test("code blocks", () => {
  const testString = `
Hi there.

\`\`\`
code goes Header
\`\`\`

\`\`\`javascript
asdasdjs goes Header

and what if this also has \`\`\`ticks\`\`\`
\`\`\`

\`\`\`html
<div>this is html</div>
\`\`\`

And regular text ensues.

And more regular text.
  `;
  const expectedResult = `<p>Hi there.</p><pre><code>
code goes Header
</code></pre><pre class="language-javascript"><code>
asdasdjs goes Header

and what if this also has \`\`\`ticks\`\`\`</code></pre><pre class="language-html"><code>\n&lt;div&gt;this is html&lt;/div&gt;</code></pre><p>And regular text ensues.</p><p>And more regular text.</p>`;
  assertEquals(expectedResult, marky(testString));
});

// Test quote blocks
Deno.test("quote blocks", () => {
  const testString = `
Hi there.

> quote block _with italic text_
> hola
> and hola dos
>
> new paragraph!
>
> > nested blockquote
> > continues here

:)`;
  const expectedResult =
    `<p>Hi there.</p><blockquote><p>quote block <em>with italic text</em>\n hola\n and hola dos</p><p>new paragraph!</p><blockquote><p>nested blockquote\n continues here</p></blockquote></blockquote><p>:)</p>`;
  assertEquals(expectedResult, marky(testString));
});

// Test list blocks
Deno.test("list block parsing and conversion", () => {
  const testString = `
Paragraph.

* and a new list!
* woohoo
- * Nested list
- * Yes?
- - 1. And another
- - 2. More nest
* **thing!**

Another paragraph.`;
  const expectedResult =
    `<p>Paragraph.</p><ul><li>and a new list!</li><li>woohoo</li><ul><li>Nested list</li><li>Yes?</li><ol><li>And another</li><li>More nest</li></ol></ul><ol><ol><li>And another</li><li>More nest</li></ol></ol><li><strong>thing!</strong></li></ul><p>Another paragraph.</p>`;
  assertEquals(expectedResult, marky(testString));
});

// Test block parsing and conversion
Deno.test("block parsing and conversion", () => {
  const testString = `
# The Villain

Hello Mr. Bond.

I've been _expecting_ you.

## The Bond

Why, me too!
    `;
  const expectedResult =
    `<h1>The Villain</h1><p>Hello Mr. Bond.</p><p>I've been <em>expecting</em> you.</p><h2>The Bond</h2><p>Why, me too!</p>`;
  assertEquals(expectedResult, marky(testString));
});
