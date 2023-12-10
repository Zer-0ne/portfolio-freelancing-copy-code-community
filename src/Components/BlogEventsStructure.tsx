// 'use server'
import { styles } from '@/utils/styles'
import { Box, Container } from '@mui/material'
import React from 'react'

const BlogEventsStructure = (
    {
        children,
        placeholder,
        btnText,
        handleSearch,
        searchInput
    }: {
        children: React.ReactNode
        placeholder: string;
        btnText: string;
        searchInput: string;
        handleSearch: (input: string) => void;
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
                        gap: 3,
                        flexWrap:'wrap'
                    }}
                >
                    <input
                        placeholder={placeholder}
                        style={styles.customInput()}
                        value={searchInput}
                        onChange={e => handleSearch(e.target.value)}
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