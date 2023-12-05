import { Box, Typography } from '@mui/material'
import React from 'react'
import { styles } from '@/utils/styles'
const BlogCard = () => {
    return (
        <>
            <Box
                sx={styles.blogCard()}
            >
                <Typography
                    variant='h5'
                >Hi i am sahil khan</Typography>
                <Typography
                    variant='caption'
                >Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolor accusamus, vero aliquam excepturi fugit id quis possimus quod veniam, voluptatibus ut a eos cupiditate inventore iusto, beatae nostrum accusantium nisi?</Typography>
            </Box>
        </>
    )
}

export default BlogCard