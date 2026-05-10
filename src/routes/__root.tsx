import {
	createRootRoute,
	HeadContent,
	Link,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { ThemeProvider } from "../components/ThemeProvider";
import { ThemeToggle } from "../components/ThemeToggle";
import ConvexProvider from "../integrations/convex/provider";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Agar Tidak Lupa | Link Saver yang gini - gini aja 😭",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	component: RootLayout,
	shellComponent: RootDocument,
});

function RootLayout() {
	return (
		<ThemeProvider>
			<div className="app-grid-bg min-h-screen transition-colors">
				<div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 pt-6 pb-2">
					<Link to="/" aria-label="Agar Tidak Lupa home" className="shrink-0">
						<img
							src="/images/agar-tidak-lupa-logo.png"
							alt="Agar Tidak Lupa"
							className="h-12 w-auto rotate-[-1deg] border-3 border-black bg-yellow-300 object-contain shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:border-yellow-300/80 dark:bg-black dark:shadow-[3px_3px_0px_0px_rgba(250,204,21,0.35)]"
						/>
					</Link>
					<div className="flex items-center gap-3">
						<Link
							to="/main"
							className="hidden border-2 border-black bg-white px-3 py-2 text-sm font-black text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none sm:inline-flex dark:border-yellow-300/45 dark:bg-[#0a0a0a] dark:text-neutral-100 dark:shadow-[3px_3px_0px_0px_rgba(250,204,21,0.24)]"
						>
							Open app
						</Link>
						<ThemeToggle />
					</div>
				</div>
				<main className="mx-auto max-w-6xl px-4 py-6">
					<Outlet />
				</main>
			</div>
		</ThemeProvider>
	);
}

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<ConvexProvider>{children}</ConvexProvider>
				<Scripts />
			</body>
		</html>
	);
}
