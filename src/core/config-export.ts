import { InApp, InDocument } from "./global";

export const configExports = () => {
    InApp.pdfExportPreferences.useDocumentBleedWithPDF = true;
    // InApp.pdfExportPreferences.cropMarks = true;
    // InApp.pdfExportPreferences.pageMarksOffset = InDocument.documentPreferences.documentBleedTopOffset;
    InApp.pdfExportPreferences.pageRange = PageRange.ALL_PAGES;
}