'use server'

import { getServerSession } from "next-auth"
import { AuthOptions } from "./AuthOptions"

// current session
export const currentSession = async () => {
    // const { data: session, status } = useSession()
    const session = await getServerSession(AuthOptions);
    console.log("session")
    if (!session) return false
    return session
}