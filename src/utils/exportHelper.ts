import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Tvoje původní funkce na CSV (upravená na exportToCSV)
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

// NOVÁ funkce na PDF (kterou teď budeš moci volat kdekoli)
export const exportToPDF = (filename: string, title: string, tableRows: string[][], tableHead: string[]) => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text(title, 14, 20);
  
  autoTable(doc, {
    startY: 30,
    head: [tableHead],
    body: tableRows,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246] } // Modrá z tvého brandu
  });
  
  doc.save(`${filename}.pdf`);
};