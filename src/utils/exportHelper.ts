/* eslint-disable @typescript-eslint/no-explicit-any */
import type { jsPDF } from 'jspdf'

// --- NOVÁ POMOCNÁ FUNKCE PRO STAHOVÁNÍ FONTŮ ---
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
    console.error(`Nepodařilo se načíst font: ${url}`, error);
  }
};

export const exportToCSV = (filename: string, data: Record<string, any>[]) => {
  if (!data || data.length === 0) return;

  // Převod dat na CSV řetězec
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(","), // hlavička
    ...data.map(row => headers.map(h => `"${row[h] ?? ""}"`).join(",")) // hodnoty
  ];
  const csvContent = csvRows.join("\n");

  // Vytvoření a stažení souboru
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// --- EXPORT DO PDF (UPRAVENÝ PRO DYNAMICKÉ FONTY A PATIČKU) ---
export const exportToPDF = async (
  filename: string, 
  title: string, 
  tableRows: string[][], 
  tableHead: string[], 
  data?: any, 
  qrCodeDataUri?: string 
): Promise<void> => {
  const { jsPDF } = await import('jspdf');
  const autoTable = (await import('jspdf-autotable')).default;

  const doc = new jsPDF();
  const isEn = data?.isForeign ?? false; // Zjistíme jazyk z dat

  await addFontFromUrl(doc, "/fonts/Roboto-Regular.ttf", "Roboto", "normal");
  await addFontFromUrl(doc, "/fonts/Roboto-Bold.ttf", "Roboto", "bold");
  doc.setFont("Roboto", "normal");

  // --- SCÉNÁŘ A: STARÉ STRÁNKY (Bez dat) ---
  if (!data) {
    doc.setFont("Roboto", "bold");
    doc.setFontSize(18);
    doc.text(title, 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [tableHead],
      body: tableRows,
      theme: 'striped',
      styles: { font: "Roboto", fontStyle: 'normal' },
      headStyles: { fillColor: [59, 130, 246], font: "Roboto", fontStyle: 'bold' },
    });
  } else {
    // --- SCÉNÁŘ B: ELITE FAKTURA ---
    doc.setFont("Roboto", "bold");
    doc.setFontSize(18);
    doc.setTextColor(37, 99, 235);
    doc.text(title, 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text(`${isEn ? 'Variable Symbol' : 'Variabilní symbol'}: ${data.variableSymbol || ''}`, 196, 20, { align: 'right' });

    doc.setDrawColor(220, 220, 220);
    doc.line(14, 25, 196, 25);

    // Adresy
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text(isEn ? 'SUPPLIER' : 'DODAVATEL', 14, 32);
    doc.text(isEn ? 'CLIENT' : 'ODBĚRATEL', 110, 32);

    doc.setTextColor(0, 0, 0);
    doc.setFont("Roboto", "bold");
    doc.setFontSize(10);
    doc.text(data.supplier?.name || '', 14, 38);
    doc.text(data.client?.name || '', 110, 38);

    doc.setFont("Roboto", "normal");
    doc.setFontSize(9);
    doc.text(`${data.supplier?.street || ''}\n${data.supplier?.zip || ''} ${data.supplier?.city || ''}\nIČO: ${data.supplier?.ico || ''}`, 14, 44);
    doc.text(`${data.client?.street || ''}\n${data.client?.zip || ''} ${data.client?.city || ''}\nIČO: ${data.client?.ico || ''}`, 110, 44);

    // Platební údaje
    doc.setFillColor(248, 248, 248);
    doc.rect(14, 62, 182, 15, 'F');
    doc.setFontSize(8.5);
    doc.setFont("Roboto", "bold");
    doc.text(`${isEn ? 'Account:' : 'Účet:'} ${data.supplier?.account || ''}`, 18, 71);
    doc.text(`${isEn ? 'Due Date:' : 'Splatnost:'} ${data.dueDate || ''}`, 120, 71);

    // Tabulka položek
    autoTable(doc, {
      startY: 82,
      head: [tableHead],
      body: tableRows,
      theme: 'striped',
      styles: { font: "Roboto", fontStyle: 'normal', fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246], font: "Roboto", fontStyle: 'bold' },
    });

    // QR KÓD a Registrace dodavatele
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    if (qrCodeDataUri) {
      try {
        doc.addImage(qrCodeDataUri, 'PNG', 14, finalY, 30, 30);
        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.text("QR PLATBA", 14, finalY + 34);
      } catch (e) {
        console.error("QR Code image failed to load in PDF", e);
      }
    }
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(data.supplier?.registration || '', qrCodeDataUri ? 50 : 14, finalY + 5, { maxWidth: 140 });
  }

  // --- UNIVERZÁLNÍ PATIČKA (uspejeme.cz) ---
  const pageCount = (doc as any).internal.getNumberOfPages();
  const pageHeight = doc.internal.pageSize.height;
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.setFont("Roboto", "normal");

    const footerText = isEn 
      ? "Created for free at uspejeme.cz" 
      : "Vytvořeno zdarma na uspejeme.cz";

    doc.text(footerText, 14, pageHeight - 10);
  }
  
  doc.save(`${filename}.pdf`);
};