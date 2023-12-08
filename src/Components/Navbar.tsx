'use client'
import { Box } from '@mui/material'
import React from 'react'
import { styles } from '@/utils/styles'
import { navbarContent } from '@/utils/constant'
import Link from 'next/link'
const Navbar = () => {
    return (
        <>
            <Box
                sx={styles.navbar()}
            >
                {
                    navbarContent.map((item, index) => (
                        <>
                            <Link href={`${item.path}`} key={index}>
                                {item.icon}
                            </Link>
                        </>
                    ))
                }
            </Box>
        </>
    )
}

export default Navbar