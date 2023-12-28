'use client'
import { Box, NoSsr, Typography } from '@mui/material'
import React from 'react'
import { styles } from '@/utils/styles'
import { Login, navbarContent, sessionAction } from '@/utils/constant'
import Link from 'next/link'
import DropDownSkelenton from './DropDownSkelenton'
import { signIn, useSession } from 'next-auth/react'
import { Data, Session } from '@/utils/Interfaces'
import { GitHub, Google } from '@mui/icons-material'
import { LoginUser } from '@/utils/FetchFromApi'
import { usePathname } from 'next/navigation'


const Navbar = () => {
    const { data: session, status } = useSession();
    const [data, setData] = React.useState<Data>({})
    const pathName = usePathname()
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await LoginUser(data as Data)
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <NoSsr>
            {/* <Box
                display={'flex'}
                gap={1}
                justifyContent={'space-around'}
            > */}
            <Box
                sx={styles.navbar()}
            >
                {
                    navbarContent.map((item, index) => (

                        <Link href={`${item.path}`} key={index}>
                            {item.icon(pathName as string, item.path)}
                        </Link>

                    ))
                }
                <form onSubmit={handleSubmit}>
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
                                            onClick={() => signIn('google')}
                                        />
                                        <GitHub
                                            sx={styles.socialMediaIcon()}
                                            onClick={async () => {
                                                await signIn('github')
                                            }}
                                        />

                                    </Box>
                                </>
                        }

                    </DropDownSkelenton>
                </form>
            </Box>
            {/* </Box> */}
        </NoSsr>
    )
}

export default Navbar