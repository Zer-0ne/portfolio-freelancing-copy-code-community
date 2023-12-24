'use client'

import { Delete, NotInterested } from '@mui/icons-material'
import { Avatar, Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import DropDown from './DropDown'
import { Data, Session } from '@/utils/Interfaces'
import { styles } from '@/utils/styles'

const UserCard = () => {
    const [data, setData] = useState<Data>()

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'space-between',
                    ...styles.glassphorism('', '12px 12px 0 0'),
                    p: 2
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center'
                    }}
                >
                    <Avatar
                        sx={{
                            height: 35,
                            width: 35
                        }}
                    />
                    <Typography
                        variant='body1'
                    >Sahil Khan</Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center'
                    }}
                >
                    <DropDown
                        name='role'
                        onChange={setData}
                        style={styles}
                        values={['user', 'admin', 'moderator']}
                    />
                    <NotInterested
                        sx={{
                            cursor: 'pointer', color: 'grey', transition: 'all .3s ease-in-out', ':hover': {
                                color: 'blue'
                            }
                        }}
                        name='ban'
                    />

                    <Delete
                        sx={{
                            cursor: 'pointer',
                            ':hover': {

                            }
                        }}
                        color='error'
                        name='delete'
                    />
                </Box>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'space-evenly',
                    ...styles.glassphorism('', '0 0 12px 12px'),
                    mb: 5,
                    p: 2
                }}
            >
                <Typography
                    variant='caption'
                    sx={{
                        opacity: .5
                    }}
                >zer.0n3</Typography>
                <Typography
                    variant='caption'
                    sx={{
                        opacity: .5
                    }}
                >sahilkhan8294799@gmail.com</Typography>
                <Typography
                    variant='caption'
                    sx={{
                        opacity: .5
                    }}
                >7982408995</Typography>
            </Box>
        </>
    )
}

export default UserCard