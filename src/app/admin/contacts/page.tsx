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
        <Container>Comming Soon...</Container>
    )
}

export default page