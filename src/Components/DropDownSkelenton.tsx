
import { Session } from '@/utils/Interfaces';
import { styles } from '@/utils/styles'
import { KeyboardArrowDown } from '@mui/icons-material';
import { Box } from '@mui/material'
import React from 'react'

const DropDownSkelenton = (
    {
        value,
        children,
        session,
        status
    }: {
        value?: string;
        children: React.ReactNode;
        session?: Session;
        status?: string
    }
) => {
    const [isTrue, setIsTrue] = React.useState(false)

    return (

        <Box
            sx={{
                position: 'relative',
            }}
        >
            <Box
                sx={{
                    ...styles?.customInput('', {
                        position: 'absolute',
                        top: '130%',
                        right: '0%',
                        left: (status === 'unauthenticated') ? null : 0,
                        display: isTrue ? 'flex' : 'none',
                        opacity: isTrue ? 1 : 0,
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'all .5s ease-in-out',
                        backdropFilter: `blur(5px) saturate(187%)`,
                        flex: 1,
                        gap: 1,
                        zIndex: 50
                    }, 1),

                }}
            >
                {children}
            </Box>
            <Box
                sx={styles?.customInput(8, {
                    textTransform: 'capitalize',
                    position:'relative',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    zIndex: 0
                }, 1)}
                onClick={() => setIsTrue(prev => !prev)}
            >
                {(value) ? value : (status === 'unauthenticated') ? 'Login' : session?.user?.name}
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