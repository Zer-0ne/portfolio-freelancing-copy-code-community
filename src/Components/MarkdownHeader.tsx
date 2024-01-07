import { BlogsInterface, Data, EventsInterface } from '@/utils/Interfaces'
import { Avatar, Box, Container, Typography } from '@mui/material'
import { IBM_Plex_Mono, Libre_Baskerville } from 'next/font/google'
import React from 'react'
import ContentStructure from './ContentStructure'

export const ibn = IBM_Plex_Mono({
    weight: '400',
    subsets: ['latin']
})

export const libre_Baskerville = Libre_Baskerville({
    weight: '400',
    subsets: ['latin']
})

const MarkdownHeader = (
    {
        data,
        user
    }: {
        data: BlogsInterface | EventsInterface;
        user: Data
    }
) => {
    return (
        <ContentStructure>


            <Typography
                variant='h2'
                sx={{
                    fontSize: 35
                }}
                className={libre_Baskerville.className}
            >{data?.title}</Typography>
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                    ml: 1
                }}
            >
                <Typography
                    variant='caption'
                    sx={{
                        mb: .7,
                        mt: 0,
                        ml: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: .8,
                        position: 'relative',
                        '::after': {
                            content: '""',
                            position: 'absolute',
                            width: 3,
                            height: 3,
                            borderRadius: '50%',
                            right: -9.5,
                            top: '50%',
                            bottom: '50%',
                            background: 'white',
                            opacity: .7
                        }
                        // alignSelf:'end'
                    }}
                    className={ibn.className}
                >
                    <Avatar
                        src={user?.image as string}
                        sx={{ width: 22, height: 22 }}
                    />
                    {user?.name}
                </Typography>

                <Typography
                    variant='caption'
                    sx={{
                        mb: .5,
                        mt: 0,
                        ml: 0,
                        opacity: .7,
                        // alignSelf:'end'
                    }}
                    className={ibn.className}
                >
                    {data?.updatedAt?.slice(0, 10)}
                </Typography>
            </Box>
            <Typography
                variant='caption'
                sx={{
                    textAlign: 'justify'
                }}
                className={ibn.className}
            >
                {data?.description}
            </Typography>
        </ContentStructure>

    )
}

export default MarkdownHeader