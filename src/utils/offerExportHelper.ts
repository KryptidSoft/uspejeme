import type { jsPDF } from 'jspdf';

interface ExportData {
  number?: string;
  isForeign: boolean;
  projectName?: string;
  supplier: { name: string };
  client: { name: string };
  issueDate: Date;
  validDays: number;
}
// Funkce pro fonty zůstává, voláme ji až uvnitř exportu
const addFontFromUrl = async (doc: jsPDF, url: string, fontName: string, fontStyle: string) => {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    let binary = "";
    for (let i = 0; i < uint8Array.length; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    const base64 = btoa(binary);
    doc.addFileToVFS(`${fontName}-${fontStyle}.ttf`, base64);
    doc.addFont(`${fontName}-${fontStyle}.ttf`, fontName, fontStyle);
  } catch (error) {
    console.error(`Chyba fontu: ${url}`, error);
  }
};

export const exportOfferToPDF = async (
  filename: string,
  title: string,
  tableRows: string[][],
  tableHead: string[],
  data: ExportData
): Promise<void> => {
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF();
  const isEn = data.isForeign;
  const locale = isEn ? 'en-US' : 'cs-CZ';

  // Formátování dat
  const formatDate = (date: Date) => {
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const issueDate = new Date(data.issueDate);
  const expiryDate = new Date(data.issueDate);
  expiryDate.setDate(expiryDate.getDate() + (Number(data.validDays) || 14));

  await addFontFromUrl(doc, "./fonts/Roboto-Regular.ttf", "Roboto", "normal");
  await addFontFromUrl(doc, "./fonts/Roboto-Bold.ttf", "Roboto", "bold");
  doc.setFont("Roboto", "normal");

  // Hlavička
  doc.setFont("Roboto", "bold");
  doc.setFontSize(22);
  doc.setTextColor(37, 99, 235);
  doc.text(title, 14, 25);
    if (data.projectName) {
    doc.setFont("Roboto", "normal");
    doc.setFontSize(12);
    doc.setTextColor(80, 80, 80);
    doc.text(data.projectName, 14, 32);
}
  
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text(data.number || '', 196, 25, { align: 'right' });

  doc.setDrawColor(220, 220, 220);
  const lineY = data.projectName ? 36 : 30;
  doc.setDrawColor(220, 220, 220);
  doc.line(14, lineY, 196, lineY);

  const dateY = lineY + 6;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.setFont("Roboto", "normal");
  const dateInfo = isEn  
    ? `Date of Issue: ${formatDate(issueDate)}    Valid Until: ${formatDate(expiryDate)}`
    : `Datum vystavení: ${formatDate(issueDate)}    Platnost do: ${formatDate(expiryDate)}`;
  doc.text(dateInfo, 14, dateY);

// Adresy - dynamicky podle dateY
  const addressLabelY = dateY + 10;
  const addressValueY = addressLabelY + 7;

  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(isEn ? 'SENDER' : 'DODAVATEL', 14, addressLabelY);
  doc.text(isEn ? 'RECIPIENT' : 'ODBĚRATEL', 110, addressLabelY);

  doc.setTextColor(0, 0, 0);
  doc.setFont("Roboto", "bold");
  doc.setFontSize(11);
  doc.text(data.supplier?.name || '', 14, addressValueY);
  doc.text(data.client?.name || '', 110, addressValueY);

  // Tabulka - začne o něco níž kvůli datům
  autoTable(doc, {
    startY: addressValueY + 10, // Místo dateY + 20 použijte addressValueY + 10
    head: [tableHead],
    body: tableRows,
    theme: 'striped',
    styles: { font: "Roboto", fontStyle: 'normal', fontSize: 10 },
    headStyles: { fillColor: [37, 99, 235], font: "Roboto", fontStyle: 'bold' },
  });

  const pageHeight = doc.internal.pageSize.height; // Zjistíme výšku stránky
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150); // Světle šedá barva
  doc.setFont("Roboto", "normal");

  const footerText = isEn 
    ? "Created for free at uspejeme.cz" 
    : "Vytvořeno zdarma na uspejeme.cz";

  // Vykreslení textu (14mm od levého okraje, 10mm od spodního okraje)
  doc.text(footerText, 14, pageHeight - 10);
  
  doc.save(`${filename}.pdf`);
};