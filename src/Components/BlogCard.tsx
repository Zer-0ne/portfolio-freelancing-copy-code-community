import { Box, Typography } from '@mui/material'
import React from 'react'
import { styles } from '@/utils/styles'
import { BlogsInterface } from '@/utils/Interfaces'
const BlogCard = ({
    item
}: {
    item: BlogsInterface
}) => {
    return (
        <>
            <Box
                sx={styles.blogCard()}
            >
                <Typography
                    variant='h5'
                >
                    {item.heading}
                </Typography>
                <Typography
                    variant='caption'
                    sx={{
                        mb:.5,
                        mt:-1,
                        ml:1,
                        opacity:.7,
                        // alignSelf:'end'
                    }}
                >
                    {item.date}
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