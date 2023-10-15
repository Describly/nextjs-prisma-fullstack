import { isAuthenticated } from "@/utils/api";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function GET(req, {params}) {
    const token = await getToken({req})
    // console.log(token)
    // const isAuth = await isAuthenticated()
    // console.log(isAuth)
    if(!token) {
        return NextResponse.json({error: "Not Authorised"},  {status: 401})
    }
    const postId = params?.postId ?? null
    if(!postId) {
        return NextResponse.json({error: "Not found."},  {status: 404})
    }
    const rawResponse = await fetch('https://jsonplaceholder.typicode.com/posts/' + postId)
    const posts = await rawResponse.json()
    return NextResponse.json(posts)
}