import { Box, Typography } from '@mui/material';
import React, { useRef, useState } from 'react';
import { styles } from '@/utils/styles';
import { Rubik_Glitch, IBM_Plex_Mono, Satisfy } from 'next/font/google';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const Typewriter = dynamic(() => import('@/components/TypeWriter'))

// Load the font using the font loader
const rubikGlitchFont = Rubik_Glitch({
    subsets: ['latin'],
    weight: '400',
});
const ibn = IBM_Plex_Mono({
    weight: '400',
    subsets: ['latin'],
});
const smooch = Satisfy({
    weight: '400',
    subsets: ['latin'],
});

const HomePage = () => {
    const [isFinish, setIsFinish] = useState(false);
    const typewriterRef = useRef(null);

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
                    },
                }}
            >
                <Typography
                    variant="h1"
                    sx={{
                        textTransform: 'capitalize',
                        color: 'green',
                        fontWeight: 800,
                        fontSize: { xs: '2rem', md: '4rem', xl: '6rem' },
                        textAlign: 'center',
                        ...rubikGlitchFont.style,
                        position: 'relative',
                        '::after': {
                            content: "'Copy code community'",
                            color: 'green',
                            position: 'absolute',
                            inset: '-0px',
                            filter: 'blur(90px)', // Blur effect for ambient shadow
                            zIndex: -1,
                        },
                        cursor:'default'
                        // fontFamily: `${rubikGlitchFont.style.fontFamily} !important`, // Override MUI font family
                    }}
                >
                    Copy Code Community
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: 'green',
                        textTransform: 'uppercase',
                        fontSize: { xl: 25, md: 16, xs: 10 },
                        ...ibn?.style
                        // fontFamily: `${ibn?.style.fontFamily} !important`, // Override MUI font family
                    }}
                >
                    -- Jamia Hamdard --
                </Typography>
            </Box>
            <Box
                sx={{
                    width: { xl: '40%', xs: '70%', md: '40%' },
                    textAlign: 'center',
                    marginTop: 2,
                    minHeight: !isFinish ? { md: '80px', xs: '80px' } : 'auto',
                }}
            >
                <Typewriter
                    ref={typewriterRef}
                    texts={[
                        "Welcome to the Copy Code Community, a vibrant hub where coding enthusiasts, web developers, and tech aficionados unite! Here, we celebrate the art of programming and the joy of creating innovative solutions together.",
                        "Whether you're a seasoned developer or just embarking on your coding journey, our community is a welcoming space for everyone. Share your code, seek advice, and engage in lively discussions about the latest trends in technology and development.",
                        "In this collaborative environment, you'll find opportunities to connect with like-minded individuals, explore diverse projects, and enhance your skills. From beginner tutorials to advanced coding challenges, there's something for everyone to learn and grow.",
                        "Join us as we embark on exciting coding adventures, collaborate on projects that inspire, and foster a culture of creativity and innovation. Together, we can build amazing things and make a positive impact in the tech world!",
                    ]}
                    className={smooch}
                    speed={10}
                    onFinish={() => setIsFinish(true)}
                />
            </Box>
            <Link
                href="/materials"
                style={{
                    transition: 'all .5s ease-in-out',
                    marginTop: 15,
                    padding: '10px 15px',
                    backgroundColor: 'rgba(0, 0, 0, .7)',
                    borderRadius: 5,
                    border: '1px solid rgba(255,255,255,.5)',
                    fontSize: '.8rem',
                    fontFamily: `${ibn?.style.fontFamily}`, // Apply font here
                }}
                className={ibn?.className}
            >
                Start Learning...
            </Link>
        </Box>
    );
};

export default HomePage;
