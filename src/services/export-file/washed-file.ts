import { global, InApp, InDocument } from "../../core/global";
import { DocumentData } from "../../models/types";
import { ExportFormat } from "indesign";
import { LoggerService } from "../logger/logger.service";
import { PPDPDFExportPreset } from "./pdf-export-preset";
import { exportIntermediateFile } from "./intermediate-file";

export const exportWashedFile = async (documentData: DocumentData, generateIntermediateFile: boolean = false) => {
    if (!global) {
        console.error("Folder not selected!");
        return;
    }

    LoggerService.setLog("Setting file");

    documentData.pages.forEach(page => {
        page.textFrames.forEach(tf => {
            tf.instance.visible = false;
        });
        page.textBubbles.forEach(tb => {
            tb.instance.visible = false;
        })
    });

    LoggerService.setLog("Exporting...");

    const pdfFile = await global.folderSelected.createFile(global.originalFilenameWithoutExtension + ".washed.pdf", { overwrite: true });

    const ppdPdfExportPreset = new PPDPDFExportPreset();
    const preset = ppdPdfExportPreset.getPreset();

    InDocument.exportFile(ExportFormat.PDF_TYPE, pdfFile, false, preset);

    LoggerService.setLog("Exported succesfully");

    console.log(`Washed file has exported succesfully!\nFilepath: ${pdfFile.nativePath}`);

    await LoggerService.displayNextTask();

    if (generateIntermediateFile) {
        await exportIntermediateFile();
    }

    documentData.pages.forEach(page => {
        page.textFrames.forEach(tf => {
            tf.instance.visible = false;
        });
        page.textBubbles.forEach(tb => {
            tb.instance.visible = false;
        })
    });
}