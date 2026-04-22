import { jsPDF } from "jspdf";

export function generateCertificate(
	name: string,
	pct: number,
	correctas: number = 0,
	total: number = 0,
) {
	const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

	// Borde azul oscuro
	doc.setDrawColor(24, 28, 68);
	doc.setLineWidth(3);
	doc.rect(15, 20, 180, 257, "S");

	// Título superior
	doc.setFontSize(9);
	doc.setTextColor(120, 120, 120);
	doc.text("CERTIFICADO DE APROVECHAMIENTO", 105, 38, { align: "center" });

	// Título principal
	doc.setFontSize(20);
	doc.setTextColor(24, 28, 68);
	doc.text("Prevención de Riesgos Laborales", 105, 50, { align: "center" });

	// Subtítulo
	doc.setFontSize(11);
	doc.setTextColor(60, 60, 60);
	doc.text("Curso Básico · Ley 31/1995 LPRL", 105, 58, { align: "center" });

	// Texto de certificación
	doc.setFontSize(11);
	doc.setTextColor(80, 80, 80);
	doc.text("Se certifica que", 105, 70, { align: "center" });

	// Nombre en itálica
	doc.setFontSize(16);
	doc.setFont("", "italic");
	doc.setTextColor(24, 28, 68);
	doc.text(name, 105, 80, { align: "center" });
	doc.setFont("", "normal");

	// Texto de logro
	doc.setFontSize(11);
	doc.setTextColor(80, 80, 80);
	doc.text(
		"ha superado satisfactoriamente el examen del curso básico de\nPrevención de Riesgos Laborales con la siguiente calificación:",
		105,
		90,
		{ align: "center" },
	);

	// Círculo con check
	doc.setDrawColor(24, 28, 68);
	doc.setLineWidth(1.2);
	doc.circle(105, 110, 15, "S");
	doc.setFontSize(30);
	doc.setTextColor(184, 148, 31);
	doc.text("✔", 105, 117, { align: "center" });

	// Porcentaje grande
	doc.setFontSize(28);
	doc.setTextColor(184, 148, 31);
	doc.text(`${pct}%`, 105, 140, { align: "center" });

	// Desglose
	doc.setFontSize(11);
	doc.setTextColor(120, 120, 120);
	let detalle = "";
	if (correctas && total) {
		detalle = `${correctas} DE ${total} RESPUESTAS CORRECTAS · APTO`;
	} else {
		detalle = `APTO`;
	}
	doc.text(detalle, 105, 150, { align: "center" });

	// Línea inferior
	doc.setDrawColor(200, 200, 200);
	doc.setLineWidth(0.5);
	doc.line(35, 170, 175, 170);

	// Pie de página
	const fecha = new Date();
	const fechaStr = fecha.toLocaleDateString();
	doc.setFontSize(9);
	doc.setTextColor(80, 80, 80);
	doc.text(`Fecha: ${fechaStr}`, 35, 178, { align: "left" });
	doc.text("PRL Master · Formación en Seguridad Laboral", 105, 178, {
		align: "center",
	});
	doc.text("Umbral aprobado: 60%", 175, 178, { align: "right" });

	doc.save("certificado.pdf");
}
