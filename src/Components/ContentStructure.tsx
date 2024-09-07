import { colors } from '@/utils/colors'
import { Box, Container } from '@mui/material'
import React from 'react'

const ContentStructure = ({
    children,
    customStyles,
    boxStyle
}: {
    children: React.ReactNode;
    customStyles?: React.CSSProperties
    boxStyle?: React.CSSProperties | object
}) => {
    return (
        <Container
            sx={{
                padding: 2,
                display: "flex",
                flexDirection: 'column',
                justifyContent: "center",
                textAlign: 'justify',
                maxWidth:'800px !important',
                // alignItems:'center'
                ...customStyles
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    flexDirection: 'column',
                    // background: colors.commentConatinerBg,
                    p: 2,
                    borderRadius: '10px',
                    // boxShadow: 'inset #00ff003d 0px 0px 10px'
                    // boxShadow: 'inset #5d5d5d8f 0px 0px 10px',
                    ...boxStyle
                }}
            >
                {children}
            </Box></Container>
    )
}

export default ContentStructure