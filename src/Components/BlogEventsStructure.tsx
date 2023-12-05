import { styles } from '@/utils/styles'
import { Box, Container } from '@mui/material'
import React from 'react'

const BlogEventsStructure = (
    {
        children,
        placeholder,
        btnText
    }: {
        children: React.ReactNode
        placeholder: string;
        btnText: string;
    }
) => {
    return (
        <Box>
            <Container
                sx={styles.containerStyle()}
            >

                {/* search bar and new btn */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: 3
                    }}
                >
                    <input
                        placeholder={placeholder}
                        style={{
                            flex: 8,
                            background: 'transparent'
                            , border: '1px solid rgba(255,255,255,.25)'
                            , borderRadius: 5
                            , padding: '7px 10px'
                        }}
                    />
                    <button
                        style={{
                            background: 'green',
                            padding: '5px 20px',
                            borderRadius: 4,
                            flex: 1
                        }}
                    >{btnText}</button>
                </Box>
                {children}
            </Container>
        </Box>
    )
}

export default BlogEventsStructure