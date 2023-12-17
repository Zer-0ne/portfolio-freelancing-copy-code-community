
import { Data } from '@/utils/Interfaces';
import { KeyboardArrowDown } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'

const DropDown = (
    {
        style,
        values,
        onChange,
        name
    }: {
        style: {
            customInput: (flex?: string | number, customStyles?: object | undefined, radius?: number) => {
                flex: string | number;
                background: string;
                border: string;
                borderRadius: number;
                padding: string;
            }
        },
        values: string[],
        onChange: React.Dispatch<React.SetStateAction<Data | undefined>>,
        name: string
    }) => {
    const [value, setValue] = useState('offline')
    const [isTrue, setIsTrue] = useState(false)

    // useEffect
    useEffect(() => {
        onChange((prevFormData) => ({ ...prevFormData, [name]: value }))
    }, [value])

    return (
        <Box
            sx={style?.customInput('', {
                position: 'relative',
                textTransform: 'capitalize',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }, 1)}
            onClick={() => setIsTrue(prev => !prev)}
        >
            {value}
            <Box
                sx={{
                    ...style?.customInput('', {
                        position: 'absolute',
                        top: '110%',
                        display: isTrue ? 'flex' : 'none',
                        opacity: isTrue ? 1 : 0,
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'all .5s ease-in-out',
                        backdropFilter: `blur(5px) saturate(187%)`,
                        flex: 1
                    }, 1),

                }}
            >
                {
                    values.map((item, index) => (
                        <Typography
                            variant='caption'
                            key={index}
                            sx={{
                                ':hover': {
                                    color: 'black',
                                    background: 'white',
                                },
                                padding: 1,
                                borderRadius: 1
                            }}
                            onClick={() => { setValue(item) }}
                        >
                            {item}
                        </Typography>
                    ))
                }
            </Box>
            <KeyboardArrowDown
                sx={{
                    transform: isTrue ? 'rotate(180deg)' : 'rotate(0deg)',
                    // transformOrigin: 'left top',
                    transition: 'all .5s ease-in-out'
                }}
            />
        </Box>
    )
}

export default DropDown