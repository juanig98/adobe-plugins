
import { ExportDocumentDataService } from "./services/export-data/export-documentdata.service";
import { ExportTextsDataService } from "./services/export-data/export-textsdata.service";
import { GenerateFilesService } from "./services/generate-file/generate-files.service";
import { test } from "./test";

window.addEventListener('load', () => {
    console.log("Application loaded at", new Date().toISOString());

    const btnTest = document.getElementById('btnTest') as HTMLButtonElement;
    const btnGenerateFiles = document.getElementById('btnGenerateFiles') as HTMLButtonElement;
    const btnGenerateDocumentData = document.getElementById('btnGenerateDocumentData') as HTMLButtonElement;
    const genDocDataSelectorAll = document.getElementById('genDocDataSelectorAll') as HTMLInputElement;
    const btnGenerateTextData = document.getElementById('btnGenerateTextData') as HTMLButtonElement;
    const genTextDataSelectorAll = document.getElementById('genTextDataSelectorAll') as HTMLInputElement;

    const generateFilesService = new GenerateFilesService();
    generateFilesService.setCheckboxes();

    btnGenerateDocumentData.addEventListener('click', async () => {
        btnGenerateDocumentData.disabled = true;
        const service = new ExportDocumentDataService();
        await service.export(genDocDataSelectorAll.checked)
        btnGenerateDocumentData.disabled = false;
    })

    btnGenerateTextData.addEventListener('click', async () => {
        btnGenerateTextData.disabled = true;
        const service = new ExportTextsDataService();
        await service.export(genTextDataSelectorAll.checked)
        btnGenerateTextData.disabled = false;
    })

    btnGenerateFiles.addEventListener('click', async () => {
        btnGenerateFiles.disabled = true;
        await generateFilesService.generateFiles();
        btnGenerateFiles.disabled = false;
    });

    btnTest.addEventListener('click', async () => {
        btnTest.disabled = true;
        await test();
        btnTest.disabled = false;
    })
})