import { InApp, InDocument } from "../../core/global";
import { DocumentData } from "../../models/types";
import { LoggerService } from "../logger/logger.service";
import { findPages } from "./find-pages";

export async function documentDataExtract(): Promise<DocumentData> {
    const data: DocumentData = { pages: [] };

    LoggerService.setLog("Recognizing Pages");
    LoggerService.setLog(`${InDocument.pages.length} Pages found`);
    for (let i = 0; i < InDocument.pages.length; i++) {
        const page = InDocument.pages.item(i);
        const pageData = await findPages(page)
        data.pages.push(pageData);
    }

    return data;
}
