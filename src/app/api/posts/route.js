import { NextResponse } from "next/server";

export async function GET(req) {
    const rawResponse = await fetch('https://jsonplaceholder.typicode.com/posts')
    const posts = await rawResponse.json()
    // conecting to prisma db and fetching the post from there
    return NextResponse.json(posts)
}