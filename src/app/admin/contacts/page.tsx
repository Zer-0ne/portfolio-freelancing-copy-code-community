'use client'

import useSession from '@/hooks/useSession'
import { Data, } from '@/utils/Interfaces'
import { styles } from '@/utils/styles'
import { Container, Typography } from '@mui/material'
import dynamic from 'next/dynamic'
import React, { useEffect, } from 'react'

const Loading = dynamic(() => import('@/components/Loading'))

const page = () => {
    const { isAdmin, error } = useSession()
    const [isloading, setIsloading] = React.useState<boolean>(true)
    const [data, setData] = React.useState<Data[]>()



    const fetchAllContact = async () => {
        const { allUser } = await import('@/utils/FetchFromApi')

        if (isAdmin && !error) {
            // dont judge the name of the function i am trying to reuse the function this is for fetching the all contacts comments from the contact page
            const alluser = await allUser('contact')
            setData(alluser)
        }
        setIsloading(false)
    }
    // console.log(data)
    useEffect(() => {
        fetchAllContact()
    }, [isAdmin])

    if (error) {
        return <div
            className='flex flex-1 w-full py-auto absolute top-[50%] right-[50%] translate-x-[50%] -translate-y-[50%] justify-center my-auto items-center'
        >
            <Typography
                sx={{
                    ...styles.glassphorism()
                }}
                className='flex w-[70%] md:w-[40%] min-h-[100px] p-10 justify-center items-center font-bold text-center  text-[#ffffff] capitalize  text-3xl rounded border-[#ff000034] border-[1px]'
            >
                something went wrong!
            </Typography>
        </div>
    }
    if (isloading) return <Loading />
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
            >{item?.content as string}</div>
            <div
                className='flex justify-evenly rounded-b-[12px] border-[1px] border-[#ffffff46] p-[5px] flex-wrap gap-2 '
            >
                <a style={{ opacity: .5 }} href={`mailto:${item.email}`}>{item?.email as string}</a>
                <p style={{ opacity: .5 }}>{item?.phone as string}</p>
                <p style={{ opacity: .5 }}>{item?.username as string}</p>
            </div>

        </div >
    );
}