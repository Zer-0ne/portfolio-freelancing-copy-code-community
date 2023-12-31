import { signIn, } from "next-auth/react";
import { BlogsInterface, Data, EventsInterface, Session } from "./Interfaces";
import { currentSession } from "./Session";
import { deleteObject, getDownloadURL, listAll, ref, uploadString } from "firebase/storage";
import { storage } from "./Firebase";
import { toast } from "react-toastify";
import { update } from "./ToastConfig";

// create user 
export const createUser = async (data: Data) => {
    try {
        const os = await import('os')
        const hostname = os.hostname();
        const response = await fetch(`${process.env.BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.ok) {
            return await response.json()
        }
        return false
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

// get all the posts
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
// get all the posts
export const allUser = async (route: string) => {
    try {
        const response = await fetch(`/api/${route}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.log(error)
    }
}
// get a post
export const Post = async (route: string, id: string) => {
    try {
        const response = await fetch(`/api/${route}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        if (response.ok) {
            if (route === 'blog') {
                const { blog } = await response.json()
                return blog;
            }
            const { event } = await response.json();
            return event
        }
    } catch (error) {
        console.log(error)
    }
}

// getting the user info
export const userInfo = async (id: string, method: string = 'GET') => {
    try {
        // await new Promise((resolve: TimerHandler) => setTimeout(resolve, 3000))
        // check the session
        if (method === "DELETE") {

            const session = await currentSession() as Session;
            if (!session) return 'Please Login!'

            if (session?.user?.username === id) return 'Cant do this action!'
        }

        const res = await fetch(`/api/user/${id}`, {
            method: `${method}`,
        })
        if (res.ok) {
            return await res.json()
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
            // Check if the download URL is present in the imageLinks array
            if (!imageLinks.includes(downloadURL)) {
                // Delete the image if it's not in the imageLinks array
                await deleteObject(imageRef);
            }
        }));
    } catch (error) {
        console.error('Error deleting images:', error);
    }
}

// create a new post
export const createNew = async (data: Data, route: string, setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>) => {
    const Toast = toast.loading('Please wait')
    try {


        // check the session
        const session = await currentSession() as Session;
        if (!session) return toast.update(Toast, update('Please Login!', 'error'))

        // check the user is admin or not 
        const user = await userInfo(session?.user?.username)
        if (user.isAdmin === false) return toast.update(Toast, update('Your are not Authorized!', 'error'))


        setIsDisabled(true)
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
            setIsDisabled(false)
            return toast.update(Toast, update('Posted!', 'success'))
        }
        setIsDisabled(false)
        return toast.update(Toast, update('Something went wrong!', 'error'))
    } catch (error) {
        setIsDisabled(false)
        console.log('error')
        return toast.update(Toast, update('Something went wrong!', 'error'))
    }
}

export const createNewContact = async (data: Data, setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>) => {
    const Toast = toast.loading('Please wait')
    try {
        setIsDisabled(true)
        // check the session
        const session = await currentSession() as Session;
        if (!session) { setIsDisabled(false); return toast.update(Toast, update('Please Login!', 'error')) }

        const response = await fetch(`/api/contact/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...data
            })
        })
        if (response.ok) {
            console.log('success')
            setIsDisabled(false)
            return toast.update(Toast, update('Posted!', 'success'))
        }
        setIsDisabled(false)
        return toast.update(Toast, update('Something went wrong!', 'error'))
    } catch (error) {
        setIsDisabled(false)
        console.log(error)
        return toast.update(Toast, update('Something went wrong!', 'error'))
    }
}

// delete the post
export const deletePost = async (id: string, route: string, item: BlogsInterface | EventsInterface) => {
    const Toast = toast.loading('Please wait')
    try {
        // check the session
        const session = await currentSession() as Session;
        if (!session) return toast.update(Toast, update('Please Login!', 'error'))

        // check the user is admin or not 
        const user = await userInfo(session?.user?.username)
        if (user.isAdmin === false) return toast.update(Toast, update('Your are not Authorized!', 'error'))

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
            return toast.update(Toast, update('Deleted!', 'success'));
        }
        return toast.update(Toast, update('Something went wrong!', 'error'))
    } catch (error) {
        console.log(error)
        return toast.update(Toast, update('Something Went Wrong!', 'error'))

    }
}

// edit the post
export const editPost = async (id: string, data: Data, route: string) => {
    const Toast = toast.loading('Please wait')
    try {
        // check the session
        const session = await currentSession() as Session;
        if (!session) return toast.update(Toast, update('Please Login!', 'error'))

        // check the user is admin or not 
        const user = await userInfo(session?.user?.username)
        if (user.isAdmin === false) return toast.update(Toast, update('Your are not Authorized!', 'error'))

        const res = await fetch(`/api/${route}/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ ...data }),
        });
        if (res.ok) {
            return toast.update(Toast, update('Edited!', 'success'));
        }
        return toast.update(Toast, update('Something went wrong!', 'error'))
    } catch (error) {
        console.log(error)
        return toast.update(Toast, update('Something Went Wrong!', 'error'));
    }
}

// add a new comments
export const addComment = async (blogId: string, comment: Data, route: string) => {
    const Toast = toast.loading("Adding...")
    try {
        // check the session
        const session = await currentSession() as Session;
        if (!session) return toast.update(Toast, update('Please Login!', 'error'))

        const response = await fetch(`/api/comment/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                blogId,
                ...comment,
                authorId: session.user.id
            }),
        })
        const data = await response.json();
        return toast.update(Toast, update(data.message, 'success'))
    } catch (err) {
        console.log(err)
    }
}