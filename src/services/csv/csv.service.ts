import fs from 'fs';
import { fsProvider, path } from "../../core/global";

export class CsvService {

    async toCsv(headers: string[], rows: string[][], filename = '') {

        let csv = headers.join(", ") + "\n";
        rows.forEach(row => {
            csv += row.map(field => field.replace(/,/g, ';')).join(', ') + "\r\n"
        });

        const fileForSaving = await fsProvider.getFileForSaving(filename + ".csv", { types: ["csv", "txt"] });

        if (!fileForSaving)
            return;

        console.log({ csv, fileForSaving });
        await fileForSaving.write(csv)

        console.log("EXPORT SUCCESS")
    }
}