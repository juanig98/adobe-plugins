import { InDocument } from "../../core/global";
import { DocumentData } from "../../models/types";
import { documentDataExport } from "./export";
import { documentDataExtract } from "./extract";

export class DocumentService {

    data: DocumentData | undefined = undefined;

    async exportData(): Promise<void> {
        if (!this.dataLoaded()) {
            await this.extractData();
        }
        await documentDataExport(this.data);
    };

    async extractData(): Promise<void> {
        this.data = await documentDataExtract();
    };

    dataLoaded = (): boolean => !!this.data;
}