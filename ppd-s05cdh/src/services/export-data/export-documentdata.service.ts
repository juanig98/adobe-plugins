import { fsProvider, InApp, setGlobals } from "../../core/global";
import { prepareNumberToCsv, areAllEqual } from "../../core/helpers";
import { DocumentData } from "../../models/types";
import { CsvService } from "../csv/csv.service";
import { DocumentService } from "../document/document.service";

export class ExportDocumentDataService {
    async export(allDocuments: boolean): Promise<void> {
        const file = await fsProvider.getFileForSaving("export-texts-data.csv", { types: ["csv", "txt"] });
        
        const data: DocumentData[] = [];
        const docService = new DocumentService();

        if (allDocuments) {
            for (let i = 0; i < InApp.documents.length; i++) {
                InApp.activeDocument = InApp.documents.item(i);
                setGlobals();
                await docService.extractData();
                data.push(docService.data);
            }
        } else {
            setGlobals();
            await docService.extractData();
            data.push(docService.data);
        }

        const headers = ["ASSET", "PAGE", "W_IN", "H_IN", "BLEED_IN", "W_PX", "H_PX", "BLEED_PX", "ACTIONS"]
        const rows: string[][] = [];

        data.forEach(docData => {
            docData.pages.forEach(page => {
                const row = [];
                row.push(docData.filename);
                row.push(`${page.name} (${page.index + 1})`);
                row.push(prepareNumberToCsv(page.boundsWithBleedIn.width));
                row.push(prepareNumberToCsv(page.boundsWithBleedIn.height));
                row.push(areAllEqual(page.bleedIn.top, page.bleedIn.left, page.bleedIn.right, page.bleedIn.bottom) ? prepareNumberToCsv(page.bleedIn.top) : `[${prepareNumberToCsv(page.bleedIn.top)},${prepareNumberToCsv(page.bleedIn.left)},${prepareNumberToCsv(page.bleedIn.right)},${prepareNumberToCsv(page.bleedIn.bottom)}]`);
                row.push(prepareNumberToCsv(page.boundsPx.width));
                row.push(prepareNumberToCsv(page.boundsPx.height));
                row.push(areAllEqual(page.bleedPx.top, page.bleedPx.left, page.bleedPx.right, page.bleedPx.bottom) ? prepareNumberToCsv(page.bleedPx.top) : `[${prepareNumberToCsv(page.bleedPx.top)},${prepareNumberToCsv(page.bleedPx.left)},${prepareNumberToCsv(page.bleedPx.right)},${prepareNumberToCsv(page.bleedPx.bottom)}]`);
                rows.push(row.map(r => r.toString()));
            })
        });

        const excelService = new CsvService();
        await excelService.toCsv(file, headers, rows);
    }
}