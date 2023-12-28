'use client'

import { EventsInterface } from '@/utils/Interfaces'
import dynamic from 'next/dynamic'
import { useParams } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'

const Loading = dynamic(() => import('@/Components/Loading'))
const Markdown = dynamic(() => import('@/Components/Markdown'))


const page = () => {
    const pageRef = useRef(false)
    const [data, setData] = useState<EventsInterface>()
    const { id } = useParams()
    const [isLoading, setIsLoading] = useState(true)


    useEffect(() => {
        const fetchedData = async () => {
            try {
                const {Post} = await import('@/utils/FetchFromApi')
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
        <Markdown
            data={data as EventsInterface}
        />
    )
}

export default page