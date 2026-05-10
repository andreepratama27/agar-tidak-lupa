import { describe, expect, it } from "vitest";
import { type SearchableLink, searchLinks } from "./search";

const links: SearchableLink[] = [
	{
		_id: "1",
		title: "React Server Components guide",
		url: "https://example.com/docs/frontend",
		label: "Article",
	},
	{
		_id: "2",
		title: "CSS clamp reference",
		url: "https://react.dev/reference",
		label: "Reference",
	},
	{
		_id: "3",
		title: "Tiny image optimizer",
		url: "https://tools.example.com/image",
		label: "Tool",
	},
];

describe("searchLinks", () => {
	it("returns no results for blank queries", () => {
		expect(searchLinks(links, "   ")).toEqual([]);
	});

	it("ranks title matches above url-only matches", () => {
		const results = searchLinks(links, "react");

		expect(results.map((result) => result.item._id)).toEqual(["1", "2"]);
	});

	it("includes label matches", () => {
		const results = searchLinks(links, "tool");

		expect(results[0]?.item._id).toBe("3");
	});

	it("searches decoded title entities", () => {
		const results = searchLinks(
			[
				{
					_id: "encoded",
					title: "Tom &amp; Jerry&rsquo;s guide",
					url: "https://example.com/cartoon",
					label: "Article",
				},
			],
			"jerry's",
		);

		expect(results[0]?.item._id).toBe("encoded");
	});

	it("searches X post fallback titles", () => {
		const results = searchLinks(
			[
				{
					_id: "x-post",
					title: "x.com",
					url: "https://x.com/addyosmani/status/2053231239721885918",
					label: "Post",
				},
			],
			"addyosmani",
		);

		expect(results[0]?.item._id).toBe("x-post");
	});

	it("respects the result limit", () => {
		const results = searchLinks(links, "example", 1);

		expect(results).toHaveLength(1);
	});
});
