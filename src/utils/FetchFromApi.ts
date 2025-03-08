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
        const response = await fetch(`${hostname}/api/auth/signup`, {
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
export const allPost = async (route: string, method: string = 'GET') => {
    try {
        const response = await fetch(`/api/${route}/`, {
            method,
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
        // console.log(data)
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
        // console.log(error)
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
        await Promise.all(result.items.map(async (imageRef: any) => {
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
export const createNew = async (data: Data, route: string, setIsDisabled?: React.Dispatch<React.SetStateAction<boolean>>) => {
    const Toast = toast.loading('Please wait')
    try {

        // check the session
        const session = await currentSession() as Session;
        if (!session) return toast.update(Toast, update('Please Login!', 'error'))

        // check the user is admin or not 
        const user = await userInfo(session?.user?.username)
        if (!['comment', 'form'].includes(route)) {
            if (['user'].includes(user.role)) return toast.update(Toast, update('Your are not Authorized!', 'error'))
        }


        // Convert file to Base64
        if (data.file) {
            const file = data.file as File;
            const base64File = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file); // Convert to Base64
            });

            data.file = { name: file.name, type: file.type, content: base64File }; // Include metadata
        }

        setIsDisabled && setIsDisabled(true)
        const response = await fetch(`/api/${route}`, {
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
            setIsDisabled && setIsDisabled(false)
            toast.update(Toast, update(res.message, res.status))
            return res
        }
        setIsDisabled && setIsDisabled(false)
        return toast.update(Toast, update(res.message ?? res.error, res.status))
    } catch (error) {
        setIsDisabled && setIsDisabled(false)
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
                email: user?.email,
                username: user?.username
            })
        })
        const data_from_server = await response.json();
        if (response.ok) {
            setIsDisabled(false)
            return toast.update(Toast, update(data_from_server.message ?? data_from_server.error, data_from_server.status))
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
export const deletePost = async (id: string, route: string, item?: BlogsInterface | EventsInterface) => {
    const Toast = toast.loading('Please wait')
    try {
        // check the session
        const session = await currentSession() as Session;
        if (!session) return toast.update(Toast, update('Please Login!', 'error'))

        // check the user is admin or not 
        const user = await userInfo(session?.user?.username)
        if (['user'].includes(user.role)) return toast.update(Toast, update('Your are not Authorized!', 'error'))

        if (item && (item as EventsInterface).image) {
            const storageRef = ref(storage, `/Thumbnails/${item?.title}`);
            await deleteObject(storageRef);
        }

        if (item && item?.contentImage.length) {

            const storageRef = ref(storage, `/content/${item?.title}`);
            const result = await listAll(storageRef);

            // Iterate through each item in the folder
            await Promise.all(result.items.map(async (imageRef: any) => {
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
            return toast.update(Toast, update(data_from_server.message ?? data_from_server.error, data_from_server.status));
        }
        return toast.update(Toast, update(data_from_server.message ?? data_from_server.error, data_from_server.status));
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
            return toast.update(Toast, update(data_from_server.message ?? data_from_server.error, data_from_server.status));
        }
        return toast.update(Toast, update(data_from_server.message ?? data_from_server.error, data_from_server.status));
    } catch (error) {
        console.log(error)
        return toast.update(Toast, update('Something Went Wrong!', 'error'));
    }
}


/**
 * 1. check the session user is authorized or not
 * 2. post request to the server with the data
 * @param data data is the object which contains fileId, role, emailAddress
 * @returns The toast message
 */
export const sharePermission = async (data: Data) => {
    const Toast = toast.loading('Please wait')
    try {
        const session = await currentSession() as Session;
        if (!session) return toast.update(Toast, update('Please Login!', 'error'))

        // check the user is admin or not 
        const user = await userInfo(session?.user?.username)
        if (['user'].includes(user.role)) return toast.update(Toast, update('Your are not Authorized!', 'error'))

        const response = await fetch('/api/drive/permissions', {
            method: 'POST',
            body: JSON.stringify(data)
        })
        const data_from_server = await response.json();
        if (response.ok) {
            return toast.update(Toast, update(data_from_server.message ?? data_from_server.error, data_from_server.status));
        }
        return toast.update(Toast, update(data_from_server.message ?? data_from_server.error, data_from_server.status));
    } catch (error) {
        console.log(error)
        return toast.update(Toast, update('Something Went Wrong!', 'error'));
    }
}

export const getData = async (route: string, data?: Data) => {
    try {
        const session = await currentSession() as Session;

        // check the user is admin or not 
        const user = await userInfo(session?.user?.username)
        if (['user'].includes(user?.role)) return;

        const response = await fetch(route, {
            method: 'POST',
            body: JSON.stringify(data)
        })
        const data_from_server = await response.json();
        return data_from_server.data
    } catch (error) {
        console.log(error)
        return;
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


/**
 * 1. check the user has authority or not
 * 2. requesting for download the sheet
 * 3. if the response is ok then the downloading process is excuted
 * 4. then show an error to the user
 * @param spreadsheetId id of the google sheets
 * @param title title of the form
 */
export const downloadSheet = async (spreadsheetId: string, title: string) => {
    const Toast = toast.loading('Please wait')
    try {
        const session = await currentSession() as Session;
        if (!session) return toast.update(Toast, update('Please Login!', 'error'))

        // check the user is admin or not 
        const user = await userInfo(session?.user?.username)
        if (['user'].includes(user.role)) return toast.update(Toast, update('Your are not Authorized!', 'error'))
        const response = await fetch(`/api/sheet/${spreadsheetId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        // const data = await response.json()
        // console.log(data.data)
        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            // console.log(url)
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title ?? 'spreadsheet'}.xlsx`; // Set the default file name
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url); // Clean up the URL object
            return toast.update(Toast, update('Downloading', 'success'))
        } else {
            const data = await response.json();
            console.error(data.error);
            return toast.update(Toast, update('Something went wrong!', 'error'))
        }
    } catch (error) {
        console.error('Error downloading sheet:', error);
        return toast.update(Toast, update('Something went wrong!', 'error'))
    }
}

// fetch the list of the material from the github api 
export interface Node {
    path: string;
    type: 'file' | 'tree';
    sha?: string; // Add SHA for both files and folders
    url: string

}
export interface TreeNode extends Node {
    children?: TreeNode[];
}

// Function to get the latest commit SHA for the default branch
export const getLatestSha = async (owner: string, repo: string): Promise<string | undefined> => {
    try {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs/heads/main`); // Assuming 'main' is the default branch
        if (!response.ok) {
            throw new Error(`Error fetching latest SHA: ${response.statusText}`);
        }
        const data = await response.json();
        return data.object.sha; // Return the latest SHA
    } catch (error) {
        console.error(error);
    }
};

export const getMaterialsFromGithub = async (sha: string = "34b1e0cba19e85cf6c2e07c9e576f98dba6a6323"): Promise<TreeNode | undefined> => {
    try {
        const response = await fetch(`https://api.github.com/repos/copycodecommunity/portfolio/git/trees/${sha}`, {
            method: 'GET',
            headers: {
                // Uncomment the line below if you need to use the GitHub API key
                // 'Authorization': `Bearer ${process.env.GITHUB_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const { tree } = await response.json();

        // Create a tree structure
        const buildTree = async (nodes: any[]): Promise<TreeNode[]> => {
            const treeNodes: TreeNode[] = [];

            for (const node of nodes) {
                if (node.type === 'tree') {
                    // If it's a folder, fetch its contents recursively
                    const children = await getMaterialsFromGithub(node.sha);
                    treeNodes.push({
                        path: node.path,
                        type: 'tree',
                        sha: node.sha, // Include SHA for the folder
                        url: node.url, // Include url for the folder
                        children: children ? children.children : []
                    });
                } else if (node.type === 'blob') {
                    // If it's a file, fetch its content
                    // const content = await getSpecificContentGithub(node.url);
                    treeNodes.push({
                        path: node.path,
                        type: 'file',
                        sha: node.sha, // Include SHA for the file
                        url: node.url, // Include url for the file
                        // content: content // Include content for the file
                    });
                }
            }

            return treeNodes;
        };

        const treeStructure = await buildTree(tree);
        return { path: '', url: tree.url, type: 'tree', children: treeStructure }; // Return the root node
    } catch (error) {
        console.error(error);
    }
};

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

export const getFileURLRecursively = async (url: string): Promise<string> => {
    try {
        // console.log(process.env.GITHUB_KEY);
        const response = await fetch(`${url}`, {
            method: 'GET',
            headers: {
                // Uncomment the line below if you need to use the GitHub API key
                // 'Authorization': `Bearer ${process.env.GITHUB_KEY}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }

        const { tree } = await response.json();

        // If tree is available, iterate through it
        if (tree && tree.length > 0) {
            for (const item of tree) {
                if (item.type === 'blob') {
                    // If the item is a file (blob), return its URL
                    return item.url; // Return the URL of the file
                } else if (item.type === 'tree') {
                    // If the item is a directory (tree), make a recursive call
                    const result = await getFileURLRecursively(item.url);
                    if (result) {
                        return result; // Return the URL found in the recursive call
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
    return ''; // Return undefined if no URL is found
};
