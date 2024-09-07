import { Box, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import { styles } from '@/utils/styles'
import { Rubik_Glitch, IBM_Plex_Mono, Satisfy } from 'next/font/google'
import Link from 'next/link';
import Typewriter from '@/Components/TypeWriter';

// Load the font using the font loader
const rubikGlitchFont = Rubik_Glitch({
    subsets: ['latin'],
    weight: '400'
});
const ibn = IBM_Plex_Mono({
    weight: '400',
    subsets: ['latin']
})
const smooch = Satisfy({
    weight: '400',
    subsets: ['latin']
})

const HomePage = () => {
    const [isFinish, setIsFinish] = useState(false)
    const typewriterRef = useRef(null); // Separate ref for Typewriter

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                height: '100vh',
                maxHeight: '100vh',
                transition: 'all .10s ease-in-out',
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
                    height: { xl: '20vh', md: '15vh', xs: '10vh' },
                    "::after": {
                        content: '""',
                        width: '50%',
                        top: -10,
                        bottom: 5,
                        ...styles.glassphorism('2px'),
                        position: 'absolute',
                        transform: 'rotate(5deg)',
                        display: { md: 'none', xs: 'none' },

                    }
                }}
            >
                <Typography variant='h1'
                    sx={{
                        textTransform: 'capitalize',
                        color: 'green',
                        fontWeight: 800,
                        fontSize: { xs: '2rem', md: '4rem', xl: '6rem' },
                        textAlign: 'center',
                        // transform: isFinish ? 'scale(1)' : 'scale(0)',
                        // opacity:isFinish?'1':'0',
                        // transition: 'all 1.9s ease-in-out',
                        // background: 'linear-gradient(to right, red, green,red)',
                        // backgroundClip: 'text',
                        // WebkitTextFillColor: 'transparent',
                        // animation: 'shine 3s linear',
                        // p: '0 100px',
                        // "@keyframes shine": {
                        //     "0%": {
                        //         backgroundPosition: 0,
                        //     },
                        //     "60%,100%": {
                        //         backgroundPosition: '800px'
                        //     }
                        // }
                    }}
                    className={rubikGlitchFont.className}
                >Copy code community</Typography>
                <Typography variant='body1'
                    sx={{
                        color: 'green',
                        // transform: isFinish ? 'scale(1)' : 'scale(0)',
                        // // opacity:isFinish?'1':'0',
                        // transition: 'all 1.9s ease-in-out',
                        textTransform: 'uppercase',
                        fontSize: { xl: 25, md: 16, xs: 10 }
                    }}
                    className={ibn.className}
                >-- Jamia Hamdard --</Typography>
            </Box>
            <Box
                sx={{
                    width: { xl: '40%', xs: '70%', md: '40%' },
                    textAlign: 'center',
                    marginTop: 2,
                    minHeight: !isFinish ? { md: '120px', xs: '150px' } : 'auto'
                }}
            >
                <Typewriter
                    ref={typewriterRef} // Use separate ref for Typewriter
                    texts={[
                        "Welcome to the Copy Code Community, a vibrant hub where coding enthusiasts, web developers, and tech aficionados unite! Here, we celebrate the art of programming and the joy of creating innovative solutions together.",
                        "Whether you're a seasoned developer or just embarking on your coding journey, our community is a welcoming space for everyone. Share your code, seek advice, and engage in lively discussions about the latest trends in technology and development.",
                        "In this collaborative environment, you'll find opportunities to connect with like-minded individuals, explore diverse projects, and enhance your skills. From beginner tutorials to advanced coding challenges, there's something for everyone to learn and grow.",
                        "Join us as we embark on exciting coding adventures, collaborate on projects that inspire, and foster a culture of creativity and innovation. Together, we can build amazing things and make a positive impact in the tech world!"
                    ]}
                    className={`${smooch.className}`}
                    speed={10}
                    onFinish={() => { setIsFinish(true) }}
                />
                {/* <Typography
                    variant='body1'
                    sx={{
                        fontSize: { xl: 20, md: 16, xs: 14 },
                    }}
                    className={`${smooch.className}`}

                >
                    Copy Code Community is a friendly space where people who love coding, web development, and new tech come together. Whether you're a pro or just starting out, everyone is welcome to share code, discuss cool tech stuff, and learn together. It's a place to connect with others, explore the world of software, and have fun while building cool things!
                </Typography> */}
            </Box>
            {
                <Link
                    href='/materials'
                    style={{
                        // transform: !isFinish ? 'skew(180deg,10deg)' : 'skew(0deg,0deg)',
                        transform: isFinish ? 'scale(1)' : 'scale(0)',
                        transition: 'all .5s ease-in-out',
                        marginTop: 15,
                        padding: '10px 15px',
                        backgroundColor: 'rgba(0, 0, 0, .7)',
                        borderRadius: 5,
                        border: '1px solid rgba(255,255,255,.5)',
                        fontSize: '.8rem'
                    }}
                    className={ibn.className}
                >Start Learning...</Link>}
        </Box >
    )
}

export default HomePage