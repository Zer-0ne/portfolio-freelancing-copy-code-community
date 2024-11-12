import Image from 'next/image';
import React from 'react';
import loading from '@/assests/download.gif';
import { Box } from '@mui/material';

const Loading = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center', // Corrected from alignItem to alignItems
                width: '100%',
                margin: 'auto',
                paddingY:'auto',
                float:'unset',
                overflow:'hidden',
                overscrollBehavior:'none',
                minHeight:'85vh'
                // No height or minHeight set
            }}
            className='!max-h-[85vh] !my-auto'
        >
            <Box
                width={600}
                display={'flex'}
                alignItems={'center'}
                justifyContent={'center'}
            >
                <Image
                    src={loading}
                    height={300}
                    width={400}
                    alt='Loading...'
                    // className='mix-blend-hard-light'
                    className='w-full'
                />
            </Box>
        </Box>
    );
}

export default Loading;
