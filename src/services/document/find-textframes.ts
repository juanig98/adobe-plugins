import { ViewPreference } from "../../core/view-preferences";
import { IFont, TextFrameData } from "./../../models/types";
import { cmyk2rgb, rgb2cmyk, rgb2hex } from "../../core/helpers";

export async function findTextFrames(instance: TextFrame): Promise<TextFrameData> {
    const textFrame: TextFrameData = new TextFrameData();
    textFrame.instance = instance;

    const viewPreference = new ViewPreference();

    viewPreference.toPixels()
    textFrame.coordinatesPx.top = Number(instance.geometricBounds[0]);
    textFrame.coordinatesPx.left = Number(instance.geometricBounds[1]);
    textFrame.coordinatesPx.bottom = Number(instance.geometricBounds[2]);
    textFrame.coordinatesPx.right = Number(instance.geometricBounds[3]);

    viewPreference.toInches()
    textFrame.coordinatesIn.top = Number(instance.geometricBounds[0]);
    textFrame.coordinatesIn.left = Number(instance.geometricBounds[1]);
    textFrame.coordinatesIn.bottom = Number(instance.geometricBounds[2]);
    textFrame.coordinatesIn.right = Number(instance.geometricBounds[3]);
    textFrame.content = instance.contents.toString();

    if (instance.characters.length > 0) {
        const fontGroups: Map<string, { text: string, font: IFont }> = new Map();

        for (let i = 0; i < instance.characters.length; i++) {
            const characterInstance = instance.characters.item(i);
            const sizePt = characterInstance.pointSize;
            const sizePx = Number(characterInstance.pointSize) * 1.333;
            const fontFamily = characterInstance.appliedFont.fontFamily;
            const fontStyle = characterInstance.fontStyle;
            const fillColor = characterInstance.fillColor.colorValue;
            const _colorCmyk = characterInstance.fillColor.colorValue as [number, number, number, number];
            const _colorRgb = cmyk2rgb(_colorCmyk);
            const colorHex = rgb2hex(_colorRgb);
            const colorCmyk = `(${_colorCmyk.join(",")})`;
            const colorRgb = `(${_colorRgb.join(",")})`;
            const letter = characterInstance.contents

            const fontKey = `${sizePx}-${fontFamily}-${fillColor}-${fontStyle}`;
            if (!fontGroups.has(fontKey)) {
                fontGroups.set(fontKey, {
                    text: '',
                    font: { sizePx, sizePt, fontFamily, fontStyle, colorCmyk, colorHex, colorRgb }
                });
            }

            const group = fontGroups.get(fontKey);
            if (group) {
                group.text += letter;
            }
        }

        fontGroups.forEach(({ text, font }) => {
            textFrame.texts.push(text);
            textFrame.fonts.push(font);
        });
    }

    return textFrame;
}