import { global, path } from "../../core/global";
import { prepareNumberToCsv, prepareTextToCsv } from "../../core/helpers";
import { DocumentData } from "../../models/types";

import fs from 'fs';

const CSV_PAGES_HEADERS = [
    '"ID"',
    '"PAGE_INDEX"',
    '"PAGE_NAME"',
    '"PAGE_WH_PX"',
    '"PAGE_WH_IN"',
    '"PAGE_BLEED_PX"',
    '"PAGE_BLEED_IN"',
    '"PAGE_WH_WBLEED_PX"',
    '"PAGE_WH_WBLEED_IN"',
    '"DPI"',
].join(', ');

const CSV_TEXTS_HEADERS = [
    '"ID"',
    '"PAGE_INDEX"',
    '"PAGE_NAME"',
    '"FRAME_NUM"',
    '"FRAME_LOCATION_PX"',
    '"FRAME_LOCATION_IN"',
    '"DPI"',
    '"TEXT_COLOR_RGB"',
    '"TEXT_COLOR_HEX"',
    '"TEXT_COLOR_CMYK"',
    '"TEXT_FONT_FAMILY"',
    '"TEXT_FONT_SIZE_PX"',
    '"TEXT_FONT_SIZE_PT"',
    '"FRAME_CONTENT"',
    '"TEXT_CONTENT"',
].join(', ');

const CSV_TEXTBUBBLES_HEADERS = [
    '"ID"',
    '"PAGE_INDEX"',
    '"PAGE_NAME"',
    '"BACKGROUND_COLOR"',
    '"BOUNDS_PX"',
    '"BOUNDS_IN"',
    '"BORDER_RADIUS_PX"',
    '"BORDER_RADIUS_IN"',
    '"DPI"',
].join(', ');

