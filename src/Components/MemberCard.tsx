'use client'
import { Avatar, Box, Typography } from '@mui/material'
import React from 'react'
import { styles } from '@/utils/styles'
import { LinkedIn, Instagram, GitHub } from '@mui/icons-material';
import { coreMember } from '@/utils/Interfaces';
import Link from 'next/link';
const MemberCard = ({ item }: {
    item: coreMember;
}) => {
    return (
        <>
            <Box
                sx={styles.memberCard()}
            >
                <Box
                    sx={styles.avtarContainer()}
                >
                    <Box
                        sx={{
                            borderRadius: '50%',
                            border: '1px solid #ffffff57',
                            background: 'transparent',
                            width: 120,
                            position:'relative',
                            height: 120,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            "::after": {
                                content: "''",
                                position: 'absolute',
                                top: 0,
                                zIndex: -1,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundImage: `url('${item.image}')`, // Shadow color
                                borderRadius: '50%',
                                filter: 'blur(10px)', // Blur effect for ambient shadow
                                transition: 'opacity 0.2s',
                                backgroundSize:'contain',
                                objectFit:'contain'
                            }
                        }}
                    >

                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                boxShadow: '0 0 10px black',

                            }}
                            src={item.image}
                        />
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        flex: 1,
                        position: 'relative',
                        width: '100%',
                        textAlign: 'center'
                    }}
                >

                    <Typography
                        variant='h5'
                        sx={{
                            fontWeight: '600',
                            // position:'absolute',
                            fontSize: { md: '1rem', xs: '1rem' }
                        }}
                    >
                        {item.name}
                    </Typography>
                    <Typography
                        variant='caption'
                        sx={{
                            fontWeight: '500',
                            fontSize: { md: '.7rem', xs: '.7rem' }
                        }}
                    >
                        {item.role}
                    </Typography>
                </Box>

                {/* social media profile */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                        gap: 3,
                        mt: 2
                    }}
                >
                    {item.LinkedIn &&
                        <Link href={item.LinkedIn} target='_blank'>
                            <LinkedIn />
                        </Link>
                    }
                    {
                        item.insta &&
                        <Link href={item.insta} target='_blank'>
                            <Instagram />
                        </Link>
                    }
                    {
                        item.GitHub &&
                        <Link href={item.GitHub} target='_blank'>
                            <GitHub />
                        </Link>
                    }
                </Box>
            </Box>
        </>
    )
}

export default MemberCard