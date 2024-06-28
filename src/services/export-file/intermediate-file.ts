import { global, InDocument } from "../../core/global";
import { LoggerService } from "../logger/logger.service";

export const exportIntermediateFile = async () => {
    await LoggerService.setLog("Saving...");

    const intermediateFile = await global.folderSelected.createFile(global.originalFilenameWithoutExtension + ".intermediate.indd", { overwrite: true });

    InDocument.saveACopy(intermediateFile);

    LoggerService.setLog("Save succesfully");

    console.log(`Intermediate file has saved succesfully!\nFilepath: ${intermediateFile.nativePath}`);
}