import { useEffect, useState } from "react";
import { supabase } from "../shared/lib/supabase";

export default function Stats() {
	const [data, setData] = useState<any[]>([]);

	useEffect(() => {
		supabase
			.from("exam_results")
			.select("*")
			.then(({ data }: { data: any[] | null }) => setData(data || []));
	}, []);

	return (
		<div>
			<h2 className="text-lg font-semibold mb-4">Estadísticas</h2>

			{data.map((r) => (
				<div key={r.id} className="mb-2">
					{r.percentage}% - {r.passed ? "Apto" : "No apto"}
				</div>
			))}
		</div>
	);
}
