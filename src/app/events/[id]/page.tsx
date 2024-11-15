'use client'
import { EventsInterface } from '@/utils/Interfaces'
import { Box, Container, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { fetchEvents } from '@/slices/eventsSlice'
import EmbientImage from '@/components/Embient-image'

const Loading = dynamic(() => import('@/components/Loading'))
const ContentStructure = dynamic(() => import('@/components/ContentStructure'))
const Markdown = dynamic(() => import('@/components/Markdown'))


const page = () => {
    const { events, loading } = useSelector((state: RootState) => state.events)
    const dispatch = useDispatch<AppDispatch>()
    const { id }: any = useParams()

    // event
    let event = events?.find((item: EventsInterface) => item._id === id);
    useEffect(() => {
        const fetchedData = async () => {
            try {
                !events.length && dispatch(fetchEvents())
                event = events?.find((item: EventsInterface) => item._id === id);
            } catch (error) {
                console.log(error)
            }
        }
        fetchedData();
    }, [events])
    if (loading) return <Loading />
    return (
        <>
            <Header data={event as EventsInterface} />
            <Markdown
                data={event as EventsInterface}
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
            <ContentStructure
                boxStyle={{
                    flexDirection: 'row !important',
                    flexWrap: 'wrap'
                }}
            >
                {/* <Image
                    className='headerImage'
                    src={`${data?.image}`}
                    width={1200}
                    height={900}
                    alt={data?.title}
                    style={{
                        // flex: 1,
                        width: '100%!important',
                        minWidth: '100%!important',
                        height: '17rem !important',
                        borderRadius: '7px'
                    }}
                /> */}
                <Box
                    sx={{
                        pl: 1,
                        pr: 1,
                        flex: 2
                    }}
                >

                    <Typography
                        variant='h3'
                        sx={{
                            fontWeight: '600',
                            fontSize: { xs: 25, md: 30 }
                        }}
                    >
                        {data?.title}
                    </Typography>
                    <Typography
                        variant='caption'
                        sx={{
                            opacity: .7,
                            ml: 2,
                            mt: 1,
                            mb: 1
                        }}
                    >
                        {data?.updatedAt?.slice(0, 10)}
                    </Typography>
                    <Typography
                        variant='body1'
                        sx={{
                            opacity: .7,
                            ml: 1,
                            mt: 1
                        }}
                    >
                        {data?.description}
                    </Typography>
                </Box>
            </ContentStructure>
        </>
    )
}
export default page