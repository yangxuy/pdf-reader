import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";

import { PdfController } from "./pdf";

class PdfView extends HTMLElement {
    public controller?: PdfController;
    private wrapper: HTMLElement;
    private frameId?: number;

    constructor() {
        super();

        const shadow = this.attachShadow({ mode: "open" });

        this.wrapper = document.createElement("div");

        shadow.appendChild(this.wrapper);

        this.controller = new PdfController(
            this.wrapper,
            (e) => this.onError(e),
            (pdf) => this.onSuccess(pdf)
        );

        window.addEventListener("resize", this.sizeObserver.bind(this));
    }

    sizeObserver() {
        this.frameId && window.cancelAnimationFrame(this.frameId);
        this.frameId = window.requestAnimationFrame(async () => {
            await this.controller?.schedular(this.frameId);
        });
    }

    onError(e: any) {
        this.dispatchEvent(new CustomEvent("onError", { detail: e }));
    }

    onSuccess(pdf: PDFDocumentProxy) {
        this.dispatchEvent(new CustomEvent("onSuccess", { detail: pdf }));
    }

    connectedCallback() {
        const style = this.getAttribute("style") ?? "";
        this.wrapper.setAttribute("style", style);
    }

    disconnectedCallback() {
        window.removeEventListener("resize", this.sizeObserver);
        this.frameId && window.cancelAnimationFrame(this.frameId);
    }

    static get observedAttributes() {
        return ["url"];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        this.controller?.init(newValue);
    }

    downLoad() {
        if (this.controller?.pdfBlob) {
            const a = document.createElement("a");
            const url = window.URL.createObjectURL(this.controller?.pdfBlob);
            a.href = url;

            a.download =
                this.getAttribute("fileName") ?? "请设置标签的fileName";
            a.click();
            window.URL.revokeObjectURL(url);
        }
    }
}

customElements.define("pdf-view", PdfView);
