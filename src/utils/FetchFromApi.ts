
import { signIn, useSession } from "next-auth/react";
import { Data, Session } from "./Interfaces";
import { currentSession } from "./Session";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "./Firebase";

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

// login to existing account
export const LoginUser = async (data: Data) => {
    try {
        const {
            username,
            password
        } = data
        const signin = await signIn('credentials', {
            redirect: false,
            username,
            password
        })
        return signin
    } catch (error) {
        console.log(error)
    }
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

// getting the user info
export const userInfo = async (id: string) => {
    try {
        const user = await fetch(`http://localhost:3000/api/user/${id}`, {
            method: 'GET'
        })
        if (user.ok) {
            return await user.json()
        }
    } catch (error) {
        console.log(error)
    }
}

// image save to firestore
export const storeImage = async (image: string, folder: string, fileName: string = new Date().getTime().toString()) => {
    const storageRef = ref(storage, `${folder}/${fileName}`);
    const snapshot = await uploadString(storageRef, image, 'data_url')
    return await getDownloadURL(snapshot.ref);
}

// create a new blog
export const createNewBlog = async (data: Data) => {
    try {
        // check the session
        const session = await currentSession() as Session;
        if (!session) return 'Please login'

        // check the user is admin or not 
        const user = await userInfo(session?.user?.id)
        if (user.isAdmin === false) return 'Your are not Authorized!'
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

// delete the blog
export const deleteBlog = async (id: string) => {
    try {
        // check the session
        const session = await currentSession() as Session;
        if (!session) return 'Please login'

        // check the user is admin or not 
        const user = await userInfo(session?.user?.id)
        if (user.isAdmin === false) return 'Your are not Authorized!'
        const res = await fetch(`http://localhost:3000/api/blog/${id}`, { method: 'DELETE' });
        if (res.ok) {
            return 'Deleted!';
        }
    } catch (error) {
        console.log(error)
    }
}

// edit the event
export const editBlog = async (id: string, data: Data) => {
    try {
        // check the session
        const session = await currentSession() as Session;
        if (!session) return 'Please login'

        // check the user is admin or not 
        const user = await userInfo(session?.user?.id)
        if (user.isAdmin === false) return 'Your are not Authorized!'

        const res = await fetch(`http://localhost:3000/api/event${id}`, {
            method: 'PUT',
            body: JSON.stringify({ ...data }),
        });
        if (res.ok) {
            return 'Edited!'
        }
    } catch (error) {
        console.log(error)
    }
}

// get all the event
export const allEvent = async () => {
    try {
        const response = await fetch('/api/event/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        if (response.ok) {
            const { event } = await response.json();
            return event
        }
    } catch (error) {
        console.log(error)
    }
}


// create a new event
export const createNewEvent = async (data: Data) => {
    try {
        // check the session
        const session = await currentSession() as Session;
        if (!session) return 'Please login'

        // check the user is admin or not 
        const user = await userInfo(session?.user?.id)
        if (user.isAdmin === false) return 'Your are not Authorized!'

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

// delete the event
export const deleteEvent = async (id: string) => {
    try {
        // check the session
        const session = await currentSession() as Session;
        if (!session) return 'Please login'

        // check the user is admin or not 
        const user = await userInfo(session?.user?.id)
        if (user.isAdmin === false) return 'Your are not Authorized!'
        const res = await fetch(`http://localhost:3000/api/event/${id}`, { method: 'DELETE' });
        if (res.ok) {
            return 'Deleted!';
        }
    } catch (error) {
        console.log(error)
    }
}

// edit the event
export const editEvent = async (id: string, data: Data) => {
    try {
        // check the session
        const session = await currentSession() as Session;
        if (!session) return 'Please login'

        // check the user is admin or not 
        const user = await userInfo(session?.user?.id)
        if (user.isAdmin === false) return 'Your are not Authorized!'

        const res = await fetch(`http://localhost:3000/api/event${id}`, {
            method: 'PUT',
            body: JSON.stringify({ ...data }),
        });
        if (res.ok) {
            return 'Edited!'
        }
    } catch (error) {
        console.log(error)
    }
}