const NAMED_ENTITIES: Record<string, string> = {
	amp: "&",
	apos: "'",
	copy: "(c)",
	gt: ">",
	hellip: "...",
	laquo: "<<",
	ldquo: '"',
	lsquo: "'",
	lt: "<",
	mdash: "-",
	ndash: "-",
	nbsp: " ",
	quot: '"',
	raquo: ">>",
	rdquo: '"',
	reg: "(r)",
	rsquo: "'",
	trade: "(tm)",
}

export function decodeHtmlEntities(value: string) {
	return value.replace(
		/&(#x[\da-f]+|#\d+|[a-z][\da-z]+);/gi,
		(match, entity) => {
			const normalized = entity.toLowerCase()
			if (normalized.startsWith("#x")) {
				const codePoint = Number.parseInt(normalized.slice(2), 16)
				return decodeCodePoint(codePoint) ?? match
			}
			if (normalized.startsWith("#")) {
				const codePoint = Number.parseInt(normalized.slice(1), 10)
				return decodeCodePoint(codePoint) ?? match
			}
			return NAMED_ENTITIES[normalized] ?? match
		},
	)
}

export function extractTitle(html: string, fallbackTitle: string) {
	const metaTitle =
		extractMetaContent(html, "property", "og:title") ??
		extractMetaContent(html, "name", "twitter:title")
	if (metaTitle) return cleanTitle(metaTitle)

	const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)
	return titleMatch ? cleanTitle(titleMatch[1]) : fallbackTitle
}

export function fallbackTitleForUrl(url: string, hostname: string) {
	if (!isXHost(hostname)) return hostname

	const parsed = new URL(url)
	const parts = parsed.pathname.split("/").filter(Boolean)
	const username = parts[0]
	if (!username || username === "i") return "X"
	if (parts[1] === "status" && parts[2]) return `Post by @${username} on X`
	return `@${username} on X`
}

export function isXUrl(hostname: string) {
	return isXHost(hostname)
}

export function isGenericXTitle(title: string, hostname: string) {
	return (
		isXHost(hostname) &&
		["x", "x.com", "twitter", "twitter.com"].includes(
			title.trim().toLowerCase(),
		)
	)
}

export function titleForUrl(title: string, url: string) {
	const parsed = new URL(url)
	return isGenericXTitle(title, parsed.hostname)
		? fallbackTitleForUrl(url, parsed.hostname)
		: title
}

export function titleFromXEmbedHtml(html: string, authorName?: string) {
	const blockquoteMatch = html.match(
		/<blockquote\b[\s\S]*?>([\s\S]*?)<\/blockquote>/i,
	)
	if (!blockquoteMatch) return null

	const tweetHtml =
		blockquoteMatch[1].match(/<p\b[^>]*>([\s\S]*?)<\/p>/i)?.[1] ??
		blockquoteMatch[1]
	const withoutLinks = tweetHtml
		.replace(/<a\b[\s\S]*?<\/a>/gi, " ")
		.replace(/<[^>]+>/g, " ")
	const text = decodeHtmlEntities(withoutLinks).trim().replace(/\s+/g, " ")
	if (!text) return authorName ? `Post by ${authorName} on X` : null
	return authorName ? `${text} - ${authorName} on X` : `${text} - X`
}

function extractMetaContent(
	html: string,
	key: "name" | "property",
	value: string,
) {
	const tagMatch = html.match(
		new RegExp(`<meta\\b(?=[^>]*\\b${key}=["']${value}["'])[^>]*>`, "i"),
	)
	if (!tagMatch) return null

	const contentMatch = tagMatch[0].match(/\bcontent=["']([^"']*)["']/i)
	return contentMatch?.[1] ?? null
}

function cleanTitle(title: string) {
	return decodeHtmlEntities(title.trim().replace(/\s+/g, " "))
}

function decodeCodePoint(codePoint: number) {
	if (!Number.isInteger(codePoint) || codePoint < 0 || codePoint > 0x10ffff) {
		return null
	}
	return String.fromCodePoint(codePoint)
}

function isXHost(hostname: string) {
	const normalized = hostname.replace(/^www\./, "").toLowerCase()
	return normalized === "x.com" || normalized === "twitter.com"
}
