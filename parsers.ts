import { marky } from "./marky.ts";

/**
 * Parses given `content` for any bold text which sits between
 * the double asterisk characters like `**text**` and then compiles
 * that into HTML like `<strong>text</strong>`.
 */
export function bold(block: string): string {
  const matches = block.match(/\*\*.*?\*\*/g);

  if (matches) {
    for (const match of matches) {
      const value = match.substring(2, match.length - 2);
      const replacement = `<strong>${value}</strong>`;

      block = block.replace(match, replacement);
    }
  }

  return block;
}

/**
 * Parses given `block` for any italic text which sits between
 * the underscore characters like `_text_` and then compiles that
 * into HTML like `<em>text</em>`.
 */
export function italic(block: string): string {
  const matches = block.match(/_.*?_/g);

  if (matches) {
    for (const match of matches) {
      const value = match.substring(1, match.length - 1);
      const replacement = `<em>${value}</em>`;

      block = block.replace(match, replacement);
    }
  }

  return block;
}

/**
 * Parses given `block` for any inline code text which sits between
 * the tick characters like ``text`` and then compiles that into
 * HTML like `<code>text</code>`.
 */
export function inlineCode(block: string): string {
  const matches = block.match(/\`.*?\`/g);

  if (matches) {
    for (const match of matches) {
      const value = match.substring(1, match.length - 1);
      const replacement = `<code>${value}</code>`;

      block = block.replace(match, replacement);
    }
  }

  return block;
}

/**
 * Parses given `block` for any inline code text which sits between
 * the tilde characters like `~~text~~` and then compiles that into
 * HTML like `<del>text</del>`.
 */
export function strikethrough(block: string): string {
  const matches = block.match(/~~.*?~~/g);

  if (matches) {
    for (const match of matches) {
      const value = match.substring(2, match.length - 2);
      const replacement = `<del>${value}</del>`;

      block = block.replace(match, replacement);
    }
  }

  return block;
}

/**
 * Parses given `block` for any links which look like `[label](url)`
 * or images which look like `![alt-title](url)` and then compiles that
 * into HTML like `<a href="url">label</a>` or `<img src="url" alt="label">`.
 */
export function linkAndImage(block: string): string {
  const matches = block.match(/\[(.*?)\]\((.*?)\)/g);

  if (matches) {
    for (const match of matches) {
      const isImage = block[block.indexOf(match) - 1] === "!";
      const label = match.substring(match.indexOf("[") + 1, match.indexOf("]"));
      const href = match.substring(match.indexOf("(") + 1, match.indexOf(")"));

      if (isImage) {
        block = block.replace(
          "!" + match,
          `<img src="${href}" alt="${label}">`,
        );
      } else {
        block = block.replace(match, `<a href="${href}">${label}</a>`);
      }
    }
  }

  return block;
}

/**
 * Checks whether the given `block` is a empty block.
 */
export function isEmptyBlock(block: string): boolean {
  return block.trim() === "";
}

/**
 * Returns an empty string.
 */
export function emptyBlock(_block: string): string {
  return "";
}

/**
 * Checks whether the given `block` is a heading block.
 */
export function isHeadingBlock(block: string): boolean {
  return block.replaceAll("\n", "").trim().startsWith("#");
}

/**
 * Parses the given `block` for heading sizes and compiles
 * that into HTML like `<h1>text</h1>`.
 */
export function headingBlock(block: string): string {
  const singleLineBlock = block.replaceAll("\n", "").trim();
  const sizeIndicators = singleLineBlock.split(" ")[0].trim();
  const size = sizeIndicators.length;
  const value = singleLineBlock.split(" ").slice(1).join(" ").trim();

  return `<h${size}>${value}</h${size}>`;
}

/**
 * Checks whether the given `block` is a code block.
 */
export function isCodeBlock(block: string): boolean {
  const singleLineBlock = block.replaceAll("\n", "").trim();

  return (
    singleLineBlock.startsWith("```") &&
    singleLineBlock.endsWith("```")
  );
}

/**
 * Parses the given `block` for a code block and compiles
 * that into HTML like `<pre><code>text</code></pre>`.
 */
