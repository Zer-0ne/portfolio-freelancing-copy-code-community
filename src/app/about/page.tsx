import { Box, Typography } from '@mui/material'
import React from 'react'
import { Kalam, IBM_Plex_Mono } from 'next/font/google';
import { styles } from '@/utils/styles';
import { aboutCCC } from '@/utils/constant';
import MemberCard from '@/Components/MemberCard';

const kalam = Kalam({
    subsets: ['latin'],
    weight: '700'
});
const ibn = IBM_Plex_Mono({
    weight: '400',
    subsets: ['latin']
})

const page = () => {
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flex: 1,
                    height: 'auto',
                    // background: 'red',
                    flexDirection: 'column',
                    margin: 5,
                    gap: 10,
                    marginTop: 8
                }}
            >
                {
                    aboutCCC.map((item, index) => (
                        <Box
                            key={index}
                            sx={{
                                display: 'flex',
                                gap: 5,
                                flexDirection: 'column',
                                flexWrap: 'wrap'
                            }}

                        >
                            <Box>
                                <Typography
                                    variant='h3'
                                    sx={[styles.heading1(), {
                                        display: 'inline'
                                    }]}
                                    className={kalam.className}
                                >
                                    {item.heading}
                                </Typography>
                            </Box>
                            <Typography
                                variant='body1'
                                sx={{
                                    textAlign: 'justify',
                                    opacity: 0.7
                                }}
                                className={ibn.className}
                            >
                                {/* <pre> */}

                                {item.content}
                                {/* </pre> */}
                            </Typography>
                        </Box>
                    ))
                }

                {/* our Team members */}
                <Box
                    sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        flex: 1,
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 5,
                            flexDirection: 'column',
                            flex: 1
                        }}

                    >
                        <Box>
                            <Typography
                                variant='h3'
                                sx={[styles.heading1(), {
                                    display: 'inline'
                                }]}
                                className={kalam.className}
                            >
                                Our Team
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: 10,
                                    margin: '10px 0',
                                    flex: 1,
                                    mt:5
                                }}
                            >
                                {
                                    [1, 2, 3, 4, 5, 6, 7, 8].map((item, index) => (
                                        <MemberCard
                                            key={index}
                                        />
                                    ))
                                }
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box >
        </>
    )
}

export default page