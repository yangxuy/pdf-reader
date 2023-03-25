import "pdfjs-dist/legacy/build/pdf.worker.entry.js";
import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
export declare class PdfController {
    private wrapper;
    private onError;
    private onSuccess;
    private pdfBuffer?;
    private pdf?;
    private url?;
    private pages?;
    private preFrame?;
    constructor(wrapper: HTMLElement, onError: (e: any) => void, onSuccess: (pdf: PDFDocumentProxy) => void);
    init(url: string): Promise<void>;
    fetchData(): Promise<void>;
    fetchPdf(): Promise<void>;
    initPages(): Promise<void>;
    schedular(frameId?: number): Promise<void>;
    renderPdf(num?: number): Promise<void>;
    clear(): void;
}
