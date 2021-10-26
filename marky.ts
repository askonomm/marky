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

function paragraph(content: string): string {
    const blocks = content.split(/\n\n/);

    return blocks.map(block => {
        // Clean up
        const normalizedBlock = block.replace('\n', '').trim();
        
        // Return as-is when starts with `#`, because
        // those are headings, not paragraphs.
        if (normalizedBlock.startsWith('#')) {
            return normalizedBlock;
        }

        return `<p>${normalizedBlock}</p>`;
    }).join('');
}

export default function marky(content: string): string {
    // turns **{string}** to <strong>{string}</strong>
    content = bold(content);

    // turns _{string}_ to <em>{string}</em>
    content = italic(content);

    // turns two line breaks into paragraphs
    content = paragraph(content);

    return content;
}