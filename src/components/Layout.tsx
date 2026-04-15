import Sidebar from "./Sidebar";

interface Props {
	view: string;
	setView: (v: string) => void;
	children: React.ReactNode;
}

export default function Layout({ view, setView, children }: Props) {
	return (
		<div className="flex h-screen">
			<Sidebar view={view} setView={setView} />
			<main className="main">{children}</main>
		</div>
	);
}
