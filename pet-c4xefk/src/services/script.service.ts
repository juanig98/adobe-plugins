import fs from "fs";
import { app } from 'photoshop';
import { fsProvider, openImage } from "../core/helpers";
import path from "../core/path";
import { ConfigService } from "./config.service";
import { DialogService } from "./dialog.service";
import { DocumentService } from "./document.service";

export class ScriptService {

    private readonly FOLDER_REGEX = new RegExp(/.*(?:PS[DB]|ps[db]).*/);
    private readonly FILE_REGEX = new RegExp(/^(?!.*LAVADO).*\.ps[bd]$/i);

    async openFiles(): Promise<void> {
        const configService = new ConfigService();
        const config = configService.getConfig();

        try {

            const assetPackName = (document.getElementById('assetPackName') as HTMLInputElement).value
            const assetFolder = (document.getElementById('assetFolder') as HTMLInputElement).value

            const pathScript = path.join(config.contentPath, config.cycle, config.lob, assetPackName, assetFolder)

            const assetsEntries = fs.readdirSync(pathScript);

            const filesOpen: string[] = []
            assetsEntries.forEach(asset => {
                const assetDir = path.join(pathScript, asset);
                const assetSubdirs = fs.readdirSync(assetDir);

                assetSubdirs.forEach(subdir => {
                    if (this.FOLDER_REGEX.test(subdir)) {
                        const psbdFolder = path.join(assetDir, subdir);
                        const filesEntries = fs.readdirSync(psbdFolder);
                        filesEntries.forEach(file => {
                            if (this.FILE_REGEX.test(file)) {
                                const filepath = path.join(psbdFolder, file);
                                filesOpen.push(filepath)
                            }
                        });
                    }
                })
            });

            console.log("Open files: ", filesOpen);
            for await (const fileToOpen of filesOpen) {
                await openImage(await fsProvider.getEntryWithUrl(fileToOpen))
            }
        } catch (err) {
            console.error("An error has ocurred", err);
        }
    }

    async run(): Promise<void> {
        await this.openFiles();
        const allDocuments = app.documents;
       
        if (!allDocuments.length) {
            new DialogService({ title: "", content: "No document founds" });
            return;
        }

        await DocumentService.getDocumentsData(allDocuments);
    }
}