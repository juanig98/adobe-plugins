import { ViewPreference } from "../../core/view-preferences";
import { global, InDocument } from "../../core/global";
import { pointsToInches, pointsToPixels } from "../../core/helpers";
import { PageData } from "../../models/types";
import { LoggerService } from "../logger/logger.service";
import { findTextBubbles } from "./find-textbubbles";
import { findTextFrames } from "./find-textframes";

export async function findPages(instance: Page): Promise<PageData> {
    const page: PageData = new PageData();

    page.instance = instance;
    page.index = instance.index ?? 0;
    page.name = instance.name ?? "undefined";

    const viewPreference = new ViewPreference();
    viewPreference.toInches();

    let _bounds = instance.bounds.map(x => Number(x))

    page.bleedPx = {
        bottom: Number(InDocument.documentPreferences.documentBleedBottomOffset) * global.dpi,
        left: Number(InDocument.documentPreferences.documentBleedInsideOrLeftOffset) * global.dpi,
        right: Number(InDocument.documentPreferences.documentBleedOutsideOrRightOffset) * global.dpi,
        top: Number(InDocument.documentPreferences.documentBleedTopOffset) * global.dpi
    };
    page.boundsPx = {
        width: _bounds[3] * global.dpi,
        height: _bounds[2] * global.dpi
    };
    page.boundsWithBleedPx = {
        width: page.boundsPx.width + page.bleedPx.left + page.bleedPx.right,
        height: page.boundsPx.height + page.bleedPx.top + page.bleedPx.bottom
    }

    page.bleedIn = {
        bottom: Number(InDocument.documentPreferences.documentBleedBottomOffset),
        left: Number(InDocument.documentPreferences.documentBleedInsideOrLeftOffset),
        right: Number(InDocument.documentPreferences.documentBleedOutsideOrRightOffset),
        top: Number(InDocument.documentPreferences.documentBleedTopOffset)
    };
    page.boundsIn = {
        width: _bounds[3],
        height: _bounds[2]
    }
    page.boundsWithBleedIn = {
        width: page.boundsIn.width + page.bleedIn.left + page.bleedIn.right,
        height: page.boundsIn.height + page.bleedIn.top + page.bleedIn.bottom
    }

    // TextFrames
    LoggerService.setLog("Recognizing TextFrames");
    const pageItems = instance.allPageItems;
    for (let j = 0; j < pageItems.length; j++) {

        const pageItem = pageItems[j];

        if (pageItem.constructor.name == 'TextFrame') {
            page.textFrames.push(await findTextFrames(pageItem as TextFrame, page));
        }

        if (pageItem.constructor.name == 'Group') {
            const textBubble = await findTextBubbles(pageItem as Group, page);
            if (textBubble) {
                page.textBubbles.push(textBubble);
            }
        }
    }
    LoggerService.setLog(`${page.textFrames.length} TextFrames found`);
    LoggerService.setLog(`${page.textBubbles.length} text bubbles found`);

    return page;
}
