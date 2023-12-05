import { Avatar, Box, Typography } from '@mui/material'
import React from 'react'
import { styles } from '@/utils/styles'
import { LinkedIn, Instagram, GitHub } from '@mui/icons-material';
import { coreMember } from '@/utils/Interfaces';
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
                            height: 120,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >

                        <Avatar
                            sx={{
                                width: 100,
                                height: 100,
                                boxShadow: '0 0 10px black'
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
                        width: '100%'
                    }}
                >

                    <Typography
                        variant='h5'
                        sx={{
                            fontWeight: '600',
                            fontSize: '1vw'
                        }}
                    >
                        {item.name}
                    </Typography>
                    <Typography
                        variant='caption'
                        sx={{
                            fontWeight: '500',
                            fontSize:'.6vw'
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
                    <LinkedIn />
                    <Instagram />
                    <GitHub />
                </Box>
            </Box>
        </>
    )
}

export default MemberCard