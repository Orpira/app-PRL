interface ProgressBarProps {
	value: number;
	max?: number;
}

export default function ProgressBar({ value, max = 100 }: ProgressBarProps) {
	const percent = Math.min(100, Math.round((value / max) * 100));
	return (
		<div className="h-2 bg-gray-200 rounded">
			<div
				className="h-full bg-[#B8941F] rounded"
				style={{ width: `${percent}%` }}
			/>
		</div>
	);
}
