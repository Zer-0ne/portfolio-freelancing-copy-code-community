'use client'
import { Login, authMode, signup } from '@/utils/constant'
import { styles } from '@/utils/styles'
import { Box, Button, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'

const page = () => {
    const [isLogin, setIsLogin] = React.useState(true);
    const [mode, setMode] = useState('login')
    return (
        <>
            <Box
                style={{
                    display: "flex",
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    inset: 0
                }}
            >
                <Box
                    style={{
                        ...styles.glassphorism(),
                        padding: 15,
                        width: "30%",
                        height: "auto",
                        color: 'white'
                    }}
                >
                    <Box
                        style={{
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
                        style={{
                            color: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 20,
                            flexWrap: 'wrap',
                            padding: 20,
                            margin: 10
                        }}
                    >
                        {
                            (isLogin ? Login : signup).map((item, index) => (
                                <TextField
                                    label={item.label}
                                    variant="standard"
                                    name={item.name}
                                    key={index}
                                    sx={{
                                        flex: '1 0 100%',
                                        color: 'white'
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
                        >
                            {isLogin ? "Login" : 'singup'}
                        </Button>
                    </Box>

                </Box>
            </Box>
        </>
    )
}

export default page