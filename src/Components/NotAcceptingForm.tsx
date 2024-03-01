import React from 'react'
import { Container } from './Forms'
import { Box } from '@mui/material'

const NotAcceptingForm = ({
    title
}: {
    title: string
}) => {
    return (
        <Box sx={{
            width: { xs: '90%', md: '60vw' }
        }} className="container mx-[auto]">

            <Container customStyle={{
                border: 'solid #ff000085',
                margin: '2rem auto',
            }} >
                <h2 className='text-[1.5rem] my-3 font-bold '>{title}</h2>
                <p> The form {title} is no longer accepting response.</p>
                <p>Try contacting the owner of the form if you think is a mistake.</p>
            </Container>
        </Box>
    )
}

export default NotAcceptingForm