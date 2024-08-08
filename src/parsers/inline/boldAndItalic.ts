export default {
	identifier: /\*\*\*(.*?)\*\*\*/g,
	parser: (match: string) => `<strong><em>${match.slice(3, -3)}</em></strong>`
}