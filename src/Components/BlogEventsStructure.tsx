// 'use server'
import { Session } from '@/utils/Interfaces'
import { styles } from '@/utils/styles'
import { Box, Container } from '@mui/material'
import Link from 'next/link'
import React from 'react'

const BlogEventsStructure = (
    {
        children,
        placeholder,
        btnText,
        handleSearch,
        searchInput,
        from,
        session
    }: {
        children: React.ReactNode
        placeholder: string;
        btnText: string;
        searchInput: string;
        handleSearch: (input: string) => void;
        from: string;
        session: Session
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
                        flexWrap: 'wrap'
                    }}
                >
                    <input
                        placeholder={placeholder}
                        style={styles.customInput()}
                        value={searchInput}
                        onChange={e => handleSearch(e.target.value)}
                    />
                    <Link
                        style={{
                            ...styles.greenBtn() as React.CSSProperties | undefined,
                            display: ['admin', 'moderator'].includes(session?.user?.role) ? 'block' : 'none'
                        }}
                        href={`/create/${from}`}
                    >{btnText}</Link>
                </Box>
                {children}
            </Container>
        </Box>
    )
}

export default BlogEventsStructure