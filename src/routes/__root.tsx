import {
	createRootRoute,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";

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
				title: "Agar Tidak Lupa",
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
		<div className="min-h-screen bg-amber-50">
			<header className="border-b-4 border-black bg-yellow-300 px-6 py-4">
				<h1 className="text-3xl font-extrabold tracking-tight text-black">
					Agar Tidak Lupa
				</h1>
			</header>
			<main className="mx-auto max-w-2xl px-4 py-8">
				<Outlet />
			</main>
		</div>
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
