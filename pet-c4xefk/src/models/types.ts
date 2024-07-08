import { Document } from "photoshop/dom/Document";
import { Layer } from "photoshop/dom/Layer";

type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
};

 
export type LayerData = Partial<Mutable<Omit<Layer, 'layers'>>> & {
    layers: Partial<LayerData>[]
    textData?: any 
}

export type DocumentData = {
    artboards: Partial<LayerData>[]
    layers: Partial<LayerData>[]
} & Partial<Mutable<Omit<Document, 'layers' | 'artboards'>>>

export const enum LayerNames {
    CTA = 'cta',
}