import { Avatar, Box, Typography } from '@mui/material'
import React from 'react'
import { styles } from '@/utils/styles'
import { BlogsInterface, Session } from '@/utils/Interfaces'
import { DeleteRounded, EditRounded } from '@mui/icons-material'
import { deletePost } from '@/utils/FetchFromApi'
import { IBM_Plex_Mono, Kalam, Libre_Baskerville } from 'next/font/google'
import Link from 'next/link'
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'

const kalam = Kalam({
    subsets: ['latin'],
    weight: '700'
});

export const ibn = IBM_Plex_Mono({
    weight: '400',
    subsets: ['latin']
})


export const libre_Baskerville = Libre_Baskerville({
    weight: '400',
    subsets: ['latin']
})



const BlogCard = ({
    item,
    fetchData
}: {
    item: BlogsInterface,
    fetchData: () => Promise<void>;
}) => {
    const deleteBlog = async () => {
        await deletePost(item?._id, 'blog', item)
        await fetchData()
    }
    const { session } = useSelector((state: RootState) => state.session)
    return (
        <>
            <Link href={`/blogs/${item._id}`}>
                <Box
                    sx={styles.blogCard()}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            display: 'flex',
                            gap: 1,
                            opacity: .5,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <EditRounded
                            sx={{
                                fontSize: 25,
                                padding: .5,
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: ['admin', 'moderator'].includes(session[0]?.role) ? 'flex' : 'none',
                                ':hover': {
                                    background: 'white',
                                    color: 'black'
                                }
                            }}
                        />
                        <DeleteRounded
                            onClick={deleteBlog}
                            sx={{
                                fontSize: 25,
                                padding: .5,
                                borderRadius: '50%',
                                cursor: 'pointer',
                                display: ['admin', 'moderator'].includes(session[0]?.role) ? 'flex' : 'none',
                                ':hover': {
                                    background: 'red',
                                    color: 'white'
                                }
                            }}
                        />
                    </Box>
                    <Typography
                        variant='h5'
                        className={libre_Baskerville.className}
                    >
                        {item.title}
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            alignItems: 'center',
                            ml: .5
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
                                sx={{ width: 22, height: 22 }}
                            />
                            Sahil khan
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
                            {item.updatedAt?.slice(0, 10)}
                        </Typography>
                    </Box>
                    <Typography
                        variant='caption'
                        className={ibn.className}
                    >
                        {item.description}
                    </Typography>
                </Box>
            </Link>
        </>
    )
}

export default BlogCard