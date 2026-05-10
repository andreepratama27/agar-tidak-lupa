import { useQuery } from "convex/react";
import { ExternalLink, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { displayLinkTitle } from "@/lib/linkTitle";
import { searchLinks } from "@/lib/search";
import { api } from "../../convex/_generated/api";
import type { Doc } from "../../convex/_generated/dataModel";
import { CategoryIcon } from "./CategoryIcon";
import { LoadingLinksAnimation } from "./LoadingLinksAnimation";

export function SearchCommand() {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key.toLowerCase() !== "k") return;
			if (!event.metaKey && !event.ctrlKey) return;

			event.preventDefault();
			setIsOpen(true);
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	return (
		<>
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				aria-label="Search saved links"
				className="inline-flex items-center gap-2 border-3 border-black bg-white p-2 font-extrabold text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none dark:border-yellow-300/45 dark:bg-[#0a0a0a] dark:text-neutral-100 dark:shadow-[3px_3px_0px_0px_rgba(250,204,21,0.24)]"
			>
				<Search size={16} />
			</button>
			{isOpen && <SearchDialog onClose={() => setIsOpen(false)} />}
		</>
	);
}

function SearchDialog({ onClose }: { onClose: () => void }) {
	const links = useQuery(api.links.list);
	const [query, setQuery] = useState("");
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);

	const results = links ? searchLinks(links, query, 8) : [];
	const hasQuery = query.trim().length > 0;

	return (
		<div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-24 sm:pt-28">
			{/** biome-ignore lint/a11y/noStaticElementInteractions: modal backdrop */}
			<div
				className="absolute inset-0 bg-black/50"
				onClick={onClose}
				onKeyDown={() => {}}
			/>
			<div
				role="dialog"
				aria-modal="true"
				aria-label="Search saved links"
				className="relative w-full max-w-2xl border-4 border-black bg-amber-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:border-yellow-300/60 dark:bg-[#0a0a0a] dark:shadow-[8px_8px_0px_0px_rgba(250,204,21,0.35)]"
			>
				<div className="flex items-center gap-3 border-b-4 border-black bg-yellow-300 p-3 text-black dark:border-yellow-300/50">
					<Search className="h-5 w-5 shrink-0" />
					<input
						ref={inputRef}
						type="search"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Search saved links..."
						className="min-w-0 flex-1 bg-transparent text-lg font-black placeholder:text-black/45 focus:outline-none"
					/>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close search"
						className="shrink-0 border-2 border-black bg-red-200 p-1.5 transition-colors hover:bg-red-400"
					>
						<X size={16} />
					</button>
				</div>

				<div className="max-h-[min(28rem,calc(100vh-14rem))] overflow-y-auto p-3">
					{links === undefined ? (
						<div className="flex justify-center py-8">
							<LoadingLinksAnimation />
						</div>
					) : !hasQuery ? (
						<SearchEmptyText>
							Type to search titles, URLs, and labels.
						</SearchEmptyText>
					) : results.length === 0 ? (
						<SearchEmptyText>No matching links.</SearchEmptyText>
					) : (
						<div className="flex flex-col gap-2">
							{results.map((result) => (
								<SearchResultItem
									key={result.item._id}
									link={result.item}
									onClose={onClose}
								/>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

function SearchResultItem({
	link,
	onClose,
}: {
	link: Doc<"links">;
	onClose: () => void;
}) {
	return (
		<a
			href={link.url}
			target="_blank"
			rel="noopener noreferrer"
			onClick={onClose}
			className="flex items-center gap-3 border-2 border-black bg-white p-3 text-black transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:bg-yellow-100 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:border-yellow-300/35 dark:bg-[#111] dark:text-neutral-100 dark:hover:bg-[#171717] dark:hover:shadow-[3px_3px_0px_0px_rgba(250,204,21,0.28)]"
		>
			{link.favicon ? (
				<img src={link.favicon} alt="" className="h-5 w-5 shrink-0" />
			) : (
				<Search className="h-5 w-5 shrink-0" />
			)}
			<div className="min-w-0 flex-1">
				<p className="truncate text-base font-black">
					{displayLinkTitle(link)}
				</p>
				<p className="truncate text-xs font-bold text-neutral-500 dark:text-stone-400">
					{hostname(link.url)}
				</p>
			</div>
			<span className="hidden shrink-0 items-center gap-1.5 border-2 border-black bg-yellow-300 px-2 py-1 text-xs font-black text-black sm:inline-flex">
				<CategoryIcon label={link.label} className="h-4 w-4" />
				{link.label}
			</span>
			<ExternalLink className="h-4 w-4 shrink-0" />
		</a>
	);
}

function SearchEmptyText({ children }: { children: React.ReactNode }) {
	return (
		<p className="py-8 text-center text-base font-black text-neutral-500 dark:text-stone-400">
			{children}
		</p>
	);
}

function hostname(url: string) {
	try {
		return new URL(url).hostname;
	} catch {
		return url;
	}
}
