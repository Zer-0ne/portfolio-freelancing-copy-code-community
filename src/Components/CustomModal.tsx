import { Backdrop, Box, Modal, Typography } from '@mui/material'
import React from 'react'
import { styles } from '@/utils/styles'
import { Data } from '@/utils/Interfaces';

const CustomModal = (
    {
        open,
        setOpen,
        item,
        content,
        title,
        onClick
    }: {
        open: boolean;
        setOpen: React.Dispatch<React.SetStateAction<boolean>>;
        item: Data,
        content: string,
        title: string,
        onClick: () => Promise<void>
    }
) => {
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={() => setOpen(false)}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Box
                sx={{
                    ...styles.glassphorism(),
                    padding: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    minWidth: { xs: '40%', md: '40%' },
                    maxWidth: { xs: '70%', md: '40%' },
                }}
            >
                <Typography
                    variant='h3'
                    sx={{
                        fontWeight: '600'
                        , fontSize: 25
                    }}
                >{
                        title
                    }</Typography>
                <Typography
                    variant='caption'
                    sx={{
                        fontWeight: '300'
                        , fontSize: 18
                    }}
                >
                    {content}
                </Typography>
                <button
                    style={{
                        background: 'red',
                        padding: 6,
                        borderRadius: "10px",
                    }}
                    onClick={onClick}
                >Delete</button>
            </Box>
        </Modal>
    )
}

export default CustomModal