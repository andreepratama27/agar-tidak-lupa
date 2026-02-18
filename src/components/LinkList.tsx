import { useMutation, useQuery } from "convex/react";
import { Trash2 } from "lucide-react";
import type { Doc } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";

export function LinkList() {
	const links = useQuery(api.links.list);
	const labels = useQuery(api.labels.list);
	const removeLink = useMutation(api.links.remove);

	const labelColors: Record<string, string> = {};
	if (labels) {
		for (const l of labels) {
			labelColors[l.name] = l.color;
		}
	}

	if (links === undefined) {
		return (
			<p className="text-lg font-bold text-gray-500 dark:text-gray-400">
				Loading links...
			</p>
		);
	}

	if (links.length === 0) {
		return (
			<p className="text-lg font-bold text-gray-500 dark:text-gray-400">
				No links saved yet. Paste one above!
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			{links.map((link: Doc<"links">) => (
				<div
					key={link._id}
					className="flex items-center gap-4 border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-white/30 dark:bg-gray-900 dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]"
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
							className="block truncate text-lg font-extrabold text-black underline decoration-2 hover:text-yellow-600 dark:text-gray-100 dark:hover:text-white"
						>
							{link.title}
						</a>
						<p className="truncate text-sm font-bold text-gray-500 dark:text-gray-400">
							{link.url}
						</p>
					</div>
					<span
						className={`shrink-0 border-2 border-black px-3 py-1 text-xs font-extrabold dark:border-gray-600 ${labelColors[link.label] ?? "bg-gray-200"}`}
					>
						{link.label}
					</span>
					<button
						type="button"
						onClick={() => removeLink({ id: link._id })}
						className="shrink-0 border-2 border-black bg-red-200 p-2 font-extrabold hover:bg-red-400 dark:border-red-400 dark:bg-red-900 dark:hover:bg-red-700"
					>
						<Trash2 size={16} />
					</button>
				</div>
			))}
		</div>
	);
}
