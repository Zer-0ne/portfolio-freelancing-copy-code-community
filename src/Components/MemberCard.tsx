import { Avatar, Box, Typography } from '@mui/material'
import React from 'react'
import { styles } from '@/utils/styles'

const MemberCard = () => {
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
                            fontWeight: '600'
                        }}
                    >Sahil khan</Typography>
                    <Typography
                        variant='caption'
                        sx={{
                            fontWeight: '500'
                        }}
                    >Sahil khan</Typography>
                </Box>
            </Box>
        </>
    )
}

export default MemberCard