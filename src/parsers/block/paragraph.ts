export default {
    identifier: (block: string) => /^\w+/.test(block),
    parser: (block: string) => `<p>${block}</p>`
}