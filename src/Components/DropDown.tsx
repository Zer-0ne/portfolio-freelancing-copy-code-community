
import { Data } from '@/utils/Interfaces';
import { KeyboardArrowDown } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import DropDownSkelenton from './DropDownSkelenton';

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
    const [value, setValue] = useState(values[0])

    // useEffect
    useEffect(() => {
        onChange((prevFormData) => ({ ...prevFormData, [name]: value }))
    }, [value])

    return (
        <DropDownSkelenton
            value={value}
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
        </DropDownSkelenton>
    )
}

export default DropDown