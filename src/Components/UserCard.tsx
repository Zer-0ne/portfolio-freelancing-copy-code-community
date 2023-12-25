'use client'

import { Delete, Done, NotInterested } from '@mui/icons-material'
import { Avatar, Box, Typography } from '@mui/material'
import React, { useState } from 'react'
import DropDown from './DropDown'
import { Data } from '@/utils/Interfaces'
import { styles } from '@/utils/styles'
import { allUser, editPost } from '@/utils/FetchFromApi'

const UserCard = (
    {
        item,
        setOpen,
        setIsUpdate,
        setdata
    }: {
        item: Data;
        setOpen: React.Dispatch<React.SetStateAction<boolean>>
        setIsUpdate: React.Dispatch<React.SetStateAction<Data | undefined>>;
        setdata: React.Dispatch<React.SetStateAction<Data[] | undefined>>
    }
) => {
    const [data, setData] = useState<Data>()

    const roles: string[] = ['admin', 'user', 'moderator']
    const userRole = item.role as string;

    roles.sort((a, b) => {
        // Move the user's role to the front
        if (a === userRole) {
            return -1;
        } else if (b === userRole) {
            return 1;
        }

        // Use the default order for other roles
        return roles.indexOf(a) - roles.indexOf(b);
    });

    // handle Edit the user details
    const handleEdit = async () => {
        const changedValues = Object.entries(data as Data)
            .filter(([key, value]) => value !== item[key])
            .reduce((obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {} as Data);
        await editPost(item.username as string, changedValues, 'user');
        
        const alluser = await allUser('user')
        setdata(alluser)
    }


    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'space-between',
                    ...styles.glassphorism('', '12px 12px 0 0'),
                    p: 2,
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
                        src={item.image as string}
                    />
                    <Typography
                        variant='body1'
                    >
                        {item.name}
                    </Typography>
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
                        values={roles as string[]}
                    />
                    <NotInterested
                        sx={{
                            cursor: 'pointer', color: 'grey', transition: 'all .3s ease-in-out', ':hover': {
                                color: 'blue'
                            }
                        }}
                        name='ban'
                    />

                    <Done
                        sx={{
                            cursor: 'pointer'
                        }}
                        onClick={() => handleEdit()}
                    />

                    <Delete
                        sx={{
                            cursor: 'pointer',
                            ':hover': {

                            }
                        }}
                        onClick={() => { setOpen(true); setIsUpdate(item) }}
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
                >
                    {item.username}
                </Typography>
                <Typography
                    variant='caption'
                    sx={{
                        opacity: .5
                    }}
                >
                    {item.email}
                </Typography>
                <Typography
                    variant='caption'
                    sx={{
                        opacity: .5
                    }}
                >
                    {item.role}
                </Typography>
            </Box>
        </>
    )
}

export default UserCard