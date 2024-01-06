'use client'
import { Box, Button, Container, Typography, useMediaQuery } from '@mui/material'
import React, { useState } from 'react'
import { styles } from '@/utils/styles'
import { GitHub, Instagram, LinkedIn, WhatsApp } from '@mui/icons-material'
import { Data } from '@/utils/Interfaces'
import dynamic from 'next/dynamic'

const Link = dynamic(() => import('next/link'))

const page = () => {
    const [isDisabled, setIsDisabled] = React.useState(false)
    const [data, setData] = useState<Data>()
    const matches = useMediaQuery('(max-width:600px)');

    // handle change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const { createNewContact } = await import('@/utils/FetchFromApi')
            return await createNewContact(data as Data, setIsDisabled)
        } catch (error) {
            console.error(error)
        }
    }
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
                        ...styles.glassphorism('7px'),
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
                                />
                            <input
                                name='lastname'
                                onChange={handleChange}
                                placeholder='Enter last name'
                                style={{
                                    ...styles.customInput('1 1 auto'),
                                    width: `${matches ? '100%' : '30%'}`
                                }}
                            />
                        </Box>
                        <input
                            name='email'
                            placeholder='Enter email'
                            onChange={handleChange}
                            style={{
                                ...styles.customInput('1 1 50%')
                            }}
                        />
                        <input
                            name='phone'
                            onChange={handleChange}
                            placeholder='Enter phone number'
                            style={{
                                ...styles.customInput('1 1 50%')
                            }}
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
            </Box >

        </Container >
    )
}

export default page