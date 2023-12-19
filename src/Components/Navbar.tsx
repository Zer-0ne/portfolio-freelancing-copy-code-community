'use client'
import { Box } from '@mui/material'
import React from 'react'
import { styles } from '@/utils/styles'
import { navbarContent } from '@/utils/constant'
import Link from 'next/link'
import DropDownSkelenton from './DropDownSkelenton'
const Navbar = () => {
    return (
        <>
            {/* <Box
                display={'flex'}
                gap={1}
                justifyContent={'space-around'}
            > */}
            <Box
                sx={styles.navbar()}
            >
                {
                    navbarContent.map((item, index) => (

                        <Link href={`${item.path}`} key={index}>
                            {item.icon}
                        </Link>

                    ))
                }
                <DropDownSkelenton value='Login'>
                    <>
                    </>
                </DropDownSkelenton>
            </Box>
            {/* </Box> */}
        </>
    )
}

export default Navbar