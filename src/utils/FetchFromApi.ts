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
export const allPost = async (route: string,) => {
    try {
        const response = await fetch(`/api/${route}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        if (response.ok) {
            const data = await response.json()
            return data
        }
    } catch (error) {
        console.log(error)
    }
}

// fetch members from github
export const fetchFromGithub = async (repo: string = 'team%20members') => {
    try {
        const response = await fetch(`https://raw.githubusercontent.com/copycodecommunity/portfolio/main/${repo}`)
        const data = await response.json()
        return data
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
            const data = await response.json()
            return data
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
        if (route !== 'comment') {
            if (['user'].includes(user.role)) return toast.update(Toast, update('Your are not Authorized!', 'error'))
        }


        setIsDisabled(true)
        const response = await fetch(`/api/${route}/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...data,
                authorId: user._id
            })
        })
        const res = await response.json()
        if (response.ok) {
            setIsDisabled(false)
            return toast.update(Toast, update(res.message, res.status))
        }
        setIsDisabled(false)
        return toast.update(Toast, update(res.message, res.status))
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

        // check the user 
        const user = await userInfo(session?.user?.username)

        const response = await fetch(`/api/contact/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...data,
                email: user?.email
            })
        })
        const data_from_server = await response.json();
        if (response.ok) {
            setIsDisabled(false)
            return toast.update(Toast, update(data_from_server.message, data_from_server.status))
        }
        setIsDisabled(false)
        return toast.update(Toast, update(data_from_server.message || 'Please Enter Required field', data_from_server.status || 'error'))
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
        if (['user'].includes(user.role)) return toast.update(Toast, update('Your are not Authorized!', 'error'))

        if ((item as EventsInterface).image) {
            const storageRef = ref(storage, `/Thumbnails/${item.title}`);
            await deleteObject(storageRef);
        }

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
        const data_from_server = await res.json();
        if (res.ok) {
            return toast.update(Toast, update(data_from_server.message, data_from_server.status));
        }
        return toast.update(Toast, update(data_from_server.message, data_from_server.status));
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
        if (['user'].includes(user.role)) return toast.update(Toast, update('Your are not Authorized!', 'error'))

        const res = await fetch(`/api/${route}/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ ...data }),
        });
        const data_from_server = await res.json();
        if (res.ok) {
            return toast.update(Toast, update(data_from_server.message, data_from_server.status));
        }
        return toast.update(Toast, update(data_from_server.message, data_from_server.status));
    } catch (error) {
        console.log(error)
        return toast.update(Toast, update('Something Went Wrong!', 'error'));
    }
}


export const deleteComment = async (id: string, authorId: string) => {
    const Toast = toast.loading('Please wait')
    try {
        const session = await currentSession() as Session;
        if (!session) return toast.update(Toast, update('Please Login!', 'error'))

        // check the user is admin or not 
        const user = await userInfo(session?.user?.username)
        if (user._id !== authorId && user.isAdmin === false) return toast.update(Toast, update('Your are not Authorized!', 'error'))

        const response = await fetch(`/api/comment/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                authorId
            })
        })
        if (response.ok) {
            const data = await response.json()
            return toast.update(Toast, update(data.message, 'success'))
        }
    } catch (error) {
        console.log(error)
    }
}

// fetch the list of the material from the github api 
export const getMaterialsFromGithub = async (url: string = "https://api.github.com/repos/copycodecommunity/portfolio/git/trees/7ad4458a17316da147b1c917578822cf4dea864a", listData: boolean = false): Promise<string | undefined> => {
    try {
        console.log(process.env.GITHUB_KEY)
        const response = await fetch(`${url}`, {
            method: 'GET',
            headers: {
                // 'Authorization': `${'Bearer' + process.env.GITHUB_KEY as string}`
            }
        })
        const { tree, content } = await response.json()
        if (response.ok) {
            if (tree && tree.length > 0 && !listData && !content) {
                return await getMaterialsFromGithub(tree && tree[0]?.url)
            } else {
                return content
            }
        }
    } catch (error) {
        console.log(error)
    }
}
// fetch the list of the material from the github api 
export const getSpecificMaterialGithub = async (_id: string = '7ad4458a17316da147b1c917578822cf4dea864a', url: string = "https://api.github.com/repos/copycodecommunity/portfolio/git/trees") => {
    try {
        const response = await fetch(`${url}/${_id}`)
        const { tree } = await response.json()
        if (response.ok) {
            return tree
        }
    } catch (error) {
        console.log(error)
    }
}
// fetch the list of the material from the github api 
export const getSpecificContentGithub = async (url: string) => {
    try {
        const response = await fetch(`${url}`, {
            method: 'GET',
            headers: {
                // 'Authorization': `${process.env.GITHUB_KEY as string}`
            }
        })
        const data = await response.json()
        if (response.ok) {
            return data
        }
    } catch (error) {
        console.log(error)
    }
}