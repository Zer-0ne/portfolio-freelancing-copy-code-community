'use client'
import { ReadmeField } from '@/Components/ReadmeField'
import { createNewBlog } from '@/utils/FetchFromApi'
import { Data } from '@/utils/Interfaces'
import { createBlog, createEvent } from '@/utils/constant'
import { styles } from '@/utils/styles'
import { Box, Container } from '@mui/material'
import React from 'react'

const page = () => {
    const [data, setData] = React.useState<Data>()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            await createNewBlog(data as Data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <form
                onSubmit={handleSubmit}
            >

                <Container
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            gap: 2,
                            flexWrap: 'wrap'
                        }}
                    >

                        {
                            createBlog.map((item, index) => (
                                <input
                                    type="text"
                                    style={styles.customInput(item.size)}
                                    key={index}
                                    name={item.name}
                                    placeholder={item.placeholder}
                                    required={item.required}
                                    onChange={handleChange}
                                />
                            ))
                        }
                    </Box>
                    <ReadmeField
                        setdata={setData}
                    />
                </Container>
            </form>
        </>
    )
}

export default page