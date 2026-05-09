import { useAction, useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import { CategoryIcon } from "./CategoryIcon";

export function LinkForm() {
	const [url, setUrl] = useState("");
	const [label, setLabel] = useState("");
	const [loading, setLoading] = useState(false);

	const labels = useQuery(api.labels.list);
	const seedLabels = useMutation(api.labels.seed);
	const fetchMetadata = useAction(api.links.fetchMetadata);
	const addLink = useMutation(api.links.add);

	useEffect(() => {
		seedLabels();
	}, [seedLabels]);

	useEffect(() => {
		if (labels && labels.length > 0 && !label) {
			setLabel(labels[0].name);
		}
	}, [labels, label]);

	useEffect(() => {
		const isUrl = (value: string) => {
			try {
				const parsed = new URL(value);
				return parsed.protocol === "http:" || parsed.protocol === "https:";
			} catch {
				return false;
			}
		};

		const readClipboard = async () => {
			if (!navigator.clipboard?.readText) return;
			try {
				const text = (await navigator.clipboard.readText()).trim();
				if (text && isUrl(text)) {
					setUrl((current) => (current ? current : text));
				}
			} catch {
				// Clipboard access denied or unavailable; ignore silently.
			}
		};

		readClipboard();

		const handleFocus = () => {
			readClipboard();
		};
		window.addEventListener("focus", handleFocus);
		return () => window.removeEventListener("focus", handleFocus);
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const trimmed = url.trim();
		if (!trimmed) return;

		setLoading(true);
		try {
			const metadata = await fetchMetadata({ url: trimmed });
			await addLink({
				url: trimmed,
				title: metadata.title,
				favicon: metadata.favicon ?? undefined,
				label,
			});
			setUrl("");
		} finally {
			setLoading(false);
		}
	};

	const hasUrl = url.trim() !== "";

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<input
				type="url"
				value={url}
				onChange={(e) => {
					setUrl(e.target.value);
					if (!e.target.value.trim() && labels?.[0]) {
						setLabel(labels[0].name);
					}
				}}
				placeholder="Paste a link..."
				required
				className="w-full border-2 border-black bg-white px-4 py-3 text-lg font-bold text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-300 dark:border-yellow-300/45 dark:bg-[#0a0a0a] dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:ring-yellow-300/60"
			/>
			<div
				className={`overflow-hidden transition-all duration-300 ease-in-out ${
					hasUrl ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<div className="flex flex-wrap gap-2 border-t-2 border-black pt-3 dark:border-yellow-300/30">
					<span className="self-center text-sm font-extrabold dark:text-neutral-100">
						Label:
					</span>
					{labels?.map((l) => (
						<button
							key={l._id}
							type="button"
							onClick={() => setLabel(l.name)}
							className={`inline-flex items-center gap-1.5 border-2 border-black px-2 py-1 text-sm font-extrabold transition-all
									${
										label === l.name
											? "bg-yellow-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:bg-yellow-300 dark:text-black dark:shadow-[2px_2px_0px_0px_rgba(250,204,21,0.35)]"
											: "bg-white hover:bg-yellow-100 dark:bg-[#111] dark:text-neutral-100 dark:hover:bg-[#171717]"
									}
									dark:border-yellow-300/40`}
						>
							<CategoryIcon label={l.name} className="h-5 w-5" />
							{l.name}
						</button>
					))}
				</div>
				<div className="flex justify-end pt-3">
					<button
						type="submit"
						disabled={loading || !url.trim()}
						className="border-2 border-black bg-black px-6 py-3 text-lg font-extrabold text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-yellow-300/80 dark:bg-yellow-300 dark:text-black dark:shadow-[4px_4px_0px_0px_rgba(250,204,21,0.35)] dark:disabled:hover:shadow-[4px_4px_0px_0px_rgba(250,204,21,0.35)]"
					>
						{loading ? "Saving..." : "Save"}
					</button>
				</div>
			</div>
		</form>
	);
}
