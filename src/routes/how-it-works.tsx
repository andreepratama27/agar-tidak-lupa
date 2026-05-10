import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	CheckCircle2,
	Clipboard,
	FolderKanban,
	LayoutGrid,
} from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
	component: HowItWorks,
});

const STEPS = [
	{
		icon: <Clipboard className="h-7 w-7" />,
		title: "Paste a link",
		copy: "Drop any URL into the saver. Agar Tidak Lupa reads the page title and favicon so the card is useful later.",
		accent: "bg-yellow-300",
	},
	{
		icon: <FolderKanban className="h-7 w-7" />,
		title: "Choose a label",
		copy: "Keep the link in the right mental bucket: article, tool, reference, video, inspiration, or a custom label.",
		accent: "bg-pink-200",
	},
	{
		icon: <LayoutGrid className="h-7 w-7" />,
		title: "Open the board",
		copy: "Filter your saved links and switch between list or grid view when the collection gets crowded.",
		accent: "bg-lime-200",
	},
];

export default function HowItWorks() {
	return (
		<div className="pb-16 text-black dark:text-neutral-100">
			<section className="grid items-center gap-8 pt-6 md:grid-cols-[0.9fr_1.1fr]">
				<div>
					<div className="mb-5 inline-flex rotate-[-1deg] items-center gap-2 border-3 border-black bg-sky-300 px-3 py-2 text-sm font-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:border-yellow-300/70 dark:bg-sky-950 dark:text-neutral-100 dark:shadow-[4px_4px_0px_0px_rgba(250,204,21,0.35)]">
						<CheckCircle2 className="h-4 w-4" />
						Three moves, saved forever
					</div>
					<h1 className="max-w-2xl text-5xl leading-[0.95] font-black tracking-normal sm:text-7xl">
						How your random tabs become memory.
					</h1>
					<p className="mt-6 max-w-xl text-lg leading-8 font-bold text-neutral-700 dark:text-neutral-300">
						The app is built for the tiny moment before a useful link disappears
						into tab chaos.
					</p>
					<div className="mt-8 flex flex-col gap-3 sm:flex-row">
						<Link
							to="/main"
							className="inline-flex items-center justify-center gap-2 border-4 border-black bg-yellow-300 px-6 py-4 text-lg font-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none dark:border-yellow-300/80 dark:shadow-[6px_6px_0px_0px_rgba(250,204,21,0.35)]"
						>
							Try it now
							<ArrowRight className="h-5 w-5" />
						</Link>
						<Link
							to="/"
							className="inline-flex items-center justify-center border-4 border-black bg-white px-6 py-4 text-lg font-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none dark:border-yellow-300/45 dark:bg-[#0a0a0a] dark:text-neutral-100 dark:shadow-[6px_6px_0px_0px_rgba(250,204,21,0.25)]"
						>
							Back home
						</Link>
					</div>
				</div>

				<img
					src="/images/how-it-works-workflow.png"
					alt="Illustration of saving, labeling, and finding links"
					className="w-full rotate-[1deg] border-4 border-black bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:border-yellow-300/60 dark:bg-black dark:shadow-[12px_12px_0px_0px_rgba(250,204,21,0.28)]"
				/>
			</section>

			<section className="mt-12 grid gap-4 md:grid-cols-3">
				{STEPS.map((step, index) => (
					<article
						key={step.title}
						className="border-4 border-black bg-white p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:border-yellow-300/45 dark:bg-[#0a0a0a] dark:shadow-[6px_6px_0px_0px_rgba(250,204,21,0.24)]"
					>
						<div
							className={`mb-5 inline-flex border-3 border-black p-2 text-black dark:border-yellow-300/80 ${step.accent}`}
						>
							{step.icon}
						</div>
						<p className="text-sm font-black text-red-600 dark:text-red-300">
							0{index + 1}
						</p>
						<h2 className="mt-1 text-2xl font-black">{step.title}</h2>
						<p className="mt-3 text-base leading-7 font-bold text-neutral-700 dark:text-neutral-300">
							{step.copy}
						</p>
					</article>
				))}
			</section>
		</div>
	);
}
