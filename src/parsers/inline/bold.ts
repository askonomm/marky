export default {
	identifier: /\*\*(.*?)\*\*|\_\_(.*?)\_\_/g,
	parser: (match: string) => `<strong>${match.slice(2, -2)}</strong>`
}