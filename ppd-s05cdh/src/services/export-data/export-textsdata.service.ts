import { fsProvider, InApp, setGlobals } from "../../core/global";
import { prepareNumberToCsv, areAllEqual } from "../../core/helpers";
import { DocumentData } from "../../models/types";
import { CsvService } from "../csv/csv.service";
import { DocumentService } from "../document/document.service";

export class ExportTextsDataService {
   
    async export(allDocuments: boolean): Promise<void> {
        const file = await fsProvider.getFileForSaving("export-texts-data.csv", { types: ["csv", "txt"] });

        if (!file)
            return;

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

        const headers = ["ASSET", "PAGE", "TEXT_FRAME_CONTENT", "TEXT", "SIZE_PT", "SIZE_PX", "FONT_FAMILY", "FONT_STYLE", "COLOR_CMYK", "COLOR_RGB_CALC", "COLOR_HEX_CALC", "TOP_IN", "LEFT_IN", "RIGHT_IN", "BOTTOM_IN", "TOP_PX", "LEFT_PX", "RIGHT_PX", "BOTTOM_PX"]
        const rows: string[][] = [];

        data.forEach(docData => {
            docData.pages.forEach(page => {
                page.textFrames.forEach(tf => {
                    tf.texts.forEach((text: string, index: number) => {
                        const row = [];
                        row.push(docData.filename);
                        row.push(`${page.name} (${page.index + 1})`);
                        row.push(tf.content.replace(/[\n\r\t\\]/g, ''));
                        row.push(text.replace(/[\n\r\t\\]/g, ''));
                        row.push(prepareNumberToCsv(tf.fonts[index].sizePt));
                        row.push(prepareNumberToCsv(tf.fonts[index].sizePx));
                        row.push(tf.fonts[index].fontFamily);
                        row.push(tf.fonts[index].fontStyle);
                        row.push(tf.fonts[index].colorCmyk);
                        row.push(tf.fonts[index].colorRgb);
                        row.push(tf.fonts[index].colorHex);
                        row.push(prepareNumberToCsv(tf.coordinatesIn.top));
                        row.push(prepareNumberToCsv(tf.coordinatesIn.left));
                        row.push(prepareNumberToCsv(tf.coordinatesIn.right));
                        row.push(prepareNumberToCsv(tf.coordinatesIn.bottom));
                        row.push(prepareNumberToCsv(tf.coordinatesPx.top));
                        row.push(prepareNumberToCsv(tf.coordinatesPx.left));
                        row.push(prepareNumberToCsv(tf.coordinatesPx.right));
                        row.push(prepareNumberToCsv(tf.coordinatesPx.bottom));
                        rows.push(row.map(r => r.toString().replace(/,/g, ';')));
                    })
                })
            })
        });

        const excelService = new CsvService();
        await excelService.toCsv(file, headers, rows);
    }
}