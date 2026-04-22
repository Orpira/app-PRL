import { createContext } from "react";

export const AppContext = createContext<{
	setView: (v: string) => void;
	setLoginMessage?: (msg: string | null) => void;
} | null>(null);
