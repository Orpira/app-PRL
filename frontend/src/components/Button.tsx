interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "gold";
}

export default function Button({ variant, ...props }: Props) {
	const base = "px-4 py-2 rounded text-sm";

	const styles = {
		primary: "bg-[#0C1F3D] text-white",
		gold: "bg-[#B8941F] text-white",
	};

	return (
		<button
			{...props}
			className={`${base} ${variant ? styles[variant] : ""}`}
		/>
	);
}
