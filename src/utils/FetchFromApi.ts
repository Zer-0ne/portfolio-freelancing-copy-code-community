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



// current session
export const currentSession = async () => {
    // const { data: session, status } = useSession()
    const session = await getServerSession(AuthOptions)
    return session
}

// get all the blog
export const allBlog = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/blog/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        if (response.ok) {
            const { blog } = await response.json();
            return blog
        }
    } catch (error) {
        console.log(error)
    }
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

// create a new blog
export const createNewEvent = async (data: Data) => {
    try {
        const session = await currentSession()
        // console.log(session)
        if (!session) return
        const {
            title,
            description,
            tag,
            content,
            mode,
            participants,
            status,
            image,
            label
        } = data
        const response = await fetch('http://localhost:3000/api/event/', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                tag,
                content,
                mode,
                participants,
                status,
                image,
                label,
                authorId: '64aaff7044c87ddfaf7b4fd0'
            })
        })
        if (response.ok) {
            console.log('success')
            return
        }
        console.log(response)
    } catch (error) {
        console.log(error)
    }
}