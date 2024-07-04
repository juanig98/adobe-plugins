import { DocumentData } from "../../models/types";
import { exportStencilFile } from "./stencil-file";
import { exportWashedFile } from "./washed-file";

export class ExportFileService {
    async stecilFile(documentData: DocumentData): Promise<void> {
        await exportStencilFile(documentData);
    };

    async washedFile(documentData: DocumentData, generateIntermediateFile: boolean = false): Promise<void> {
        await exportWashedFile(documentData, generateIntermediateFile);
    };

}