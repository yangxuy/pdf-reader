import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";

import { PdfController } from "./pdf";

class PdfView extends HTMLElement {
    private controller?: PdfController;
    private wrapper: HTMLElement;
    private observer: ResizeObserver;
    private frameId?: number;

    constructor() {
        super();

        const shadow = this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");

        shadow.appendChild(this.wrapper);

        this.controller = new PdfController(
            this.wrapper,
            this.onError,
            this.onSuccess
        );

        this.observer = new ResizeObserver((entries) => {
            for (let entry of entries) {
                if (entry.contentBoxSize) {
                    this.frameId && window.cancelAnimationFrame(this.frameId);
                    this.frameId = window.requestAnimationFrame(async () => {
                        await this.controller!.schedular(this.frameId);
                    });
                }
            }
        });

        this.observer.observe(this.wrapper);
    }

    onError(e: any) {
        console.log(e);
    }

    onSuccess(pdf: PDFDocumentProxy) {}

    connectedCallback() {
        const style = this.getAttribute("style") ?? "";
        this.wrapper.setAttribute("style", style);
    }

    disconnectedCallback() {
        this.observer?.unobserve(this.wrapper);
        this.observer?.disconnect();
        this.frameId && window.cancelAnimationFrame(this.frameId);
    }

    static get observedAttributes() {
        return ["url"];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        this.controller?.init(newValue);
    }
}

customElements.define("pdf-view", PdfView);
