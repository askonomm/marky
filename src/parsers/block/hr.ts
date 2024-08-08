export default {
    identifier: (block: string) => /^---|^\*\*\*/.test(block),
    parser: (block: string) => `<hr>`
}