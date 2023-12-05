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
                style={{
                    position: 'sticky',
                    left: 0,
                    right: 0,
                    height: 50,
                    zIndex: 5,
                    top:'10px',
                    padding: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    ...styles.glassphorism(),
                    margin: '15px 20px'
                }}
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