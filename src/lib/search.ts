import { displayLinkTitle } from "./linkTitle";

export type SearchableLink = {
	_id: string;
	title: string;
	url: string;
	label: string;
	favicon?: string;
};

export type SearchResult<T extends SearchableLink = SearchableLink> = {
	item: T;
	score: number;
};

const BM25_K1 = 1.4;
const BM25_B = 0.75;

export function searchLinks<T extends SearchableLink>(
	links: T[],
	query: string,
	limit = 8,
): SearchResult<T>[] {
	const queryTokens = tokenize(query);
	if (queryTokens.length === 0) return [];

	const documents = links.map((link) => {
		const tokens = linkTokens(link);
		const frequencies = new Map<string, number>();
		for (const token of tokens) {
			frequencies.set(token, (frequencies.get(token) ?? 0) + 1);
		}
		return { link, tokens, frequencies };
	});

	const totalLength = documents.reduce(
		(sum, document) => sum + document.tokens.length,
		0,
	);
	const averageLength = totalLength / Math.max(documents.length, 1);
	const uniqueQueryTokens = [...new Set(queryTokens)];

	const documentFrequency = new Map<string, number>();
	for (const token of uniqueQueryTokens) {
		documentFrequency.set(
			token,
			documents.filter((document) => document.frequencies.has(token)).length,
		);
	}

	return documents
		.map((document) => {
			const score = uniqueQueryTokens.reduce((sum, token) => {
				const frequency = document.frequencies.get(token) ?? 0;
				if (frequency === 0) return sum;

				const idf = Math.log(
					1 +
						(documents.length - (documentFrequency.get(token) ?? 0) + 0.5) /
							((documentFrequency.get(token) ?? 0) + 0.5),
				);
				const numerator = frequency * (BM25_K1 + 1);
				const denominator =
					frequency +
					BM25_K1 *
						(1 - BM25_B + BM25_B * (document.tokens.length / averageLength));

				return sum + idf * (numerator / denominator);
			}, 0);

			return { item: document.link, score };
		})
		.filter((result) => result.score > 0)
		.sort(
			(a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title),
		)
		.slice(0, limit);
}

function linkTokens(link: SearchableLink): string[] {
	const urlParts = urlSearchText(link.url);
	return [
		...repeatTokens(tokenize(displayLinkTitle(link)), 3),
		...repeatTokens(tokenize(link.label), 2),
		...tokenize(urlParts),
	];
}

function repeatTokens(tokens: string[], count: number): string[] {
	return Array.from({ length: count }, () => tokens).flat();
}

function urlSearchText(url: string): string {
	try {
		const parsed = new URL(url);
		return `${parsed.hostname} ${parsed.pathname}`;
	} catch {
		return url;
	}
}

function tokenize(value: string): string[] {
	return value
		.toLowerCase()
		.split(/[^a-z0-9]+/g)
		.filter(Boolean);
}
