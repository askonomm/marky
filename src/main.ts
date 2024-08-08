import paragraphBlockParser from "./parsers/block/paragraph.js";
import headingBlockParser from "./parsers/block/heading.js";
import hrBlockParser from "./parsers/block/hr.js";
import boldInlineParser from "./parsers/inline/bold.js";
import italicInlineParser from "./parsers/inline/italic.js";
import codeStitcher from "./stitchers/code.js";
import fs from "node:fs";

export interface BlockParser {
    identifier: (block: string) => boolean;
    parser: (block: string) => string;
}

export interface InlineParser {
    identifier: RegExp;
    parser: (match: string) => string;
}

export interface Stitcher {
    needsStitching: (blocks: string[]) => boolean;
    stitch: (blocks: string[]) => string[];
}

export interface Opts {
    blockParsers?: BlockParser[];
    inlineParsers?: InlineParser[];
    stitchers?: Stitcher[];
    joinBlocksWith?: string;
}

/**
 * Stitch blocks
 *
 * @param blocks
 * @param stitchers
 * @returns string[]
 * @private
 */
function stitchBlocks(blocks: string[], stitchers: Stitcher[]): string[] {
    for (const stitcher of stitchers) {
        if (stitcher.needsStitching(blocks)) {
            blocks = stitcher.stitch(blocks);
        }
    }

    return blocks;
}

/**
 * Parse blocks.
 *
 * @param blocks
 * @param parsers
 * @returns string[]
 * @private
 */
function parseBlocks(blocks: string[], blockParsers: BlockParser[], inlineParsers: InlineParser[]): string[] {
    return blocks.map((block) => {
        // Parse the block
        for (const parser of blockParsers) {
            if (parser.identifier(block.trim())) {
                block = parser.parser(block.trim());
            }
        }

        // Parse inline
        for (const inlineParser of inlineParsers) {
            const matches = block.match(inlineParser.identifier);

            console.log(matches);

            if (!matches) continue;

            for (const match of matches) {
                block = block.replace(match, inlineParser.parser(match));
            }
        }

        return block;
    });
}

export const defaultConfig: Opts = {
    blockParsers: [
        paragraphBlockParser,
        headingBlockParser,
        hrBlockParser,
    ],
    inlineParsers: [
        boldInlineParser,
        italicInlineParser,
    ],
    stitchers: [
        codeStitcher,
    ],
    joinBlocksWith: "\r\n\r\n"
};

/**
 * Parse markdown.
 *
 * @param markdown
 * @param opts
 */
export default function parse(markdown: string, opts?: Opts): string {
    // No opts? Use default
    opts = opts || defaultConfig;

    // Get blocks
    let blocks = markdown.split("\r\n\r\n");

    // Stitch blocks
    blocks = stitchBlocks(blocks, opts.stitchers || []);

    // Parse blocks
    const parsedBlocks = parseBlocks(blocks, opts.blockParsers || [], opts.inlineParsers || []);

    // Output
    return parsedBlocks.join(opts.joinBlocksWith || "");
}

// get from test.md
const markdown = fs.readFileSync("test.md", "utf8");

const html = parse(markdown);

console.log(html);
