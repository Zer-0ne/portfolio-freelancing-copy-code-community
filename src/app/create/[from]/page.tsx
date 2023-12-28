'use client'
import { ReadmeField } from '@/Components/ReadmeField'
import { Data, Session } from '@/utils/Interfaces'
import { createBlog, createEvent } from '@/utils/constant'
import { styles } from '@/utils/styles'
import { notFound, useParams, useRouter } from 'next/navigation'
import { Box, Container, Typography } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import { AddAPhotoRounded } from '@mui/icons-material'
import dynamic from 'next/dynamic'

const Loading = dynamic(() => import('@/Components/Loading'))
const DropDown = dynamic(() => import('@/Components/DropDown'))
const Image = dynamic(() => import('next/image'))


const page = async () => {
    const pageRef = useRef(false)
    const [data, setData] = React.useState<Data>()
    const [isAdmin, setIsAdmin] = React.useState<boolean>(true)
    const [isloading, setIsloading] = React.useState<boolean>(true)
    const [isDisabled, setIsDisabled] = React.useState(false)
    const { from } = useParams()
    const router = useRouter()
    const inputRef = React.useRef<HTMLDivElement>(null)
    useEffect(() => {
        const user = async () => {
            const { userInfo } = await import('@/utils/FetchFromApi');
            const { currentSession } = await import('@/utils/Session');

            const session = await currentSession() as Session
            const currUser = await userInfo(session?.user.username);
            (session && currUser.isAdmin === true) ? setIsAdmin(true) : setIsAdmin(false)
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


    // handle submit to the api
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const { createNew, imagesInFolder } = await import('@/utils/FetchFromApi');

            (data?.contentImages) && await imagesInFolder('content/', data?.contentImages as string[])
            await createNew(data as Data, from as string, setIsDisabled)
            router.push((from === 'blog') ? '/blogs' : '/events')
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
                            ((from === 'blog') ? createBlog : createEvent).map((item, index) => (
                                (item.name === 'mode') ? <DropDown
                                    onChange={setData}
                                    name={item.name}
                                    key={index}
                                    style={styles}
                                    values={['offline', 'online', 'hybrid']}
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
                                        name={item.name}
                                        placeholder={item.placeholder}
                                        required={item.required}
                                        onChange={handleChange}
                                    />
                            ))
                        }

                    </Box>

                    <ReadmeField
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