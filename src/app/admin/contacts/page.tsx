'use client'

import { Data, Session } from '@/utils/Interfaces'
import { Container } from '@mui/material'
import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import React, { useEffect, useRef } from 'react'

const Loading = dynamic(() => import('@/Components/Loading'))

const page = () => {
    const pageRef = useRef(false)
    const [isloading, setIsloading] = React.useState<boolean>(true)
    const [data, setData] = React.useState<Data[]>()
    const [isAdmin, setIsAdmin] = React.useState(false)

    const fetchAllContact = async () => {
        const { allUser, userInfo } = await import('@/utils/FetchFromApi')
        const { currentSession } = await import('@/utils/Session');

        const session = await currentSession() as Session
        const currUser = await userInfo(session?.user.username);
        (session && ['user'].includes(currUser.role)) ? setIsAdmin(false) : setIsAdmin(true)

        if (session && ['admin', 'moderator'].includes(currUser.role)) {
            // dont judge the name of the function i am trying to reuse the function this is for fetching the all contacts comments from the contact page
            const alluser = await allUser('contact')
            setData(alluser)
        }
        setIsloading(false)
    }
    // console.log(data)
    useEffect(() => {
        (pageRef.current === false) && fetchAllContact()
        return () => {
            pageRef.current = true
        }
    }, [])
    if (isloading) return <Loading />
    if (isAdmin === false) return notFound()
    return (
        <Container
            className='flex flex-col gap-[2rem]'
        >Here all the contacts message...
            {
                data ?
                    data?.map((item: Data, index: number) => (
                        <Card key={index} item={item} />
                    )) : 'No query yet posted'
            }
        </Container>
    )
}

export default page

const Card = ({
    item
}: {
    item: Data
}) => {
    return (
        <div
            className='flex flex-1 flex-col gap-[8px]'
        >
            <div
                className='flex-1 flex rounded-t-[12px] p-[12px] border-[1px] border-[#ffffff46] transition-all delay-[.2s] ease-in-out'
            >{item?.content}</div>
            <div
                className='flex justify-evenly rounded-b-[12px] border-[1px] border-[#ffffff46] p-[5px] flex-wrap gap-2 '
            >
                <a style={{ opacity: .5 }} href={`mailto:${item.email}`}>{item.email}</a>
                <p style={{ opacity: .5 }}>{item.phone}</p>
                <p style={{ opacity: .5 }}>{item.username}</p>
            </div>

        </div >
    );
}