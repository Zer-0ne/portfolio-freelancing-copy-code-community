'use client'


import { EventsInterface } from '@/utils/Interfaces'
import { Box, Container, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

const Loading = dynamic(() => import('@/Components/Loading'))
const ContentStructure = dynamic(() => import('@/Components/ContentStructure'))
const Markdown = dynamic(() => import('@/Components/Markdown'))


const page = () => {
    const pageRef = useRef(false)
    const [data, setData] = useState<EventsInterface>()
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        const fetchedData = async () => {
            try {
                const { Post } = await import('@/utils/FetchFromApi')
                const res = await Post('event', id as string)
                setData(res)
                setIsLoading(false)
            } catch (error) {
                console.log(error)
            }
        }
        (pageRef.current === false) && fetchedData()
        return () => {
            pageRef.current = true
        }
    }, [])
    if (isLoading) return <Loading />
    return (
        <>
            <Header data={data as EventsInterface} />
            <Markdown
                data={data as EventsInterface}
            />
        </>
    )
}

const Header = ({
    customStyles,
    data
}: {
    customStyles?: React.CSSProperties
    data: EventsInterface
}) => {
    return (
        <>
            <ContentStructure>
                <Image
                    className='headerImage'
                    src={`${data.image}`}
                    width={1200}
                    height={900}
                    alt={data.title}
                    style={{
                        flex: 1,
                        width: '100%!important',
                        minWidth: '100%!important',
                        height: '17rem !important',
                        borderRadius: '7px'
                    }}
                />
                <Box
                    sx={{
                        pl: 1,
                        pr: 1
                    }}
                >

                    <Typography
                        variant='h3'
                        sx={{
                            fontWeight: '600'
                        }}
                    >
                        {data.title}
                    </Typography>
                    <Typography
                        variant='caption'
                        sx={{
                            opacity: .7,
                            ml: 2,
                            mt: 1
                        }}
                    >
                        {data.updatedAt?.slice(0, 10)}
                    </Typography>
                </Box>
            </ContentStructure>
        </>
    )
}
export default page