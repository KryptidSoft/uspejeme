import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { robotoBase64, robotoBoldBase64 } from "./robotoFont";

// --- EXPORT DO CSV ---
export const exportToCSV = (filename: string, data: Record<string, any>[]) => {
  if (!data || data.length === 0) return;
  const separator = ";";
  const keys = Object.keys(data[0]);
  const csvContent = [
    keys.join(separator),
    ...data.map(row => 
      keys.map(key => {
        const cell = row[key] ?? "";
        if (typeof cell === "number") return cell.toString().replace(".", ",");
        return `"${cell.toString().replace(/"/g, '""').replace(/\n|\r/g, " ")}"`;
      }).join(separator)
    )
  ].join("\r\n");

  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// --- EXPORT DO PDF (S PODPOROU ČEŠTINY) ---
export const exportToPDF = (filename: string, title: string, tableRows: string[][], tableHead: string[]) => {
  const doc = new jsPDF();

  // 1. REGISTRACE FONTŮ (Zásadní část)
  
  // Registrace Regular verze
  if (robotoBase64 && robotoBase64.length > 100) {
    doc.addFileToVFS("Roboto-Regular.ttf", robotoBase64);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");
  }

  // Registrace Bold verze (Tohle vám chybělo)
  if (robotoBoldBase64 && robotoBoldBase64.length > 100) {
    doc.addFileToVFS("Roboto-Bold.ttf", robotoBoldBase64);
    doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");
  }

  // Nastavíme výchozí font dokumentu na Roboto
  doc.setFont("Roboto", "normal");

  // 2. Nadpis (Použije registrovaný Bold)
  doc.setFont("Roboto", "bold");
  doc.setFontSize(18);
  doc.text(title, 14, 20);
  
  // 3. Generování tabulky
  autoTable(doc, {
    startY: 30,
    head: [tableHead],
    body: tableRows,
    theme: 'striped',
    styles: {
      font: "Roboto",
      fontStyle: 'normal'
    },
    headStyles: { 
      fillColor: [59, 130, 246], 
      font: "Roboto",
      fontStyle: 'bold' // Teď už tabulka ví, že má vzít Roboto-Bold.ttf
    },
    margin: { top: 30 },
  });
  
  doc.save(`${filename}.pdf`);
};