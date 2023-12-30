import { Avatar, Box, Container } from '@mui/material'
import { styles } from '@/utils/styles'
import React from 'react'
import { SendRounded } from '@mui/icons-material'

const CommentContainer = () => {
    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 1,
                p: 2
            }}
        >
            {/* input fleid for new comments */}
            <Box
                sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'center'
                }}
            >
                <Avatar />
                <input
                    style={{ ...styles.customInput(1,{
                        borderRadius:10
                    }) }}
                />
                <SendRounded />
            </Box>

            {/* fetch all the comment of the post */}

        </Container>
    )
}

export default CommentContainer