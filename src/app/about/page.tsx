'use client'
import { Box, Container, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { Kalam, IBM_Plex_Mono } from 'next/font/google';
import { styles } from '@/utils/styles';
import { aboutCCC } from '@/utils/constant';
import { colors } from '@/utils/colors';
import { coreMember } from '@/utils/Interfaces';
import dynamic from 'next/dynamic';

const MemberCard = dynamic(() => import('@/Components/MemberCard'))


const kalam = Kalam({
    subsets: ['latin'],
    weight: '700'
});
const ibn = IBM_Plex_Mono({
    weight: '400',
    subsets: ['latin']
})

const page = () => {
    const blogRef = useRef(false);
    const [coreTeamMember, setCoreTeamMember] = useState<coreMember[]>()

    const fetch = async () => {
        const { fetchFromGithub } = await import('@/utils/FetchFromApi')
        const data = await fetchFromGithub('team%20members')
        setCoreTeamMember(data)

    }

    useEffect(() => {
        (blogRef.current === false) && fetch()
        return () => { blogRef.current = true }
    }, [])

    return (
        <>
            <Container

            >
                <Box
                    sx={{
                        display: 'flex',
                        flex: 1,
                        height: 'auto',
                        // background: 'red',
                        flexDirection: 'column',
                        alignItems: 'center',
                        // margin: 5,
                        gap: 8,
                        marginTop: 8,
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
                                    flexWrap: 'wrap',
                                    background: colors.commentConatinerBg,
                                    p: 4,
                                    borderRadius: 5
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
                                flex: 1,
                                // background: colors.commentConatinerBg,
                                // p: 4,
                                // borderRadius: 5
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
                                        gap: { xs: 5, md: 6, xl: 8 },
                                        margin: '10px 0',
                                        flex: 1,
                                        mt: 5,
                                        justifyContent: 'center',
                                    }}
                                >
                                    {coreTeamMember &&
                                        coreTeamMember?.map((item, index) => (
                                            <MemberCard
                                                key={index}
                                                item={item}
                                            />
                                        ))
                                    }
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>

            </Container >
        </>
    )
}

export default page