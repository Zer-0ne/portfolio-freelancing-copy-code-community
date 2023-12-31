import { Avatar, Box, Container, Typography } from '@mui/material'
import { styles } from '@/utils/styles'
import React, { useState } from 'react'
import { SendRounded } from '@mui/icons-material'
import { colors } from '@/utils/colors'
import { BlogsInterface, Data, EventsInterface } from '@/utils/Interfaces'

const CommentContainer = (
    {
        data
    }: {
        data: BlogsInterface | EventsInterface
    }
) => {
    const [comment, setComment] = useState<Data>()

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setComment((prevComment) => ({
            ...prevComment, [name]: value
        }))
    }

    const handleSubmit = async () => {
        try {
            const { addComment } = await import('@/utils/FetchFromApi')
            await addComment(data?._id, comment as Data, 'blog')
        } catch (error) {

        }
    }
    return (
        <Container
            sx={{
                padding: 2,
                display: "flex",
                flexDirection: 'column',
                justifyContent: "center",
                textAlign: 'justify'
            }}
        >
            <Box
                sx={{
                    background: colors.commentConatinerBg,
                    p: 2,
                    borderRadius: '10px',
                    gap: 1
                }}
            >

                {/* input fleid for new comments */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}
                >
                    <Typography
                        variant='h4'
                        sx={{
                            fontSize: 25,
                            // p:'0 10px'
                        }}
                    >Add a new comment</Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 1.5,
                        }}
                    >
                        <Avatar />
                        <textarea
                            name='comment'
                            onChange={handleChange}
                            style={{
                                ...styles.customInput(1, {
                                    borderRadius: 10,
                                    height: 150
                                })
                            }}
                            placeholder='Type your comment'
                        />
                        <SendRounded
                            sx={{
                                alignSelf: 'flex-end',
                                mb: 1
                            }}
                            onClick={handleSubmit}
                        />
                    </Box>
                </Box>

                {/* fetch all the comment of the post */}

            </Box>
        </Container>
    )
}

export default CommentContainer