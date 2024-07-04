import { global, InApp, InDocument } from "../../core/global";

export class PPDPDFExportPreset {

    static PRESET_NAME = "[PreProcessDesign]";

    private makePDFPreset(presetName: string, ourPdfExportPreset: Partial<PDFExportPreset>): PDFExportPreset {
        var ps = InApp.pdfExportPresets.itemByName(presetName);
        if (ps.isValid) {
            return ps;
        } else {
            ps = InApp.pdfExportPresets.add({ name: presetName });
            ps.properties = ourPdfExportPreset.properties;
            return ps;
        }
    }

    getPreset(): PDFExportPreset {
        const pdfExportPreset = this.makePDFPreset(PPDPDFExportPreset.PRESET_NAME, InApp.pdfExportPresets.itemByName("[Press Quality]"));

        // Color Bitmap
        pdfExportPreset.colorBitmapSampling = 1650742125; // Sampling.BICUBIC_DOWNSAMPLE;
        pdfExportPreset.colorBitmapSamplingDPI = global.dpi; // DPI
        pdfExportPreset.colorBitmapCompression = 2053730371; // BitmapCompression.ZIP
        pdfExportPreset.colorBitmapQuality = 1701722210; // CompressionQuality.EIGHT_BIT
        
        // Grayscale Bitmap
        pdfExportPreset.grayscaleBitmapSampling = 1650742125; // Sampling.BICUBIC_DOWNSAMPLE
        pdfExportPreset.grayscaleBitmapSamplingDPI = global.dpi; // DPI
        pdfExportPreset.grayscaleBitmapCompression = 2053730371; // BitmapCompression.ZIP
        pdfExportPreset.grayscaleBitmapQuality = 1701722210; // CompressionQuality.EIGHT_BIT

        // Marks and bleeds
        pdfExportPreset.useDocumentBleedWithPDF = true;
        pdfExportPreset.cropMarks = true;
        pdfExportPreset.pageMarksOffset = InDocument.documentPreferences.documentBleedTopOffset;
 
        return pdfExportPreset;
    }

}