import Image from 'next/image'
import React from 'react'
import loading from '@/assests/1.gif'
import { Box } from '@mui/material'
const Loading = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItem: 'center',
                width: '100%',
                height: '100vh'
            }}
        >
            <Box
                height={800}
                width={600}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
            >

                <Image
                    src={loading}
                    height={300}
                    width={400}
                    alt=''

                />
            </Box>
        </Box>
    )
}

export default Loading