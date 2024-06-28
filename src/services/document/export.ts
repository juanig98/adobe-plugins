import { global, path } from "../../core/global";
import { prepareTextToCsv } from "../../core/helpers";
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
    '"DPI"',
    '"PAGE_WH_DPI_PX"',
].join(', ');

const CSV_TEXTS_HEADERS = [
    '"ID"',
    '"PAGE_INDEX"',
    '"PAGE_NAME"',
    '"FRAME_NUM"',
    '"FRAME_LOCATION_PX"',
    '"FRAME_LOCATION_IN"',
    '"DPI"',
    '"FRAME_LOCATION_DPI_PX"',
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
    '"BOUNDS_DPI_PX"',
    '"BORDER_RADIUS_DPI_PX"',
].join(', ');

const prepareNumber = (val: string | number): number => Number(Number(val).toFixed(global.decimals))

const defineByDpi = (val: string | number): number => Number((Number(val) * global.dpi).toFixed(global.decimals))

export const documentDataExport = async (data: DocumentData) => {
    let id = 1;
    let dataPagesCSV = data.pages.reduce((acc, page, index) => {
        console.log({ page });
        acc += [
            `"${id++}"`,
            `"${page.index + 1}"`,
            `"${page.name}"`,
            `"[${[prepareNumber(page.boundsPx[3]), prepareNumber(page.boundsPx[2])].join(', ')}]"`,
            `"[${[prepareNumber(page.boundsIn[3]), prepareNumber(page.boundsIn[2])].join(', ')}]"`,
            `"[${[prepareNumber(page.bleedPx.top), prepareNumber(page.bleedPx.left), prepareNumber(page.bleedPx.bottom), prepareNumber(page.bleedPx.right)].join(', ')}]"`,
            `"[${[prepareNumber(page.bleedIn.top), prepareNumber(page.bleedIn.left), prepareNumber(page.bleedIn.bottom), prepareNumber(page.bleedIn.right)].join(', ')}]"`,
            `"${global.dpi}"`,
            `"[${[defineByDpi(page.boundsIn[3] + page.bleedIn.left + page.bleedIn.right), defineByDpi(page.boundsIn[2] + page.bleedIn.top + page.bleedIn.bottom)].join(', ')}]"`,
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
                    `"[${[prepareNumber(textFrame.coordinatesPx.top), prepareNumber(textFrame.coordinatesPx.left), prepareNumber(textFrame.coordinatesPx.right), prepareNumber(textFrame.coordinatesPx.bottom)].join(', ')}]"`,
                    `"[${[prepareNumber(textFrame.coordinatesIn.top), prepareNumber(textFrame.coordinatesIn.left), prepareNumber(textFrame.coordinatesIn.right), prepareNumber(textFrame.coordinatesIn.bottom)].join(', ')}]"`,
                    `"${global.dpi}"`,
                    `"[${[defineByDpi(textFrame.coordinatesIn.top + page.bleedIn.top), defineByDpi(textFrame.coordinatesIn.left + page.bleedIn.left), defineByDpi(textFrame.coordinatesIn.right + page.bleedIn.right), defineByDpi(textFrame.coordinatesIn.bottom + page.bleedIn.bottom)].join(', ')}]"`,
                    `"${textFrame.fonts[index].colorRgb}"`,
                    `"${textFrame.fonts[index].colorHex}"`,
                    `"${textFrame.fonts[index].colorCmyk}"`,
                    `"${textFrame.fonts[index].fontFamily}"`,
                    `"${prepareNumber(textFrame.fonts[index].sizePx)}"`,
                    `"${prepareNumber(textFrame.fonts[index].sizePt)}"`, 
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
                `"[${[prepareNumber(tb.boundsPx.top), prepareNumber(tb.boundsPx.left), prepareNumber(tb.boundsPx.right), prepareNumber(tb.boundsPx.bottom)].join(', ')}]"`,
                `"[${[prepareNumber(tb.boundsIn.top), prepareNumber(tb.boundsIn.left), prepareNumber(tb.boundsIn.right), prepareNumber(tb.boundsIn.bottom)].join(', ')}]"`,
                `"[${[prepareNumber(tb.borderRadiusPx.top), prepareNumber(tb.borderRadiusPx.left), prepareNumber(tb.borderRadiusPx.right), prepareNumber(tb.borderRadiusPx.bottom)].join(', ')}]"`,
                `"[${[prepareNumber(tb.borderRadiusIn.top), prepareNumber(tb.borderRadiusIn.left), prepareNumber(tb.borderRadiusIn.right), prepareNumber(tb.borderRadiusIn.bottom)].join(', ')}]"`,
                `"${global.dpi}"`,
                `"[${[defineByDpi(tb.boundsIn.top + page.bleedIn.top), defineByDpi(tb.boundsIn.left + page.bleedIn.left), defineByDpi(tb.boundsIn.right + page.bleedIn.right), defineByDpi(tb.boundsIn.bottom + page.bleedIn.bottom)].join(', ')}]"`,
                `"[${[defineByDpi(tb.borderRadiusIn.top), defineByDpi(tb.borderRadiusIn.left), defineByDpi(tb.borderRadiusIn.right), defineByDpi(tb.borderRadiusIn.bottom)].join(', ')}]"`,
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