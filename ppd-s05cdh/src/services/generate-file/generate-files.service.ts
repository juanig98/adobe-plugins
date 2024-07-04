import { global } from "../../core/global";
import { ICheckboxes } from "../../models/types";
import { DocumentService } from "../document/document.service";
import { ExportFileService } from "../export-file/exports.service";
import { LoggerService } from "../logger/logger.service";
import { showDialog } from "./../../core/dialog";
import { setGlobals, fsProvider } from "./../../core/global";

export class GenerateFilesService {

    private checkboxes: ICheckboxes = {
        genStencilFile: undefined,
        genWashedFile: undefined,
        genIntermediateFile: undefined,
    }


    setCheckboxes(): void {
        this.checkboxes.genStencilFile = document.getElementById('genStencilFile') as HTMLInputElement;
        this.checkboxes.genWashedFile = document.getElementById('genWashedFile') as HTMLInputElement;
        this.checkboxes.genIntermediateFile = document.getElementById('genIntermediateFile') as HTMLInputElement;

        this.checkboxes.genWashedFile.addEventListener('click', () => {
            (document.querySelector('label[for="genIntermediateFile"]') as HTMLLabelElement).style.color = 'white';
            if (this.checkboxes.genWashedFile.checked) {
                this.checkboxes.genIntermediateFile.disabled = false;
                this.checkboxes.genIntermediateFile.checked = true;
            } else {
                (document.querySelector('label[for="genIntermediateFile"]') as HTMLLabelElement).style.color = 'gray';
                this.checkboxes.genIntermediateFile.checked = false;
                this.checkboxes.genIntermediateFile.disabled = true;
            }
        })
    }


    async generateFiles(): Promise<void> {
        const tasks = [];
        tasks.push("Setting global variables...") // 2
        tasks.push("Selecting directory...") // 1
        tasks.push("Extracting document data") // 3 
        if (this.checkboxes.genStencilFile.checked)
            tasks.push("Generating stencil file") // 5
        if (this.checkboxes.genIntermediateFile.checked)
            tasks.push("Generating intermediate file") // 6
        if (this.checkboxes.genWashedFile.checked)
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

        if (this.checkboxes.genStencilFile.checked) {
            await exportsService.stecilFile(docService.data);
            await LoggerService.displayNextTask();
        }

        if (this.checkboxes.genWashedFile.checked) {
            await exportsService.washedFile(docService.data, !!this.checkboxes.genIntermediateFile.checked);
            await LoggerService.displayNextTask();
        }
    }
}
