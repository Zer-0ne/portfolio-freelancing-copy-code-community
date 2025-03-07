
import { RootState } from '@/store/store';
import { styles } from '@/utils/styles'
import { KeyboardArrowDown, } from '@mui/icons-material';
import { Avatar, Box, SxProps, Theme, useMediaQuery } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux';

const DropDownSkelenton = (
    {
        value,
        children,
        status,
        customStyle
    }: {
        value?: string;
        children: React.ReactNode;
        status?: string
        customStyle?: React.CSSProperties | object | SxProps<Theme> | undefined
    }
) => {
    const { session } = useSelector((state: RootState) => state.session)
    const [isTrue, setIsTrue] = React.useState(false)
    const matches = useMediaQuery('(max-width:900px)');

    return (

        <Box
            sx={{
                position: 'relative',
                zIndex: isTrue ? 5 : 'auto',
            }}
        >
            <Box
                sx={{
                    ...styles?.customInput('', {
                        position: 'absolute',
                        top: '130%',
                        right: '0%',
                        left: (status === 'unauthenticated') ? null : (status === 'authenticated') ? { md: -13, xs: -200 } : 0,
                        display: isTrue ? 'flex' : 'none',
                        opacity: isTrue ? 1 : 0,
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'all .5s ease-in-out',
                        flex: 1,
                        padding: 0,
                        gap: 1,
                        zIndex: 5,
                        // overflow: 'scroll',
                        // maxHeight: '150px',
                        fontSize: { xs: 12, md: 18, xl: 25 },
                        textAlign: 'center',
                        border: '0px'
                    }, 0)
                }}
            >
                <Box
                    className='capitalize'
                    sx={{
                        ...styles?.customInput('', {
                            position: 'static',
                            display: isTrue ? 'flex' : 'none',
                            opacity: isTrue ? 1 : 0,
                            flexDirection: 'column',
                            ...styles.glassphorism(),
                            cursor: 'pointer',
                            transition: 'all .5s ease-in-out',
                            flex: 1,
                            gap: 1,
                            zIndex: 5,
                            fontSize: { xs: 12, md: 18, xl: 25 },
                            textAlign: 'center',
                        }, 1),
                    }}
                >
                    {children}
                </Box>
            </Box>
            <Box
                sx={styles?.customInput(8, {
                    textTransform: 'capitalize',
                    position: 'relative',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    ...customStyle,
                    zIndex: 5,
                    opacity: .8,
                    fontSize: { xs: 12, md: 14, xl: 14 }
                }, 1)}
                onClick={() => setIsTrue(prev => !prev)}
            >
                {(value) ? value : (status === 'unauthenticated') ? (matches) ? '' : 'Login' : (matches) ? '' : <>
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

                </>}
                <KeyboardArrowDown
                    sx={{
                        transform: isTrue ? 'rotate(180deg)' : 'rotate(0deg)',
                        // transformOrigin: 'left top',
                        transition: 'all .5s ease-in-out'
                    }}
                />
            </Box>
        </Box >
    )
}

export default DropDownSkelenton