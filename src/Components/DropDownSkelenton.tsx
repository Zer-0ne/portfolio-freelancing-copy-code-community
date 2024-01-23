
import { RootState } from '@/store/store';
import { styles } from '@/utils/styles'
import { KeyboardArrowDown } from '@mui/icons-material';
import { Avatar, Box, useMediaQuery } from '@mui/material'
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
        customStyle?: React.CSSProperties
    }
) => {
    const { session } = useSelector((state: RootState) => state.session)
    const [isTrue, setIsTrue] = React.useState(false)
    const matches = useMediaQuery('(max-width:900px)');

    return (

        <Box
            sx={{
                position: 'relative',
                zIndex: 1
            }}
        >

            <Box
                sx={styles?.customInput(8, {
                    textTransform: 'capitalize',
                    position: 'relative',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 0,
                    ...customStyle,
                    fontSize: { xs: 12, md: 18, xl: 20 }
                }, 1)}
                onClick={() => setIsTrue(prev => !prev)}
            >
                {(value) ? value : (status === 'unauthenticated') ? (matches) ? '' : 'Login' : (matches) ? '' : <>
                    <Avatar
                        src={session[0]?.image}
                        sizes='20px'
                        sx={{
                            width: 30,
                            height: 30,
                        }}
                    />
                </>}
                <KeyboardArrowDown
                    sx={{
                        transform: isTrue ? 'rotate(180deg)' : 'rotate(0deg)',
                        // transformOrigin: 'left top',
                        transition: 'all .5s ease-in-out'
                    }}
                />
            </Box>
            <Box
                sx={{
                    ...styles.glassphorism('8px', '10px !important', 'rgba(0, 0, 0, 0.2)', {
                        position: 'absolute',
                        top: '130%',
                        right: '0%',
                        left: (status === 'unauthenticated') ? null : (status === 'authenticated') ? { md: -13, xs: -200 } : 0,
                        display: isTrue ? 'flex' : 'none',
                        opacity: isTrue ? 1 : 0,
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'all .5s ease-in-out',
                        ...styles.customInput(1, {}, 2),
                        flex: 1,
                        gap: 1,
                        zIndex: 50,
                        fontSize: { xs: 12, md: 18, xl: 25 },
                        textAlign: 'center',
                    }),

                }}
            >
                {children}
            </Box>
        </Box >
    )
}

export default DropDownSkelenton