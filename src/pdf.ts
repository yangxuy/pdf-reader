import * as pdfjsLib from "pdfjs-dist";

import "pdfjs-dist/legacy/build/pdf.worker.entry.js";

import {
    PDFDocumentProxy,
    PDFPageProxy,
} from "pdfjs-dist/types/src/display/api";

const global: any = window;

export class PdfController {
    private pdfBuffer?: ArrayBuffer;
    public pdfBlob?: Blob;
    private pdf?: PDFDocumentProxy;
    private url?: string;
    private pages?: PDFPageProxy[];
    private preFrame?: number;

    constructor(
        private wrapper: HTMLElement,
        private onError: (e: any) => void,
        private onSuccess: (pdf: PDFDocumentProxy) => void
    ) {
        pdfjsLib.GlobalWorkerOptions.workerSrc = global.pdfjsWorker;
    }

    async init(url: string) {
        this.url = url;
        await this.fetchData();
    }

    async fetchData() {
        try {
            const res = await fetch(this.url!);
            this.pdfBlob = await res.blob();
            this.pdfBuffer = await this.pdfBlob?.arrayBuffer();
            this.fetchPdf();
        } catch (e) {
            this.onError(e);
        }
    }

    async fetchPdf() {
        const pdfDocConfig: Record<string, any> = {
            cMapPacked: true,
            rangeChunkSize: 65536,
            pdfBug: false,
            useSystemFonts: true,
            data: this.pdfBuffer,
        };

        pdfjsLib
            .getDocument(pdfDocConfig)
            .promise.then(async (pdf) => {
                this.pdf = pdf;
                this.onSuccess(pdf);
                await this.initPages();
            })
            .catch((e) => {
                this.onError(e);
            });
    }

    async initPages() {
        const numbers = this.pdf!.numPages;

        const promises = [...Array(numbers)].map((_, index) => {
            return this.pdf?.getPage(index + 1);
        });

        await Promise.all(promises)
            .then((pages: any[]) => {
                this.pages = pages;
                this.renderPdf();
            })
            .catch((err) => {
                this.onError(err);
            });
    }

    async schedular(frameId?: number) {
        if (this.preFrame === undefined) {
            this.preFrame = frameId;
            await this.renderPdf();
        } else {
            this.preFrame = frameId;
        }
    }

    async renderPdf(num = 0) {
        while (this.pdf && this.pages && num < this.pdf.numPages) {
            console.log(this.pages);
            const page = this.pages[num];

            let viewport = page.getViewport({ scale: 1 });

            const size = this.wrapper.getBoundingClientRect();
            const rate = size.width / viewport.width;

            let canvas = document.createElement("canvas");
            let context = canvas.getContext("2d");

            canvas.width = Math.floor(viewport.width * rate);
            canvas.height = Math.floor(viewport.height * rate);

            let renderContext = {
                transform: [rate, 0, 0, rate, 0, 0],
                canvasContext: context!,
                viewport: viewport,
            };

            await page.render(renderContext).promise;

            if (num === 0) {
                this.clear();
            }

            this.wrapper.appendChild(canvas);

            num++;
        }
        this.preFrame = undefined;
    }

    clear() {
        this.wrapper.innerHTML = "";
    }
}
