import { app } from "photoshop";
import { ConfigService } from "./services/config.service";
import { ScriptService } from "./services/script.service";
import { DocumentService } from "./services/document.service";


window.addEventListener('load', () => {
    console.clear();
    console.log("Application loaded at", new Date().toISOString());

    const btnTest = document.getElementById('btnTest') as HTMLButtonElement;
    const btnConfigEdit = document.getElementById('configEdit') as HTMLButtonElement;
    const btnRunScript = document.getElementById('runScript') as HTMLButtonElement;

    btnConfigEdit.addEventListener('click', () => {
        const configService = new ConfigService();
        configService.editConfigHandle();
    })
    btnRunScript.addEventListener('click', async () => {
        const scriptService = new ScriptService();
        await scriptService.run();
    })

    btnTest.addEventListener('click', () => {
        console.log("action btnTest");
        console.log(DocumentService.getDocumentData(app.activeDocument));
    })

})