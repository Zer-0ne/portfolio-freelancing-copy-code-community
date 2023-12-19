import { styles } from '@/utils/styles'
import { KeyboardArrowDown } from '@mui/icons-material';
import { Box } from '@mui/material'
import React from 'react'

const DropDownSkelenton = (
    {
        value,
        children
    }: {
        value?: string;
        children: React.ReactNode;
    }
) => {
    const [isTrue, setIsTrue] = React.useState(false)
    return (
        <Box
            sx={styles?.customInput('', {
                position: 'relative',
                textTransform: 'capitalize',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }, 1)}
            onClick={() => setIsTrue(prev => !prev)}
        >
            {value && value}
            <Box
                sx={{
                    ...styles?.customInput('', {
                        position: 'absolute',
                        top: '110%',
                        display: isTrue ? 'flex' : 'none',
                        opacity: isTrue ? 1 : 0,
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'all .5s ease-in-out',
                        backdropFilter: `blur(5px) saturate(187%)`,
                        flex: 1,
                        zIndex:2
                    }, 1),

                }}
            >
                {children}
            </Box>
            <KeyboardArrowDown
                sx={{
                    transform: isTrue ? 'rotate(180deg)' : 'rotate(0deg)',
                    // transformOrigin: 'left top',
                    transition: 'all .5s ease-in-out'
                }}
            />
        </Box>
    )
}

export default DropDownSkelenton