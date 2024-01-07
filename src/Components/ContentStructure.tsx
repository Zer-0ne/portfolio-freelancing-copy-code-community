import { colors } from '@/utils/colors'
import { Box, Container } from '@mui/material'
import React from 'react'

const ContentStructure = ({
    children,
    customStyles
}: {
    children: React.ReactNode;
    customStyles?: React.CSSProperties
}) => {
    return (
        <Container
            sx={{
                padding: 2,
                display: "flex",
                flexDirection: 'column',
                justifyContent: "center",
                textAlign: 'justify',
                ...customStyles
                // alignItems:'center'
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    flexDirection: 'column',
                    background: colors.commentConatinerBg,
                    p: 2,
                    borderRadius: '10px',
                    // boxShadow: 'inset #00ff003d 0px 0px 10px'
                    boxShadow: 'inset #5d5d5d8f 0px 0px 10px'
                }}
            >
                {children}
            </Box></Container>
    )
}

export default ContentStructure