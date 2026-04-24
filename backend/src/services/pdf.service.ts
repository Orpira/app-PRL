let pdfjsLib: any;

async function loadPDFJS() {
  if (!pdfjsLib) {
    pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
  }
  return pdfjsLib;
}

export async function extractPDFText(buffer: Buffer): Promise<string> {
  const pdfjs = await loadPDFJS();
  
  const uint8Array = new Uint8Array(buffer);

  const pdf = await pdfjs.getDocument({
    data: uint8Array,
    useWorkerFetch: false,
    isEvalSupported: false,
  }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();

    text += content.items.map((i: any) => i.str).join(" ") + "\n";

    page.cleanup();
  }

  return text;
}