
import { Data, DrivePermissionRole } from '@/utils/Interfaces';
import { Box, SxProps, Theme, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic';

const DropDownSkelenton = dynamic(() => import('./DropDownSkelenton'))

const DropDown = (
    {
        style,
        valuesStyles,
        values,
        onChange,
        name,
        placeholder
    }: {
        style?: SxProps<Theme> | undefined,
        valuesStyles?: SxProps<Theme> | undefined
        values: string[] | DrivePermissionRole[],
        onChange: React.Dispatch<React.SetStateAction<Data | undefined>>,
        name: string;
        placeholder?: string;
    }) => {
    const [value, setValue] = useState(placeholder ? placeholder : values[0]);

    // useEffect
    useEffect(() => {
        onChange((prevFormData) => ({ ...prevFormData, [name]: value }))
    }, [value])

    return (
        <DropDownSkelenton
            value={value}
            customStyle={{
                ...style,
                // opacity: (placeholder ? .7 : 1),
                // fontSize: (placeholder) ? { sx: 12, md: 15, xl: 16 } : { xs: 12, md: 18, xl: 20 }
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
                            borderRadius: 1,
                            ...valuesStyles,
                            overflow: 'scroll'
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