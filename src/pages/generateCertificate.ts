import jsPDF from "jspdf";

export function generateCertificate(name: string, pct: number) {
	const doc = new jsPDF();

	doc.text("CERTIFICADO PRL", 70, 40);
	doc.text(`Alumno: ${name}`, 20, 80);
	doc.text(`Resultado: ${pct}%`, 20, 100);

	doc.save("certificado.pdf");
}
