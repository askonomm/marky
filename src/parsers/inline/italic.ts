export default {
	identifier: /\*(.*?)\*|\_(.*?)\_/g,
	parser: (match: string) => `<em>${match.slice(1, -1)}</em>`
}