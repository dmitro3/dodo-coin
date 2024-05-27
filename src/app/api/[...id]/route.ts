import {NextFetchEvent, NextRequest} from "next/server";
import {CustomApiHandler} from "@/app/api/[...id]/custom";
import {uploadFile} from "@/utils/api";


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


const images: any[] = [];
const uploadImage = async () => {
    let urls: string[] = await Promise.all(
         images.map(async (img) => {
             return await uploadFile(img, `/images/${img?.name}.$EX`)
         })
    )

    return urls
}

const uploadImage = async () => {
    let urls: string[] = []
    images.map( (img) => {
        let path = await uploadFile(img, `/images/${img?.name}.$EX`)

        urls = [...urls, path]
    })


    return urls

}
