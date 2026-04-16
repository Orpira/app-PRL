import { createContext } from "react";

export const AppContext = createContext<{
	setView: (v: string) => void;
} | null>(null);
