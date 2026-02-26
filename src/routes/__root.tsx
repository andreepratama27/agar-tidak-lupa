import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";

import ConvexProvider from "../integrations/convex/provider";
import { ThemeProvider } from "../components/ThemeProvider";
import { ThemeToggle } from "../components/ThemeToggle";

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
			<div className="min-h-screen bg-amber-50 transition-colors dark:bg-gray-950">
				<div className="mx-auto flex max-w-2xl items-center justify-between px-4 pt-6 pb-2">
					<p className="inline-block rotate-[-1deg] border-3 border-black bg-yellow-300 px-3 py-1 text-sm font-extrabold uppercase tracking-widest text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:border-amber-200/60 dark:bg-gray-800 dark:text-amber-200 dark:shadow-[3px_3px_0px_0px_rgba(253,230,138,0.5)]">
						Agar Tidak Lupa ✏️
					</p>
					<ThemeToggle />
				</div>
				<main className="mx-auto max-w-2xl px-4 py-6">
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
