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
  const matches = content.match(/\`.*\`/g);

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
 * Checks whether the given `block` is a heading block.
 */
function isBlockHeading(block: string): boolean {
  return block.startsWith("#");
}

/**
 * Parses the given `block` for heading sizes and compiles
 * that into HTML like `<h1>text</h1>`.
 */
function blockHeading(block: string): string {
  const sizeIndicators = block.split(" ")[0].trim();
  const size = sizeIndicators.length;
  const value = block.split(" ").slice(1).join(" ").trim();

  return `<h${size}>${value}</h${size}>`;
}

/**
 * Parses the given block for a paragraph and compiles
 * that into HTML like `<p>text</p>`.
 */
function blockParagraph(block: string): string {
  return `<p>${block}</p>`;
}

/**
 * Parses given `content` for double line breaks which it then
 * turns into blocks.
 */
function block(content: string): string {
  const blocks = content.split(/\n\n/);

  return blocks.map((block) => {
    // Clean up
    const normalizedBlock = block.replace("\n", "").trim();

    // Heading block?
    if (isBlockHeading(normalizedBlock)) {
      return blockHeading(normalizedBlock);
    }

    // If we make it here, it must be a regular paragraph.
    return blockParagraph(normalizedBlock);
  }).join("");
}

/**
 * Takes in raw Markdown as `content`, sends it to the heavens
 * where it will be polished into fine bits of HTML and handed down
 * to you with great glory.
 */
export function marky(content: string): string {
  return pipe(
    content,
    bold,
    italic,
    inlineCode,
    strikethrough,
    block,
  );
}