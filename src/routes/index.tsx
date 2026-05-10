import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	ClipboardCheck,
	FolderKanban,
	Sparkles,
	Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<div className="pb-16 text-black dark:text-neutral-100">
			<section className="grid min-h-[calc(100vh-7rem)] items-center gap-10 pt-6 md:grid-cols-[1.05fr_0.95fr] md:pt-2">
				<div className="relative z-10">
					<div className="mb-5 inline-flex rotate-[-1deg] items-center gap-2 border-3 border-black bg-white px-3 py-2 text-sm font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-yellow-300/70 dark:bg-black dark:shadow-[4px_4px_0px_0px_rgba(250,204,21,0.35)]">
						<Sparkles className="h-4 w-4 text-red-500" />
						Bookmark inbox, minus the mess
					</div>

					<h1 className="max-w-3xl text-5xl leading-[0.95] font-black tracking-normal sm:text-7xl lg:text-8xl">
						Save links before your brain drops them.
					</h1>
					<p className="mt-6 max-w-xl text-lg leading-8 font-bold text-neutral-700 sm:text-xl dark:text-neutral-300">
						Agar Tidak Lupa keeps articles, tools, references, videos, and
						random internet findings in one loud, labeled board.
					</p>

					<div className="mt-8 flex flex-col gap-3 sm:flex-row">
						<Link
							to="/main"
							className="inline-flex items-center justify-center gap-2 border-4 border-black bg-yellow-300 px-6 py-4 text-lg font-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none dark:border-yellow-300/80 dark:shadow-[6px_6px_0px_0px_rgba(250,204,21,0.35)]"
						>
							Start saving
							<ArrowRight className="h-5 w-5" />
						</Link>
						<Link
							to="/how-it-works"
							className="inline-flex items-center justify-center gap-2 border-4 border-black bg-white px-6 py-4 text-lg font-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none dark:border-yellow-300/45 dark:bg-[#0a0a0a] dark:text-neutral-100 dark:shadow-[6px_6px_0px_0px_rgba(250,204,21,0.25)]"
						>
							How it works
							<ArrowRight className="h-5 w-5" />
						</Link>
					</div>
				</div>

				<div className="relative mx-auto w-full max-w-md">
					<div className="absolute -top-4 -right-4 h-28 w-28 border-4 border-black bg-red-400 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:border-yellow-300/60" />
					<div className="absolute -bottom-5 -left-5 h-24 w-24 border-4 border-black bg-sky-300 shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:border-yellow-300/60" />
					<img
						src="/images/link-memory-board.png"
						alt="Agar Tidak Lupa link board preview"
						className="relative w-full rotate-[1.5deg] border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:border-yellow-300/60 dark:bg-black dark:shadow-[12px_12px_0px_0px_rgba(250,204,21,0.28)]"
					/>
				</div>
			</section>

			<section className="grid gap-4 border-t-4 border-black pt-10 md:grid-cols-3 dark:border-yellow-300/35">
				<Feature
					icon={<ClipboardCheck className="h-7 w-7" />}
					title="Paste once"
					copy="Drop a URL. Metadata gets fetched so the saved link is readable later."
					className="bg-white dark:bg-[#0a0a0a]"
				/>
				<Feature
					icon={<FolderKanban className="h-7 w-7" />}
					title="Label fast"
					copy="Sort by article, video, tool, reference, inspiration, or your own labels."
					className="bg-pink-200 dark:bg-pink-950"
				/>
				<Feature
					icon={<Zap className="h-7 w-7" />}
					title="Find later"
					copy="Flip between list and grid views when your saved pile starts getting serious."
					className="bg-lime-200 dark:bg-lime-950"
				/>
			</section>
		</div>
	);
}

function Feature({
	icon,
	title,
	copy,
	className,
}: {
	icon: React.ReactNode;
	title: string;
	copy: string;
	className: string;
}) {
	return (
		<article
			className={`border-4 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:border-yellow-300/45 dark:shadow-[6px_6px_0px_0px_rgba(250,204,21,0.24)] ${className}`}
		>
			<div className="mb-5 inline-flex border-3 border-black bg-yellow-300 p-2 text-black dark:border-yellow-300/80">
				{icon}
			</div>
			<h2 className="text-2xl font-black">{title}</h2>
			<p className="mt-3 text-base leading-7 font-bold text-neutral-700 dark:text-neutral-300">
				{copy}
			</p>
		</article>
	);
}
