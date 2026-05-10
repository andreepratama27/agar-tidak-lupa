import { decodeHtmlEntities } from "./htmlEntities";

export type LinkTitleInput = {
	title: string;
	url: string;
};

export function displayLinkTitle(link: LinkTitleInput) {
	const decodedTitle = decodeHtmlEntities(link.title);
	if (!isGenericXTitle(decodedTitle, link.url)) return decodedTitle;
	return fallbackXTitle(link.url) ?? decodedTitle;
}

function fallbackXTitle(url: string) {
	try {
		const parsed = new URL(url);
		const hostname = parsed.hostname.replace(/^www\./, "").toLowerCase();
		if (hostname !== "x.com" && hostname !== "twitter.com") return null;

		const parts = parsed.pathname.split("/").filter(Boolean);
		const username = parts[0];
		if (!username || username === "i") return "X";
		if (parts[1] === "status" && parts[2]) return `Post by @${username} on X`;
		return `@${username} on X`;
	} catch {
		return null;
	}
}

function isGenericXTitle(title: string, url: string) {
	if (
		!["x", "x.com", "twitter", "twitter.com"].includes(
			title.trim().toLowerCase(),
		)
	) {
		return false;
	}

	try {
		const hostname = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
		return hostname === "x.com" || hostname === "twitter.com";
	} catch {
		return false;
	}
}
