import { NextRequest, NextResponse } from "next/server";
import { DocumentService } from "@/hocuspocus-server/service/DocumentService";

const documentService = new DocumentService();

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const documentName = searchParams.get("documentName");

    if (!documentName) {
        return NextResponse.json(
            { error: "Document name is required" },
            { status: 400 }
        );
    }

    try {
        const document = await documentService.onLoadDocument({
            documentName,
            document: new Uint8Array(),
            context: {},
            version: 0,
        });

        return NextResponse.json({ document });
    } catch (error) {
        console.error("Error loading document:", error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { documentName, content } = body;

        if (!documentName) {
            return NextResponse.json(
                { error: "Document name is required" },
                { status: 400 }
            );
        }

        // Process document creation or update
        // Extend your DocumentService as needed

        return NextResponse.json({ success: true, documentName });
    } catch (error) {
        console.error("Error processing document:", error);
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
