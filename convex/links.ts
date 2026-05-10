import { v } from "convex/values"
import { action, mutation, query } from "./_generated/server"
import {
	extractTitle,
	fallbackTitleForUrl,
	isGenericXTitle,
	isXUrl,
	titleForUrl,
	titleFromXEmbedHtml,
} from "./metadata"

export const list = query({
	args: {},
	handler: async (ctx) => {
		return await ctx.db.query("links").order("desc").collect()
	},
})

export const add = mutation({
	args: {
		url: v.string(),
		title: v.string(),
		favicon: v.optional(v.string()),
		label: v.string(),
	},
	handler: async (ctx, args) => {
		await ctx.db.insert("links", {
			url: args.url,
			title: titleForUrl(args.title, args.url),
			favicon: args.favicon,
			label: args.label,
			savedAt: Date.now(),
		})
	},
})

export const remove = mutation({
	args: {
		id: v.id("links"),
	},
	handler: async (ctx, args) => {
		await ctx.db.delete(args.id)
	},
})

export const fetchMetadata = action({
	args: {
		url: v.string(),
	},
	handler: async (_ctx, args): Promise<{ title: string; favicon: string | null }> => {
		let hostname: string
		try {
			hostname = new URL(args.url).hostname
		} catch {
			return { title: args.url, favicon: null }
		}

		const fallbackTitle = fallbackTitleForUrl(args.url, hostname)
		const fallbackFavicon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`

		try {
			const controller = new AbortController()
			const timeout = setTimeout(() => controller.abort(), 5000)

			const response = await fetch(args.url, {
				signal: controller.signal,
				headers: {
					"User-Agent": "Mozilla/5.0 (compatible; LinkSaver/1.0)",
				},
			})
			clearTimeout(timeout)

			const html = await response.text()

			const extractedTitle = extractTitle(html, fallbackTitle)
			const title = isGenericXTitle(extractedTitle, hostname)
				? await fetchXEmbedTitle(args.url, fallbackTitle)
				: extractedTitle

			// Extract favicon from <link rel="icon"> or <link rel="shortcut icon">
			let favicon: string | null = null
			const faviconMatch = html.match(
				/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["'][^>]*\/?>/i,
			)
			if (!faviconMatch) {
				// Try reversed attribute order: href before rel
				const altMatch = html.match(
					/<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:shortcut )?icon["'][^>]*\/?>/i,
				)
				if (altMatch) {
					favicon = altMatch[1]
				}
			} else {
				favicon = faviconMatch[1]
			}

			if (favicon) {
				// Resolve relative URLs
				if (favicon.startsWith("//")) {
					favicon = `https:${favicon}`
				} else if (favicon.startsWith("/")) {
					favicon = `https://${hostname}${favicon}`
				} else if (!favicon.startsWith("http")) {
					favicon = `https://${hostname}/${favicon}`
				}
			} else {
				favicon = fallbackFavicon
			}

			return { title, favicon }
		} catch {
			return { title: fallbackTitle, favicon: fallbackFavicon }
		}
	},
})

async function fetchXEmbedTitle(url: string, fallbackTitle: string) {
	let hostname: string
	try {
		hostname = new URL(url).hostname
	} catch {
		return fallbackTitle
	}
	if (!isXUrl(hostname)) return fallbackTitle

	try {
		const response = await fetch(
			`https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}&omit_script=true`,
		)
		if (!response.ok) return fallbackTitle
		const data = (await response.json()) as {
			html?: unknown
			author_name?: unknown
		}
		if (typeof data.html !== "string") return fallbackTitle
		const authorName =
			typeof data.author_name === "string" ? data.author_name : undefined
		return titleFromXEmbedHtml(data.html, authorName) ?? fallbackTitle
	} catch {
		return fallbackTitle
	}
}
