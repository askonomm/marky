export default {
    identifier: (block: string) => /^#+/.test(block),
    parser: (block: string) => {
        const level = block.match(/#/g)?.length || 0;
        const content = block.replace(/#+/g, '').trim();
        return `<h${level}>${content}</h${level}>`;
    }
}