'use client'
import { Avatar, AvatarGroup, Box, Button, Container, Typography, useMediaQuery } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { styles } from '@/utils/styles'
import { GitHub, Instagram, LinkedIn, WhatsApp } from '@mui/icons-material'
import { Data } from '@/utils/Interfaces'
import dynamic from 'next/dynamic'
import { IBM_Plex_Mono } from 'next/font/google'

const Link = dynamic(() => import('next/link'))
const ibn = IBM_Plex_Mono({
    weight: '400',
    subsets: ['latin']
})

const page = () => {

    const [joinUs, setJoinUs] = useState('-1007px')
    useEffect(() => {
        setTimeout(() => setJoinUs('-100px'), 1000)
        setInterval(() => setJoinUs('-100px'), 1500)
        setInterval(() => setJoinUs('-150px'), 4200)
    }, [])


    const blogRef = useRef(false);
    const [developedBy, setDevelopedBy] = useState<{
        name: string;
        image: string
    }[]>()
    const [isDisabled, setIsDisabled] = React.useState(false)
    const [data, setData] = useState<Data>()
    const matches = useMediaQuery('(max-width:600px)');

    // handle change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData((prevFormData?:Data) => ({ ...prevFormData, [name]: value }));
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const { createNewContact } = await import('@/utils/FetchFromApi')
            await createNewContact(data as Data, setIsDisabled)
            return setData(undefined)
        } catch (error) {
            console.error(error)
        }
    }

    const fetch = async () => {
        const { fetchFromGithub } = await import('@/utils/FetchFromApi')
        const data = await fetchFromGithub('deplovedBy')
        setDevelopedBy(data)
    }

    React.useEffect(() => {
        (blogRef.current === false) && fetch()
        return () => { blogRef.current = true }
    }, [])
    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                minHeight: 'calc(100vh - 84px)'
            }}
        >
            <Box
                sx={{
                    zIndex: 1,
                    position: 'relative',
                    width: { md: '60%', xl: '60%', xs: '80%' },
                    "::before": {
                        content: '""',
                        position: 'absolute',
                        width: 250,
                        height: 250,
                        borderRadius: '50%',
                        background: 'linear-gradient(red,purple)',
                        zIndex: 1,
                        top: -(250 / 3),
                        left: -(250 / 3)
                    },
                    '::after': {
                        content: '""',
                        position: 'absolute',
                        width: 150,
                        height: 150,
                        borderRadius: '50%',
                        background: 'linear-gradient(cyan,blue)',
                        zIndex: 1,
                        bottom: -(150 / 3),
                        right: -(150 / 3)
                    }
                }}
            >
                <Box
                    sx={{
                        ...styles.glassphorism('7px', '0 0 12px 12px'),
                        padding: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        width: '100%',
                        flex: 1,
                        zIndex: 2,
                        gap: 4
                    }}
                >
                    <Typography
                        variant='h5'
                        sx={{
                            fontSize: 24,
                            fontWeight: '700'
                        }}
                    >Contact Us</Typography>

                    <form
                        onSubmit={handleSubmit}
                        style={{
                            flex: '1 1 50%',
                            display: 'flex',
                            gap: 15,
                            flexDirection: 'column',
                            width: '100%'
                        }}
                    >

                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1,
                                flex: '1 1 100%',
                                flexDirection: 'row',
                            }}
                        >
                            <input
                                name='firstname'
                                placeholder='Enter first name'
                                onChange={handleChange}
                                style={{
                                    ...styles.customInput('1 1 auto'),
                                    width: `${matches ? '100%' : '30%'}`
                                }}
                                value={data?.firstname as string || ''}
                            />
                            <input
                                name='lastname'
                                onChange={handleChange}
                                placeholder='Enter last name'
                                style={{
                                    ...styles.customInput('1 1 auto'),
                                    width: `${matches ? '100%' : '30%'}`
                                }}
                                value={data?.lastname as string || ''}
                            />
                        </Box>
                        <input
                            name='phone'
                            onChange={handleChange}
                            placeholder='Enter phone number'
                            style={{
                                ...styles.customInput('1 1 50%')
                            }}
                            value={data?.phone as string || ''}
                        />
                        <textarea
                            onChange={handleChange}
                            placeholder='Enter your message...'
                            rows={4}
                            name='content'
                            style={{
                                resize: 'none',
                                ...styles.customInput('1 1 50%')
                            }}
                            value={data?.content as string || ''}
                        />

                        <Button
                            disabled={isDisabled}
                            sx={{
                                mt: 2,
                                color: 'white',
                                ':hover': {
                                    background: 'rgba(255,255,255,.1)'
                                }
                            }}
                            type='submit'
                        >
                            {
                                isDisabled ? 'Submiting...' : 'Submit'
                            }
                        </Button>
                    </form>

                    <Box
                        sx={{
                            display: 'flex',
                            gap: 5,
                            mt: 2,
                            flex: 1,
                            width: '100%',
                            justifyContent: 'center',
                            position: 'relative',
                            ":before": {
                                content: '"Connect us"',
                                position: 'absolute',
                                top: -40,
                                display: 'flex',
                                justifyContent: 'center',
                                left: 0,
                                right: 0,
                                opacity: .5
                            }
                        }}
                    >
                        <Link href={`https://chat.whatsapp.com/FH1jEnRUd3g7G8Om32u8Ka`} target='_blank' >
                            <WhatsApp
                                sx={styles.socialMediaIcon()}
                            />
                        </Link>
                        <Link href={`https://www.linkedin.com/company/copy-code-community/`} target='_blank'>
                            <LinkedIn
                                sx={styles.socialMediaIcon()}
                            />
                        </Link>
                        <GitHub
                            sx={styles.socialMediaIcon()}
                        />
                        <Link href={`https://www.instagram.com/copy_code_/`} target='_blank'>
                            <Instagram
                                sx={styles.socialMediaIcon()}
                            />
                        </Link>
                    </Box>
                </Box>
                <Link
                    href='/forms/join'
                    style={{

                    }}
                    className={`${ibn.className}`}
                >
                    <Typography
                        sx={{
                            ...styles.glassphorism(),
                            position: 'absolute',
                            // right: { xs: 'calc(50% - 3rem)' },
                            right: 0, left: 0, zIndex: 2,
                            top: { xs: `calc(${joinUs} + 55px)` },
                            transform: { xs: 'rotate(0deg)' },
                            padding: { md: '5px 8px !important', xs: '5px 8px !important' },
                            backgroundColor: 'rgba(0, 0, 0, .7)',
                            borderRadius: { xs: '10px 10px 0 0 !important' },
                            backgroundOrigin: 'border-box',
                            // width: { md: '6rem', xs: '6rem' },
                            textAlign: 'center',
                            textTransform: 'uppercase',
                            border: '1px solid rgba(255,255,255,.2)',
                            transition: 'all 2s ease-in-out',
                            fontWeight: '800',
                            background: 'linear-gradient(to right, rgba(0,69,255,1) 0%, rgba(255,0,0,1) 35%, rgba(255,0,194,1) 100%)',
                            backgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Join us

                    </Typography>
                </Link>
            </Box >
            {/* <AvatarGroup
                total={20}
                sx={{
                    color: 'black',
                    mt: 18,
                    "after":{
                        content:`"Developed By"`,

                    }
                }}
            >
                {
                    developedBy?.map((item, index) => (
                        <Avatar
                            key={index}
                            src={item.image}
                        />
                    ))
                }
            </AvatarGroup> */}
        </Container >
    )
}

export default page