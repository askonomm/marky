import { pipe } from "./deps.ts";

/**
 * Parses given `content` for any bold text which sits between
 * the double asterisk characters like `**text**` and then compiles
 * that into HTML like `<strong>text</strong>`.
 */
function bold(content: string): string {
  const matches = content.match(/\*\*.*?\*\*/g);

  if (matches) {
    for (const match of matches) {
      const value = match.substring(2, match.length - 2);
      const replacement = `<strong>${value}</strong>`;

      content = content.replace(match, replacement);
    }
  }

  return content;
}

/**
 * Parses given `content` for any italic text which sits between
 * the underscore characters like `_text_` and then compiles that
 * into HTML like `<em>text</em>`.
 */
function italic(content: string): string {
  const matches = content.match(/_.*?_/g);

  if (matches) {
    for (const match of matches) {
      const value = match.substring(1, match.length - 1);
      const replacement = `<em>${value}</em>`;

      content = content.replace(match, replacement);
    }
  }

  return content;
}

/**
 * Parses given `content` for any inline code text which sits between
 * the tick characters like ``text`` and then compiles that into
 * HTML like `<code>text</code>`.
 */
function inlineCode(content: string): string {
  const matches = content.match(/\`[^\`].*\`[^\`]{0}/g);

  if (matches) {
    for (const match of matches) {
      const value = match.substring(1, match.length - 1);
      const replacement = `<code>${value}</code>`;

      content = content.replace(match, replacement);
    }
  }

  return content;
}

/**
 * Parses given `content` for any inline code text which sits between
 * the tilde characters like `~~text~~` and then compiles that into
 * HTML like `<del>text</del>`.
 */
function strikethrough(content: string): string {
  const matches = content.match(/~~.*~~/g);

  if (matches) {
    for (const match of matches) {
      const value = match.substring(2, match.length - 2);
      const replacement = `<del>${value}</del>`;

      content = content.replace(match, replacement);
    }
  }

  return content;
}

/**
 * Parses given `content` for any links which look like `[label](url)`
 * or images which look like `![alt-title](url)` and then compiles that
 * into HTML like `<a href="url">label</a>` or `<img src="url" alt="label">`.
 */
function linkAndImage(content: string): string {
  const matches = content.match(/\[(.*?)\]\((.*?)\)/g);

  if (matches) {
    for (const match of matches) {
      const isImage = content[content.indexOf(match) - 1] === "!";
      const label = match.substring(match.indexOf("[") + 1, match.indexOf("]"));
      const href = match.substring(match.indexOf("(") + 1, match.indexOf(")"));

      if (isImage) {
        content = content.replace(
          "!" + match,
          `<img src="${href}" alt="${label}">`,
        );
      } else {
        content = content.replace(match, `<a href="${href}">${label}</a>`);
      }
    }
  }

  return content;
}

/**
 * Checks whether the given `block` is a heading block.
 */
function isHeadingBlock(block: string): boolean {
  return block.replaceAll("\n", "").trim().startsWith("#");
}

/**
 * Parses the given `block` for heading sizes and compiles
 * that into HTML like `<h1>text</h1>`.
 */
function headingBlock(block: string): string {
  const singleLineBlock = block.replaceAll("\n", "").trim();
  const sizeIndicators = singleLineBlock.split(" ")[0].trim();
  const size = sizeIndicators.length;
  const value = singleLineBlock.split(" ").slice(1).join(" ").trim();

  return `<h${size}>${value}</h${size}>`;
}

/**
 * Checks whether the given `block` is a code block.
 */
function isCodeBlock(block: string): boolean {
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
function codeBlock(block: string): string {
  const languageMatch = block.match(/\`\`\`\w+/);
  const language = languageMatch
    ? languageMatch[0].replace("```", "").trim()
    : false;
  let value = "";

  if (language) {
    value = block.replace(/\`\`\`\w+/, "").replace(/\n\`\`\`/, "");
    return `<pre class="language-${language}"><code>${value}</code></pre>`;
  }

  value = block.substring(3, block.length - 3);
  return `<pre><code>${value}</code></pre>`;
}

/**
 * Checks whether the given `block` is a horizontal line block.
 */
function isHorizontalLineBlock(block: string): boolean {
  return block.replaceAll("\n", "").trim() === "***";
}

/**
 * Compiles HTML that creates a horizontal line, e.g `<hr>`.
 */
function horizontalLineBlock(): string {
  return `<hr>`;
}

/**
 * Scans given `blocks` for any partial code blocks which
 * it then stitches together, returning only whole blocks.
 */
function stitchCodeBlocks(blocks: string[]): string[] {
  const capturedBlocks: string[] = [];
  const codeBlockIndexes: number[] = [];

  blocks.forEach((block, index) => {
    // If the block starts as a code block, but doesn't end as
    // one, that means the code block spans multiple blocks and
    // we need to stitch them together until we find an end.
    if (block.startsWith("```") && !block.endsWith("```")) {
      let capturingBlock = block;
      let nextIndex = index + 1;
      const nextBlock = blocks[nextIndex];

      // Saving indexes of blocks that are code blocks to be able
      // to distinguish between code blocks and other blocks.
      codeBlockIndexes.push(...[index, nextIndex]);

      // This will run and stitch together blocks until it finds
      // that the next block is the end of the code block.
      while (typeof nextBlock !== "undefined" && !nextBlock.endsWith("```")) {
        if (!codeBlockIndexes.length) {
          capturingBlock += blocks[nextIndex];
        } else {
          capturingBlock += "\n\n" + blocks[nextIndex];
        }
        nextIndex += 1;
      }

      // Now that we know that the next block is the last one,
      // we can stitch that as well.
      capturingBlock += "\n\n" + blocks[nextIndex];

      // One block done :)
      capturedBlocks.push(capturingBlock);
    } // The following will be any other block, which we'll
    // keep as-is.
    else if (!codeBlockIndexes.includes(index)) {
      capturedBlocks.push(block);
    }
  });

  return capturedBlocks;
}

/**
 * Parses the given block for a paragraph and compiles
 * that into HTML like `<p>text</p>`.
 */
function paragraphBlock(block: string): string {
  const singleLineBlock = block.replaceAll("\n", "").trim();

  return `<p>${singleLineBlock}</p>`;
}

/**
 * Parses given `content` for double line breaks which it then
 * turns into blocks.
 */
function createBlocks(content: string): string {
  const blocks: string[] = pipe(content.split(/\n\n/), stitchCodeBlocks);

  return blocks.map((block) => {
    // Heading block?
    if (isHeadingBlock(block)) {
      return pipe(
        block,
        headingBlock,
        bold,
        italic,
        inlineCode,
        strikethrough,
        linkAndImage,
      );
    }

    // Code block?
    if (isCodeBlock(block)) {
      return codeBlock(block);
    }

    // Horizontal line block?
    if (isHorizontalLineBlock(block)) {
      return horizontalLineBlock();
    }

    // If we make it here, it must be a regular paragraph.
    return pipe(
      block,
      paragraphBlock,
      bold,
      italic,
      inlineCode,
      strikethrough,
      linkAndImage,
    );
  }).join("");
}

/**
 * Takes in raw Markdown as `content`, sends it to the heavens
 * where it will be polished into fine bits of HTML and handed down
 * to you with great glory.
 */
export function marky(content: string): string {
  return createBlocks(content);
}
