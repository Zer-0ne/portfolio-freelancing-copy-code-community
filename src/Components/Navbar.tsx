'use client'
import { Box, Typography } from '@mui/material'
import React from 'react'
import { styles } from '@/utils/styles'
import { Login, navbarContent, sessionAction } from '@/utils/constant'
import Link from 'next/link'
import DropDownSkelenton from './DropDownSkelenton'
import { useSession } from 'next-auth/react'
import { Data, Session } from '@/utils/Interfaces'
import { GitHub, Google } from '@mui/icons-material'
import { LoginUser } from '@/utils/FetchFromApi'
const Navbar = () => {
    const { data: session, status } = useSession();
    const [data, setData] = React.useState<Data>({})

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await LoginUser(data as Data)
            console.log(response)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <>
            {/* <Box
                display={'flex'}
                gap={1}
                justifyContent={'space-around'}
            > */}
            <form onSubmit={handleSubmit}>
                <Box
                    sx={styles.navbar()}
                >
                    {
                        navbarContent.map((item, index) => (

                            <Link href={`${item.path}`} key={index}>
                                {item.icon}
                            </Link>

                        ))
                    }
                    <DropDownSkelenton
                        session={session as Session}
                        status={status}
                    >
                        {
                            (status === 'authenticated') ?
                                sessionAction.map((item, index) => (
                                    <Typography
                                        variant='caption'
                                        key={index}
                                        sx={{
                                            ':hover': {
                                                color: 'black',
                                                background: 'white',
                                            },
                                            padding: 1,
                                            borderRadius: 1,
                                        }}
                                        onClick={item.action}
                                    >
                                        {item.name}
                                    </Typography>
                                )) : <>
                                    {
                                        Login.map((item, index) => (
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
                                    <button
                                        type='submit'
                                        style={styles.greenBtn() as React.CSSProperties | undefined}
                                    >Login</button>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 5,
                                            mt: 4,
                                            mb: 1,
                                            flex: 1,
                                            width: '100%',
                                            justifyContent: 'center',
                                            position: 'relative',
                                            ":before": {
                                                content: '"Login with"',
                                                position: 'absolute',
                                                top: -30,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                left: 0,
                                                right: 0,
                                                opacity: .5
                                            }
                                        }}
                                    >
                                        <Google
                                            sx={styles.socialMediaIcon()}
                                        />
                                        <GitHub
                                            sx={styles.socialMediaIcon()}
                                        />

                                    </Box>
                                </>
                        }

                    </DropDownSkelenton>
                </Box>
            </form>
            {/* </Box> */}
        </>
    )
}

export default Navbar