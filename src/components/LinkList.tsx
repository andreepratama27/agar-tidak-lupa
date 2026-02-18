import { useQuery } from "convex/react";
import type { Doc } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";

const LABEL_COLORS: Record<string, string> = {
	Article: "bg-blue-200",
	Video: "bg-red-200",
	Tool: "bg-green-200",
	Reference: "bg-purple-200",
	Inspiration: "bg-pink-200",
	Other: "bg-gray-200",
};

export function LinkList() {
	const links = useQuery(api.links.list);

	if (links === undefined) {
		return (
			<p className="text-lg font-bold text-gray-500">Loading links...</p>
		);
	}

	if (links.length === 0) {
		return (
			<p className="text-lg font-bold text-gray-500">
				No links saved yet. Paste one above!
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			{links.map((link: Doc<"links">) => (
				<div
					key={link._id}
					className="flex items-center gap-4 border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
				>
					{link.favicon && (
						<img
							src={link.favicon}
							alt=""
							width={16}
							height={16}
							className="shrink-0"
						/>
					)}
					<div className="min-w-0 flex-1">
						<a
							href={link.url}
							target="_blank"
							rel="noopener noreferrer"
							className="block truncate text-lg font-extrabold text-black underline decoration-2 hover:text-yellow-600"
						>
							{link.title}
						</a>
						<p className="truncate text-sm font-bold text-gray-500">
							{link.url}
						</p>
					</div>
					<span
						className={`shrink-0 border-2 border-black px-3 py-1 text-xs font-extrabold ${LABEL_COLORS[link.label] ?? "bg-gray-200"}`}
					>
						{link.label}
					</span>
				</div>
			))}
		</div>
	);
}
