/**
 * Detect if there are code blocks that need stitching
 * into one block.
 *
 * @param blocks
 * @returns boolean
 * @private
 */
function needsStitching(blocks: string[]): boolean {
	// Are there multiple blocks that contain code, eg a
	// block that starts with ```, but do not end with ```?
	return blocks.some((block) => {
		return block.startsWith("```") && !block.endsWith("```");
	});
}

/**
 * Stitch code blocks together.
 *
 * @param blocks
 * @returns string[]
 * @private
 */
function stitch(blocks: string[]): string[] {
	// Find the first block that starts with ```, and the
	// next block that ends with ```, and join them,
	// and everything in-between together.
	for (let i = 0; i < blocks.length; i++) {
		if (blocks[i].startsWith("```") && !blocks[i].endsWith("```")) {
			// Iterate join every next block until we find one that ends with ```
			let j = i + 1;

			while (j < blocks.length && !blocks[j].endsWith("```")) {
				blocks[i] += "\r\n" + blocks[j];
				j++;
			}

			// Join the last block
			blocks[i] += "\r\n" + blocks[j];

			// Remove the blocks that were stitched
			blocks.splice(i + 1, j - i);
		}
	}

	return blocks;
}

export default {
	needsStitching,
	stitch,
};
