import { handler } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"


export const get_full_api_path = (path) => {
    return process.env.NEXT_PUBLIC_API_URL + path
}

export const isAuthenticated = async () => {
    const session = await getServerSession(handler)
    return session?.user ?? false
}