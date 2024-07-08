import uxp from "uxp";
import { core, app } from "photoshop";

export const fsProvider = uxp.storage.localFileSystem

export const openImage = (entryPath: any) => {
    return new Promise((resolve, reject) => {
        core.executeAsModal(async () => {
            // Now I have the files path, how do I open a file in photoshop? 
            try {
                const fd = await app.open(entryPath);
                resolve(fd);
            } catch (error) {
                console.log(error);
                reject(error);
            }
        }, { commandName: "open image" });
    })
}


export const removeSpecialCharacters = (text: string) => {   
    return text.toString().replace(/(\r\n|\n|\r)/gm, "");
}