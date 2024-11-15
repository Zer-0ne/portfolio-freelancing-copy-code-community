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
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={() => setOpen(prev => !prev)}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 0,
                transform: open ? 'scale(1)' : 'scale(0)',

            }}
            className='transition-all delay-300 ease-in-out'
            slotProps={{
                backdrop: {
                    timeout: 500,
                },
            }}
        >
            <Box
                className='transition-all delay-300 ease-in-out'
                sx={{
                    ...styles.glassphorism(),
                    padding: 2,
                    display: 'flex',
                    transform: open ? 'scale(1)' : 'scale(0)',
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