export const documentDataExport = async (data: DocumentData) => {
    let id = 1;
    let dataPagesCSV = data.pages.reduce((acc, page, index) => {
        console.log({ page });
        acc += [
            `"${id++}"`,
            `"${page.index + 1}"`,
            `"${page.name}"`,
            `"[${[prepareNumberToCsv(page.boundsPx.width), prepareNumberToCsv(page.boundsPx.height)].join(', ')}]"`,
            `"[${[prepareNumberToCsv(page.boundsIn.width), prepareNumberToCsv(page.boundsIn.height)].join(', ')}]"`,
            `"[${[prepareNumberToCsv(page.bleedPx.top), prepareNumberToCsv(page.bleedPx.left), prepareNumberToCsv(page.bleedPx.bottom), prepareNumberToCsv(page.bleedPx.right)].join(', ')}]"`,
            `"[${[prepareNumberToCsv(page.bleedIn.top), prepareNumberToCsv(page.bleedIn.left), prepareNumberToCsv(page.bleedIn.bottom), prepareNumberToCsv(page.bleedIn.right)].join(', ')}]"`,
            `"[${[prepareNumberToCsv(page.boundsWithBleedPx.width), prepareNumberToCsv(page.boundsWithBleedPx.height)].join(', ')}]"`,
            `"[${[prepareNumberToCsv(page.boundsWithBleedIn.width), prepareNumberToCsv(page.boundsWithBleedIn.height)].join(', ')}]"`,
            `"${global.dpi}"`,
        ].map(v => prepareTextToCsv(v)).join(", ") + "\n";
        return acc;
    }, `${CSV_PAGES_HEADERS}\n`);

    let idT = 1;
    let idBT = 1;
    let dataTextCSV = `${CSV_TEXTS_HEADERS}\n`;
    let dataBubbleTextCSV = `${CSV_TEXTBUBBLES_HEADERS}\n`;

    data.pages.forEach((page) => {
        page.textFrames.forEach((textFrame) => {
            dataTextCSV += textFrame.texts.reduce((acc, text, index) => {
                acc += [
                    `"${idT++}"`,
                    `"${page.index + 1}"`,
                    `"${page.name}"`,
                    `"${index + 1}"`,
                    `"[${[prepareNumberToCsv(textFrame.coordinatesPx.top), prepareNumberToCsv(textFrame.coordinatesPx.left), prepareNumberToCsv(textFrame.coordinatesPx.right), prepareNumberToCsv(textFrame.coordinatesPx.bottom)].join(', ')}]"`,
                    `"[${[prepareNumberToCsv(textFrame.coordinatesIn.top), prepareNumberToCsv(textFrame.coordinatesIn.left), prepareNumberToCsv(textFrame.coordinatesIn.right), prepareNumberToCsv(textFrame.coordinatesIn.bottom)].join(', ')}]"`,
                    `"${global.dpi}"`,
                    `"${textFrame.fonts[index].colorRgb}"`,
                    `"${textFrame.fonts[index].colorHex}"`,
                    `"${textFrame.fonts[index].colorCmyk}"`,
                    `"${textFrame.fonts[index].fontFamily}"`,
                    `"${prepareNumberToCsv(textFrame.fonts[index].sizePx)}"`,
                    `"${prepareNumberToCsv(textFrame.fonts[index].sizePt)}"`,
                    `"${textFrame.content}"`,
                    `"${text}"`,
                ].map(v => prepareTextToCsv(v)).join(", ") + "\n";
                return acc;
            }, "");
        });

        dataBubbleTextCSV += page.textBubbles.reduce((acc, tb, index) => {
            acc += [
                `"${idBT++}"`,
                `"${page.index + 1}"`,
                `"${page.name}"`,
                `"${tb.backgroundColor}"`,
                `"[${[prepareNumberToCsv(tb.boundsPx.top), prepareNumberToCsv(tb.boundsPx.left), prepareNumberToCsv(tb.boundsPx.right), prepareNumberToCsv(tb.boundsPx.bottom)].join(', ')}]"`,
                `"[${[prepareNumberToCsv(tb.boundsIn.top), prepareNumberToCsv(tb.boundsIn.left), prepareNumberToCsv(tb.boundsIn.right), prepareNumberToCsv(tb.boundsIn.bottom)].join(', ')}]"`,
                `"[${[prepareNumberToCsv(tb.borderRadiusPx.top), prepareNumberToCsv(tb.borderRadiusPx.left), prepareNumberToCsv(tb.borderRadiusPx.right), prepareNumberToCsv(tb.borderRadiusPx.bottom)].join(', ')}]"`,
                `"[${[prepareNumberToCsv(tb.borderRadiusIn.top), prepareNumberToCsv(tb.borderRadiusIn.left), prepareNumberToCsv(tb.borderRadiusIn.right), prepareNumberToCsv(tb.borderRadiusIn.bottom)].join(', ')}]"`,
                `"${global.dpi}"`,
            ].map(v => prepareTextToCsv(v)).join(", ") + "\n";
            return acc;
        }, "");
    });

    // Export CSV (Pages)
    const pageInfoCsvFilePath = path.join(global.folderSelected.nativePath, global.originalFilenameWithoutExtension + ".page-info.csv");
    fs.writeFileSync(pageInfoCsvFilePath, dataPagesCSV, { encoding: "utf-8" });
    console.log(`PageInfo CSV file has exported succesfully!\nFilepath: ${pageInfoCsvFilePath.nativePath}`);

    // Export CSV (Texts)
    const textInfoFilePath = path.join(global.folderSelected.nativePath, global.originalFilenameWithoutExtension + ".text-info.csv");
    fs.writeFileSync(textInfoFilePath, dataTextCSV, { encoding: "utf-8" });
    console.log(`TextFrameInfo CSV file has exported succesfully!\nFilepath: ${textInfoFilePath.nativePath}`);

    // Export CSV (Bubbles)
    const textBubbleInfoFilePath = path.join(global.folderSelected.nativePath, global.originalFilenameWithoutExtension + ".textbubble-info.csv");
    fs.writeFileSync(textBubbleInfoFilePath, dataBubbleTextCSV, { encoding: "utf-8" });
    console.log(`TextFrameInfo CSV file has exported succesfully!\nFilepath: ${textBubbleInfoFilePath.nativePath}`);

    const json = path.join(global.folderSelected.nativePath, global.originalFilenameWithoutExtension + ".data.json");
    fs.writeFileSync(json, JSON.stringify(data), { encoding: "utf-8" });
    console.log(`JSON file has exported succesfully!\nFilepath: ${json.nativePath}`);
}