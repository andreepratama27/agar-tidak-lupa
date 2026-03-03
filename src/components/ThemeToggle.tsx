import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
	const { theme, toggle } = useTheme();

	return (
		<button
			type="button"
			onClick={toggle}
			aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
			className="border-3 border-black bg-yellow-300 p-2 font-extrabold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none dark:border-yellow-300/40 dark:bg-[#141414] dark:shadow-[3px_3px_0px_0px_rgba(253,224,71,0.25)]"
		>
			{theme === "light" ? (
				<Moon size={16} className="text-black" />
			) : (
				<Sun size={16} className="text-yellow-300" />
			)}
		</button>
	);
}
