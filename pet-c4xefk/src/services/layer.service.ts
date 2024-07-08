import { removeSpecialCharacters } from './../core/helpers';
import { Layers } from "photoshop/dom/collections/Layers";
import { Layer } from "photoshop/dom/Layer";
import { LayerData, LayerNames } from "../models/types";

export class LayerService {
    private static readonly PARTNER_LOGO_REGEX = new RegExp(/retailer|partner/i);
    private static readonly CTA_REGEX = new RegExp(/cta/i);

    static hideLayer(layer: Layer): void {
        if (
            layer.parent.name.toLowerCase().includes(LayerNames.CTA)
            || this.isPartnerLogo(layer.parent)
        ) {
            layer.parent.visible = false;
        } else {
            layer.visible = false;
        }
    }

    static isPartnerLogo(layer: Layer): boolean { return this.PARTNER_LOGO_REGEX.test(layer.name); }

    static isParentCTA(layer: Layer): boolean { return this.CTA_REGEX.test(layer.parent?.name); }

    static getLayersData(layers: Layers): Partial<LayerData>[] {
        const result: Partial<LayerData>[] = []
        for (const layer of layers) {
            result.push(this.getLayerData(layer));
        }
        return result;
    }

    static getLayerData(layer: Layer): Partial<LayerData> {
        let data: Partial<LayerData> = new Object();
        data.name = layer.name;
        data.typename = layer.typename;
        data.bounds = (this.isParentCTA(layer)) ? layer.parent.bounds : layer.bounds;
        data.boundsNoEffects = layer.boundsNoEffects;
        data.layers = layer.layers?.length ? this.getLayersData(layer.layers) : [];

        if (layer.textItem) {
            data.textData = this.getTexyLayerData(layer);
        }

        return data;
    }

    static getTexyLayerData(layer: Layer): any {
        let textData: any = new Object();
        textData.contents = removeSpecialCharacters(layer.textItem.contents);
        textData.color = {
            // hex: layer.textItem.characterStyle.color.,
            rgb: layer.textItem.characterStyle.color.rgb,
            cmyk: layer.textItem.characterStyle.color.cmyk,
        }
        textData.font = layer.textItem.characterStyle.font;
        textData.size = layer.textItem.characterStyle.size;
        textData.parentBounds = layer.parent.bounds;
        return textData;
    }
}
