import { Box, Button, Container, Typography } from '@mui/material'
import React from 'react'
import { styles } from '@/utils/styles'
import { GitHub, Instagram, LinkedIn, WhatsApp } from '@mui/icons-material'
const page = () => {
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
                        style={{
                            flex: 1,
                            display: 'flex',
                            gap: 15,
                            flexDirection: 'column'
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 1,
                                flex: 1,
                                flexDirection: 'row'
                            }}
                        >
                            <input
                                name='fname'
                                placeholder='Enter first name'
                                style={{
                                    ...styles.customInput(1),
                                    // width: {md:'50%',xl:'50%',xs}
                                }}
                            />
                            <input
                                name='lname'
                                placeholder='Enter last name'
                                style={{
                                    ...styles.customInput(1),
                                    // Width: '50%'
                                }}
                            />
                        </Box>
                        <input
                            name='email'
                            placeholder='Enter email'
                            style={{
                                ...styles.customInput(1)
                            }}
                        />
                        <input
                            name='phone'
                            placeholder='Enter phone number'
                            style={{
                                ...styles.customInput(1)
                            }}
                        />
                        <textarea
                            placeholder='Enter your message...'
                            rows={4}
                            style={{
                                resize: 'none',
                                ...styles.customInput(1)
                            }}
                        />
                        <Button
                            sx={{
                                mt: 2,
                                color: 'white',
                                ':hover': {
                                    background: 'rgba(255,255,255,.1)'
                                }
                            }}
                        >Submit</Button>
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
                                content: '"Follow us"',
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
                        <WhatsApp
                            sx={{
                                cursor: 'pointer',
                                fontSize: 25,
                                opacity: .5,
                                ':hover': {
                                    opacity: 1
                                }
                            }}
                        />
                        <LinkedIn
                            sx={{
                                cursor: 'pointer',
                                fontSize: 25,
                                opacity: .5,
                                ':hover': {
                                    opacity: 1
                                }
                            }}
                        />
                        <GitHub
                            sx={{
                                cursor: 'pointer',
                                fontSize: 25,
                                opacity: .5,
                                ':hover': {
                                    opacity: 1
                                }
                            }}
                        />
                        <Instagram
                            sx={{
                                cursor: 'pointer',
                                fontSize: 25,
                                opacity: .5,
                                ':hover': {
                                    opacity: 1
                                }
                            }}
                        />
                    </Box>
                </Box>
            </Box>

        </Container>
    )
}

export default page