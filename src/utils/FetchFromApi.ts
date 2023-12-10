// 'use server'
import { signIn } from "next-auth/react";
import { Data } from "./Interfaces";

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