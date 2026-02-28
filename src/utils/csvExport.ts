/**
 * Exportuje data do CSV souboru kompatibilního s Excelem.
 */
export const exportToCSV = (filename: string, data: Record<string, any>[]) => {
  // Základní kontrola dat
  if (!data || !Array.isArray(data) || data.length === 0) {
    console.warn("ExportToCSV: Žádná data k exportu.");
    return;
  }

  const separator = ";";
  const keys = Object.keys(data[0]);
  
  // Sestavení obsahu CSV
  const csvContent = [
    // 1. Řádek: Hlavička
    keys.join(separator),
    // 2. a další řádky: Data
    ...data.map(row => 
      keys.map(key => {
        const cell = row[key] === null || row[key] === undefined ? "" : row[key];
        
        // Formátování čísel pro český Excel (čárka jako oddělovač desetinných míst je v ČR standard)
        // Pokud preferujete tečku, nechte .toString()
        if (typeof cell === "number") {
          return cell.toString().replace(".", ",");
        }
        
        // Ošetření textu: uvozovky a odstranění zalomení řádků, které rozbíjejí CSV strukturu
        const cleanText = cell.toString().replace(/"/g, '""').replace(/\n|\r/g, " ");
        return `"${cleanText}"`;
      }).join(separator)
    )
  ].join("\r\n");

  // Vytvoření souboru s BOM (\ufeff) pro správné kódování češtiny (UTF-8)
  const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  // Vytvoření stahovacího odkazu
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  
  // Úklid po stažení
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};