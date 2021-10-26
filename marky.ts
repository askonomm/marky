/**
 * Parses given `content` for any bold text which sits between
 * the double asterisk characters like `**text**`.
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
 * the underscore characters like `_text_`.
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
 * the tick characters like ``text``.
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
 * the tilde characters like `~~text~~`.
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
 * Parses given `content` for double line breaks which it then
 * turns into paragraphs. 
 * 
 * It currently avoids headings, but in the future there might 
 * be more thing this needs to avoid, like blockquotes, etc.
 */
function paragraph(content: string): string {
    const blocks = content.split(/\n\n/);

    return blocks.map(block => {
        // Clean up
        console.log(block);
        const normalizedBlock = block.replace('\n', '').trim();
        
        // Return as-is when starts with `#`, because
        // those are headings, not paragraphs.
        if (normalizedBlock.startsWith('#')) {
            return normalizedBlock;
        }

        return `<p>${normalizedBlock}</p>`;
    }).join('');
}

/**
 * Takes in raw Markdown as `content`, sends it to the heavens
 * where it will be polished into fine bits of HTML and handed down
 * to you with great glory.
 */
export function marky(content: string): string {
    // Turns **{string}** to <strong>{string}</strong>
    content = bold(content);

    // Turns _{string}_ to <em>{string}</em>
    content = italic(content);

    // Turns `{string}` to <code>{string}</code>
    content = inlineCode(content);

    // Turns `~~{string}~~` to <del>{string}</del>
    content = strikethrough(content);

    // turns two line breaks into paragraphs
    content = paragraph(content);

    return content;
}