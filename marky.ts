import defaultParsers, { Parser } from "./parsers.ts";

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
    if (block.trim().startsWith("```") && !block.trim().endsWith("```")) {
      let capturingBlock = block;
      let nextIndex = index + 1;

      // Saving indexes of blocks that are code blocks to be able
      // to distinguish between code blocks and other blocks.
      codeBlockIndexes.push(...[index, nextIndex]);

      // This will run and stitch together blocks until it finds
      // that the next block is the end of the code block.
      while (
        typeof blocks[nextIndex] !== "undefined" &&
        !blocks[nextIndex].trim().endsWith("```")
      ) {
        if (!codeBlockIndexes.length) {
          capturingBlock += blocks[nextIndex];
        } else {
          capturingBlock += "\n\n" + blocks[nextIndex];
        }

        nextIndex += 1;
        codeBlockIndexes.push(nextIndex);
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
 * Parses given `content` for double line breaks which it then
 * turns into blocks.
 */
function createBlocks(content: string, parsers: Parser[]): string {
  let blocks: string[] = content.split(/\n\n/);

  // Stitch code blocks
  blocks = stitchCodeBlocks(blocks);

  // Return parsed blocks
  return blocks.map((block) => {
    const match = parsers.find((parser) =>
      parser.matcher && parser.matcher(block)
    );

    // If a match was found, we want a specific parser to deal with this block
    if (match) {
      for (const renderer of match.renderers) {
        block = renderer(block);
      }

      return block;
    }

    // If no match was found, we let everything without a matcher deal with this block
    const parsersWithoutMatcher = parsers.filter((parser) => !parser.matcher);

    for (const parser of parsersWithoutMatcher) {
      for (const renderer of parser.renderers) {
        block = renderer(block);
      }
    }

    return block;
  }).join("");
}

/**
 * Takes in raw Markdown as `content`, sends it to the heavens
 * where it will be polished into fine bits of HTML and handed down
 * to you with great glory.
 */
export function marky(
  content: string,
  parsers: Parser[] = defaultParsers,
): string {
  return createBlocks(content, parsers);
}
