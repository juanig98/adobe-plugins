import { InDocument } from "./core/global";

export const test = async () => {
    for (let i = 0; i < InDocument.swatches.length; i++) {
        const element = InDocument.swatches.item(i);
        const props = (<any>element.properties);
        console.log({ swatchName: element.name, swatchValue: props.colorValue ?? "undefined", space: props.space ?? "undefined" });
    }

    for (let i = 0; i < InDocument.colors.length; i++) {
        const color = InDocument.colors.item(i);
        console.log({ color });
    }
}