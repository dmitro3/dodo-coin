import {NextFetchEvent, NextRequest} from "next/server";
import {CustomApiHandler} from "@/app/api/[...id]/custom";


export async function POST(request: NextRequest, fetch: NextFetchEvent) {
    return await CustomApiHandler(request, fetch)
}

export async function GET(request: NextRequest, fetch: NextFetchEvent) {
    return await CustomApiHandler(request, fetch)
}

export async function PUT(request: NextRequest, fetch: NextFetchEvent) {
    return await CustomApiHandler(request, fetch)
}

export async function DELETE(request: NextRequest, fetch: NextFetchEvent) {
    return await CustomApiHandler(request, fetch)
}

export async function OPTIONS(request: NextRequest, fetch: NextFetchEvent) {
    return await CustomApiHandler(request, fetch)
}

export async function PATCH(request: NextRequest, fetch: NextFetchEvent) {
    return await CustomApiHandler(request, fetch)
}
