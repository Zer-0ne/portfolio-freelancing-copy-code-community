
import { signIn, useSession } from "next-auth/react";
import { BlogsInterface, Data, EventsInterface, Session } from "./Interfaces";
import { currentSession } from "./Session";
import { deleteObject, getDownloadURL, listAll, ref, uploadString } from "firebase/storage";
import { storage } from "./Firebase";

// create user 
export const createUser = async (data: Data) => {
    try {
        console.log(data)
        const response = await fetch('http://localhost:3000/api/auth/signup', {
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
export const allPost = async (route: string) => {
    try {
        const response = await fetch(`/api/${route}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        if (response.ok) {
            if (route === 'blog') {
                const { blog } = await response.json()
                return blog
            }
            const { event } = await response.json();
            return event
        }
    } catch (error) {
        console.log(error)
    }
}

// getting the user info
export const userInfo = async (id: string) => {
    try {
        // await new Promise((resolve: TimerHandler) => setTimeout(resolve, 3000))

        const user = await fetch(`/api/user/${id}`, {
            method: 'GET',
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

// delete image from the firestore
export const deleteImageFromFirestore = async (imageId: string) => {
    const storageRef = ref(storage, imageId);
    await deleteObject(storageRef);
}

// fetch all the image of any folder
export const imagesInFolder = async (folderName: string, imageLinks: string[]) => {
    const storageRef = ref(storage, folderName);
    try {
        const result = await listAll(storageRef);

        // Iterate through each item in the folder
        await Promise.all(result.items.map(async (imageRef) => {
            // Get the download URL for the image
            const downloadURL = await getDownloadURL(imageRef);
            console.log(downloadURL, imageLinks)
            // Check if the download URL is present in the imageLinks array
            if (!imageLinks.includes(downloadURL)) {
                // Delete the image if it's not in the imageLinks array
                await deleteObject(imageRef);
                console.log(`Deleted ${downloadURL}`);
            }
        }));
    } catch (error) {
        console.error('Error deleting images:', error);
    }
}

// create a new post
export const createNew = async (data: Data, route: string) => {
    try {
        // check the session
        const session = await currentSession() as Session;
        if (!session) return 'Please login'

        // check the user is admin or not 
        const user = await userInfo(session?.user?.username)
        if (user.isAdmin === false) return 'Your are not Authorized!'


        const response = await fetch(`/api/${route}/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...data,
                authorId: session.user.id
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

// delete the post
export const deletePost = async (id: string, route: string, item: BlogsInterface | EventsInterface) => {
    try {
        // check the session
        const session = await currentSession() as Session;
        if (!session) return 'Please login'

        // check the user is admin or not 
        const user = await userInfo(session?.user?.username)
        if (user.isAdmin === false) return 'Your are not Authorized!'

        if (item.contentImage.length) {

            const storageRef = ref(storage, `/content/${item.title}`);
            const result = await listAll(storageRef);

            // Iterate through each item in the folder
            await Promise.all(result.items.map(async (imageRef) => {
                // Get the download URL for the image
                const downloadURL = await getDownloadURL(imageRef);
                // Check if the download URL is present in the imageLinks array
                // Delete the image if it's not in the imageLinks array
                await deleteObject(imageRef);
                console.log(`Deleted ${downloadURL}`);

            }));
        }

        const res = await fetch(`/api/${route}/${id}`, { method: 'DELETE' });
        if (res.ok) {
            return 'Deleted!';
        }
    } catch (error) {
        console.log(error)
    }
}

// edit the post
export const editPost = async (id: string, data: Data, route: string) => {
    try {
        // check the session
        const session = await currentSession() as Session;
        if (!session) return 'Please login'

        // check the user is admin or not 
        const user = await userInfo(session?.user?.username)
        if (user.isAdmin === false) return 'Your are not Authorized!'

        const res = await fetch(`http://localhost:3000/api/${route}/${id}`, {
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

