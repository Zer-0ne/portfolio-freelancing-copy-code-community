import { Box, Typography } from '@mui/material'
import React from 'react'
import { styles } from '@/utils/styles'
import { BlogsInterface } from '@/utils/Interfaces'
import { DeleteRounded, EditRounded } from '@mui/icons-material'
import { deletePost } from '@/utils/FetchFromApi'
const BlogCard = ({
    item,
    fetchData
}: {
    item: BlogsInterface,
    fetchData: () => Promise<void>;
}) => {
    const deleteBlog = async () => {
        await deletePost(item?._id, 'blog')
        await fetchData()
    }
    return (
        <>
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
                            ':hover': {
                                background: 'red',
                                color: 'white'
                            }
                        }}
                    />
                </Box>
                <Typography
                    variant='h5'
                >
                    {item.title}
                </Typography>
                <Typography
                    variant='caption'
                    sx={{
                        mb: .5,
                        mt: -1,
                        ml: 0,
                        opacity: .7,
                        // alignSelf:'end'
                    }}
                >
                    {item.updatedAt?.slice(0, 10)}
                </Typography>
                <Typography
                    variant='caption'
                >
                    {item.description}
                </Typography>
            </Box>
        </>
    )
}

export default BlogCard