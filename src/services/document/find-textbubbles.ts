import { areAllEqual } from "../../core/helpers";
import { ViewPreference } from "../../core/view-preferences";
import { IBoundes, TextBubble } from "../../models/types";

export async function findTextBubbles(item: Group): Promise<TextBubble | undefined> {

    for (let i = 0; i < item.rectangles.length; i++) {
        const rectangle = item.rectangles.item(i);

        if (areAllEqual(rectangle.topLeftCornerRadius, rectangle.topRightCornerRadius, rectangle.bottomLeftCornerRadius, rectangle.bottomRightCornerRadius)) {
            const radiusValue = rectangle.topLeftCornerRadius;

            const viewPreference = new ViewPreference();
            viewPreference.toPixels();
            const boundsPx: IBoundes = {
                top: Number(rectangle.geometricBounds[0]),
                left: Number(rectangle.geometricBounds[1]),
                right: Number(rectangle.geometricBounds[3]),
                bottom: Number(rectangle.geometricBounds[2]),
            }
            const borderRadiusPx: IBoundes = {
                top: Number(radiusValue),
                left: Number(radiusValue),
                right: Number(radiusValue),
                bottom: Number(radiusValue),
            }

            viewPreference.toInches();
            const boundsIn: IBoundes = {
                top: Number(rectangle.geometricBounds[0]),
                left: Number(rectangle.geometricBounds[1]),
                right: Number(rectangle.geometricBounds[3]),
                bottom: Number(rectangle.geometricBounds[2]),
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