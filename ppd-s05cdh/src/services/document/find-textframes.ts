import { global } from '../../core/global';
import { cmyk2rgb, rgb2hex } from "../../core/helpers";
import { IFont, PageData, TextFrameData } from "./../../models/types";

export async function findTextFrames(instance: TextFrame, page: PageData): Promise<TextFrameData> {
    const textFrame: TextFrameData = new TextFrameData();
    textFrame.instance = instance;

    textFrame.coordinatesPx.top = Number(instance.geometricBounds[0]) * global.dpi + page.bleedPx.top;
    textFrame.coordinatesPx.left = Number(instance.geometricBounds[1]) * global.dpi + page.bleedPx.left;
    textFrame.coordinatesPx.bottom = Number(instance.geometricBounds[2]) * global.dpi + page.bleedPx.top;
    textFrame.coordinatesPx.right = Number(instance.geometricBounds[3]) * global.dpi + page.bleedPx.left;

    textFrame.coordinatesIn.top = Number(instance.geometricBounds[0]) + page.bleedIn.top;
    textFrame.coordinatesIn.left = Number(instance.geometricBounds[1]) + page.bleedIn.left;
    textFrame.coordinatesIn.bottom = Number(instance.geometricBounds[2]) + page.bleedIn.top;
    textFrame.coordinatesIn.right = Number(instance.geometricBounds[3]) + page.bleedIn.left;

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
            const colorCmyk = `(${_colorCmyk.map(v => v.toFixed(global.decimals)).join(",")})`;
            const colorRgb = `(${_colorRgb.map(v => v.toFixed(global.decimals)).join(",")})`;
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