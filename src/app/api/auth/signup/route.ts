import Users from "@/Models/Users";
import connect from "@/utils/database";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import { storage } from "@/utils/Firebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

export const POST = async (request: NextRequest) => {
    try {
        await connect()
        const {
            name,
            username,
            email,
            password,
            isAdmin,
            profile,
        } = await request.json()
        const existingUser = await Users.findOne({ username })
        if (existingUser) return NextResponse.json({ message: 'User Already exists' })

        // encrypt the password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // save the profile image firbase storage
        const storageRef = ref(storage, `profiles/${username}`)
        const snapshot = await uploadString(storageRef, profile, 'data_url')
        const imageUrl = await getDownloadURL(snapshot.ref)

        const user = new Users({
            username,
            name,
            password: hashPassword,
            email,
            profile: imageUrl
        })
        await user.save()
        return NextResponse.json({ message: 'User Created!' })
    } catch (error: {
        message: string
    } | any) {
        console.log(error)
        return NextResponse.json({ message: error.message })
    }
}