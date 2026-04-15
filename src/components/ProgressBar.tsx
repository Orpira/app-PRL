export default function ProgressBar({ value }: { value: number }) {
	return (
		<div className="h-2 bg-gray-200 rounded">
			<div
				className="h-full bg-[#B8941F] rounded"
				style={{ width: `${value}%` }}
			/>
		</div>
	);
}
