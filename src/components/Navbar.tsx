'use client'
import { Avatar, Box, NoSsr, Typography } from '@mui/material'
import React, { useRef } from 'react'
import { styles } from '@/utils/styles'
import { Login, navbarContent, sessionAction } from '@/utils/constant'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Data, } from '@/utils/Interfaces'
import { GitHub, Google, LinkedIn } from '@mui/icons-material'
import { LoginUser } from '@/utils/FetchFromApi'
import { usePathname } from 'next/navigation'
import { AppDispatch, RootState } from '@/store/store'
import { useDispatch, useSelector } from 'react-redux'
import { removeSession } from '@/slices/sessionSlice'
import { Rubik_Glitch } from 'next/font/google'
import dynamic from 'next/dynamic'

const DropDownSkelenton = dynamic(() => import('./DropDownSkelenton'))


const rubikGlitchFont = Rubik_Glitch({
    subsets: ['latin'],
    weight: '400'
});

const Navbar = () => {
    const pageRef = useRef(false);
    const { session } = useSelector((state: RootState) => state.session)
    const [data, setData] = React.useState<Data>({})
    const { status } = useSession()
    const pathName = usePathname()
    const dispatch = useDispatch<AppDispatch>()

    // fetch all the blogs
    const fetchData = async () => {
        try {
            const { fetchSession } = await import('@/slices/sessionSlice');

            // fetch session from the redux store 
            dispatch(fetchSession());
        } catch (error) {
            console.log(error)
        }
    }

    // useEffect
    React.useEffect(() => {
        (pageRef.current === false) && fetchData()
        return () => { pageRef.current = true }
    }, [])


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await LoginUser(data as Data)
            await fetchData()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <NoSsr
        >
            <Box
                sx={styles.navbar(pathName as string)}
            >
                <Box
                    sx={{ flex: 1.5 }}
                >
                    <Link href={`/`}  >

                        <Typography variant='h1'
                            sx={{
                                textTransform: 'capitalize',
                                color: 'green',
                                fontWeight: 800,
                                fontSize: '1.3rem',
                                textAlign: { xs: 'center', md: 'start' },
                                ...rubikGlitchFont.style,
                                position: 'relative',
                                '::after': {
                                    content: "'Copy code community'",
                                    color: 'green',
                                    position: 'absolute',
                                    inset: '-5px',
                                    filter: 'blur(20px)', // Blur effect for ambient shadow
                                    zIndex: -1,
                                }
                            }}
                            className={rubikGlitchFont.className}
                        >Copy code community</Typography></Link>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-evenly', flex: 1, alignItems: 'center', position: { xs: 'absolute', md: 'static' }, right: 10 }}>
                    {
                        navbarContent.map((item, index) => (
                            <Box key={index} sx={{
                                position: 'relative',
                                display: {
                                    xs: 'none', md: (item.name === 'home') ? 'none' : ['contacts', 'controls'].includes(item.name) ?
                                        ['admin', 'moderator'].includes(session[0]?.role) ?
                                            'block' :
                                            'none' :
                                        ['users'].includes(item.name) ?
                                            ['admin'].includes(session[0]?.role) ?
                                                'block' :
                                                'none' :
                                            'block'
                                },
                                color: (item.path).includes('admin') ? 'red !important' : 'white',
                                "::after": {
                                    content: `'${item.name}'`, // Use single quotes instead of double quotes
                                    position: 'absolute',
                                    bottom: '-50px',
                                    transform: 'translateX(-70%) scale(0)',
                                    ...styles.glassphorism(),
                                    color: 'white',
                                    padding: '6px 10px',
                                    borderRadius: '4px',
                                    fontSize: '12px',
                                    textTransform: 'capitalize',
                                    opacity: 0,
                                    pointerEvents: 'none',
                                    whiteSpace: 'nowrap',
                                    marginTop: '8px',
                                    transition: 'all 0.3s ease',
                                    zIndex: 1,
                                },
                                '::before': {
                                    content: "''",
                                    position: 'absolute',
                                    inset: '-1px',
                                    borderRadius: '50%',
                                    zIndex: -1,
                                    background: pathName.includes(item.path.replace('/', '')) ? (item.path).includes('admin') ? 'red' : 'white' : 'transparent',
                                    filter: 'blur(20px)'
                                },
                                ":hover": {
                                    "::after": {
                                        opacity: { md: 1, xs: 0 },
                                        transform: { md: 'translateX(-70%) scale(1)', xs: 'translateX(-70%) scale(0)' },

                                    }
                                }
                            }}>

                                <Link href={`${item.path}`} >
                                    {item.icon(pathName as string, item.path.replace('/', ''))}
                                </Link>
                            </Box>

                        ))
                    }
                    <form onSubmit={handleSubmit}>
                        <DropDownSkelenton
                            customStyle={{
                                border: 'none!important',
                                opacity:1
                            }}
                            status={status}
                        >

                            {
                                navbarContent.map((item, index) => (
                                    <Box key={index} sx={{
                                        display: { xs: 'flex', md: 'none' },
                                        flex: 1, alignSelf: 'center', position: 'relative', width: '100%', textAlign: 'center', justifyContent: 'center',
                                        '::before': {
                                            content: "''",
                                            position: 'absolute',
                                            inset: '-5px',
                                            borderRadius: '50%',
                                            zIndex: -1,
                                            background: (pathName.includes(item.path.replace('/', '')) && item.path.length > 1) ? (item.path).includes('admin') ? 'red' : 'white' : 'transparent',
                                            filter: 'blur(80px)'
                                        },
                                    }}>

                                        <Link href={`${item.path}`} style={{
                                            display: ['users', 'contacts', 'controls'].includes(item.name) ?
                                                ['admin', 'moderator'].includes(session[0]?.role) ?
                                                    'flex' :
                                                    'none' :
                                                'flex',
                                            gap: 2, alignItems: 'center',
                                            color: ['users', 'contacts', 'controls'].includes(item.name) ? 'red' : 'white'
                                        }}>
                                            {item.icon(pathName as string, item.path.replace('/', ''))}
                                            <Typography variant='caption' sx={{
                                                fontSize: 20,
                                                ...styles.iconStyle(pathName as string, item.path.replace('/', ''))
                                            }}>{item.name}</Typography>
                                        </Link>
                                    </Box>

                                ))
                            }

                            <Box
                                sx={{
                                    display: { xs: (session.length) ? 'flex' : 'none', md: 'none' },
                                    gap: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        '::after': {
                                            content: "''",
                                            position: 'absolute',
                                            inset: '-2px',
                                            borderRadius: '10px',
                                            filter: 'blur(10px)', // Blur effect for ambient shadow
                                            zIndex: -1,
                                            backgroundImage: `url('${session[0]?.image}')`, // Shadow color
                                            transition: 'opacity 0.2s',
                                            objectFit: { md: 'cover', xs: 'contain' },
                                            backgroundSize: { md: 'cover', xs: 'contain' }, /* Ensures the image covers the entire area */
                                            backgroundPosition: 'center' /* Centers the image */
                                        }
                                    }}
                                >
                                    <Avatar
                                        src={session[0]?.image}
                                        sizes='20px'
                                        sx={{
                                            width: 30,
                                            height: 30,

                                        }}
                                    />
                                </Box>
                                {/* <Avatar
                                    src={session[0]?.image || ''}
                                    sx={{
                                        width: 20,
                                        height: 20
                                    }}
                                /> */}
                                <Typography>{session[0]?.name}</Typography>
                            </Box>
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
                                            onClick={async () => {
                                                dispatch(removeSession(session[0].id))
                                                return await signOut({
                                                    redirect: false
                                                })
                                            }}
                                        >
                                            {item.name}
                                        </Typography>
                                    )) : <>

                                        {['admin', 'moderator'].includes(session[0]?.role) &&
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
                                        {
                                            ['admin', 'moderator'].includes(session[0]?.role) &&
                                            <button
                                                type='submit'
                                                style={styles.greenBtn() as React.CSSProperties | undefined}
                                            >Login</button>
                                        }
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                gap: 5,
                                                paddingX: 1,
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
                                                    opacity: .5,
                                                    fontSize: { md: 14, xl: 16, xs: 12 }
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
                                            <LinkedIn
                                                sx={styles.socialMediaIcon()}
                                                onClick={async () => {
                                                    await signIn('linkedin')
                                                }}
                                            />

                                        </Box>
                                    </>
                            }

                        </DropDownSkelenton>
                    </form>
                </Box>

            </Box>
            {/* </Box> */}
        </NoSsr>
    )
}

export default Navbar