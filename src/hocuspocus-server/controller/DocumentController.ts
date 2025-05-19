import { Server } from "@hocuspocus/server";
import { DocumentService } from "../service/DocumentService";

export class DocumentController {
    private server: Server;
    private documentService: DocumentService;

    constructor() {
        this.documentService = new DocumentService();
        this.server = new Server({
            port: 1234,
            onConnect: this.documentService.onConnect.bind(
                this.documentService
            ),
            onDisconnect: this.documentService.onDisconnect.bind(
                this.documentService
            ),
            onLoadDocument: this.documentService.onLoadDocument.bind(
                this.documentService
            ),
        });
    }

    start() {
        this.server.listen();
        console.log("Hocuspocus server is running on port 1234");
    }
}
