import { IGlobal } from "../models/types";
import { app } from 'indesign';
import uxp from 'uxp';

export const path = (<any>window).path;

export const global: IGlobal = {
    folderSelected: undefined,
    originalFilename: app.activeDocument.properties.name,
    originalFilenameWithoutExtension: app.activeDocument.properties.name.replace(/\.[^/.]+$/, ""),
    decimals: 4,
    dpi: 600,
}

export const fsProvider = uxp.storage.localFileSystem

export const InApp: InApplication = app;

export let InDocument: InDocument = app.activeDocument;


export const setGlobals = () => {
    InDocument = InApp.activeDocument;
    global.originalFilename = (<any>InDocument.properties).name;
    global.originalFilenameWithoutExtension = (<any>InDocument.properties).name.replace(/\.[^/.]+$/, "");
    global.decimals = Number((document.getElementById('decimals') as HTMLInputElement).value);
    global.dpi = Number((document.getElementById('dpi') as HTMLInputElement).value);
}