export function codeBlock(block: string): string {
  const languageMatch = block.match(/\`\`\`\w+/);
  const language = languageMatch
    ? languageMatch[0].replace("```", "").trim()
    : false;
  let value = "";

  if (language) {
    value = block.replace(/\`\`\`\w+/, "").replace(/\n\`\`\`/, "");

    // Remove first \n if the first line is empty
    if (value.split("\n")[0].trim() === "") {
      value = value.replace("\n", "");
    }

    // Encode
    value = value.replace(/&/g, "&amp;");
    value = value.replace(/</g, "&lt;");
    value = value.replace(/>/g, "&gt;");

    // Replace all line breaks with a `<br>` because otherwise
    // `<pre>` thinks that lines following a \n should have a tab, which is dumb.
    value = value.replaceAll("\n", "<br>");

    return `<pre class="language-${language}"><code>${value}</code></pre>`;
  }

  return `<pre><code>${block.substring(3, block.length - 3)}</code></pre>`;
}

/**
 * Checks whether the given `block` is a horizontal line block.
 */
export function isHorizontalLineBlock(block: string): boolean {
  return block.replaceAll("\n", "").trim() === "***";
}

/**
 * Compiles HTML that creates a horizontal line, e.g `<hr>`.
 */
export function horizontalLineBlock(): string {
  return `<hr>`;
}

/**
 * Checks whether the given `block` is a quote block.
 */
export function isQuoteBlock(block: string): boolean {
  return block.replaceAll("\n", "").trim().startsWith(">");
}

/**
 * Parses the given `block` and compiles HTML that creates
 * a blockquote like `<blockquote>text</blockquote>`. It's a
 * recursive action, in that each blockquote will also be ran
 * through Marky itself, again and again, until all nested
 * blockquotes are also parsed just like any other blocks.
 */
export function quoteBlock(block: string): string {
  const matches = block.match(/>.*/g);

  if (matches) {
    return `<blockquote>${
      marky(
        matches.map((match) => {
          return match.substring(1);
        }).join("\n"),
      )
    }</blockquote>`;
  }

  return block;
}

/**
 * Checks whether the given `block` is a unordered list block.
 */
export function isListBlock(block: string): boolean {
  return !!block.match(/-?\s?-?\s?(\*\s.*|\d\.\s.*)[^\*]/g);
}

/**
 * Parses the given `block` and compiles HTML that creates lists.
 * Both ordered and unordered lists, as well as nested lists, due to
 * its recursive nature. The output is a mixture of `<ol>` and `<ul>`
 * HTML with list items.
 *
 * As opposed to using two spaces to create a nested list, Marky uses
 * a dash character `-` to signify that the given list should be nested.
 * While the function itself has no limit to nesting, the current regex
 * pattern supports only up to two levels deep nesting.
 */
export function listBlock(block: string): string {
  const matches = block.match(/-?\s?-?\s?(\*\s.*|\d\.\s.*)[^\*]/g);
  const isOrderedList = matches && !matches[0].startsWith("*");
  const skipIndexes: number[] = [];
  let result = "";

  if (matches) {
    result += isOrderedList ? `<ol>` : `<ul>`;

    matches.forEach((match, index) => {
      if (skipIndexes.includes(index)) {
        return;
      }

      // If the match starts with `-`, it means we're dealing
      // with nested lists and thus need to stitch those matches
      // together and pass them back to `marky`.
      if (match.startsWith("-")) {
        let captured = match.substring(2);
        let nextIndex = index + 1;
        skipIndexes.push(...[index, nextIndex]);

        while (
          typeof matches[nextIndex] !== "undefined" &&
          matches[nextIndex].startsWith("-")
        ) {
          captured += matches[nextIndex].substring(2);
          nextIndex += 1;
        }

        result += marky(captured);
      } // Otherwise we continue as-is.
      else {
        result += `<li>${match.substring(2).trim()}</li>`;
      }
    });

    result += isOrderedList ? `</ol>` : `</ul>`;

    return result;
  }

  return block;
}

/**
 * Parses the given block for a paragraph and compiles
 * that into HTML like `<p>text</p>`.
 */
export function paragraphBlock(block: string): string {
  return `<p>${block.trim()}</p>`;
}

export type Parser = {
  matcher?: (block: string) => boolean;
  renderers: ((block: string) => string)[];
};

/**
 * Default building blocks that Marky is made out of.
 */
const defaultParsers: Parser[] = [{
  matcher: isEmptyBlock,
  renderers: [emptyBlock],
}, {
  matcher: isHeadingBlock,
  renderers: [
    bold,
    italic,
    inlineCode,
    strikethrough,
    linkAndImage,
    headingBlock,
  ],
}, {
  matcher: isCodeBlock,
  renderers: [codeBlock],
}, {
  matcher: isHorizontalLineBlock,
  renderers: [horizontalLineBlock],
}, {
  matcher: isQuoteBlock,
  renderers: [quoteBlock],
}, {
  matcher: isListBlock,
  renderers: [bold, italic, inlineCode, strikethrough, linkAndImage, listBlock],
}, {
  renderers: [
    bold,
    italic,
    inlineCode,
    strikethrough,
    linkAndImage,
    paragraphBlock,
  ],
}];

export default defaultParsers;
