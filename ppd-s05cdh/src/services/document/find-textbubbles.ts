import { global } from "../../core/global";
import { areAllEqual } from "../../core/helpers";
import { IBoundes, PageData, TextBubble } from "../../models/types";

export async function findTextBubbles(item: Group, page: PageData): Promise<TextBubble | undefined> {

    for (let i = 0; i < item.rectangles.length; i++) {
        const rectangle = item.rectangles.item(i);

        if (areAllEqual(rectangle.topLeftCornerRadius, rectangle.topRightCornerRadius, rectangle.bottomLeftCornerRadius, rectangle.bottomRightCornerRadius)) {
            const radiusValue = rectangle.topLeftCornerRadius;

            const boundsPx: IBoundes = {
                top: Number(rectangle.geometricBounds[0]) * global.dpi + page.bleedPx.top,
                left: Number(rectangle.geometricBounds[1]) * global.dpi + page.bleedPx.left,
                right: Number(rectangle.geometricBounds[3]) * global.dpi + page.bleedPx.top,
                bottom: Number(rectangle.geometricBounds[2]) * global.dpi + page.bleedPx.left,
            }
            const borderRadiusPx: IBoundes = {
                top: Number(radiusValue),
                left: Number(radiusValue),
                right: Number(radiusValue),
                bottom: Number(radiusValue),
            }

            const boundsIn: IBoundes = {
                top: Number(rectangle.geometricBounds[0]) + page.bleedIn.top,
                left: Number(rectangle.geometricBounds[1]) + page.bleedIn.left,
                right: Number(rectangle.geometricBounds[3]) + page.bleedIn.top,
                bottom: Number(rectangle.geometricBounds[2]) + page.bleedIn.left,
            }
            const borderRadiusIn: IBoundes = {
                top: Number(radiusValue),
                left: Number(radiusValue),
                right: Number(radiusValue),
                bottom: Number(radiusValue),
            }
            console.log("LLEGA");

            return {
                instance: item,
                rectangles: item.rectangles.everyItem(),
                backgroundColor: undefined,
                borderRadiusPx,
                borderRadiusIn,
                boundsIn,
                boundsPx
            }
        }
    }

    return undefined;
}