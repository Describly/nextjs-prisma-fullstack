import { get_full_api_path } from "@/utils/api";
import { notFound, redirect } from "next/navigation";
import {headers} from "next/headers"

async function fetchPostDetail(postId) {
    const rawResponse = await fetch(get_full_api_path("/api/posts/"+postId), {
        cache: "no-store",
        headers: headers()
    })
    return await rawResponse.json()
}

export default async function PostDetailPage({params}) {

    const postId = params?.postId ?? null;
    if(!postId) {
        notFound()
    }
    const post = await fetchPostDetail(postId)
    return (
        <>
        <div key={postId} className={"pt-5"}>
                <div>
                    <h1 className={"h4"}>{post?.title?.replace(/\b\w/g, l => l.toUpperCase())}</h1>
                </div>
                <div>
                    <article>
                        <p>{post.body}</p>
                    </article>
                </div>
            </div>
        </>
    )
}