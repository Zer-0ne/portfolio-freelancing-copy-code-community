import { Avatar, Box, Container, Typography } from '@mui/material'
import { styles } from '@/utils/styles'
import React, { useState } from 'react'
import { SendRounded } from '@mui/icons-material'
import { colors } from '@/utils/colors'
import { BlogsInterface, CommentInterface, Data, EventsInterface } from '@/utils/Interfaces'
import CommentItem from './CommentItem'

const CommentContainer = (
    {
        data,
        comments
    }: {
        data: BlogsInterface | EventsInterface
        comments: CommentInterface[]
    }
) => {
    const [comment, setComment] = useState<Data>()
    const [isDisabled, setIsDisabled] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setComment((prevComment) => ({
            ...prevComment, [name]: value
        }))
    }

    const handleSubmit = async () => {
        setIsDisabled(true)
        try {
            const { addComment } = await import('@/utils/FetchFromApi')
            await addComment(data?._id, comment as Data, 'blog')
            setIsDisabled(false)
        } catch (error) {
            setIsDisabled(false)
            console.log(error)
        }
    }
    return (
        <Container
            sx={{
                padding: 2,
                display: "flex",
                flexDirection: 'column',
                justifyContent: "center",
                textAlign: 'justify',
                gap: 2
            }}
        >
            {/* input fleid for new comments */}
            <Box
                sx={{
                    background: colors.commentConatinerBg,
                    p: 2,
                    borderRadius: '10px',
                    gap: 1
                }}
            >

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
                        <button
                            onClick={handleSubmit}
                            disabled={isDisabled}
                            style={{
                                alignSelf: 'flex-end',
                                marginBottom: 1,
                                cursor: 'pointer',
                            }}
                        >
                            <SendRounded
                            />
                        </button>
                    </Box>
                </Box>
            </Box>

            {/* fetch all the comment of the post */}
            <Box
                sx={{
                    background: colors.commentConatinerBg,
                    display: 'flex',
                    flexDirection: 'column',
                    p: 2,
                    borderRadius: '10px',
                    gap: 2
                }}
            >
                <Typography
                    variant='h4'
                    sx={{
                        fontSize: 25,
                        // p:'0 10px'
                    }}
                >Comments {comments.length}</Typography>
                {
                    comments.map((item, index) => (
                        <CommentItem key={index} data={item} />
                    ))
                }
            </Box>
        </Container>
    )
}

export default CommentContainer