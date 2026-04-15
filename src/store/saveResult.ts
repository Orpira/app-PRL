import { supabase } from "../shared/lib/supabase";

export async function saveResult(result: any, userId: string) {
	await supabase.from("exam_results").insert([
		{
			user_id: userId,
			score: result.ok,
			total: result.total,
			percentage: result.pct,
			passed: result.passed,
		},
	]);
}
