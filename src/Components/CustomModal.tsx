import { Backdrop, Box, Modal } from '@mui/material'
import React from 'react'
import { styles } from '@/utils/styles'

const CustomModal = (
    {
        open,
        setOpen,
        children
    }: {
        open: boolean;
        setOpen: React.Dispatch<React.SetStateAction<boolean>>;
        children: React.ReactNode
    }
) => {
    return (
        <Modal
            keepMounted
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
                    minWidth: { xs: '40%', md: '30%' },
                    maxWidth: { xs: '70%', md: '30%' },
                }}
            >
                {children}
            </Box>
        </Modal>
    )
}

export default CustomModal