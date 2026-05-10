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
};

export function decodeHtmlEntities(value: string) {
	return value.replace(
		/&(#x[\da-f]+|#\d+|[a-z][\da-z]+);/gi,
		(match, entity) => {
			const normalized = entity.toLowerCase();
			if (normalized.startsWith("#x")) {
				const codePoint = Number.parseInt(normalized.slice(2), 16);
				return decodeCodePoint(codePoint) ?? match;
			}
			if (normalized.startsWith("#")) {
				const codePoint = Number.parseInt(normalized.slice(1), 10);
				return decodeCodePoint(codePoint) ?? match;
			}
			return NAMED_ENTITIES[normalized] ?? match;
		},
	);
}

function decodeCodePoint(codePoint: number) {
	if (!Number.isInteger(codePoint) || codePoint < 0 || codePoint > 0x10ffff) {
		return null;
	}
	return String.fromCodePoint(codePoint);
}
