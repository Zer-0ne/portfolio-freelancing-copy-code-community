import React from 'react'
import { Container } from './Forms'
import { Container as BOX } from '@mui/material'

const NotAcceptingForm = ({
    title
}: {
    title: string
}) => {
    return (
        <BOX>

            <Container customStyle={{
                border: 'solid #ff000085',
                margin: '2rem auto',
            }} >
                <h2 className='text-[1.5rem] my-3 font-bold '>{title}</h2>
                <p> The form {title} is no longer accepting response.</p>
                <p>Try contacting the owner of the form if you think is a mistake.</p>
            </Container>
        </BOX>
    )
}

export default NotAcceptingForm