import { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { supabase } from "../shared/lib/supabase";
import { useAuthStore } from "../store/useAuthStore";

function getLocalResults() {
	try {
		return JSON.parse(localStorage.getItem("exam_results_local") || "[]");
	} catch {
		return [];
	}
}

export default function Stats() {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [statsError, setStatsError] = useState<string | null>(null);
	const appContext = useContext(AppContext);
	const user = useAuthStore((state) => state.user);

	useEffect(() => {
		setLoading(true);
		setStatsError(null);
		if (!user) {
			setData(getLocalResults());
			setLoading(false);
			return;
		}
		supabase
			.from("exam_results")
			.select("*")
			.eq("user_id", user.id)
			.then(({ data, error }: { data: any[] | null; error?: any }) => {
				if (error) {
					setStatsError(
						"Error al cargar estadísticas: " + (error.message || ""),
					);
					setData([]);
					setLoading(false);
					return;
				}
				setData([...(data || []), ...getLocalResults()]);
				setLoading(false);
			});
	}, [user]);

	if (loading) {
		return (
			<div className="p-8 text-center text-gray-500">
				Cargando estadísticas...
			</div>
		);
	}

	if (statsError) {
		return (
			<div className="p-8 text-center text-red-600 bg-red-50 border border-red-200 rounded">
				{statsError}
			</div>
		);
	}

	if (!data.length) {
		return (
			<div className="max-w-3xl mx-auto mt-16 flex flex-col items-center">
				<h2 className="text-2xl font-semibold mb-4">Estadísticas</h2>
				<div className="flex flex-col items-center">
					<img
						src="/icons.svg"
						alt="estadísticas"
						style={{ width: 48, marginBottom: 16 }}
					/>
					<div className="mb-4 text-gray-700">
						Aún no has realizado ningún examen.
					</div>
					<button
						className="bg-[#181C44] text-white px-4 py-2 rounded"
						onClick={() => {
							if (appContext?.setView) appContext.setView("exam");
							const evt = new CustomEvent("goToExamSetup");
							window.dispatchEvent(evt);
						}}
					>
						Realizar primer examen
					</button>
				</div>
			</div>
		);
	}

	// Estadísticas
	const total = data.length;
	const aprobados = data.filter((r) => r.passed).length;
	const media = Math.round(
		data.reduce((a, r) => a + (r.percentage || 0), 0) / total,
	);
	const mejor = Math.max(...data.map((r) => r.percentage || 0));
	const tendencia = data.slice(-5).map((r) => r.percentage || 0);

	return (
		<div className="max-w-4xl mx-auto mt-8">
			<h2 className="text-2xl font-semibold mb-2">Estadísticas</h2>
			<div className="mb-8 text-gray-700">
				Seguimiento de tu progreso y rendimiento
			</div>

			<div className="grid grid-cols-4 gap-4 mb-8 text-center">
				<div>
					<div className="text-3xl font-bold">{total}</div>
					<div className="text-gray-600">Exámenes</div>
				</div>
				<div>
					<div className="text-3xl font-bold">{aprobados}</div>
					<div className="text-gray-600">Aprobados</div>
				</div>
				<div>
					<div className="text-3xl font-bold">{media}%</div>
					<div className="text-gray-600">Media</div>
				</div>
				<div>
					<div className="text-3xl font-bold">{mejor}%</div>
					<div className="text-gray-600">Mejor resultado</div>
				</div>
			</div>

			<div className="mb-8">
				<div className="mb-2 font-medium">
					Tendencia (últimos {tendencia.length} exámenes)
				</div>
				<div className="w-full h-6 bg-gray-200 rounded overflow-hidden flex">
					{tendencia.map((v, i) => (
						<div
							key={`tendencia-${i}-${v}`}
							className={v >= 60 ? "bg-green-500" : "bg-red-500"}
							style={{ width: `${100 / tendencia.length}%` }}
							title={`Examen ${total - tendencia.length + i + 1}: ${v}%`}
						>
							&nbsp;
						</div>
					))}
				</div>
			</div>

			<div className="mb-4 font-medium">Historial completo</div>
			<div className="overflow-x-auto">
				<table className="min-w-full border text-sm">
					<thead>
						<tr className="bg-gray-100">
							<th className="px-2 py-1 border">#</th>
							<th className="px-2 py-1 border">Fecha</th>
							<th className="px-2 py-1 border">Preg.</th>
							<th className="px-2 py-1 border">Correctas</th>
							<th className="px-2 py-1 border">%</th>
							<th className="px-2 py-1 border">Estado</th>
						</tr>
					</thead>
					<tbody>
						{data.map((r, i) => (
							<tr key={r.id || `local-${i}`}> 
								<td className="px-2 py-1 border text-center">{i + 1}</td>
								<td className="px-2 py-1 border text-center">
									{r.created_at
										? new Date(r.created_at).toLocaleDateString()
										: "-"}
								</td>
								<td className="px-2 py-1 border text-center">
									{r.total || "-"}
								</td>
								<td className="px-2 py-1 border text-center">
									{r.score || "-"}
								</td>
								<td className="px-2 py-1 border text-center">
									{r.percentage || "-"}%
								</td>
								<td className="px-2 py-1 border text-center">
									{r.passed ? (
										<span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
											Apto
										</span>
									) : (
										<span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
											No apto
										</span>
									)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
