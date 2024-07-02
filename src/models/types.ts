export interface IGlobal {
    folderSelected: any
    originalFilename: string
    originalFilenameWithoutExtension: string
    decimals: number
    dpi: number
}
export interface DocumentData {
    filename: string;
    path: string;
    pages: PageData[]
}
export class PageData {
    instance: Page
    index: number
    name: string
    boundsPx: IWidthHeight;
    boundsIn: IWidthHeight;
    boundsWithBleedPx: IWidthHeight;
    boundsWithBleedIn: IWidthHeight;
    bleedPx: IBoundes
    bleedIn: IBoundes
    textFrames: TextFrameData[]
    textBubbles: TextBubble[]
    constructor() {
        this.instance = undefined
        this.index = undefined
        this.name = undefined
        this.boundsPx = undefined
        this.boundsIn = undefined
        this.bleedPx = { top: undefined, left: undefined, bottom: undefined, right: undefined }
        this.bleedIn = { top: undefined, left: undefined, bottom: undefined, right: undefined }
        this.textFrames = []
        this.textBubbles = []
    }
}
export interface IBoundes {
    top: number
    left: number
    right: number
    bottom: number
}
export type ISize = IPixelsSize & IPointsSize & IInchesSize
export interface IPixelsSize {
    pixels: string | number
}
export interface IPointsSize {
    points: string | number
}
export interface IInchesSize {
    inches: string | number
}
export interface IWidthHeight {
    width: number;
    height: number;
}
export class TextFrameData {
    instance: TextFrame
    coordinatesIn: IBoundes
    coordinatesPx: IBoundes
    content: string
    texts: string[]
    fonts: IFont[]
    constructor() {
        this.instance = undefined
        this.coordinatesPx = { top: undefined, left: undefined, right: undefined, bottom: undefined }
        this.coordinatesIn = { top: undefined, left: undefined, right: undefined, bottom: undefined }
        this.content = undefined
        this.texts = []
        this.fonts = []
    }
}
export class TextBubble {
    instance: any
    rectangles: Rectangle[]
    boundsPx: IBoundes
    boundsIn: IBoundes
    borderRadiusPx: IBoundes
    borderRadiusIn: IBoundes
    backgroundColor: string
}
export interface IFont {
    sizePx: string | number
    sizePt: string | number
    fontFamily: string
    fontStyle: string
    colorRgb: string
    colorHex: string
    colorCmyk: string
}
export interface ICoordinates {
    x1: string | number
    x2: string | number
    y1: string | number
    y2: string | number
}
export interface ICheckboxes {
    genStencilFile: HTMLInputElement | undefined
    genWashedFile: HTMLInputElement | undefined
    genIntermediateFile: HTMLInputElement | undefined 
}