'use client'

import { Data, Session } from '@/utils/Interfaces'
import { Login, authMode, signup } from '@/utils/constant'
import { styles } from '@/utils/styles'
import { Avatar, Box, Button, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Loading = dynamic(() => import('@/Components/Loading'))


const page = () => {
    const [isLogin, setIsLogin] = React.useState(true);
    const [isAdmin, setIsAdmin] = React.useState<boolean>(true)
    const [isloading, setIsloading] = React.useState<boolean>(true)
    const [mode, setMode] = useState('login')
    const [data, setData] = useState<Data>({})
    const inputRef = React.useRef<HTMLDivElement>(null)

    useEffect(() => {
        const user = async () => {
            const { userInfo } = await import('@/utils/FetchFromApi')
            const { currentSession } = await import('@/utils/Session')
            const session = await currentSession() as Session
            const currUser = await userInfo(session?.user.username);
            (session && currUser.isAdmin === true) ? setIsAdmin(true) : setIsAdmin(false)
            setIsloading(false)
            return (currUser.isAdmin) ? true : false;
        }
        user()
    }, [])
    if (isloading) return <Loading />
    if (!isAdmin) return notFound()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'image') {
            if (!e.target.files) return;
            const file: File | null = e?.target.files[0];
            const reader = new FileReader();
            reader.onload = async (event) => {
                if (event.target && event.target.result) {
                    const dataURL = event.target.result.toString();
                    const { storeImage } = await import('@/utils/FetchFromApi');
                    const imageUrl = await storeImage(dataURL, 'profiles', data?.username as string)
                    setData((prevData) => ({
                        ...prevData,
                        image: imageUrl
                    }));
                }
            };
            console.log(reader.readAsDataURL(file))
            reader.readAsDataURL(file);
        }
        setData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const { LoginUser, createUser } = await import('@/utils/FetchFromApi');
            (isLogin) ? await LoginUser(data as Data) : await createUser(data)

        } catch (error) {
            console.error(error)
        }
    }
    return (
        <>
            <form
                style={{
                    width: '100%',
                    height: '90vh'
                }}
                onSubmit={handleSubmit}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'absolute',
                        inset: 0
                    }}
                >
                    <Box
                        sx={{
                            ...styles.glassphorism(),
                            padding: 5,
                            width: "30%",
                            height: "auto",
                            color: 'white'
                        }}
                    >
                        <Box
                            sx={{
                                fontSize: 25,
                                gap: 5,
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                margin: '10px 20px ',
                                display: 'flex',
                                justifyContent: 'space-around'
                            }}
                        >
                            {
                                (authMode).map((item, index) => (
                                    <Typography
                                        sx={[styles.loginSignUpBtn(mode, item)]}
                                        onClick={() => { setIsLogin(prev => !prev); setMode(item.name) }}
                                        key={index}
                                    >{item.name}</Typography>
                                ))
                            }
                        </Box>
                        <Box
                            sx={{
                                color: 'white',
                                display: 'flex',
                                // flexDirection: 'column',
                                gap: 2,
                                flexWrap: 'wrap',
                                padding: 2,
                                margin: 1,
                                flex: 1,
                                justifyContent: 'center'
                            }}
                        >

                            {(!isLogin) &&
                                <Avatar
                                    onClick={() => { inputRef.current && inputRef.current?.click() }}
                                    src={data?.image as string}
                                    sx={{
                                        display: isLogin ? 'none' : 'flex',
                                        width: 100,
                                        height: 100,
                                        justifySelf: 'center',
                                        position: 'relative',
                                        "::after": {
                                            content: '"+"',
                                            position: 'absolute',
                                            bottom: 15,
                                            right: 18,
                                            color: 'white',
                                            width: '25px',
                                            height: '25px',
                                            borderRadius: '50%',
                                            display: data.image ? 'none' : 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            background: 'green',
                                        },
                                        cursor: 'pointer',
                                        m: 2
                                    }}
                                />
                            }
                            <input
                                ref={inputRef as React.RefObject<HTMLInputElement>}
                                type='file'
                                style={{ display: 'none' }}
                                onChange={handleChange}
                                // accept="image/*"
                                name='image'
                            />
                            {
                                (isLogin ? Login : signup).map((item, index) => (
                                    <input
                                        placeholder={item.label}
                                        name={item.name}
                                        key={index}
                                        onChange={handleChange}
                                        value={data[item.name] as string || ''}
                                        style={{
                                            ...styles.customInput('1 0 10px')
                                        }}
                                        type={item.type}
                                        required={item.required}
                                    />
                                ))
                            }
                            <Button variant="outlined"
                                sx={{
                                    marginTop: 2
                                }}
                                type='submit'
                            >
                                {isLogin ? "Login" : 'singup'}
                            </Button>
                        </Box>

                    </Box>
                </Box>
            </form>
        </>
    )
}

export default page