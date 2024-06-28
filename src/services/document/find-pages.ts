import { ViewPreference } from "../../core/view-preferences";
import { InDocument } from "../../core/global";
import { pointsToInches, pointsToPixels } from "../../core/helpers";
import { PageData } from "../../models/types";
import { LoggerService } from "../logger/logger.service";
import { findTextBubbles } from "./find-textbubbles";
import { findTextFrames } from "./find-textframes";

export async function findPages(instance: Page): Promise<PageData> {
    const page: PageData = new PageData();

    page.instance = instance;
    page.index = instance.index;
    page.name = instance.name;

    const viewPreference = new ViewPreference();

    viewPreference.toPixels();
    page.boundsPx = instance.bounds.map(x => Number(x));
    page.bleedPx = {
        bottom: parseInt(InDocument.documentPreferences.documentBleedBottomOffset.toString()),
        left: parseInt(InDocument.documentPreferences.documentBleedInsideOrLeftOffset.toString()),
        right: parseInt(InDocument.documentPreferences.documentBleedOutsideOrRightOffset.toString()),
        top: parseInt(InDocument.documentPreferences.documentBleedTopOffset.toString())
    };

    viewPreference.toInches();
    page.boundsIn = instance.bounds.map(x => Number(x));
    page.bleedIn = {
        bottom: parseInt(InDocument.documentPreferences.documentBleedBottomOffset.toString()),
        left: parseInt(InDocument.documentPreferences.documentBleedInsideOrLeftOffset.toString()),
        right: parseInt(InDocument.documentPreferences.documentBleedOutsideOrRightOffset.toString()),
        top: parseInt(InDocument.documentPreferences.documentBleedTopOffset.toString())
    };

    // TextFrames
    LoggerService.setLog("Recognizing TextFrames");
    const pageItems = instance.allPageItems;
    for (let j = 0; j < pageItems.length; j++) {

        const pageItem = pageItems[j];

        if (pageItem.constructor.name == 'TextFrame') {
            page.textFrames.push(await findTextFrames(pageItem as TextFrame));
        }

        if (pageItem.constructor.name == 'Group') {
            const textBubble = await findTextBubbles(pageItem as Group);
            if (textBubble) {
                page.textBubbles.push(textBubble);
            }
        }
    }
    LoggerService.setLog(`${page.textFrames.length} TextFrames found`);
    LoggerService.setLog(`${page.textBubbles.length} text bubbles found`);

    return page;
}
