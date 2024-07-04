
export class CsvService {

    async toCsv(fileForSaving: any, headers: string[], rows: string[][]) {
        let csv = headers.join(", ") + "\n";

        rows.forEach(row => {
            csv += row.map(field => field.replace(/,/g, 'COMMA')).join(', ') + "\r\n"
        });

        await fileForSaving.write(csv)

        console.log("EXPORT SUCCESS")
    }
}