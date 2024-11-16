'use client'

import { Delete, Done, NotInterested } from '@mui/icons-material'
import { Avatar, Box, Typography } from '@mui/material'
import React, { useState } from 'react'
import DropDown from './DropDown'
import { Data } from '@/utils/Interfaces'
import { styles } from '@/utils/styles'
import { editPost } from '@/utils/FetchFromApi'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { roles } from '@/utils/constant'

const UserCard = (
    {
        item,
        setOpen,
        setIsUpdate,
        fetchedUser
    }: {
        item: Data;
        setOpen: React.Dispatch<React.SetStateAction<boolean>>
        setIsUpdate: React.Dispatch<React.SetStateAction<Data | undefined>>;
        fetchedUser: () => Promise<void>
    }
) => {
    const { session } = useSelector((state: RootState) => state.session)
    const [data, setData] = useState<Data>()

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
        await fetchedUser()
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
                    flexWrap: 'wrap',
                    zIndex: 10
                }}
            >

                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        alignItems: 'center'
                    }}
                >
                    <Box
                        sx={{
                            position: 'relative',
                            '::after': {
                                content: "''",
                                position: 'absolute',
                                inset: '-0px',
                                borderRadius: '10px',
                                filter: 'blur(10px)', // Blur effect for ambient shadow
                                zIndex: -1,
                                backgroundImage: `url('${item.image}')`, // Shadow color
                                transition: 'opacity 0.2s',
                                objectFit: { md: 'cover', xs: 'contain' },
                                backgroundSize: { md: 'cover', xs: 'contain' }, /* Ensures the image covers the entire area */
                                backgroundPosition: 'center' /* Centers the image */
                            }
                        }}
                    >

                        <Avatar
                            sx={{
                                height: 35,
                                width: 35
                            }}
                            src={item.image as string}
                        />
                    </Box>
                    <Typography
                        variant='body1'
                    >
                        {item?.name as string}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: (item.username === session[0]?.username) ? 'none' : 'flex',
                        gap: 2,
                        alignItems: 'center',
                    }}
                >
                    <DropDown
                        name='role'
                        onChange={setData}
                        // style={styles as }
                        values={roles as string[]}
                        valuesStyles={{
                            p: '3px'
                        }}
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
                    p: 2,
                    flexWrap: 'wrap'
                }}
            >
                <Typography
                    variant='caption'
                    sx={{
                        opacity: .5
                    }}
                >
                    {item?.username as string}
                </Typography>
                <Typography
                    variant='caption'
                    sx={{
                        opacity: .5
                    }}
                >
                    {item?.email as string}
                </Typography>
                <Typography
                    variant='caption'
                    sx={{
                        opacity: .5
                    }}
                >
                    {item?.role as string}
                </Typography>
            </Box>
        </>
    )
}

export default UserCard