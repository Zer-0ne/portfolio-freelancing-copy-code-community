// 'use server'
import { RootState } from '@/store/store'
import { styles } from '@/utils/styles'
import { Box, Container } from '@mui/material'
import Link from 'next/link'
import React from 'react'
import { useSelector } from 'react-redux'

const BlogEventsStructure = (
    {
        children,
        placeholder,
        btnText,
        handleSearch,
        searchInput,
        from,
    }: {
        children: React.ReactNode
        placeholder: string;
        btnText: string;
        searchInput: string;
        handleSearch: (input: string) => void;
        from: string;
    }
) => {
    const { session } = useSelector((state: RootState) => state.session)
    return (
        <Box
        >
            <Container

                sx={[styles.containerStyle()]}
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
                            display: ['admin', 'moderator'].includes(session[0]?.role) ? 'block' : 'none'
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