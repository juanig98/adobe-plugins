import { Document } from "photoshop/dom/Document";
import { DocumentData } from "../models/types";
import { LayerService } from "./layer.service";

export class DocumentService {

    static getDocumentsData(documents: Document[]): Partial<DocumentData>[] {
        let data: Partial<DocumentData>[] = [];
        for (const document of documents) {
            data.push(this.getDocumentData(document));
        }
        console.table(data);
        return data;
    }

    static getDocumentData(document: Document): Partial<DocumentData> {
        let docData: Partial<DocumentData> = new Object();
        docData.name = document.name;
        docData.title = document.title;
        docData.typename = document.typename;
        docData.artboards = LayerService.getLayersData(document.artboards);
        docData.layers = LayerService.getLayersData(document.layers);
        return docData;
    }

} 