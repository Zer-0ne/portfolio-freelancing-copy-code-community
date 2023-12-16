'use server'
import { signIn, useSession } from "next-auth/react";
import { Data } from "./Interfaces";
import { getServerSession } from "next-auth";
import { AuthOptions } from "./AuthOptions";

// create user 
export const createUser = async (data: Data) => {
    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.ok) {
            console.log(response)
        }
        return
    } catch (error) {
        console.log(error)
    }
}

// login user
export const loginUser = async (data: Data) => {
    try {
        const {
            username,
            password
        } = data
        const signin = signIn('credentials', {
            redirect: false,
            username,
            password
        })
        if (!signin) return
        return signin
    }
    catch (error) {
        console.error(error)
    }
}

// current session
export const currentSession = async () => {
    // const { data: session, status } = useSession()
    const session = await getServerSession(AuthOptions)
    return session
}

// create a new blog
export const createNewBlog = async (data: Data) => {
    try {
        if (!currentSession()) return
        const {
            title,
            description,
            tag,
            content
        } = data
        const response = await fetch('http://localhost:3000/api/blog/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                tag,
                content,
                authorId: '64aaff7044c87ddfaf7b4fd0'
            })
        })
        if (response.ok) {
            console.log('success')
            return
        }
    } catch (error) {
        console.log(error)
    }
}