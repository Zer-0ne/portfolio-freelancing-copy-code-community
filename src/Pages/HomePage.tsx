import { Box, Typography } from '@mui/material'
import React from 'react'
import { styles } from '@/utils/styles'
import { Rubik_Glitch, IBM_Plex_Mono, Smooch, Dancing_Script } from 'next/font/google';
import Link from 'next/link';

// Load the font using the font loader
const rubikGlitchFont = Rubik_Glitch({
    subsets: ['latin'],
    weight: '400'
});
const ibn = IBM_Plex_Mono({
    weight: '400',
    subsets: ['latin']
})
const smooch = Dancing_Script({
    weight: '400',
    subsets: ['latin']
})

const HomePage = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                height: '90vh',
                maxHeight: '90vh',
                flex: 1,
                // backgroundColor: '#283593',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: 'center',
                    position: 'relative',
                    height: '20vh',
                    "::after": {
                        content: '""',
                        width: '50%',
                        top: -10,
                        bottom: 5,
                        ...styles.glassphorism('2px'),
                        position: 'absolute',
                        transform: 'rotate(5deg)'
                    }
                }}
            >
                <Typography variant='h1'
                    sx={{
                        textTransform: 'capitalize',
                        color: 'green',
                        fontWeight: 800,
                    }}
                    className={rubikGlitchFont.className}
                >Copy code community</Typography>
                <Typography variant='body1'
                    sx={{
                        color: 'green',
                        textTransform: 'uppercase',
                        fontSize: 25
                    }}
                    className={ibn.className}
                >-- Jamia Hamdard --</Typography>
            </Box>
            <Box
                sx={{
                    width: '40%',
                    textAlign: 'center',
                    marginTop: 3
                }}
            >
                <Typography
                    variant='body1'
                    sx={{
                        fontSize: 20
                    }}
                    className={smooch.className}
                >
                    Copy Code Community is a friendly space where people who love coding, web development, and new tech come together. Whether you're a pro or just starting out, everyone is welcome to share code, discuss cool tech stuff, and learn together. It's a place to connect with others, explore the world of software, and have fun while building cool things!
                </Typography>
            </Box>
            <Link
                href='#'
                style={{
                    marginTop: 30,
                    padding: '10px 15px',
                    backgroundColor: 'rgba(0, 0, 0, .7)',
                    borderRadius: 5,
                    border:'1px solid rgba(255,255,255,.5)'
                }}
                className={ibn.className}
            >Start Learning...</Link>
        </Box>
    )
}

export default HomePage