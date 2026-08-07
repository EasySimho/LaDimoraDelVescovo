import fs from "fs";
import path from "path";
import Papa from "papaparse";
import ExcelJS from "exceljs";

const root = process.cwd();
const templateDir = path.join(root, "sheet-template");
const tabs = ["luoghi", "info", "regole", "video", "faq"];

async function buildExcel() {
  const workbook = new ExcelJS.Workbook();

  for (const tab of tabs) {
    const csvPath = path.join(templateDir, `${tab}.csv`);
    if (!fs.existsSync(csvPath)) continue;

    const csvContent = fs.readFileSync(csvPath, "utf8");
    const parsed = Papa.parse(csvContent, { header: false, skipEmptyLines: false });
    const rows = parsed.data;

    const worksheet = workbook.addWorksheet(tab);

    rows.forEach((row) => {
      worksheet.addRow(row);
    });

    // Formattazione della prima riga (intestazione)
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true };
  }

  const outputPath = path.join(root, "Template-GuestBook.xlsx");
  await workbook.xlsx.writeFile(outputPath);
  console.log(`Creato con successo: ${outputPath}`);
}

buildExcel().catch(console.error);
