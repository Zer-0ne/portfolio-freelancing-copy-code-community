import { Box, SxProps, Theme } from '@mui/material'
import { StaticImport } from 'next/dist/shared/lib/get-img-props'
import Image from 'next/image'
import React from 'react'

const EmbientImage = ({
    customBoxStyles,
    customImageStyles,
    src,
    alt,
    imageProps
}: {
    customBoxStyles?: SxProps<Theme> | undefined
    customImageStyles?: React.CSSProperties | undefined
    src: string | StaticImport
    alt: string
    imageProps?: React.ComponentProps<typeof Image>;
}) => {
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flex: { xs: 10, md: 1, xl: 1 },
                    // minWidth: 200,
                    position: 'relative'
                    , "::after": {
                        content: "''",
                        position: 'absolute',
                        inset: '-2px',
                        zIndex: -1,
                        backgroundImage: `url('${src}')`, // Shadow color
                        borderRadius: '10px',
                        filter: 'blur(10px)', // Blur effect for ambient shadow
                        transition: 'opacity 0.2s',
                        objectFit: { md: 'cover', xs: 'contain' },
                        backgroundSize: { md: 'cover', xs: 'contain' }, /* Ensures the image covers the entire area */
                        backgroundPosition: 'center' /* Centers the image */
                    },
                    ...customBoxStyles
                }}
            >
                <Image
                    src={src}
                    alt={alt}
                    width={200}
                    height={200}
                    fill={false}
                    style={{
                        flex: 1,
                        ...customImageStyles
                    }}
                    {...imageProps}
                />
            </Box>
        </>
    )
}

export default EmbientImage