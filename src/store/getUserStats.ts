import { supabase } from "../shared/lib/supabase";

export async function getUserStats(userId: string) {
	const { data, error } = await supabase
		.from("exam_results")
		.select("percentage")
		.eq("user_id", userId);
	if (error) throw error;
	if (!data || data.length === 0) {
		return { examenes: 0, media: 0, mejor: 0 };
	}
	const examenes = data.length;
	const media = Math.round(
		data.reduce((acc, r) => acc + (r.percentage || 0), 0) / examenes,
	);
	const mejor = Math.max(...data.map((r) => r.percentage || 0));
	return { examenes, media, mejor };
}
