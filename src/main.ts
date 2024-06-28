import { showDialog } from "./core/dialog";
import { fsProvider, global, InDocument, setGlobals } from "./core/global";
import { ICheckboxes } from "./models/types";
import { DocumentService } from "./services/document/document.service";
import { ExportFileService } from "./services/export-file/exports.service";
import { LoggerService } from "./services/logger/logger.service";

let checkboxes: ICheckboxes = {
    genStencilFile: undefined,
    genWashedFile: undefined,
    genIntermediateFile: undefined,
    genDocumenDataFile: undefined,
}

window.addEventListener('load', () => {
    console.log("Application loaded at", new Date().toISOString());

    checkboxes.genStencilFile = document.getElementById('genStencilFile') as HTMLInputElement;
    checkboxes.genWashedFile = document.getElementById('genWashedFile') as HTMLInputElement;
    checkboxes.genIntermediateFile = document.getElementById('genIntermediateFile') as HTMLInputElement;
    checkboxes.genDocumenDataFile = document.getElementById('genDocumenDataFile') as HTMLInputElement;

    checkboxes.genWashedFile.addEventListener('click', () => {
        (document.querySelector('label[for="genIntermediateFile"]') as HTMLLabelElement).style.color = 'white';
        if (checkboxes.genWashedFile.checked) {
            checkboxes.genIntermediateFile.disabled = false;
            checkboxes.genIntermediateFile.checked = true;
        } else {
            (document.querySelector('label[for="genIntermediateFile"]') as HTMLLabelElement).style.color = 'gray';
            checkboxes.genIntermediateFile.checked = false;
            checkboxes.genIntermediateFile.disabled = true;
        }
    })

    document.getElementById('btnTest')
        ?.addEventListener('click', () => {

            // console.log("Swatches");

            // for (let i = 0; i < InDocument.swatches.length; i++) {
            //     const element = InDocument.swatches.item(i);
            //     console.log({ swatch: element })
            // }
            console.log("Colors Groups");
            for (let i = 0; i < InDocument.colorGroups.length; i++) {
                const colorGroup = InDocument.colorGroups.item(i);
                for (let j = 0; j < colorGroup.colorGroupSwatches.length; j++) {
                    const colorSwatch = colorGroup.colorGroupSwatches.item(j);
                    console.log({ colorSwatch })
                }
            }
        })
    document.getElementById('btnExecute')
        ?.addEventListener('click', async () => {
            const tasks = [];
            tasks.push("Setting global variables...") // 2
            tasks.push("Selecting directory...") // 1
            tasks.push("Extracting document data") // 3
            if (checkboxes.genDocumenDataFile.checked)
                tasks.push("Generating document data file") // 4
            if (checkboxes.genStencilFile.checked)
                tasks.push("Generating stencil file") // 5
            if (checkboxes.genIntermediateFile.checked)
                tasks.push("Generating intermediate file") // 6
            if (checkboxes.genWashedFile.checked)
                tasks.push("Generating washed file") // 7

            if (tasks.length < 4) {
                showDialog('Attention', 'Mmm... there is no task to do')
                return;
            }

            await LoggerService.setTasks(tasks);

            setGlobals();
            await LoggerService.displayNextTask();

            global.folderSelected = await fsProvider.getFolder();

            if (!global.folderSelected) {
                await LoggerService.clearTasks();
                return;
            }
            await LoggerService.displayNextTask();

            const docService = new DocumentService();
            const exportsService = new ExportFileService();

            await docService.extractData();
            await LoggerService.displayNextTask();

            if (checkboxes.genDocumenDataFile.checked) {
                await docService.exportData();
                await LoggerService.displayNextTask();
            }

            if (checkboxes.genStencilFile.checked) {
                await exportsService.stecilFile(docService.data);
                await LoggerService.displayNextTask();
            }

            if (checkboxes.genWashedFile.checked) {
                await exportsService.washedFile(docService.data, !!checkboxes.genIntermediateFile.checked);
                await LoggerService.displayNextTask();
            }

            await __dev();
        });
})



const __dev = async () => {
    // for (let i = 0; i < InApp.pdfExportPresets.length; i++) {
    //     const element = InApp.pdfExportPresets.item(i);
    //     console.log(element);

    // }
}

