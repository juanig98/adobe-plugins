import { ExportFormat, PageRange } from "indesign";
import { global, InApp, InDocument } from "../../core/global";
import { DocumentData } from "../../models/types";
import { LoggerService } from "../logger/logger.service";
import { PPDPDFExportPreset } from "./pdf-export-preset";
import { configExports } from "../../core/config-export";

export const exportStencilFile = async (documentData: DocumentData) => {
    if (!global) {
        console.error("Folder not selected!");
        return;
    }

    LoggerService.setLog("Setting file");

    documentData.pages.forEach(page =>
        page.textFrames.forEach(tf => {
            tf.instance.visible = true;
        })
    );

    LoggerService.setLog("Exporting...");

    const file = await global.folderSelected.createFile(global.originalFilenameWithoutExtension + ".stencil.pdf", { overwrite: true });

    const ppdPdfExportPreset = new PPDPDFExportPreset();
    const preset = ppdPdfExportPreset.getPreset();

    InDocument.exportFile(ExportFormat.PDF_TYPE, file, false, preset);

    LoggerService.setLog("Exported succesfully");

    console.log(`Stencil file has exported succesfully!\nFilepath: ${file.nativePath}`);
}
