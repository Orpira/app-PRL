export default function ExamResult({ result }: any) {
	return (
		<div className="text-center">
			<h2
				className={`text-xl font-semibold mb-2 inline-block badge ${
					result.p ? "badge-pass" : "badge-fail"
				}`}
			>
				{result.p ? "APTO" : "NO APTO"}
			</h2>
			<p className="mt-2">
				<span className="font-bold">{result.ok}</span>/{result.tot} (
				{result.pct}%)
			</p>
		</div>
	);
}
