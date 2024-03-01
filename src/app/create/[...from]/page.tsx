'use client'

import { Data, Session } from '@/utils/Interfaces'
import { createBlog, createEvent } from '@/utils/constant'
import { styles } from '@/utils/styles'
import { notFound, useParams, useRouter } from 'next/navigation'
import { Box, Container, Typography } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { AddAPhotoRounded, } from '@mui/icons-material'
import dynamic from 'next/dynamic'
import { AppDispatch } from '@/store/store'
import { useDispatch } from 'react-redux'


const Loading = dynamic(() => import('@/Components/Loading'))
const DropDown = dynamic(() => import('@/Components/DropDown'))
const ReadmeField = dynamic(() => import('@/Components/ReadmeField'))
const Image = dynamic(() => import('next/image'))

const modes = ['offline', 'online', 'hybrid']
const labels = ['Default', 'Featured', 'UpComming']

const page = () => {
    const pageRef = useRef(false)
    const { from } = useParams()
    const dispatch = useDispatch<AppDispatch>()
    const [data, setData] = React.useState<Data>()
    const [isAdmin, setIsAdmin] = React.useState<boolean>(true)
    const [isloading, setIsloading] = React.useState<boolean>(true)
    const [beforeEdit, setBeforeEdit] = React.useState<Data>()
    const [isDisabled, setIsDisabled] = React.useState(false)
    const router = useRouter()
    const inputRef = React.useRef<HTMLDivElement>(null)
    useEffect(() => {
        const user = async () => {
            const { userInfo, Post } = await import('@/utils/FetchFromApi');
            const { currentSession } = await import('@/utils/Session');

            const session = await currentSession() as Session
            const currUser = await userInfo(session?.user.username);
            (session && ['user'].includes(currUser.role)) ? setIsAdmin(false) : setIsAdmin(true)
            if (from[1]) {
                const editData = await Post(from[0] as string, from[1] as string)
                setData(editData)
                setBeforeEdit(editData)
            }
            setIsloading(false)
            return (currUser.isAdmin) ? true : false;
        }
        (pageRef.current === false) && user()
        return () => {
            pageRef.current = true
        }
    }, [])

    if (isloading) return <Loading />
    if (!isAdmin) return notFound()
    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'image') {
            if (!e.target.files) return;
            const file: File | null = e?.target.files[0];
            const reader = new FileReader();
            reader.onload = async (event) => {
                if (event.target && event.target.result) {
                    const dataURL = event.target.result.toString();
                    const { storeImage } = await import('@/utils/FetchFromApi');
                    const imageUrl = await storeImage(dataURL, 'Thumbnails', data?.title as string) as string
                    setData((prevData) => ({
                        ...prevData,
                        image: imageUrl
                    }));
                }
            };
            console.log(reader.readAsDataURL(file))
            await reader.readAsDataURL(file);
        }
        setData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }

    if (from[1]) {

        // yha hmm ek kaam kr rhe hai jo hmare jo data ka mode hia uss ke hisab se yh sort kia hai 
        const ModesOfEvent = data?.mode as string;
        modes.sort((a, b) => {
            // Move the user's role to the front
            if (a === ModesOfEvent) {
                return -1;
            } else if (b === ModesOfEvent) {
                return 1;
            }

            // Use the default order for other roles
            return modes.indexOf(a) - modes.indexOf(b);
        });

        // yha hmm yhi sorting for label ke lie bhi krnge 
        let LabelMode = data?.label as string;
        labels.sort((a, b) => {
            if (a === LabelMode) {
                return -1
            } else if (b === LabelMode) {
                return 1;
            }

            // Use the default order for other roles
            return labels.indexOf(a) - labels.indexOf(b);
        })
    }

    // handle submit to the api
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const { createNew, imagesInFolder, editPost, Post } = await import('@/utils/FetchFromApi');
            const { fetchBlogs, updateBlog } = await import('@/slices/blogsSlice');
            const { fetchEvents, updateEvent } = await import('@/slices/eventsSlice');

            if (from[1] && beforeEdit) {
                const changedValues = Object.entries(data as Data)
                    .filter(([key, value]) => value !== beforeEdit[key])
                    .reduce((obj, [key, value]) => {
                        obj[key] = value;
                        return obj;
                    }, {} as Data);
                await editPost(from[1] as string, changedValues, from[0]);
                const PostData = await Post(from[0], from[1]);
                (from[0] === 'blog') ? dispatch(updateBlog({ id: from[1], updatedEvent: PostData })) : dispatch(updateEvent({ id: from[1], updatedEvent: PostData }));
            } if (!from[1]) {
                await createNew(data as Data, from as string, setIsDisabled);
                (from[0] === 'blog') ? dispatch(fetchBlogs) : dispatch(fetchEvents);
            }
            (data?.contentImages) && await imagesInFolder('content/', data?.contentImages as string[])
            router.push((from[0] === 'blog') ? '/blogs' : '/events')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <form
                onSubmit={handleSubmit}
            >

                <Container
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            flexWrap: 'wrap'
                        }}
                    >

                        {
                            ((from[0] === 'blog') ? createBlog : createEvent).map((item, index) => (
                                (['mode', 'label'].includes(item.name)) ? <DropDown
                                    onChange={setData}
                                    name={item.name}
                                    key={index}
                                    style={styles}
                                    // yha pr abhi hmm dekh the hai ki dropdown kiske lie hai mode ke lie or label ke lie 
                                    // ab hmm mode me ek or condition check krnge jisme hmm agr edit kr rhe hai data ko toh uss data ke hisab se woh mode front me ho
                                    // or baki sab baad me ho 
                                    values={(item.name === 'mode') ? modes : labels}
                                /> : (item.name === 'image') ?
                                    <Box
                                        key={index}
                                    >
                                        <input
                                            ref={inputRef as React.RefObject<HTMLInputElement>}
                                            type='file'
                                            style={{ display: 'none' }}
                                            onChange={handleChange}
                                            // accept="image/*"
                                            name={item.name}
                                        />
                                        <Box
                                            onClick={() => { inputRef.current && inputRef.current?.click() }}
                                            sx={styles.customInput('', {
                                                display: 'flex',
                                                gap: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                cursor: 'pointer'
                                            }, 1)}
                                        >
                                            {
                                                (data?.image) ? <>
                                                    <Image
                                                        src={data?.image as string}
                                                        alt='img'
                                                        width={50}
                                                        height={50}
                                                        style={{
                                                            flex: 1
                                                        }}
                                                    />
                                                </> : <>
                                                    <AddAPhotoRounded
                                                        sx={{
                                                            opacity: .6
                                                        }}
                                                    />
                                                    <Typography
                                                        sx={{
                                                            opacity: .6
                                                        }}
                                                    >Add Thumbnail</Typography></>
                                            }
                                        </Box>
                                    </Box> : <input
                                        type={item?.type}
                                        style={styles.customInput(item.size)}
                                        key={index}
                                        value={data && data[item.name] as string}
                                        name={item.name}
                                        placeholder={item.placeholder}
                                        required={item.required}
                                        onChange={handleChange}
                                    />
                            ))
                        }

                    </Box>

                    <ReadmeField
                        Daata={data as Data}
                        setdata={setData}
                        propsData={data as Data}
                        isDisabled={isDisabled}
                    />
                </Container>
            </form>
        </>
    )
}

export default page