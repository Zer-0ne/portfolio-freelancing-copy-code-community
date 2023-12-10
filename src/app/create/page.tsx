import { ReadmeField } from '@/Components/ReadmeField'
import { createBlog } from '@/utils/constant'
import { styles } from '@/utils/styles'
import { Box, Container } from '@mui/material'
import React from 'react'

const page = () => {
    return (
        <>
            <Container
                sx={{
                    display: 'flex',
                    flexDirection:'column',
                    gap:2
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: 2,
                        flexWrap: 'wrap'
                    }}
                >

                    {
                        createBlog.map((item, index) => (
                            <input
                                type="text"
                                style={styles.customInput(item.size)}
                                key={index}
                                name={item.name}
                                placeholder={item.placeholder}
                                required={item.required}
                            />
                        ))
                    }
                </Box>
                <ReadmeField />
            </Container>
        </>
    )
}

export default page