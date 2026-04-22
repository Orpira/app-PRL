import { supabase } from "../shared/lib/supabase";

// Guarda resultado en Supabase si hay usuario, si no en localStorage
export async function saveResult(result: any, userId?: string) {
	if (userId) {
		await supabase.from("exam_results").insert([
			{
				user_id: userId,
				score: result.ok,
				total: result.total,
				percentage: result.pct,
				passed: result.passed,
				created_at: new Date().toISOString(),
			},
		]);
	} else {
		// Guardar en localStorage
		const local = JSON.parse(
			localStorage.getItem("exam_results_local") || "[]",
		);
		local.push({
			score: result.ok,
			total: result.total,
			percentage: result.pct,
			passed: result.passed,
			created_at: new Date().toISOString(),
		});
		localStorage.setItem("exam_results_local", JSON.stringify(local));
	}
}
